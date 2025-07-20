/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP networking outputs for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/networking/outputs.tf

output "network_id" {
  description = "VPC network ID"
  value       = google_compute_network.main.id
}

output "network_name" {
  description = "VPC network name"
  value       = google_compute_network.main.name
}

output "private_subnet_id" {
  description = "Private subnet ID"
  value       = google_compute_subnetwork.private.id
}

output "vpc_connector_id" {
  description = "VPC connector ID"
  value       = google_vpc_access_connector.connector.id
}

output "db_private_ip" {
  description = "Private IP range for database"
  value       = google_compute_global_address.private_ip_address.name
}
*/