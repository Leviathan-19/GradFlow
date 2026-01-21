###########################################################################
########################## LAUNCH TEMPLATE ################################
###########################################################################

resource "aws_launch_template" "app" {
  name_prefix   = "auth-app-"
  image_id      = var.ami_id
  instance_type = var.instance_type
  key_name      = local.effective_key_name

  vpc_security_group_ids = [aws_security_group.web.id]

  user_data = base64encode(<<-EOT
    #!/bin/bash
    set -euo pipefail

    export DEBIAN_FRONTEND=noninteractive
    
    # Instalar dependencias
    apt-get update -y
    apt-get install -y docker.io curl awscli jq

    systemctl enable --now docker

    # Configurar AWS CLI (usar metadata de instancia)
    INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
    REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/region)
    
    # Asociar IP elástica disponible a esta instancia
    EIP_ALLOCATION_IDS=($(aws ec2 describe-addresses \
      --region $REGION \
      --query 'Addresses[?AssociationId==null].AllocationId' \
      --output text 2>/dev/null || true))
    
    if [ ${#EIP_ALLOCATION_IDS[@]} -gt 0 ] && [ -n "${EIP_ALLOCATION_IDS[0]}" ]; then
      echo "Asociando IP elástica ${EIP_ALLOCATION_IDS[0]} a la instancia $INSTANCE_ID"
      aws ec2 associate-address \
        --region $REGION \
        --instance-id $INSTANCE_ID \
        --allocation-id ${EIP_ALLOCATION_IDS[0]} \
        || echo "Advertencia: No se pudo asociar IP elástica"
    else
      echo "No hay IPs elásticas disponibles para asociar"
    fi

    # Docker login si hay credenciales
    if [ -n "${var.docker_registry}" ] && [ -n "${var.docker_registry_username}" ] && [ -n "${var.docker_registry_password}" ]; then
      echo "${var.docker_registry_password}" | docker login ${var.docker_registry} -u "${var.docker_registry_username}" --password-stdin || true
    fi

    # Pull y ejecutar contenedor
    docker pull ${var.docker_image} || true

    docker rm -f app || true

    docker run -d --restart always --name app -p 80:${var.docker_container_port} ${var.docker_image}
  EOT
  )
  
  # IAM instance profile deshabilitado para cuentas académicas
  # iam_instance_profile {
  #   name = aws_iam_instance_profile.app.name
  # }
}

###########################################################################
########################## AUTO SCALING GROUP #############################
###########################################################################

resource "aws_autoscaling_group" "app" {
  name                = "auth-asg"
  max_size            = var.max_capacity
  min_size            = var.min_capacity
  desired_capacity    = var.desired_capacity

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  vpc_zone_identifier = aws_subnet.public[*].id
  target_group_arns   = [aws_lb_target_group.app.arn]

  health_check_type         = "ELB"
  health_check_grace_period = 300
  
  termination_policies = ["OldestInstance", "Default"]
  protect_from_scale_in = false

  instance_refresh {
    strategy = "Rolling"

    preferences {
      min_healthy_percentage = 50
      instance_warmup        = 180
    }
    
    triggers = ["tag"]
  }

  tag {
    key                 = "Name"
    value               = "auth-instance"
    propagate_at_launch = true
  }
  
  tag {
    key                 = "ManagedBy"
    value               = "Terraform"
    propagate_at_launch = true
  }
}

###########################################################################
################## SCALE UP POLICY (CPU > 80%) ###########################
###########################################################################

resource "aws_autoscaling_policy" "cpu_scale_up" {
  name                   = "scale-up-on-high-cpu"
  autoscaling_group_name = aws_autoscaling_group.app.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }

    target_value = 80.0
    disable_scale_in = false
  }

  estimated_instance_warmup = 300
}

###########################################################################
################## SCALE OUT POLICY #######################################
###########################################################################

resource "aws_autoscaling_policy" "scale_out" {
  name                   = "scale-out-policy"
  autoscaling_group_name = aws_autoscaling_group.app.name
  adjustment_type        = "ChangeInCapacity"
  scaling_adjustment     = 1
  cooldown               = 300
  policy_type            = "SimpleScaling"
}

###########################################################################
################## SCALE IN POLICY ########################################
###########################################################################

resource "aws_autoscaling_policy" "scale_in" {
  name                   = "scale-in-policy"
  autoscaling_group_name = aws_autoscaling_group.app.name
  adjustment_type        = "ChangeInCapacity"
  scaling_adjustment     = -1
  cooldown               = 600
  policy_type            = "SimpleScaling"
}
