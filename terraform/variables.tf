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
}

variable "ami_id" {
  description = "Ubuntu t3.micro"
  type        = string
  default     = "ami-08df7e9cff92a2aac"   # us-east-1
}

variable "min_capacity" {
  type    = number
  default = 3
}

variable "desired_capacity" {
  type    = number
  default = 3
}

variable "max_capacity" {
  type    = number
  default = 9
}
