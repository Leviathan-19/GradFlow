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
  name        = "users-create-tg"
  port        = 3001
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"

  health_check {
    enabled             = true
    path                = "/api/health"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = {
    Name = "users-create-target-group"
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

resource "aws_lb_listener_rule" "users_api" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.users.arn
  }

  condition {
    path_pattern {
      values = [
        "/api/*",
        "/api-docs*"
      ]
    }
  }
}

