output "overseer_uploader_access_key_id" {
  value       = aws_iam_access_key.overseer_uploader.id
  description = "The access key id for the service user able to upload scouting data to S3"
  sensitive   = true
}
