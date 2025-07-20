/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP monitoring outputs for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/monitoring/outputs.tf

output "notification_channel_id" {
  description = "ID of the notification channel"
  value       = google_monitoring_notification_channel.email.id
}

output "uptime_check_id" {
  description = "ID of the uptime check"
  value       = google_monitoring_uptime_check_config.cloud_run_uptime.uptime_check_id
}
*/