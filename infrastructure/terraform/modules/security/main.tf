/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP security main configuration for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/security/main.tf

# Service account for Cloud Run
resource "google_service_account" "cloud_run" {
  account_id   = "cloud-run-${var.environment}"
  display_name = "Cloud Run Service Account - ${var.environment}"
  description  = "Service account for ProxaPeople Cloud Run service"
}

# IAM roles for Cloud Run service account
resource "google_project_iam_member" "cloud_run_roles" {
  for_each = toset([
    "roles/cloudsql.client",
    "roles/secretmanager.secretAccessor",
    "roles/cloudtrace.agent",
    "roles/monitoring.metricWriter",
    "roles/logging.logWriter"
  ])
  
  project = var.project_id
  role    = each.key
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

# KMS keyring
resource "google_kms_key_ring" "main" {
  name     = "proxapeople-${var.environment}"
  location = var.region
}

# Database encryption key
resource "google_kms_crypto_key" "database" {
  name     = "database-encryption"
  key_ring = google_kms_key_ring.main.id
  
  rotation_period = "7776000s" # 90 days
  
  lifecycle {
    prevent_destroy = true
  }
}

# Grant Cloud SQL service access to KMS key
# Note: The Cloud SQL service account is auto-created when the first instance is created
# This will be applied in a separate run after the database instance exists
# resource "google_kms_crypto_key_iam_member" "sql_encryption" {
#   crypto_key_id = google_kms_crypto_key.database.id
#   role          = "roles/cloudkms.cryptoKeyEncrypterDecrypter"
#   member        = "serviceAccount:service-${data.google_project.project.number}@gcp-sa-cloud-sql.iam.gserviceaccount.com"
# }

# Get project details for service account
data "google_project" "project" {
  project_id = var.project_id
}

# Secrets for Auth0
resource "google_secret_manager_secret" "auth0_client_secret" {
  secret_id = "auth0-client-secret-${var.environment}"
  
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "jwt-secret-${var.environment}"
  
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "session_secret" {
  secret_id = "session-secret-${var.environment}"
  
  replication {
    auto {}
  }
}

# Generate JWT secret
resource "random_password" "jwt_secret" {
  length  = 64
  special = false # Base64 friendly
}

# Generate session secret
resource "random_password" "session_secret" {
  length  = 64
  special = false # Base64 friendly
}

resource "google_secret_manager_secret_version" "jwt_secret" {
  secret      = google_secret_manager_secret.jwt_secret.id
  secret_data = random_password.jwt_secret.result
}

resource "google_secret_manager_secret_version" "session_secret" {
  secret      = google_secret_manager_secret.session_secret.id
  secret_data = random_password.session_secret.result
}

# IAM for secret access
resource "google_secret_manager_secret_iam_member" "auth0_secret_access" {
  secret_id = google_secret_manager_secret.auth0_client_secret.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_secret_manager_secret_iam_member" "jwt_secret_access" {
  secret_id = google_secret_manager_secret.jwt_secret.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_secret_manager_secret_iam_member" "session_secret_access" {
  secret_id = google_secret_manager_secret.session_secret.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run.email}"
}
*/