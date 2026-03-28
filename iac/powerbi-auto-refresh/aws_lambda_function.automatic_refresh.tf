resource "aws_lambda_function" "automatic_refresh" {
  function_name = "${local.hidashNamePrefix}-automatic-powerbi-refresh"
  description   = "Lambda function to trigger powerbi data refresh when scouting data is uploaded"
  role          = aws_iam_role.automatic_refresh.arn
  filename      = data.archive_file.lambda_zip.output_path
  handler       = "index.handler"

  runtime = "nodejs22.x"

  timeout     = 30
  memory_size = 128

  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  environment {
    variables = {
      AZURE_TENANT_ID       = var.azure_tenant_id
      POWERBI_DATASOURCE_ID = var.powerbi_datasource_id
      AUTH_PAYLOAD          = var.auth_payload
    }
  }

  depends_on = [data.archive_file.lambda_zip]
}
