data "aws_s3_bucket" "scouting_output" {
  bucket = "${local.hidashNamePrefix}-scouting-output"
}
