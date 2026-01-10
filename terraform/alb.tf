resource "aws_lb" "app" {
  name = "hello-lb"
  load_balancer_type = "application"
  subnets = aws_subnet.public[*].id
}
