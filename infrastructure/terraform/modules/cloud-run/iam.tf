/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP Cloud Run IAM configuration for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/cloud-run/iam.tf

# Additional IAM for Cloud Run service
resource "google_cloud_run_service_iam_member" "developer_access" {
  count    = var.environment == "staging" ? 1 : 0
  service  = google_cloud_run_v2_service.app.name
  location = google_cloud_run_v2_service.app.location
  role     = "roles/run.developer"
  member   = "group:developers@proxapeople.com"
}

# Note: monitoring.viewer role is not supported for Cloud Run services
# Monitoring access is granted at the project level instead
*/