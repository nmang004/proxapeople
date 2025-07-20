/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP Cloud Run main configuration for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/cloud-run/main.tf

resource "google_cloud_run_v2_service" "app" {
  name     = var.service_name
  location = var.region
  
  template {
    service_account = var.service_account_email
    
    vpc_access {
      connector = var.vpc_connector_id
      egress    = "PRIVATE_RANGES_ONLY"
    }
    
    containers {
      image = var.image
      
      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
        
        cpu_idle          = true
        startup_cpu_boost = true
      }
      
      dynamic "env" {
        for_each = var.env_vars
        content {
          name  = env.key
          value = env.value
        }
      }
      
      dynamic "env" {
        for_each = var.secrets
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = env.value
              version = "latest"
            }
          }
        }
      }
      
      ports {
        container_port = 8080
      }
      
      startup_probe {
        http_get {
          path = "/health"
        }
        initial_delay_seconds = 10
        period_seconds        = 10
        failure_threshold     = 3
        timeout_seconds       = 5
      }
      
      liveness_probe {
        http_get {
          path = "/health"
        }
        initial_delay_seconds = 30
        period_seconds        = 10
        timeout_seconds       = 5
        failure_threshold     = 3
      }
    }
    
    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }
    
    timeout = "300s"
  }
  
  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
  
  labels = {
    environment = var.environment
    application = "proxapeople"
  }
}

# IAM binding for public access
resource "google_cloud_run_service_iam_member" "public" {
  service  = google_cloud_run_v2_service.app.name
  location = google_cloud_run_v2_service.app.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Domain mapping (optional)
resource "google_cloud_run_domain_mapping" "domain" {
  count    = var.custom_domain != "" ? 1 : 0
  location = google_cloud_run_v2_service.app.location
  name     = var.custom_domain
  
  metadata {
    namespace = var.project_id
  }
  
  spec {
    route_name = google_cloud_run_v2_service.app.name
  }
}
*/