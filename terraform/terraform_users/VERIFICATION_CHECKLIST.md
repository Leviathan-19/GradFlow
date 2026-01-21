# Terraform Users Verification Checklist

## ✅ Files Status

### Core Configuration Files

- ✅ **autoscaling.tf** - Correctly configured with:
  - Launch Template using `templatefile()` for user-data-template.sh
  - Auto Scaling Group with health checks
  - CPU scaling policies (scale up at 80% CPU)
  - Instance refresh configuration

- ✅ **variables.tf** - All required variables present:
  - Database variables: `db_host`, `db_user`, `db_password`, `db_name`, `db_port`
  - JWT: `jwt_secret`
  - Docker Hub: `dockerhub_username`, `dockerhub_token`
  - Docker Registry: `docker_registry`, `docker_registry_username`, `docker_registry_password`
  - Docker image: `docker_image`, `docker_container_port`
  - AWS: `profile`, `aws_region`, `instance_type`, `ami_id`
  - ASG: `min_capacity`, `desired_capacity`, `max_capacity`
  - SSH: `ssh_enabled`, `ssh_allowed_cidr`, `key_pair_name`

- ✅ **user-data-template.sh** - Correctly configured:
  - Docker installation
  - Docker Hub login
  - .env file creation with Load Balancer DNS
  - Docker image pull and container start

- ✅ **outputs.tf** - All outputs present:
  - `loadbalancer_dns` - For service URLs
  - `asg_name` - For deployment workflows
  - `asg_arn` - For reference
  - `target_group_arn` - For Load Balancer
  - Docker-related outputs

- ✅ **alb.tf** - Load Balancer configured:
  - Application Load Balancer
  - Target Group with health checks
  - HTTP listener

- ✅ **vpc.tf** - VPC and subnets configured

- ✅ **security_groups.tf** - Security groups configured

- ✅ **keypair.tf** - Key pair management

- ✅ **main.tf** - Provider configuration

- ✅ **iam.tf** - IAM commented out (for academic accounts)

### Template Files

- ✅ **templates/env.tpl** - Template for generating .env files locally

### Optional Files

- ✅ **generate-env.tf** - For generating .env files locally (optional, not required for deployment)

## 🔍 Key Configurations to Verify

### 1. Launch Template User Data

**File:** `autoscaling.tf` (lines 13-28)

```hcl
user_data = base64encode(templatefile("${path.module}/user-data-template.sh", {
  docker_registry          = var.docker_registry
  docker_registry_username = var.docker_registry_username
  docker_registry_password = var.docker_registry_password
  dockerhub_username       = var.dockerhub_username
  dockerhub_token          = var.dockerhub_token
  db_host                  = var.db_host
  db_user                  = var.db_user
  db_password              = var.db_password
  db_name                  = var.db_name
  db_port                  = var.db_port
  jwt_secret               = var.jwt_secret
  docker_image             = var.docker_image
  docker_container_port    = var.docker_container_port
  loadbalancer_dns         = aws_lb.app.dns_name
}))
```

**Status:** ✅ Correct

### 2. Auto Scaling Group Configuration

**File:** `autoscaling.tf` (lines 35-82)

- ✅ Min capacity: 2
- ✅ Max capacity: 5
- ✅ Desired capacity: 2
- ✅ Health check type: ELB
- ✅ Instance refresh: Enabled
- ✅ Tags: Name, ManagedBy

**Status:** ✅ Correct

### 3. CPU Scaling Policy

**File:** `autoscaling.tf` (lines 92-109)

- ✅ Scale up when CPU > 80%
- ✅ Target tracking scaling configured

**Status:** ✅ Correct

### 4. User Data Script

**File:** `user-data-template.sh`

- ✅ Docker installation
- ✅ Docker Hub login (if credentials provided)
- ✅ .env file creation with Load Balancer DNS
- ✅ Docker image pull
- ✅ Container start with .env file

**Status:** ✅ Correct

## 📝 Required Terraform Variables

Make sure you have these in `terraform.tfvars`:

```hcl
# Database
db_host     = "your-db.rds.amazonaws.com"
db_user     = "postgres"
db_password = "your-password"
db_name     = "gradflow"
db_port     = 5432

# JWT
jwt_secret = "your-jwt-secret"

# Docker Hub
dockerhub_username = "your-dockerhub-username"
dockerhub_token    = "your-dockerhub-token"

# Docker image to deploy
docker_image          = "your-username/gradflow-users-create:qa"
docker_container_port = 3001
```

## ✅ Validation

Run `terraform validate` - **PASSED** ✅

## 🚀 Next Steps

1. **Set up terraform.tfvars** with your values
2. **Run terraform plan** to verify changes
3. **Run terraform apply** to create infrastructure
4. **Get Load Balancer DNS** from outputs:
   ```bash
   terraform output loadbalancer_dns
   ```
5. **Configure GitHub Secrets** with AWS credentials and Docker Hub token

## 🔧 Troubleshooting

If something doesn't work:

1. **Check User Data logs** on instances:
   ```bash
   ssh -i key.pem ubuntu@instance-ip
   cat /var/log/user_data.log
   ```

2. **Verify .env file** exists:
   ```bash
   cat /home/ubuntu/.env
   ```

3. **Check Docker containers**:
   ```bash
   docker ps
   docker logs <container-name>
   ```

4. **Verify Load Balancer DNS**:
   ```bash
   terraform output loadbalancer_dns
   curl http://<loadbalancer-dns>/api/health
   ```

## Summary

All critical files are present and correctly configured. The Terraform configuration is valid and ready to use.
