/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP database main configuration for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/database/main.tf

# Generate random password
resource "random_password" "db_password" {
  length  = 32
  special = true
}

# Store password in Secret Manager
resource "google_secret_manager_secret" "db_password" {
  secret_id = "db-password-${var.environment}"
  
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = random_password.db_password.result
}

# Cloud SQL instance
resource "google_sql_database_instance" "main" {
  name             = "proxapeople-${var.environment}"
  database_version = var.database_version
  region           = var.region
  
  settings {
    tier                        = var.database_tier
    deletion_protection_enabled = var.deletion_protection
    
    disk_size                   = var.environment == "production" ? 100 : 10
    disk_type                   = "PD_SSD"
    disk_autoresize             = true
    disk_autoresize_limit       = var.environment == "production" ? 500 : 100
    
    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = true
      location                       = var.region
      
      backup_retention_settings {
        retained_backups = var.environment == "production" ? 30 : 7
        retention_unit   = "COUNT"
      }
    }
    
    ip_configuration {
      ipv4_enabled                                  = false
      private_network                               = var.network_id
      enable_private_path_for_google_cloud_services = true
      ssl_mode                                      = "ENCRYPTED_ONLY"
    }
    
    database_flags {
      name  = "max_connections"
      value = var.environment == "production" ? "200" : "100"
    }
    
    insights_config {
      query_insights_enabled  = true
      query_string_length     = 1024
      record_application_tags = true
      record_client_address   = true
    }
    
    maintenance_window {
      day          = 7  # Sunday
      hour         = 4  # 4 AM
      update_track = "stable"
    }
  }
  
# encryption_key_name = var.kms_key_id  # Disabled for now due to service account issues
  
  depends_on = [var.private_ip_address]
}

# Database
resource "google_sql_database" "main" {
  name     = "proxapeople"
  instance = google_sql_database_instance.main.name
}

# Database user
resource "google_sql_user" "app" {
  name     = "app_user"
  instance = google_sql_database_instance.main.name
  password = random_password.db_password.result
}
*/