# Key pair management (similar al patrón de AWS-Infrastructure)
# Genera una clave privada/pública y registra la pública en AWS.
# Opcionalmente guarda el .pem localmente.

resource "tls_private_key" "this" {
  count     = var.create_key_pair ? 1 : 0
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "this" {
  count     = var.create_key_pair ? 1 : 0
  key_name  = var.key_pair_name
  public_key = tls_private_key.this[0].public_key_openssh
}

resource "local_file" "private_key_pem" {
  count           = var.create_key_pair && var.save_private_key_locally ? 1 : 0
  filename        = local.effective_private_key_path
  content         = tls_private_key.this[0].private_key_pem
  file_permission = "0600"
}

# Output-friendly local value del nombre de la key
locals {
  effective_key_name         = var.create_key_pair ? aws_key_pair.this[0].key_name : var.key_pair_name
  default_private_key_dir    = "D:/llaves"
  effective_private_key_path = length(var.private_key_path) > 0 ? var.private_key_path : "${local.default_private_key_dir}/${var.key_pair_name}.pem"
}
