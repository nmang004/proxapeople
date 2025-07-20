/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP KMS configuration for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/security/kms.tf

# Additional encryption keys for different services
resource "google_kms_crypto_key" "secrets" {
  name     = "secrets-encryption"
  key_ring = google_kms_key_ring.main.id
  
  rotation_period = "7776000s" # 90 days
  
  lifecycle {
    prevent_destroy = true
  }
}

# IAM binding for Cloud Run to use secrets encryption key
resource "google_kms_crypto_key_iam_member" "secrets_encryption" {
  crypto_key_id = google_kms_crypto_key.secrets.id
  role          = "roles/cloudkms.cryptoKeyEncrypterDecrypter"
  member        = "serviceAccount:${google_service_account.cloud_run.email}"
}
*/