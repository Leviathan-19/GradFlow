variable "profile" {
  description = "AWS shared credentials profile (e.g., count1, count2)"
  type        = string
  default     = "count3"
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

variable "docker_image" {
  description = "Docker image"
  type        = string
  default     = "leviathan119/helloworld:latest"
}

variable "docker_container_port" {
  description = "Puerto interno expuesto por el contenedor"
  type        = number
  default     = 3000
}

variable "ami_id" {
  description = "AMI de Ubuntu (us-east-1)"
  type        = string
  default     = "ami-0ecb62995f68bb549"
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
  default     = "gradflow-docs"
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

variable "docker_registry" {
  description = "Docker registry (opcional)"
  type        = string
  default     = ""
}

variable "docker_registry_username" {
  description = "Usuario del registry (opcional)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "docker_registry_password" {
  description = "Password del registry (opcional)"
  type        = string
  default     = "" 
  sensitive   = true
}
