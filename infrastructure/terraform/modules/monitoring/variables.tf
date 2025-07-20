/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP monitoring variables for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/monitoring/variables.tf

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
}

variable "cloud_run_service" {
  description = "Cloud Run service name"
  type        = string
}

variable "database_instance" {
  description = "Cloud SQL instance name"
  type        = string
}

variable "alert_email" {
  description = "Email address for alerts"
  type        = string
}
*/