# infrastructure/terraform/variables.tf
# COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION - Original Terraform Variables

/*
variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name (staging/production)"
  type        = string
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Environment must be staging or production"
  }
}

variable "container_image" {
  description = "Container image URL"
  type        = string
}

variable "database_tier" {
  description = "Cloud SQL machine type"
  type        = string
  default     = "db-f1-micro"
}

variable "cloud_run_cpu" {
  description = "Cloud Run CPU allocation"
  type        = string
  default     = "1"
}

variable "cloud_run_memory" {
  description = "Cloud Run memory allocation"
  type        = string
  default     = "512Mi"
}

variable "min_instances" {
  description = "Minimum Cloud Run instances"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Maximum Cloud Run instances"
  type        = number
  default     = 100
}

variable "auth0_domain" {
  description = "Auth0 domain"
  type        = string
}

variable "auth0_client_id" {
  description = "Auth0 client ID"
  type        = string
}

variable "auth0_audience" {
  description = "Auth0 audience"
  type        = string
}

variable "frontend_url" {
  description = "Frontend URL for CORS"
  type        = string
}

variable "alert_email" {
  description = "Email for monitoring alerts"
  type        = string
}
*/