/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP Cloud Run outputs for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/cloud-run/outputs.tf

output "service_url" {
  description = "URL of the Cloud Run service"
  value       = google_cloud_run_v2_service.app.uri
}

output "service_name" {
  description = "Name of the Cloud Run service"
  value       = google_cloud_run_v2_service.app.name
}

output "service_id" {
  description = "ID of the Cloud Run service"
  value       = google_cloud_run_v2_service.app.id
}
*/