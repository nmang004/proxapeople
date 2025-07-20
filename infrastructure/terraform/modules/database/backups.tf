/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP database backup configuration for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/database/backups.tf

# Backup configuration is handled in main.tf within the database instance settings
# This file documents the backup strategy for reference

# Backup configuration is set in google_sql_database_instance.main.settings.backup_configuration:
# - Enabled: true
# - Start time: 03:00 (3 AM)
# - Point-in-time recovery: enabled
# - Retention: 7 days (staging), 30 days (production)
# - Location: same region as database

# For on-demand backups, use the Google Cloud Console or gcloud CLI:
# gcloud sql backups create --instance=proxapeople-production --description="Manual backup"

locals {
  backup_documentation = {
    staging = {
      frequency = "daily"
      retention_days = 7
      start_time = "03:00"
    }
    production = {
      frequency = "daily" 
      retention_days = 30
      start_time = "03:00"
    }
  }
}
*/