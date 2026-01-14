###########################################################################
########################## LAUNCH TEMPLATE ################################
###########################################################################

resource "aws_launch_template" "app" {
  name_prefix   = "hello"
  image_id      = "ami-0c398cb65a93047f2"
  instance_type = "t3.micro"
  key_name      = "nginx-server-ssh"

  vpc_security_group_ids = [aws_security_group.web.id]
}

###########################################################################
########################## AUTO SCALING GROUP #############################
###########################################################################

resource "aws_autoscaling_group" "app" {
  max_size          = 10
  min_size          = 2
  desired_capacity  = 2

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  vpc_zone_identifier = aws_subnet.public[*].id
  target_group_arns   = [aws_lb_target_group.app.arn]

  health_check_type         = "ELB"
  health_check_grace_period = 120

  instance_refresh {
    strategy = "Rolling"

    preferences {
      min_healthy_percentage = 50
      instance_warmup        = 120
    }
  }

  tag {
    key                 = "Name"
    value               = "hello-app-instance"
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

    target_value = 40   # Baja CPU = reduce instancias
  }

  estimated_instance_warmup = 120
}

#############################
# POLICY 2: ESCALAR POR REQUEST COUNT (ALB)
#############################

resource "aws_autoscaling_policy" "requests_tracking" {
  name                   = "scale-on-requests"
  autoscaling_group_name = aws_autoscaling_group.app.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ALBRequestCountPerTarget"
      resource_label         = "${aws_lb.app.arn_suffix}/${aws_lb_target_group.app.arn_suffix}"
    }

    target_value = 10     # MENOS DE 10 peticiones por instancia = elimina instancias
  }

  estimated_instance_warmup = 120
}

