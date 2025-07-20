/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP project configuration for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/project/main.tf

# Enable required GCP APIs
resource "google_project_service" "services" {
  for_each = toset(var.services)
  
  project                    = var.project_id
  service                    = each.value
  disable_dependent_services = true
  disable_on_destroy         = false
}

# Wait for API enablement before proceeding
resource "time_sleep" "wait_for_apis" {
  depends_on = [google_project_service.services]
  
  create_duration = "60s"
}
*/