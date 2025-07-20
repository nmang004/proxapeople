/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP monitoring alerts configuration for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/monitoring/alerts.tf

# High error rate alert
resource "google_monitoring_alert_policy" "high_error_rate" {
  display_name = "High Error Rate - ${var.environment}"
  combiner     = "OR"
  enabled      = true
  
  conditions {
    display_name = "Error rate condition"
    
    condition_threshold {
      filter         = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${var.cloud_run_service}\""
      duration       = "300s"
      comparison     = "COMPARISON_GT"
      threshold_value = var.environment == "production" ? 0.05 : 0.1 # 5% for prod, 10% for staging
      
      aggregations {
        alignment_period     = "300s"
        per_series_aligner   = "ALIGN_RATE"
        cross_series_reducer = "REDUCE_MEAN"
        group_by_fields      = ["resource.labels.service_name"]
      }
    }
  }
  
  notification_channels = [google_monitoring_notification_channel.email.id]
  
  alert_strategy {
    auto_close = "1800s" # 30 minutes
  }
}

# High latency alert
resource "google_monitoring_alert_policy" "high_latency" {
  display_name = "High Latency - ${var.environment}"
  combiner     = "OR"
  enabled      = true
  
  conditions {
    display_name = "Response latency condition"
    
    condition_threshold {
      filter         = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${var.cloud_run_service}\" AND metric.type=\"run.googleapis.com/request_latencies\""
      duration       = "300s"
      comparison     = "COMPARISON_GT"
      threshold_value = var.environment == "production" ? 1000 : 2000 # 1s for prod, 2s for staging
      
      aggregations {
        alignment_period     = "300s"
        per_series_aligner   = "ALIGN_PERCENTILE_95"
        cross_series_reducer = "REDUCE_MEAN"
        group_by_fields      = ["resource.labels.service_name"]
      }
    }
  }
  
  notification_channels = [google_monitoring_notification_channel.email.id]
  
  alert_strategy {
    auto_close = "1800s"
  }
}

# Database CPU alert
resource "google_monitoring_alert_policy" "database_cpu" {
  display_name = "Database High CPU - ${var.environment}"
  combiner     = "OR"
  enabled      = true
  
  conditions {
    display_name = "Database CPU condition"
    
    condition_threshold {
      filter         = "resource.type=\"cloudsql_database\" AND resource.labels.database_id=\"${var.project_id}:${var.database_instance}\""
      duration       = "300s"
      comparison     = "COMPARISON_GT"
      threshold_value = 0.8 # 80%
      
      aggregations {
        alignment_period     = "300s"
        per_series_aligner   = "ALIGN_MEAN"
        cross_series_reducer = "REDUCE_MEAN"
        group_by_fields      = ["resource.labels.database_id"]
      }
    }
  }
  
  notification_channels = [google_monitoring_notification_channel.email.id]
  
  alert_strategy {
    auto_close = "1800s"
  }
}

# Database connections alert
resource "google_monitoring_alert_policy" "database_connections" {
  display_name = "Database High Connections - ${var.environment}"
  combiner     = "OR"
  enabled      = true
  
  conditions {
    display_name = "Database connections condition"
    
    condition_threshold {
      filter         = "resource.type=\"cloudsql_database\" AND resource.labels.database_id=\"${var.project_id}:${var.database_instance}\" AND metric.type=\"cloudsql.googleapis.com/database/postgresql/num_backends\""
      duration       = "300s"
      comparison     = "COMPARISON_GT"
      threshold_value = var.environment == "production" ? 160 : 80 # 80% of max connections
      
      aggregations {
        alignment_period     = "300s"
        per_series_aligner   = "ALIGN_MEAN"
        cross_series_reducer = "REDUCE_MEAN"
        group_by_fields      = ["resource.labels.database_id"]
      }
    }
  }
  
  notification_channels = [google_monitoring_notification_channel.email.id]
  
  alert_strategy {
    auto_close = "1800s"
  }
}

# Uptime check failure alert
resource "google_monitoring_alert_policy" "uptime_failure" {
  display_name = "Service Down - ${var.environment}"
  combiner     = "OR"
  enabled      = true
  
  conditions {
    display_name = "Uptime check condition"
    
    condition_threshold {
      filter         = "resource.type=\"uptime_url\" AND metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\""
      duration       = "300s"
      comparison     = "COMPARISON_LT"
      threshold_value = 1
      
      aggregations {
        alignment_period     = "300s"
        per_series_aligner   = "ALIGN_FRACTION_TRUE"
        cross_series_reducer = "REDUCE_MEAN"
        group_by_fields      = ["resource.labels.checked_resource_id"]
      }
    }
  }
  
  notification_channels = [google_monitoring_notification_channel.email.id]
  
  alert_strategy {
    auto_close = "1800s"
  }
}
*/