resource "aws_s3_bucket" "website" {
    bucket = local.websiteS3BucketName
}