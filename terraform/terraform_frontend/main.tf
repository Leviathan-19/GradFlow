terraform {
  required_version = ">= 1.3.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = ">= 4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = ">= 2.0"
    }
  }
}

provider "aws" {
  region                   = var.aws_region
  shared_credentials_files = ["C:/Users/pasante.it/.aws/credentials"]
  profile                  = var.profile
  default_tags {
    tags = {
      Project     = "GradFlow"
      Environment = "frontend"
      ManagedBy   = "Terraform"
    }
  }
}
