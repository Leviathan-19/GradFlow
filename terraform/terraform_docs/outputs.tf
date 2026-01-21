output "loadbalancer_dns" {
  description = "Public DNS del Load Balancer"
  value       = aws_lb.app.dns_name
}

output "loadbalancer_arn" {
  description = "ARN del Load Balancer"
  value       = aws_lb.app.arn
}

output "vpc_id" {
  description = "ID de la VPC"
  value       = aws_vpc.main.id
}

output "public_subnets" {
  description = "IDs de las subnets públicas"
  value       = aws_subnet.public[*].id
}

output "target_group_arn" {
  description = "ARN del Target Group usado por el ALB"
  value       = aws_lb_target_group.app.arn
}

output "target_group_name" {
  description = "Nombre del Target Group"
  value       = aws_lb_target_group.app.name
}

output "asg_name" {
  description = "Nombre del Auto Scaling Group"
  value       = aws_autoscaling_group.app.name
}

output "asg_arn" {
  description = "ARN del Auto Scaling Group"
  value       = aws_autoscaling_group.app.arn
}

output "elastic_ips_list" {
  description = "Lista simple de IPs elásticas públicas"
  value       = aws_eip.app[*].public_ip
}

output "iam_role_arn" {
  description = "ARN del IAM role asignado a las instancias"
  value       = aws_iam_role.app.arn
}