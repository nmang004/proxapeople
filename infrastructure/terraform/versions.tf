# infrastructure/terraform/versions.tf
# COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION - Original Terraform Configuration

/*
terraform {
  required_version = ">= 1.7.0"
  
  backend "gcs" {
    bucket = "proxapeople-production-terraform-state"
    prefix = "terraform/state"
  }
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta" 
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}
*/