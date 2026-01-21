###########################################################################
########################## LAUNCH TEMPLATE ################################
###########################################################################

resource "aws_launch_template" "app" {
  name_prefix   = "users-app-"
  image_id      = var.ami_id
  instance_type = var.instance_type
  key_name      = local.effective_key_name

  vpc_security_group_ids = [aws_security_group.web.id]

  user_data = base64encode(<<-EOT
    #!/bin/bash
    set -e

    export DEBIAN_FRONTEND=noninteractive

    apt-get update -y
    apt-get install -y docker.io

    systemctl enable docker
    systemctl start docker

    # Permitir usar docker sin sudo (usuario ubuntu)
    usermod -aG docker ubuntu

    # Log para debugging
    echo "Docker instalado correctamente" > /var/log/user_data.log
    docker --version >> /var/log/user_data.log
    EOT
)
}

###########################################################################
########################## AUTO SCALING GROUP #############################
###########################################################################

resource "aws_autoscaling_group" "app" {
  name                = "users-asg"
  max_size            = var.max_capacity
  min_size            = var.min_capacity
  desired_capacity    = var.desired_capacity

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  vpc_zone_identifier = aws_subnet.public[*].id
  target_group_arns   = [aws_lb_target_group.app.arn]

  # Health checks mejorados
  health_check_type         = "ELB"
  health_check_grace_period = 300
  
  # Terminación de instancias: asegurar que se reemplacen si fallan
  termination_policies = ["OldestInstance", "Default"]
  
  # Protección contra terminación accidental durante scaling
  protect_from_scale_in = false

  instance_refresh {
    strategy = "Rolling"

    preferences {
      min_healthy_percentage = 50
      instance_warmup        = 180
    }
    
    triggers = ["tag"]
  }

  # Tags para identificar instancias
  tag {
    key                 = "Name"
    value               = "users-instance"
    propagate_at_launch = true
  }
  
  tag {
    key                 = "ManagedBy"
    value               = "Terraform"
    propagate_at_launch = true
  }
}
###########################################################################
#################### POLICY AUTOSCALING BY CPU ############################
###########################################################################

###########################################################################
################## SCALE UP POLICY (CPU > 80%) ###########################
###########################################################################

# Policy para escalar cuando CPU promedio supera 80%
resource "aws_autoscaling_policy" "cpu_scale_up" {
  name                   = "scale-up-on-high-cpu"
  autoscaling_group_name = aws_autoscaling_group.app.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }

    target_value = 80.0  # Escalar cuando CPU promedio supera 80%
    
    # Disable scale-in para mantener mínimo 2 instancias
    disable_scale_in = false
  }

  estimated_instance_warmup = 300
}

###########################################################################
################## SCALE OUT POLICY (Agregar instancia) ##################
###########################################################################

# Policy adicional para agregar instancia cuando hay alta demanda
resource "aws_autoscaling_policy" "scale_out" {
  name                   = "scale-out-policy"
  autoscaling_group_name = aws_autoscaling_group.app.name
  adjustment_type        = "ChangeInCapacity"
  scaling_adjustment     = 1
  cooldown               = 300
  policy_type            = "SimpleScaling"
}

###########################################################################
################## SCALE IN POLICY (Remover instancia) ###################
###########################################################################

# Policy para reducir instancias cuando la carga baja
resource "aws_autoscaling_policy" "scale_in" {
  name                   = "scale-in-policy"
  autoscaling_group_name = aws_autoscaling_group.app.name
  adjustment_type        = "ChangeInCapacity"
  scaling_adjustment     = -1
  cooldown               = 600  # 10 minutos de cooldown
  policy_type            = "SimpleScaling"
}
