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

output "key_pair_name" {
  description = "Nombre de la key pair utilizada por las instancias"
  value       = local.effective_key_name
}

output "ssh_command_hint" {
  description = "Ejemplo de comando SSH (reemplaza <ip_publica> por la IP de una instancia o IP elástica)"
  value       = "ssh -i <ruta-a-tu-pem> ubuntu@<ip_publica-o-elastica>"
}

output "docker_registry" {
  description = "Docker registry URL for pulling images"
  value       = var.docker_registry
}

output "docker_registry_username" {
  description = "Docker registry username"
  value       = var.docker_registry_username
  sensitive   = true
}

output "docker_image" {
  description = "Docker image name"
  value       = var.docker_image
}

output "docker_container_port" {
  description = "Docker container port"
  value       = var.docker_container_port
}

# IAM role output deshabilitado para cuentas académicas
# output "iam_role_arn" {
#   description = "ARN del IAM role asignado a las instancias"
#   value       = aws_iam_role.app.arn
# }


