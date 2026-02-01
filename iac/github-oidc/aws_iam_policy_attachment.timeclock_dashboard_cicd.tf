resource "aws_iam_role_policy_attachment" "timeclock_dashboard_cicd" {
  role       = aws_iam_role.timeclock_dashboard_cicd.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}