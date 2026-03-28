variable "awsRegion" {
  type        = string
  description = "value of the AWS region"
}

variable "awsAccountId" {
  type        = string
  description = "value of the AWS account id"
}

variable "appId" {
  type        = string
  description = "App ID"
}

variable "environment" {
  type        = string
  description = "Environment [dev, prod]"
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "Environment must be either dev or prod."
  }
}

variable "azure_tenant_id" {
  type        = string
  description = "Azure -> Entra ID -> Tenant ID"
}

variable "powerbi_datasource_id" {
  type        = string
  description = "PowerBI Web -> '2026scouting' dataset -> ID"
}


variable "auth_payload" {
  type        = string
  description = "The payload to pass to the Microsoft Auth endpoint"

  # Payload format
  # {
  #  "client_id":"<azure-app-registration-client-id>",
  #  "scope":"https://analysis.windows.net/powerbi/api/.default",
  #  "grant_type":"password",
  #  "username":"<powerbi-refresh-user-username>",
  #  "password":"<powerbi-refresh-user-password>"
  # }
}
