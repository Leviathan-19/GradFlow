output "loadbalancer_dns" {
  description = "public DNS Load balancer"
  value       = aws_lb.app.dns_name
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnets" {
  value = aws_subnet.public[*].id
}
