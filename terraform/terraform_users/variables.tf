variable "profile" {
  description = "AWS shared credentials profile (e.g., count1, count2)"
  type        = string
  default     = "count1"
}

variable "aws_region" {
  description = "Region AWS"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "Tipo de instancia"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "AMI de Ubuntu (us-east-1)"
  type        = string
  default     = "ami-0ecb62995f68bb549" # Ubuntu 24.04 LTS x86_64 en us-east-1
}

variable "min_capacity" {
  type        = number
  description = "ASG min (AWS Academy compatible)"
  default     = 2
}

variable "desired_capacity" {
  type        = number
  description = "ASG desired (AWS Academy compatible)"
  default     = 2
}

variable "max_capacity" {
  type        = number
  description = "ASG max (AWS Academy compatible - máximo 5 instancias)"
  default     = 5
  validation {
    condition     = var.max_capacity >= var.desired_capacity && var.desired_capacity >= var.min_capacity && var.max_capacity <= 5
    error_message = "Capacidades ASG inválidas: min <= desired <= max <= 5 (límite AWS Academy)."
  }
}

variable "ssh_enabled" {
  description = "Habilitar acceso SSH (22) desde ssh_allowed_cidr"
  type        = bool
  default     = true
}

variable "ssh_allowed_cidr" {
  description = "CIDR (x.x.x.x/32) permitido para SSH"
  type        = string
  default     = "0.0.0.0/0"
}

variable "key_pair_name" {
  description = "Nombre de la key pair"
  type        = string
  default     = "gradflow-users"
}

variable "create_key_pair" {
  description = "Crear key pair con Terraform"
  type        = bool
  default     = true
}

variable "save_private_key_locally" {
  description = "Guardar la clave privada (.pem) localmente"
  type        = bool
  default     = true
}

variable "private_key_path" {
  description = "Ruta local para guardar el .pem"
  type        = string
  default     = ""
}

variable "db_host" {
  description = "Database host"
  type        = string
  default     = ""
  sensitive   = true
}

variable "db_user" {
  description = "Database user"
  type        = string
  default     = ""
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  default     = ""
  sensitive   = true
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_port" {
  description = "Database port"
  type        = number
  default     = 5432
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  default     = ""
  sensitive   = true
}

variable "dockerhub_username" {
  description = "Docker Hub username for pulling images"
  type        = string
  default     = ""
}

variable "dockerhub_token" {
  description = "Docker Hub token for pulling images"
  type        = string
  default     = ""
  sensitive   = true
}

# Docker images for each service
variable "docker_image_users_create" {
  description = "Docker image for users-create service"
  type        = string
  default     = ""
}

variable "docker_image_users_delete" {
  description = "Docker image for users-delete service"
  type        = string
  default     = ""
}

variable "docker_image_users_list" {
  description = "Docker image for users-list service"
  type        = string
  default     = ""
}

variable "docker_image_users_search" {
  description = "Docker image for users-search service"
  type        = string
  default     = ""
}

variable "docker_image_users_update" {
  description = "Docker image for users-update service"
  type        = string
  default     = ""
}
