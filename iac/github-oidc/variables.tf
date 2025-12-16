variable "environment" {
  type        = string
  description = "Environment [prod]"
  validation {
    condition     = contains(["prod"], var.environment)
    error_message = "Environment for GitHub OIDC Provider must be 'prod'"
  }
}
