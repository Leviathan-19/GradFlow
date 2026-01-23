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

output "tg_users_create_arn" {
  description = "ARN del target group users_create"
  value       = aws_lb_target_group.users_create.arn
}

output "tg_users_delete_arn" {
  description = "ARN del target group users_delete"
  value       = aws_lb_target_group.users_delete.arn
}

output "tg_users_list_arn" {
  description = "ARN del target group users_list"
  value       = aws_lb_target_group.users_list.arn
}

output "tg_users_update_arn" {
  description = "ARN del target group users_update"
  value       = aws_lb_target_group.users_update.arn
}

output "tg_users_search_arn" {
  description = "ARN del target group users_search"
  value       = aws_lb_target_group.users_search.arn
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

# IAM role output deshabilitado para cuentas académicas
# output "iam_role_arn" {
#   description = "ARN del IAM role asignado a las instancias"
#   value       = aws_iam_role.app.arn
# }


