########################## APPLICATION LOAD BALANCER #####################

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

########################## TARGET GROUPS ###################################

resource "aws_lb_target_group" "users_create" {
  name        = "tg-users-create"
  port        = 3001
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"

  health_check {
  path                = "/api-docs"
  protocol            = "HTTP"
  interval            = 30
  timeout             = 5
  healthy_threshold   = 2
  unhealthy_threshold = 3
}
}

resource "aws_lb_target_group" "users_delete" {
  name        = "tg-users-delete"
  port        = 3002
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"
  health_check {
  path                = "/api-docs"
  protocol            = "HTTP"
  interval            = 30
  timeout             = 5
  healthy_threshold   = 2
  unhealthy_threshold = 3
}
}

resource "aws_lb_target_group" "users_list" {
  name        = "tg-users-list"
  port        = 3003
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"
  health_check {
  path                = "/api-docs"
  protocol            = "HTTP"
  interval            = 30
  timeout             = 5
  healthy_threshold   = 2
  unhealthy_threshold = 3
}
}

resource "aws_lb_target_group" "users_update" {
  name        = "tg-users-update"
  port        = 3004
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"
  health_check {
  path                = "/api-docs"
  protocol            = "HTTP"
  interval            = 30
  timeout             = 5
  healthy_threshold   = 2
  unhealthy_threshold = 3
}
}

resource "aws_lb_target_group" "users_search" {
  name        = "tg-users-search"
  port        = 3005
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"
  health_check {
  path                = "/api-docs"
  protocol            = "HTTP"
  interval            = 30
  timeout             = 5
  healthy_threshold   = 2
  unhealthy_threshold = 3
}
}

########################## ALB LISTENER ###################################

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Ruta no encontrada"
      status_code  = 404
    }
  }
}
########################## ALB LISTENER RULES ##############################

resource "aws_lb_listener_rule" "users_create_rule" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.users_create.arn
  }

  condition {
    path_pattern {
      values = ["/users_create/*"]
    }
  }
}

resource "aws_lb_listener_rule" "users_delete_rule" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 20

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.users_delete.arn
  }

  condition {
    path_pattern {
      values = ["/users_delete/*"]
    }
  }
}

resource "aws_lb_listener_rule" "users_list_rule" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 30

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.users_list.arn
  }

  condition {
    path_pattern {
      values = ["/users_list/*"]
    }
  }
}

resource "aws_lb_listener_rule" "users_update_rule" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 40

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.users_update.arn
  }

  condition {
    path_pattern {
      values = ["/users_update/*"]
    }
  }
}

resource "aws_lb_listener_rule" "users_search_rule" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 50

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.users_search.arn
  }

  condition {
    path_pattern {
      values = ["/users_search/*"]
    }
  }
}

