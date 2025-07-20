/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This Terraform configuration has been commented out as part of the migration
 * from Google Cloud Platform to Vercel (frontend) and Supabase (backend/database).
 * The original infrastructure code is preserved below for reference.
 */

/*
# infrastructure/terraform/environments/production/outputs.tf

output "cloud_run_url" {
  description = "URL of the production Cloud Run service"
  value       = module.proxapeople.cloud_run_url
}

output "database_connection_name" {
  description = "Cloud SQL connection name"
  value       = module.proxapeople.database_connection_name
  sensitive   = true
}
*/