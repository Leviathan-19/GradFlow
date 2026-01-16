resource "aws_key_pair" "nginx_server_ssh" {
  key_name   = "nginx-server-ssh"
  public_key = file("${path.module}/nginx-server.key.pub")
}
