output "github_actions_iam_role_arn" {
    value = aws_iam_role.timeclock_dashboard_cicd.arn
    description = "The ARN of the IAM role for GitHub Actions to assume"
}