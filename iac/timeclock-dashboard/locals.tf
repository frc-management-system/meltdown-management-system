locals {
    websiteS3BucketName = contains(["prod"], var.environment) ? "timeclock-dashboard" : "timeclock-dashboard-${var.environment}"
}