/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP monitoring main configuration for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/monitoring/main.tf

# Notification channel for alerts
resource "google_monitoring_notification_channel" "email" {
  display_name = "ProxaPeople Email Alerts - ${var.environment}"
  type         = "email"
  
  labels = {
    email_address = var.alert_email
  }
  
  enabled = true
}

# Uptime check for Cloud Run service
resource "google_monitoring_uptime_check_config" "cloud_run_uptime" {
  display_name = "ProxaPeople Service Uptime - ${var.environment}"
  timeout      = "10s"
  period       = "300s"
  
  http_check {
    path           = "/health"
    port           = "443"
    use_ssl        = true
    validate_ssl   = true
    request_method = "GET"
  }
  
  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = replace(data.google_cloud_run_service.app.status[0].url, "https://", "")
    }
  }
  
  checker_type = "STATIC_IP_CHECKERS"
}

# Get Cloud Run service details
data "google_cloud_run_service" "app" {
  name     = var.cloud_run_service
  location = var.region
}

# Log-based metric for error rate
resource "google_logging_metric" "error_rate" {
  name   = "error_rate_${var.environment}"
  filter = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${var.cloud_run_service}\" AND severity>=ERROR"
  
  metric_descriptor {
    metric_kind = "GAUGE"
    value_type  = "INT64"
    display_name = "Error Rate"
  }
  
  label_extractors = {
    "service_name" = "EXTRACT(resource.labels.service_name)"
  }
}
*/