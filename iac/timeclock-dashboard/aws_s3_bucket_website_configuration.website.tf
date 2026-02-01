resource "aws_s3_bucket_website_configuration" "website" {
    bucket = aws_s3_bucket.website.id

    index_document {
        suffix = "index.html"
    }

    error_document {
        key = "index.html"
    }
}