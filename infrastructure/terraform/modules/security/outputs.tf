/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP security outputs for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/security/outputs.tf

output "cloud_run_service_account" {
  description = "Email of the Cloud Run service account"
  value       = google_service_account.cloud_run.email
}

output "database_encryption_key" {
  description = "ID of the database encryption key"
  value       = google_kms_crypto_key.database.id
}

output "auth0_secret_id" {
  description = "ID of the Auth0 client secret"
  value       = google_secret_manager_secret.auth0_client_secret.id
}

output "jwt_secret_id" {
  description = "ID of the JWT secret"
  value       = google_secret_manager_secret.jwt_secret.id
}

output "session_secret_id" {
  description = "ID of the session secret"
  value       = google_secret_manager_secret.session_secret.id
}

output "kms_keyring_id" {
  description = "ID of the KMS keyring"
  value       = google_kms_key_ring.main.id
}
*/