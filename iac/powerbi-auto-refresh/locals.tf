locals {
  lodashNamePrefix = lower("${replace(var.appId, "-", "_")}_${var.environment}")
  hidashNamePrefix = lower("${replace(var.appId, "_", "-")}-${var.environment}")
}
