###########################################################################
########################## APPLICATION LOAD BALANCER #####################
###########################################################################

resource "aws_lb" "app" {
  name               = "auth-lb"
  load_balancer_type = "application"
  subnets            = aws_subnet.public[*].id
  security_groups    = [aws_security_group.lb.id]

  enable_deletion_protection = false
  enable_http2              = true
  enable_cross_zone_load_balancing = true

  ip_address_type = "ipv4"

  tags = {
    Name = "auth-application-lb"
  }
}

###########################################################################
########################## TARGET GROUP ###################################
###########################################################################

resource "aws_lb_target_group" "app" {
  name        = "auth-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200-399"
  }

  deregistration_delay = 30

  stickiness {
    enabled         = false
    type            = "lb_cookie"
    cookie_duration = 86400
  }

  tags = {
    Name = "auth-target-group"
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
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}
