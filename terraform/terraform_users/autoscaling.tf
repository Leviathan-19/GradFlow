###########################################################################
########################## LAUNCH TEMPLATE ################################
###########################################################################

resource "aws_launch_template" "app" {
  name_prefix   = "users-app-"
  image_id      = var.ami_id
  instance_type = var.instance_type
  key_name      = local.effective_key_name

  vpc_security_group_ids = [aws_security_group.web.id]

  user_data = base64encode(templatefile("${path.module}/user-data-template.sh", {
    dockerhub_username           = var.dockerhub_username
    dockerhub_token              = var.dockerhub_token

    db_host                      = var.db_host
    db_user                      = var.db_user
    db_password                  = var.db_password
    db_name                      = var.db_name
    db_port                      = var.db_port

    jwt_secret                   = var.jwt_secret

    docker_image_users_create    = var.docker_image_users_create
    docker_image_users_delete    = var.docker_image_users_delete
    docker_image_users_list      = var.docker_image_users_list
    docker_image_users_search    = var.docker_image_users_search
    docker_image_users_update    = var.docker_image_users_update

    loadbalancer_dns             = aws_lb.app.dns_name
  }))
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

  # Asociar a todos los target groups de los microservicios
  target_group_arns = [
    aws_lb_target_group.users_create.arn,
    aws_lb_target_group.users_delete.arn,
    aws_lb_target_group.users_list.arn,
    aws_lb_target_group.users_update.arn,
    aws_lb_target_group.users_search.arn
  ]

  health_check_type         = "EC2"
  health_check_grace_period = 300
  termination_policies      = ["Default"]
  protect_from_scale_in     = false
  wait_for_capacity_timeout = "10m"

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
