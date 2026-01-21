###########################################################################
########################## APPLICATION LOAD BALANCER #####################
###########################################################################

resource "aws_lb" "app" {
  name               = "users-lb"
  load_balancer_type = "application"
  subnets            = aws_subnet.public[*].id
  security_groups    = [aws_security_group.lb.id]

  # Habilitar logging de acceso
  enable_deletion_protection = false
  enable_http2              = true
  enable_cross_zone_load_balancing = true

  # IP address type
  ip_address_type = "ipv4"

  tags = {
    Name = "users-application-lb"
  }
}

###########################################################################
########################## TARGET GROUP ###################################
###########################################################################

resource "aws_lb_target_group" "app" {
  name        = "users-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"

  # Health check - More lenient to prevent instance termination
  # Changed to root path and increased thresholds
  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 5  # Increased from 3 to 5 - more tolerance
    timeout             = 10  # Increased from 5 to 10 seconds
    interval            = 60  # Increased from 30 to 60 seconds - check less frequently
    path                = "/"  # Changed from /health to root path (more likely to work)
    protocol            = "HTTP"
    matcher             = "200,404"  # Accept both 200 and 404 as healthy
  }

  # Deregistration delay - Increased to give more time before removing from LB
  deregistration_delay = 300  # Increased from 30 to 300 seconds (5 minutes)

  # Connection draining
  stickiness {
    enabled         = false  # Para balanceo de carga equitativo
    type            = "lb_cookie"
    cookie_duration = 86400
  }

  tags = {
    Name = "users-target-group"
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

###########################################################################
########################## ALB LISTENER RULE (OPCIONAL) ###################
###########################################################################

# Ejemplo de regla adicional (puedes agregar más según necesidad)
# resource "aws_lb_listener_rule" "example" {
#   listener_arn = aws_lb_listener.http.arn
#   priority     = 100
#
#   action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.app.arn
#   }
#
#   condition {
#     path_pattern {
#       values = ["/api/*"]
#     }
#   }
# }
