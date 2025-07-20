# infrastructure/terraform/outputs.tf
# COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION - Original Terraform Outputs

/*
output "cloud_run_url" {
  description = "URL of the Cloud Run service"
  value       = module.cloud_run.service_url
}

output "database_connection_name" {
  description = "Cloud SQL connection name"
  value       = module.database.connection_name
  sensitive   = true
}

output "vpc_connector_id" {
  description = "VPC connector ID"
  value       = module.networking.vpc_connector_id
}

output "kms_key_id" {
  description = "KMS encryption key ID"
  value       = module.security.database_encryption_key
}
*/