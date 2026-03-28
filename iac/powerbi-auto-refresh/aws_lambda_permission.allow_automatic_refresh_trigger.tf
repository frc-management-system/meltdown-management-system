resource "aws_lambda_permission" "allow_automatic_refresh_trigger" {
  statement_id  = "allow-automatic-refresh-${data.aws_s3_bucket.scouting_output.id}-to-${aws_lambda_function.automatic_refresh.function_name}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.automatic_refresh.arn
  principal     = "s3.amazonaws.com"
  source_arn    = data.aws_s3_bucket.scouting_output.arn
}
