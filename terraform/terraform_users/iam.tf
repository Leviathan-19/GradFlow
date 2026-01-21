###########################################################################
########################## IAM ROLE & POLICIES ###########################
###########################################################################
# NOTA: Deshabilitado para cuentas académicas de AWS que no tienen acceso completo a IAM
# Las IPs elásticas deberán asociarse manualmente o mediante AWS Console/CLI después de crear las instancias

# # IAM Role para las instancias del ASG
# resource "aws_iam_role" "app" {
#   name = "users-asg-instance-role"
#
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = "sts:AssumeRole"
#         Effect = "Allow"
#         Principal = {
#           Service = "ec2.amazonaws.com"
#         }
#       }
#     ]
#   })
#
#   tags = {
#     Name = "users-asg-instance-role"
#   }
# }
#
# # Policy para asociar IPs elásticas
# resource "aws_iam_role_policy" "eip_association" {
#   name = "users-eip-association-policy"
#   role = aws_iam_role.app.id
#
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Effect = "Allow"
#         Action = [
#           "ec2:DescribeAddresses",
#           "ec2:AssociateAddress",
#           "ec2:DisassociateAddress"
#         ]
#         Resource = "*"
#       }
#     ]
#   })
# }
#
# # Policy para CloudWatch (monitoreo y métricas)
# resource "aws_iam_role_policy" "cloudwatch" {
#   name = "users-cloudwatch-policy"
#   role = aws_iam_role.app.id
#
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Effect = "Allow"
#         Action = [
#           "cloudwatch:PutMetricData",
#           "logs:CreateLogGroup",
#           "logs:CreateLogStream",
#           "logs:PutLogEvents"
#         ]
#         Resource = "*"
#       }
#     ]
#   })
# }
#
# # Instance Profile
# resource "aws_iam_instance_profile" "app" {
#   name = "users-asg-instance-profile"
#   role = aws_iam_role.app.name
# }
