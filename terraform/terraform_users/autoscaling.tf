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
    set -euo pipefail

    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y
    apt-get install -y docker.io curl

    systemctl enable --now docker

    if [ -n "${var.docker_registry}" ] && [ -n "${var.docker_registry_username}" ] && [ -n "${var.docker_registry_password}" ]; then
      echo "${var.docker_registry_password}" | docker login ${var.docker_registry} -u "${var.docker_registry_username}" --password-stdin || true
    fi

    docker pull ${var.docker_image}

    docker rm -f app || true

    docker run -d --restart always --name app -p 80:${var.docker_container_port} ${var.docker_image}
  EOT
  )
}

###########################################################################
########################## AUTO SCALING GROUP #############################
###########################################################################

resource "aws_autoscaling_group" "app" {
  max_size          = var.max_capacity
  min_size          = var.min_capacity
  desired_capacity  = var.desired_capacity

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  vpc_zone_identifier = aws_subnet.public[*].id
  target_group_arns   = [aws_lb_target_group.app.arn]

  health_check_type         = "ELB"
  health_check_grace_period = 300

  instance_refresh {
    strategy = "Rolling"

    preferences {
      min_healthy_percentage = 50
      instance_warmup        = 180
    }
  }

  tag {
    key                 = "Name"
    value               = "users-instance"
    propagate_at_launch = true
  }
}
###########################################################################
#################### POLICY AUTOSCALING BY CPU ############################
###########################################################################

resource "aws_autoscaling_policy" "cpu_tracking" {
  name                   = "scale-on-cpu"
  autoscaling_group_name = aws_autoscaling_group.app.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }

    target_value = 10   # Baja CPU = reduce instancias
  }

  estimated_instance_warmup = 300
}
