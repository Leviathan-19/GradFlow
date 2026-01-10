resource "aws_launch_template" "app" {
  name_prefix   = "hello"
  image_id      = "ami-08df7e9cff92a2aac"
  instance_type = "t3.micro"
}


resource "aws_autoscaling_group" "app" {
  max_size = 9
  min_size = 3
  desired_capacity = 3

  launch_template {
    id = aws_launch_template.app.id
    version = "$Latest"
  }

  vpc_zone_identifier = aws_subnet.public[*].id
}
