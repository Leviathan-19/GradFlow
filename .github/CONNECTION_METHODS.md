# Connection Methods for EC2 Deployment

## Overview

When deploying to EC2 instances in Auto Scaling Groups, you have three main options for connecting and deploying containers:

1. **AWS Systems Manager (SSM)** - Recommended ✅
2. **SSH** - Fallback option
3. **Instance Refresh** - Zero-downtime deployment

## AWS Session Token

### When do you need it?

**AWS Session Token is ONLY needed if:**
- You're using **temporary credentials** (STS - Security Token Service)
- Your credentials expire after a certain time
- You're using AWS Academy accounts with session-based access

**You DON'T need it if:**
- You're using **permanent IAM user credentials**
- Your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` don't expire

### How to check if you need it:

```bash
# If your credentials look like this, you need session token:
aws_access_key_id = ASIA2E5L34DRYAAM4CQ3  # Starts with "ASIA" = temporary
aws_secret_access_key = 3s6qyq43/30y6zQM4kSfuE/DJ7q3+zz59TiX0PD5
aws_session_token = IQoJb3JpZ2luX2VjEOr...  # Long token

# If your credentials look like this, you DON'T need session token:
aws_access_key_id = AKIAIOSFODNN7EXAMPLE  # Starts with "AKIA" = permanent
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
# No session_token needed
```

### GitHub Secrets Configuration

**If using temporary credentials:**
```
AWS_ACCESS_KEY_ID=ASIA...
AWS_SECRET_ACCESS_KEY=...
AWS_SESSION_TOKEN=IQoJb3JpZ2luX2VjEOr...  # Required!
```

**If using permanent credentials:**
```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
# AWS_SESSION_TOKEN not needed (can be empty or omitted)
```

## Method 1: AWS Systems Manager (SSM) - Recommended ✅

### Why SSM?

- ✅ **No SSH keys needed** - More secure
- ✅ **Works with Auto Scaling Groups** - Automatically finds all instances
- ✅ **No need for static IPs** - Works with dynamic IPs
- ✅ **Built-in AWS service** - No additional setup
- ✅ **Audit trail** - All commands logged in CloudTrail

### Prerequisites

1. **SSM Agent installed** (usually pre-installed on Ubuntu AMIs)
   ```bash
   # Check if SSM Agent is running
   sudo systemctl status snap.amazon-ssm-agent.amazon-ssm-agent.service
   ```

2. **IAM permissions** for SSM (if using IAM roles)
   - Note: Academic accounts may not have full IAM access
   - SSM should still work with instance metadata

3. **Instance must be running** and SSM agent ready

### How it works:

```yaml
# GitHub Actions workflow uses:
aws ssm send-command \
  --instance-ids "i-1234567890abcdef0" \
  --document-name "AWS-RunShellScript" \
  --parameters "commands=[docker pull image]"
```

### Advantages:

- Automatically finds all instances in ASG
- No need to know instance IPs
- More secure (no SSH keys in GitHub secrets)
- Commands are logged and auditable

### Limitations:

- Requires SSM Agent (usually pre-installed)
- May need IAM permissions (if using IAM roles)
- Commands run as root or ssm-user

## Method 2: SSH - Fallback Option

### When to use SSH:

- SSM is not available (SSM Agent not installed)
- You have static IPs or Elastic IPs
- You need direct shell access for debugging
- Academic account limitations prevent SSM

### Prerequisites

1. **SSH Key Pair** (.pem file)
2. **Static IP or Elastic IP** (because instances change in ASG)
3. **Security Group** allows SSH (port 22) from your IP
4. **GitHub Secrets** configured:
   ```
   EC2_HOST=ec2-44-209-157-161.compute-1.amazonaws.com
   EC2_USER=ubuntu
   EC2_KEY=-----BEGIN RSA PRIVATE KEY-----...
   ```

### How it works:

```yaml
# GitHub Actions workflow uses:
uses: appleboy/ssh-action@v1.0.3
with:
  host: ${{ secrets.EC2_HOST }}
  username: ${{ secrets.EC2_USER }}
  key: ${{ secrets.EC2_KEY }}
  script: |
    docker pull image
    docker run ...
```

### Advantages:

- Direct shell access
- Easy to debug
- Works without SSM Agent

### Limitations:

- ❌ **Requires static IP** (instances in ASG change)
- ❌ **Less secure** (SSH keys in GitHub secrets)
- ❌ **Doesn't scale** (only connects to one instance)
- ❌ **Manual IP management** (must update if instance changes)

### Problem with Auto Scaling Groups:

**The issue:** Instances in ASG are created/destroyed automatically. Their IPs change.

**Example:**
```
Instance 1: ec2-44-209-157-161.compute-1.amazonaws.com  ← Today
Instance 2: ec2-55-220-168-172.compute-1.amazonaws.com  ← Tomorrow (different!)
```

**Solution:** Use Elastic IPs (limited to 5 in academic accounts) or use SSM instead.

## Method 3: Instance Refresh - Zero-Downtime

### When to use:

- You want **zero-downtime** deployment
- New instances should automatically get latest images
- You trust the User Data script to handle deployment

### How it works:

1. Push new Docker image to Docker Hub
2. Trigger instance refresh:
   ```bash
   aws autoscaling start-instance-refresh \
     --auto-scaling-group-name users-asg \
     --preferences MinHealthyPercentage=50
   ```
3. ASG creates new instances
4. User Data script runs automatically
5. Pulls latest Docker image
6. Starts container
7. Old instances terminated after new ones healthy

### Advantages:

- ✅ **Zero-downtime** - Load Balancer routes to healthy instances
- ✅ **Automatic** - No manual deployment needed
- ✅ **Scalable** - Works with any number of instances

### How to trigger:

**Via GitHub Actions:**
```yaml
- name: Trigger Instance Refresh
  run: |
    aws autoscaling start-instance-refresh \
      --auto-scaling-group-name users-asg \
      --preferences MinHealthyPercentage=50
```

**Via AWS CLI:**
```bash
aws autoscaling start-instance-refresh \
  --auto-scaling-group-name users-asg \
  --preferences MinHealthyPercentage=50,InstanceWarmup=180
```

## Comparison Table

| Feature | SSM | SSH | Instance Refresh |
|---------|-----|-----|------------------|
| Works with ASG | ✅ Yes | ❌ No (needs static IP) | ✅ Yes |
| No SSH keys needed | ✅ Yes | ❌ No | ✅ Yes |
| Zero-downtime | ⚠️ Manual | ❌ No | ✅ Yes |
| Automatic deployment | ⚠️ Via workflow | ❌ Manual | ✅ Yes |
| Debugging | ⚠️ Limited | ✅ Easy | ❌ Hard |
| Scalability | ✅ All instances | ❌ One instance | ✅ All instances |
| Security | ✅ High | ⚠️ Medium | ✅ High |

## Recommended Approach

### For Production (Auto Scaling Groups):

1. **Primary:** Use **Instance Refresh** for automatic deployments
   - Push to Docker Hub → Trigger instance refresh
   - New instances get latest images automatically

2. **Fallback:** Use **SSM** for manual deployments or debugging
   - When you need to deploy immediately
   - When debugging issues

3. **Last Resort:** Use **SSH** only if:
   - SSM is not available
   - You have Elastic IPs configured
   - You need direct shell access

### For Development (Single Instance):

- Use **SSH** with Elastic IP
- Simpler setup
- Direct access for debugging

## GitHub Secrets Configuration

### Minimum Required (for SSM or Instance Refresh):

```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_SESSION_TOKEN=your-session-token  # Only if using temporary credentials
DOCKERHUB_USERNAME=your-dockerhub-username
DOCKERHUB_TOKEN=your-dockerhub-token
```

### Additional (for SSH fallback):

```
EC2_HOST=ec2-44-209-157-161.compute-1.amazonaws.com
EC2_USER=ubuntu
EC2_KEY=-----BEGIN RSA PRIVATE KEY-----
...
```

## Troubleshooting

### SSM not working?

1. **Check SSM Agent:**
   ```bash
   ssh -i key.pem ubuntu@instance-ip
   sudo systemctl status snap.amazon-ssm-agent.amazon-ssm-agent.service
   ```

2. **Check instance is in SSM:**
   ```bash
   aws ssm describe-instance-information --query 'InstanceInformationList[*].[InstanceId,ComputerName]'
   ```

3. **Check IAM permissions** (if using IAM roles)

### SSH not working?

1. **Check Security Group** allows SSH from your IP
2. **Check instance is running**
3. **Verify SSH key** is correct
4. **Check Elastic IP** is associated (if using)

### Instance Refresh not working?

1. **Check ASG exists:**
   ```bash
   aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names users-asg
   ```

2. **Check instance refresh status:**
   ```bash
   aws autoscaling describe-instance-refreshes --auto-scaling-group-name users-asg
   ```

3. **Check User Data script** logs:
   ```bash
   ssh -i key.pem ubuntu@instance-ip
   cat /var/log/user_data.log
   ```

## Summary

**For your use case (Auto Scaling Groups):**

1. ✅ **Use Instance Refresh** - Best for automatic deployments
2. ✅ **Use SSM** - Best for manual deployments/debugging
3. ⚠️ **Use SSH** - Only as fallback with Elastic IPs

**AWS Session Token:**
- ✅ **Required** if credentials start with "ASIA" (temporary)
- ❌ **Not needed** if credentials start with "AKIA" (permanent)
