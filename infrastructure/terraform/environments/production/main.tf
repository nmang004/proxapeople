/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This Terraform configuration has been commented out as part of the migration
 * from Google Cloud Platform to Vercel (frontend) and Supabase (backend/database).
 * The original infrastructure code is preserved below for reference.
 */

/*
# infrastructure/terraform/environments/production/main.tf

terraform {
  required_version = ">= 1.7.0"
  
  backend "gcs" {
    bucket = "proxapeople-terraform-state"
    prefix = "production"
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

# Configure providers
provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# Include the main module
module "proxapeople" {
  source = "../.."
  
  # Project configuration
  project_id  = var.project_id
  region      = var.region
  environment = "production"
  
  # Container configuration
  container_image = var.container_image
  
  # Cloud Run configuration
  cloud_run_cpu    = var.cloud_run_cpu
  cloud_run_memory = var.cloud_run_memory
  min_instances    = var.min_instances
  max_instances    = var.max_instances
  
  # Database configuration
  database_tier = var.database_tier
  
  # Auth0 configuration
  auth0_domain    = var.auth0_domain
  auth0_client_id = var.auth0_client_id
  
  # URLs
  frontend_url = var.frontend_url
  
  # Monitoring
  alert_email = var.alert_email
}
*/