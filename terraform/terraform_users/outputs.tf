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

output "target_group_arn" {
  description = "ARN del Target Group usado por el ALB"
  value       = aws_lb_target_group.app.arn
}

output "asg_name" {
  description = "Nombre del Auto Scaling Group"
  value       = aws_autoscaling_group.app.name
}

output "key_pair_name" {
  description = "Nombre de la key pair utilizada por las instancias"
  value       = local.effective_key_name
}

output "ssh_command_hint" {
  description = "Ejemplo de comando SSH (reemplaza <ip_publica> por la IP de una instancia)"
  value       = "ssh -i <ruta-a-tu-pem> ubuntu@<ip_publica>"
}


