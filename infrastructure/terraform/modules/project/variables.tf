/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP project variables for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/project/variables.tf

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "services" {
  description = "List of GCP services to enable"
  type        = list(string)
  default     = []
}
*/