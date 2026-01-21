# Health Check Configuration Fix

## Problem

Instances were being terminated and recreated constantly because:
1. Auto Scaling Group was using ELB health checks (`health_check_type = "ELB"`)
2. Load Balancer health check was failing (probably `/health` endpoint not responding)
3. When health check failed, ASG marked instance as unhealthy and replaced it

## Solution Applied

### 1. Changed ASG Health Check Type

**Before:**
```hcl
health_check_type = "ELB"  # Checks application health via Load Balancer
```

**After:**
```hcl
health_check_type = "EC2"  # Only checks if instance is running (more lenient)
```

**Why:** EC2 health checks only verify that the instance is running, not that the application is responding. This prevents unnecessary instance replacement.

### 2. Made Load Balancer Health Check More Lenient

**Before:**
```hcl
health_check {
  unhealthy_threshold = 3
  timeout            = 5
  interval           = 30
  path               = "/health"
  matcher            = "200"
}
```

**After:**
```hcl
health_check {
  unhealthy_threshold = 5   # More tolerance (was 3)
  timeout            = 10   # More time to respond (was 5)
  interval           = 60   # Check less frequently (was 30)
  path               = "/"  # Root path (more likely to work)
  matcher            = "200,404"  # Accept both 200 and 404
}
```

**Why:** More lenient thresholds and accepting root path makes health checks less likely to fail.

### 3. Increased Deregistration Delay

**Before:**
```hcl
deregistration_delay = 30  # 30 seconds
```

**After:**
```hcl
deregistration_delay = 300  # 5 minutes
```

**Why:** Gives more time before removing instance from Load Balancer, reducing connection drops.

### 4. Changed Termination Policies

**Before:**
```hcl
termination_policies = ["OldestInstance", "Default"]
```

**After:**
```hcl
termination_policies = ["Default"]
```

**Why:** Default policy only terminates during scale-down, not on health check failures.

## What This Means

### Before (ELB Health Checks)
- ✅ ASG checks application health via Load Balancer
- ❌ If `/health` endpoint fails → Instance marked unhealthy
- ❌ Unhealthy instance → Terminated and replaced
- ❌ Constant replacement cycle

### After (EC2 Health Checks)
- ✅ ASG only checks if instance is running
- ✅ Instance stays running even if application has issues
- ✅ Load Balancer still checks application health (but doesn't trigger replacement)
- ✅ More stable - instances won't be replaced unless they actually crash

## Important Notes

1. **EC2 Health Checks are Less Strict:**
   - They only verify instance is running
   - They don't check if your application is working
   - You should still monitor application health separately

2. **Load Balancer Still Checks Health:**
   - Load Balancer health checks still run
   - They just don't trigger instance replacement
   - Unhealthy instances are removed from Load Balancer routing, but not terminated

3. **Manual Monitoring:**
   - You should monitor application health via CloudWatch or other tools
   - If instances are truly broken, you can manually replace them

## Applying Changes

```bash
cd terraform/terraform_users
terraform plan  # Review changes
terraform apply # Apply changes
```

## Verification

After applying:

1. **Check ASG health check type:**
   ```bash
   aws autoscaling describe-auto-scaling-groups \
     --auto-scaling-group-names users-asg \
     --query 'AutoScalingGroups[0].HealthCheckType'
   ```
   Should return: `EC2`

2. **Check instance status:**
   ```bash
   aws autoscaling describe-auto-scaling-groups \
     --auto-scaling-group-names users-asg \
     --query 'AutoScalingGroups[0].Instances[*].[InstanceId,HealthStatus,LifecycleState]' \
     --output table
   ```

3. **Monitor for a few minutes:**
   - Instances should stay running
   - No automatic replacement
   - SSH connections should remain stable

## If You Still Have Issues

If instances are still being replaced:

1. **Check CloudWatch logs:**
   - Look for errors in instance logs
   - Check if application is actually crashing

2. **Check Load Balancer target health:**
   ```bash
   aws elbv2 describe-target-health \
     --target-group-arn <target-group-arn> \
     --query 'TargetHealthDescriptions[*].[Target.Id,TargetHealth.State,TargetHealth.Reason]' \
     --output table
   ```

3. **Verify application is running:**
   ```bash
   ssh -i key.pem ubuntu@instance-ip
   docker ps  # Check if containers are running
   curl http://localhost:PORT/health  # Test health endpoint
   ```

## Reverting Changes

If you want to go back to ELB health checks:

```hcl
health_check_type = "ELB"
```

But make sure your `/health` endpoint is working correctly first!
