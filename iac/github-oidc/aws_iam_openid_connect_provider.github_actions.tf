# oidc provider to allow github actions to assume iam roles
resource "aws_iam_openid_connect_provider" "github_actions_oidc_provider" {
    url = "https://token.actions.githubusercontent.com"

    client_id_list = ["sts.amazonaws.com"]
}