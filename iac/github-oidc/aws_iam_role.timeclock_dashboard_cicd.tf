resource "aws_iam_role" "timeclock_dashboard_cicd" {
    name = "timeclock_dashboard_cicd"

    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Effect = "Allow"
                Principal = {
                    Federated = aws_iam_openid_connect_provider.github_actions_oidc_provider.arn
                }
                Action = "sts:AssumeRoleWithWebIdentity"
                Condition = {
                    StringEquals = {
                        "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
                        "token.actions.githubusercontent.com:sub" = "repo:frc2357/pi-clock:ref:refs/heads/main"
                    }
                }
            }
        ]
    })
}