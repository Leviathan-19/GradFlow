# Auto Scaling - Scale Down Explanation

## What is Scale-Down?

**Scale-down** (also called "scale-in") is the process of **reducing** the number of instances in your Auto Scaling Group when demand decreases.

## How It Works

### Scale-Up (Scale-Out)
- **When:** CPU usage > 80% (or other metric threshold)
- **Action:** ASG creates **new instances** to handle increased load
- **Example:** 2 instances → 3 instances → 4 instances

### Scale-Down (Scale-In)
- **When:** CPU usage < threshold for extended period
- **Action:** ASG **terminates instances** to save costs
- **Example:** 4 instances → 3 instances → 2 instances (back to minimum)

## Your Current Configuration

```hcl
min_capacity     = 2  # Minimum 2 instances always running
desired_capacity = 2  # Target: 2 instances
max_capacity     = 5  # Maximum 5 instances
```

### What This Means:

1. **Minimum (2 instances):**
   - Always keep at least 2 instances running
   - Scale-down will **never** go below 2 instances
   - Even with no traffic, 2 instances stay running

2. **Desired (2 instances):**
   - Target number of instances
   - ASG tries to maintain this number

3. **Maximum (5 instances):**
   - Can scale up to 5 instances if needed
   - Won't create more than 5

## Scale-Down Policies in Your Config

### Current Policies:

1. **CPU Scale-Up Policy:**
   ```hcl
   target_value = 80.0  # Scale up when CPU > 80%
   disable_scale_in = false  # Allows scale-down
   ```

2. **Scale-In Policy:**
   ```hcl
   scaling_adjustment = -1  # Remove 1 instance
   cooldown = 600  # Wait 10 minutes between scale-downs
   ```

## When Does Scale-Down Happen?

### Automatic Scale-Down:

1. **CPU-based:**
   - If CPU usage stays **low** for extended period
   - Target tracking scaling will reduce instances
   - But **never below minimum** (2 instances)

2. **Manual Scale-Down:**
   - You manually reduce `desired_capacity`
   - ASG terminates excess instances

### Scale-Down Process:

1. ASG selects instance to terminate (oldest or based on policy)
2. Instance is marked for termination
3. Load Balancer stops sending new traffic to that instance
4. Existing connections finish (deregistration delay: 5 minutes)
5. Instance is terminated
6. New instances are created if needed to maintain minimum

## Why Scale-Down Exists

### Benefits:
- ✅ **Cost Savings:** Pay only for what you need
- ✅ **Resource Efficiency:** Don't waste resources on idle instances
- ✅ **Automatic:** No manual intervention needed

### Considerations:
- ⚠️ **Connection Drops:** If you're connected to an instance being terminated
- ⚠️ **Warm-up Time:** New instances need time to start
- ⚠️ **Minimum Capacity:** Won't scale below your minimum (2 instances in your case)

## Your Specific Case

### Current Behavior:

Since you have:
- `min_capacity = 2`
- `desired_capacity = 2`
- `max_capacity = 5`

**Scale-Down will:**
- ✅ Only happen if you have **more than 2 instances**
- ✅ Never go below 2 instances
- ✅ Only terminate instances when CPU is low **and** you have > 2 instances

**Example Scenarios:**

1. **2 instances running, low CPU:**
   - ❌ No scale-down (already at minimum)
   - ✅ Instances stay running

2. **3 instances running, low CPU:**
   - ✅ Scale-down to 2 instances
   - ✅ One instance terminated

3. **5 instances running, low CPU:**
   - ✅ Scale-down to 2 instances
   - ✅ Three instances terminated (gradually)

## Preventing Scale-Down

If you **never** want instances to be terminated:

### Option 1: Disable Scale-In in Policy
```hcl
target_tracking_configuration {
  disable_scale_in = true  # Prevent scale-down
}
```

### Option 2: Remove Scale-In Policy
```hcl
# Comment out or remove the scale_in policy
# resource "aws_autoscaling_policy" "scale_in" { ... }
```

### Option 3: Set Min = Desired = Max
```hcl
min_capacity     = 2
desired_capacity = 2
max_capacity     = 2  # Can't scale up or down
```

## Recommendation

For your use case (development/testing):

**Keep current configuration:**
- ✅ Minimum 2 instances always running
- ✅ Can scale up to 5 if needed
- ✅ Scale-down only happens if you have > 2 instances
- ✅ Won't affect your 2 base instances

**Why:**
- You always have 2 instances available
- Scale-down only affects extra instances (3-5)
- Saves costs when not needed
- Maintains minimum capacity for availability

## Summary

| Question | Answer |
|----------|--------|
| **What is scale-down?** | Reducing number of instances when demand decreases |
| **When does it happen?** | When CPU is low AND you have more than minimum instances |
| **Will it affect my 2 base instances?** | No, scale-down never goes below minimum (2) |
| **Should I disable it?** | No, it's useful for cost savings and only affects extra instances |

## Current Status

With your configuration:
- ✅ 2 instances always running (protected from scale-down)
- ✅ Can scale up to 5 if CPU > 80%
- ✅ Can scale down from 5 → 2 if CPU stays low
- ✅ Your base 2 instances are safe
