resource "aws_s3_bucket_policy" "website" {
    bucket = aws_s3_bucket.website.id

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Sid = "PublicReadGetObject"
                Effect = "Allow"
                Principal = "*"
                Action = "s3:GetObject"
                Resource = "${aws_s3_bucket.website.arn}/*"
            }
        ]
    })

    depends_on = [aws_s3_bucket_public_access_block.website]
}