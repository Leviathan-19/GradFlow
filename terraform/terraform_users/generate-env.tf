# Generate .env files for services from Terraform outputs
# This creates .env files that can be uploaded to EC2 instances

resource "local_file" "env_users_create" {
  content = templatefile("${path.module}/templates/env.tpl", {
    service_name     = "users_create"
    port             = 3001
    loadbalancer_dns = aws_lb.app.dns_name
    db_host          = var.db_host
    db_user          = var.db_user
    db_password      = var.db_password
    db_name          = var.db_name
    db_port          = var.db_port
    jwt_secret       = var.jwt_secret
    docker_registry  = var.docker_registry
    docker_username  = var.docker_registry_username
    docker_password  = var.docker_registry_password
  })
  filename = "${path.module}/.env.users_create"
}

resource "local_file" "env_users_delete" {
  content = templatefile("${path.module}/templates/env.tpl", {
    service_name     = "users_delete"
    port             = 3002
    loadbalancer_dns = aws_lb.app.dns_name
    db_host          = var.db_host
    db_user          = var.db_user
    db_password      = var.db_password
    db_name          = var.db_name
    db_port          = var.db_port
    jwt_secret       = var.jwt_secret
    docker_registry  = var.docker_registry
    docker_username  = var.docker_registry_username
    docker_password  = var.docker_registry_password
  })
  filename = "${path.module}/.env.users_delete"
}

resource "local_file" "env_users_list" {
  content = templatefile("${path.module}/templates/env.tpl", {
    service_name     = "users_list"
    port             = 3003
    loadbalancer_dns = aws_lb.app.dns_name
    db_host          = var.db_host
    db_user          = var.db_user
    db_password      = var.db_password
    db_name          = var.db_name
    db_port          = var.db_port
    jwt_secret       = var.jwt_secret
    docker_registry  = var.docker_registry
    docker_username  = var.docker_registry_username
    docker_password  = var.docker_registry_password
  })
  filename = "${path.module}/.env.users_list"
}

resource "local_file" "env_users_search" {
  content = templatefile("${path.module}/templates/env.tpl", {
    service_name     = "users_search"
    port             = 3004
    loadbalancer_dns = aws_lb.app.dns_name
    db_host          = var.db_host
    db_user          = var.db_user
    db_password      = var.db_password
    db_name          = var.db_name
    db_port          = var.db_port
    jwt_secret       = var.jwt_secret
    docker_registry  = var.docker_registry
    docker_username  = var.docker_registry_username
    docker_password  = var.docker_registry_password
  })
  filename = "${path.module}/.env.users_search"
}

resource "local_file" "env_users_update" {
  content = templatefile("${path.module}/templates/env.tpl", {
    service_name     = "users_update"
    port             = 3005
    loadbalancer_dns = aws_lb.app.dns_name
    db_host          = var.db_host
    db_user          = var.db_user
    db_password      = var.db_password
    db_name          = var.db_name
    db_port          = var.db_port
    jwt_secret       = var.jwt_secret
    docker_registry  = var.docker_registry
    docker_username  = var.docker_registry_username
    docker_password  = var.docker_registry_password
  })
  filename = "${path.module}/.env.users_update"
}
