resource "aws_s3_bucket_notification" "automatic_refresh_trigger" {
  bucket = data.aws_s3_bucket.scouting_output.id

  lambda_function {
    events              = ["s3:ObjectCreated:*"]
    lambda_function_arn = aws_lambda_function.automatic_refresh.arn
  }

  depends_on = [aws_lambda_permission.allow_automatic_refresh_trigger]
}
