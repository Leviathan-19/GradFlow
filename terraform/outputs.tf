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
output "asg_cpu_scaling_policy_target" {
  description = "Umbral de CPU para la política de escalado (porcentaje)"
  value       = try(aws_autoscaling_policy.scale_on_cpu.target_tracking_configuration[0].target_value, "Política no definida")
}

output "asg_request_scaling_policy_target" {
  description = "Umbral de peticiones por instancia para la política de escalado"
  value       = try(aws_autoscaling_policy.scale_on_request_count.target_tracking_configuration[0].target_value, "Política no definida")
}

output "asg_scaling_policies_status" {
  description = "Estado de las políticas de escalado"
  value       = format("CPU: %s, Requests: %s", 
                      try(aws_autoscaling_policy.scale_on_cpu.name, "No creada"),
                      try(aws_autoscaling_policy.scale_on_request_count.name, "No creada"))
}