###########################################################################
########################## APPLICATION LOAD BALANCER #####################
###########################################################################

resource "aws_lb" "app" {
  name               = "users-lb"
  load_balancer_type = "application"
  subnets            = aws_subnet.public[*].id
  security_groups    = [aws_security_group.lb.id]

  enable_deletion_protection       = false
  enable_http2                     = true
  enable_cross_zone_load_balancing = true

  ip_address_type = "ipv4"

  tags = {
    Name = "users-application-lb"
  }
}

###########################################################################
########################## TARGET GROUPS (UNO POR SERVICIO) ###############
###########################################################################

locals {
  users_services = {
    create = 3001
    delete = 3002
    list   = 3003
    search = 3004
    update = 3005
  }
}

resource "aws_lb_target_group" "users" {
  for_each = local.users_services

  name        = "users-${each.key}-tg"
  port        = each.value
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 5
    timeout             = 10
    interval            = 60
    path                = "/api-docs"
    protocol            = "HTTP"
    matcher             = "200"
  }

  deregistration_delay = 300

  tags = {
    Name = "users-${each.key}-target-group"
  }
}

###########################################################################
########################## ALB LISTENER ###################################
###########################################################################

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "Not Found"
      status_code  = "404"
    }
  }
}

###########################################################################
########################## ALB LISTENER RULES #############################
###########################################################################

resource "aws_lb_listener_rule" "users_routes" {
  for_each = aws_lb_target_group.users

  listener_arn = aws_lb_listener.http.arn
  priority     = 100 + index(keys(aws_lb_target_group.users), each.key)

  action {
    type             = "forward"
    target_group_arn = each.value.arn
  }

  condition {
    path_pattern {
      values = [
        each.key == "create" ? "/api/users/create*" :
        each.key == "delete" ? "/api/users/*/delete*" :
        each.key == "list"   ? "/api/users" :
        each.key == "search" ? "/api/users/search*" :
        "/api/users/*/update*"
      ]
    }
  }
}
