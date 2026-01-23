# Security group for Load Balancer
resource "aws_security_group" "web" {
  name   = "web_sg"
  vpc_id = aws_vpc.main.id

  # Permitir que el ALB conecte a los puertos de los microservicios
  ingress {
    from_port       = 3001
    to_port         = 3005
    protocol        = "tcp"
    security_groups = [aws_security_group.lb.id]
    description     = "Permitir tráfico del ALB a los microservicios"
  }

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # temporal, solo para debug/SSH
    description = "SSH for CI/CD"
  }

  # Egress
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
