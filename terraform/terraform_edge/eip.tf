###########################################################################
########################## ELASTIC IPs ###################################
###########################################################################

resource "aws_eip" "app" {
  count  = 5
  domain = "vpc"

  tags = {
    Name = "edge-eip-${count.index + 1}"
  }

  depends_on = [aws_internet_gateway.igw]
}

output "elastic_ips" {
  description = "IPs elásticas creadas"
  value = {
    for idx, eip in aws_eip.app : "eip-${idx + 1}" => {
      id         = eip.id
      public_ip  = eip.public_ip
      allocation_id = eip.allocation_id
    }
  }
}
