# Security group for Load Balancer
resource "aws_security_group" "lb" {
  name   = "lb_sg"
  vpc_id = aws_vpc.main.id

  # Permitir HTTP desde internet
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Permitir trafico HTTP desde internet"
  }

  # Egress
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Permitir todo el trafico de salida"
  }
}

# Security group para las instancias del ASG
resource "aws_security_group" "web" {
  name   = "web_sg"
  vpc_id = aws_vpc.main.id

  # Permitir tráfico del ALB a los microservicios
  ingress {
    from_port       = 3001
    to_port         = 3005
    protocol        = "tcp"
    security_groups = [aws_security_group.lb.id]
    description     = "Permitir trafico del ALB a los microservicios"
  }

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH for CI/CD"
  }

  # Egress
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Permitir todo el trafico de salida"
  }
}
