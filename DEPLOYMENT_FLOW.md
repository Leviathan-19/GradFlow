# Complete Deployment Flow

## Overview

This document explains the complete CI/CD flow for deploying GradFlow microservices to AWS EC2 instances.

## Flow Diagram

```
1. Developer pushes to QA branch
   ↓
2. GitHub Actions detects changes (path-based)
   ↓
3. Builds Docker images for changed services
   ↓
4. Pushes to Docker Hub (tags: qa, latest)
   ↓
5. Terraform creates/updates infrastructure
   ↓
6. Launch Template User Data script runs on new instances
   ↓
7. Script pulls Docker images and starts containers
   ↓
8. Services communicate via Load Balancer DNS
```

## Key Concepts

### 1. Load Balancer DNS (Static)

**Why use Load Balancer DNS instead of IPs?**
- Load Balancer DNS is **static** (doesn't change)
- Instance IPs are **dynamic** (change when instances are created/destroyed)
- Load Balancer automatically routes to healthy instances
- Services can communicate reliably using DNS name

**Example:**
```
Load Balancer DNS: users-lb-123456789.us-east-1.elb.amazonaws.com
All services use: http://users-lb-123456789.us-east-1.elb.amazonaws.com
```

### 2. Auto Scaling Group Behavior

**When new instance is created:**
1. User Data script runs automatically
2. Pulls Docker image from Docker Hub
3. Creates `.env` file with Load Balancer DNS
4. Starts container
5. Registers with Load Balancer Target Group
6. Health check passes → instance becomes healthy

**When instance is destroyed:**
- Load Balancer detects unhealthy instance
- ASG creates replacement automatically
- New instance follows same process

**When you update Docker image:**
- Push new image to Docker Hub
- Trigger instance refresh: `aws autoscaling start-instance-refresh`
- New instances get new image automatically
- Old instances terminated after new ones healthy

### 3. Environment Variables (.env)

**Static values** (from Terraform variables):
- Database credentials
- JWT secret
- Docker registry credentials

**Dynamic values** (from Terraform outputs):
- Load Balancer DNS → used for all service URLs
- Service ports → configured per service

**How .env is created:**
- User Data script creates it automatically
- Uses Terraform template variables
- Stored at `/home/ubuntu/.env`
- Loaded by Docker containers via `--env-file`

## Step-by-Step Deployment

### Step 1: Configure Terraform Variables

Create `terraform/terraform_users/terraform.tfvars`:

```hcl
# AWS Configuration
profile        = "count1"
aws_region     = "us-east-1"
instance_type  = "t3.micro"

# Database (static)
db_host     = "your-db.rds.amazonaws.com"
db_user     = "postgres"
db_password = "your-password"
db_name     = "gradflow"
db_port     = 5432

# JWT (static)
jwt_secret = "your-jwt-secret-key"

# Docker Hub (for pulling images)
dockerhub_username = "your-dockerhub-username"
dockerhub_token    = "your-dockerhub-token"

# Docker image to deploy (change per service)
docker_image          = "your-username/gradflow-users-create:qa"
docker_container_port = 3001
```

### Step 2: Create Infrastructure

```bash
cd terraform/terraform_users
terraform init
terraform plan
terraform apply
```

**Outputs you'll get:**
- `loadbalancer_dns` - Use this for all service URLs
- `asg_name` - Auto Scaling Group name
- `key_pair_name` - SSH key name

### Step 3: Configure GitHub Secrets

In GitHub repository settings → Secrets:

### Minimum Required (for SSM or Instance Refresh):

```
DOCKERHUB_USERNAME=your-dockerhub-username
DOCKERHUB_TOKEN=your-dockerhub-token
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_SESSION_TOKEN=your-aws-session-token  # Only if using temporary credentials (starts with ASIA)
```

**Note about AWS_SESSION_TOKEN:**
- **Required** if your `AWS_ACCESS_KEY_ID` starts with `ASIA` (temporary credentials)
- **Not needed** if your `AWS_ACCESS_KEY_ID` starts with `AKIA` (permanent credentials)

### Additional (for SSH fallback - only if needed):

```
EC2_HOST=ec2-44-209-157-161.compute-1.amazonaws.com  # Static IP or Elastic IP
EC2_USER=ubuntu
EC2_KEY=-----BEGIN RSA PRIVATE KEY-----
... (your private key)
```

**Note:** SSH is only recommended if:
- You have Elastic IPs configured (limited to 5 in academic accounts)
- SSM is not available
- You need direct shell access for debugging

**For Auto Scaling Groups, SSM or Instance Refresh are recommended over SSH.**
```

### Step 4: Push Code to QA Branch

```bash
git checkout QA
git add .
git commit -m "Update users_create service"
git push origin QA
```

**What happens:**
1. GitHub Actions detects changes in `apps/backend/users/users_create/**`
2. Builds Docker image
3. Pushes to Docker Hub

### Step 5: Deploy to EC2

**Option A: Automatic (via User Data)**
- New instances automatically pull latest image
- Trigger instance refresh to update existing instances:
  ```bash
  aws autoscaling start-instance-refresh \
    --auto-scaling-group-name users-asg \
    --preferences MinHealthyPercentage=50
  ```

**Option B: Manual (via GitHub Actions)**
- Workflow connects to instances via SSM
- Pulls latest images
- Restarts containers

## Service Communication

### Problem
Services need to communicate, but:
- Instance IPs change when instances are created/destroyed
- Can't hardcode IPs in code

### Solution
Use Load Balancer DNS for all service URLs:

**In your code:**
```typescript
// ❌ Bad: Hardcoded IP
const API_URL = "http://44.209.157.161:3000"

// ✅ Good: Load Balancer DNS
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || "http://localhost:3000"
// In production: http://users-lb-123456789.us-east-1.elb.amazonaws.com
```

**In .env file:**
```env
API_GATEWAY_URL=http://users-lb-123456789.us-east-1.elb.amazonaws.com
USERS_CREATE_URL=http://users-lb-123456789.us-east-1.elb.amazonaws.com
# All services use same Load Balancer DNS
```

### How Load Balancer Routes

The Load Balancer uses **Target Groups** to route requests:

- Request to `/api/users` → routes to users_create target group
- Request to `/api/auth/login` → routes to auth_login target group
- Health check on `/api/health` → determines if instance is healthy

## Testing Your Deployment

### 1. Check Load Balancer DNS
```bash
cd terraform/terraform_users
terraform output loadbalancer_dns
```

### 2. Test Health Endpoint
```bash
curl http://<loadbalancer-dns>/api/health
```

### 3. Test Service Endpoint
```bash
curl http://<loadbalancer-dns>/api/users
```

### 4. Check Instance Logs
```bash
# Get instance IP from Terraform outputs or AWS Console
ssh -i key.pem ubuntu@<instance-ip>

# Check User Data logs
cat /var/log/user_data.log

# Check Docker containers
docker ps
docker logs <container-name>

# Check .env file
cat /home/ubuntu/.env
```

## Common Issues and Solutions

### Issue: Services show as unhealthy

**Check:**
1. Containers are running: `docker ps`
2. Health endpoint works: `curl http://localhost:<port>/api/health`
3. .env file exists: `cat /home/ubuntu/.env`
4. Load Balancer Target Group health checks

**Solution:**
- Verify User Data script ran: `cat /var/log/user_data.log`
- Check container logs: `docker logs <container-name>`
- Verify security groups allow traffic

### Issue: Services can't communicate

**Check:**
1. All services use Load Balancer DNS in `.env`
2. Load Balancer Target Groups configured correctly
3. Security groups allow traffic between services

**Solution:**
- Verify `.env` file has correct Load Balancer DNS
- Check Load Balancer listener rules
- Verify Target Group health checks

### Issue: Docker image not pulling

**Check:**
1. Docker Hub credentials in Terraform variables
2. Image exists: `docker pull <image-name>`
3. User Data logs: `cat /var/log/user_data.log`

**Solution:**
- Verify `dockerhub_username` and `dockerhub_token` in Terraform
- Check Docker Hub image exists and is public (or credentials correct)
- Manually test: `docker login` then `docker pull`

### Issue: .env file missing or incorrect

**Check:**
1. Terraform variables are set
2. User Data script ran successfully
3. File permissions: `ls -la /home/ubuntu/.env`

**Solution:**
- Verify all Terraform variables are set
- Check User Data logs for errors
- Manually create .env if needed (temporary fix)

## Best Practices

1. **Always use Load Balancer DNS** for service URLs
2. **Store secrets in Terraform variables** (sensitive = true)
3. **Use instance refresh** for zero-downtime deployments
4. **Monitor health checks** via Load Balancer metrics
5. **Tag Docker images** with version numbers
6. **Test locally** before pushing to Docker Hub
7. **Use separate Terraform workspaces** for different environments

## Next Steps

1. Set up Terraform variables for your environment
2. Run `terraform apply` to create infrastructure
3. Get Load Balancer DNS from outputs
4. Configure GitHub secrets
5. Push code to QA branch
6. Monitor deployment via GitHub Actions
7. Test endpoints via Load Balancer DNS
