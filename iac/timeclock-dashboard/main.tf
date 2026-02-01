terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "5.82.2"
        }
    }

    backend "s3" {
        key = "timeclock-dashboard.tfstate"
    }
}

provider "aws" {
    region = "us-east-2"
}