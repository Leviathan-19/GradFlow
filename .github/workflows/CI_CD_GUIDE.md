# CI/CD Deployment Guide

## Overview

This guide explains the complete CI/CD flow for deploying GradFlow microservices to AWS EC2 instances managed by Terraform.

## Architecture

```
GitHub Push (QA branch)
    ↓
GitHub Actions (Build & Push)
    ↓
Docker Hub
    ↓
EC2 Instances (via Auto Scaling Group)
    ↓
Load Balancer (DNS endpoint)
```

## Flow Explanation

### 1. Infrastructure Creation (Terraform)

When you run `terraform apply`:
- Creates VPC, subnets, security groups
- Creates Load Balancer (ALB)
- Creates Auto Scaling Group with Launch Template
- Launch Template includes User Data script that:
  - Installs Docker
  - Creates `.env` file dynamically from Terraform variables
  - Pulls Docker images automatically
  - Starts containers

### 2. GitHub Actions Workflow

**Build & Push Workflows:**
- Triggered on push to `QA` branch
- Only runs if files in specific domain changed (path-based triggers)
- Builds Docker images
- Pushes to Docker Hub with tags: `qa` and `latest`

**Deploy Workflows:**
- Triggered after successful build
- Gets Terraform outputs (Load Balancer DNS, ASG name, instance IDs)
- Uses AWS SSM or SSH to connect to instances
- Pulls latest images and restarts containers

### 3. Service Communication

**Important:** Services communicate via Load Balancer DNS, not direct IPs!

- Load Balancer DNS is static (doesn't change)
- All services use same Load Balancer DNS
- Load Balancer routes to correct service based on Target Group rules
- When instances are created/destroyed, Load Balancer automatically updates

## Environment Variables (.env)

### Static Variables (from Terraform variables)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
- `JWT_SECRET`
- `DOCKER_REGISTRY`, `DOCKER_REGISTRY_USERNAME`, `DOCKER_REGISTRY_PASSWORD`

### Dynamic Variables (from Terraform outputs)
- `API_GATEWAY_URL` = `http://<loadbalancer_dns>`
- `USERS_CREATE_URL` = `http://<loadbalancer_dns>`
- All service URLs use Load Balancer DNS

### How .env is Created

**Option 1: User Data Script (Recommended)**
- Created automatically when instance starts
- Uses Terraform template variables
- Stored at `/home/ubuntu/.env`

**Option 2: Manual Generation**
```bash
cd terraform/terraform_users
terraform output -json > outputs.json
# Use script to generate .env
./scripts/generate-env-from-terraform.sh terraform/terraform_users users_create
```

## Docker Images in Launch Template

The Launch Template User Data script:
1. Installs Docker
2. Logs into Docker Hub (if credentials provided)
3. Creates `.env` file
4. Pulls Docker image specified in `var.docker_image`
5. Runs container with `.env` file

**Note:** For Auto Scaling Groups, each new instance automatically:
- Gets the latest User Data script
- Pulls the Docker image
- Starts the container

## Deployment Strategies

### Strategy 1: Auto Deployment (Recommended)

**How it works:**
- User Data script in Launch Template pulls image on instance creation
- When you push new image to Docker Hub, manually trigger instance refresh:
  ```bash
  aws autoscaling start-instance-refresh \
    --auto-scaling-group-name users-asg \
    --preferences MinHealthyPercentage=50
  ```
- New instances get latest image automatically

### Strategy 2: Manual Deployment via GitHub Actions

**How it works:**
- GitHub Actions workflow connects to instances via SSM or SSH
- Pulls latest images
- Restarts containers

**Limitations:**
- Requires SSM agent installed (or SSH access)
- Need to know instance IDs (which change with ASG)

### Strategy 3: Load Balancer Health Checks

**How it works:**
- Load Balancer checks `/api/health` endpoint
- If unhealthy, ASG replaces instance
- New instance pulls latest image automatically

## Required Terraform Variables

Add these to your `terraform.tfvars`:

```hcl
# Database
db_host       = "your-db-host.rds.amazonaws.com"
db_user       = "postgres"
db_password   = "your-password"
db_name       = "gradflow"
db_port       = 5432

# JWT
jwt_secret    = "your-jwt-secret-key"

# Docker Hub (for pulling images)
dockerhub_username = "your-dockerhub-username"
dockerhub_token    = "your-dockerhub-token"

# Docker image to deploy
docker_image  = "your-username/gradflow-users-create:qa"
docker_container_port = 3001
```

## Required GitHub Secrets

Add these to your GitHub repository secrets:

```
DOCKERHUB_USERNAME=your-dockerhub-username
DOCKERHUB_TOKEN=your-dockerhub-token
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
EC2_HOST=your-ec2-host (optional, for SSH fallback)
EC2_USER=ubuntu
EC2_KEY=your-private-key (optional, for SSH fallback)
```

## Service URLs Configuration

**Problem:** Services need to communicate, but instance IPs change.

**Solution:** Use Load Balancer DNS for all service URLs.

**In your code:**
```typescript
// Instead of: http://localhost:3001
// Use: http://<loadbalancer_dns>
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:3000';
```

**In Terraform:**
- Load Balancer DNS is output: `loadbalancer_dns`
- Used in User Data script to create `.env`
- All services get same DNS name

## Load Balancer Routing

The Load Balancer routes requests based on:
- **Path-based routing** (if configured)
- **Target Groups** (one per service)
- **Health checks** on each target

**Example:**
- Request to `http://loadbalancer-dns/api/users` → routes to users_create target group
- Request to `http://loadbalancer-dns/api/auth/login` → routes to auth_login target group

## Auto Scaling Group Behavior

When instances are created/destroyed:

1. **New Instance Created:**
   - User Data script runs
   - Pulls Docker image
   - Starts container
   - Registers with Load Balancer Target Group
   - Health check passes → instance becomes healthy

2. **Instance Destroyed:**
   - Load Balancer detects unhealthy
   - ASG creates replacement
   - New instance follows same process

3. **Image Update:**
   - Push new image to Docker Hub
   - Trigger instance refresh
   - New instances get new image
   - Old instances terminated after new ones healthy

## Testing Deployment

1. **Check Load Balancer DNS:**
   ```bash
   cd terraform/terraform_users
   terraform output loadbalancer_dns
   ```

2. **Test Health Endpoint:**
   ```bash
   curl http://<loadbalancer-dns>/api/health
   ```

3. **Check Instance Logs:**
   ```bash
   ssh -i key.pem ubuntu@<instance-ip>
   docker logs <container-name>
   cat /var/log/user_data.log
   ```

## Troubleshooting

### Services show as unhealthy
- Check if containers are running: `docker ps`
- Check container logs: `docker logs <container-name>`
- Verify `.env` file exists: `cat /home/ubuntu/.env`
- Check health endpoint: `curl http://localhost:<port>/api/health`

### Services can't communicate
- Verify all services use Load Balancer DNS in `.env`
- Check Load Balancer Target Groups are configured correctly
- Verify security groups allow traffic between services

### Docker image not pulling
- Check Docker Hub credentials in Terraform variables
- Verify image exists: `docker pull <image-name>`
- Check User Data logs: `cat /var/log/user_data.log`

### .env file missing or incorrect
- Check Terraform variables are set
- Verify User Data script ran: `cat /var/log/user_data.log`
- Manually create .env if needed

## Best Practices

1. **Use Load Balancer DNS** for all service communication
2. **Store secrets in Terraform variables** (sensitive = true)
3. **Use instance refresh** for zero-downtime deployments
4. **Monitor health checks** via Load Balancer metrics
5. **Keep Docker images tagged** with version numbers
6. **Test locally** before pushing to Docker Hub

## Next Steps

1. Set up Terraform variables with your values
2. Run `terraform apply` to create infrastructure
3. Get Load Balancer DNS from outputs
4. Update GitHub secrets
5. Push to QA branch to trigger build
6. Monitor deployment via GitHub Actions
