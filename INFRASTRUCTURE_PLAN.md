# ProxaPeople Infrastructure as Code Plan
## Terraform Configuration for Google Cloud Platform

**Date:** January 14, 2025  
**Version:** 1.0  
**Target Platform:** Google Cloud Run  

---

## Overview

This document defines the complete Infrastructure as Code strategy for deploying ProxaPeople on Google Cloud Platform using Terraform. The configuration supports multiple environments, follows security best practices, and enables zero-downtime deployments.

---

## 1. GCP Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Google Cloud Project                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐     ┌──────────────┐     ┌─────────────────┐  │
│  │   Cloud     │     │    Cloud     │     │     Cloud       │  │
│  │   Load      │────▶│     Run      │────▶│      SQL        │  │
│  │  Balancer   │     │   Service    │     │   PostgreSQL    │  │
│  └─────────────┘     └──────────────┘     └─────────────────┘  │
│         │                    │                      │            │
│         │                    │                      │            │
│  ┌─────────────┐     ┌──────────────┐     ┌─────────────────┐  │
│  │    Cloud    │     │    Secret    │     │     Cloud       │  │
│  │    CDN      │     │   Manager    │     │    Storage      │  │
│  └─────────────┘     └──────────────┘     └─────────────────┘  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Cloud Monitoring                      │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Terraform Module Structure

```
infrastructure/terraform/
├── environments/
│   ├── staging/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   └── production/
│       ├── main.tf
│       ├── variables.tf
│       ├── terraform.tfvars
│       └── backend.tf
├── modules/
│   ├── project/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── cloud-run/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── iam.tf
│   ├── database/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── backups.tf
│   ├── networking/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── firewall.tf
│   ├── security/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── kms.tf
│   └── monitoring/
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── alerts.tf
├── main.tf
├── variables.tf
├── outputs.tf
├── versions.tf
└── README.md
```

---

## 3. Core Terraform Configuration

### 3.1 Root Configuration (main.tf)

```hcl
# infrastructure/terraform/main.tf

terraform {
  required_version = ">= 1.7.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# Enable required APIs
module "project_services" {
  source = "./modules/project"
  
  project_id = var.project_id
  services = [
    "run.googleapis.com",
    "sql-component.googleapis.com",
    "sqladmin.googleapis.com",
    "compute.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudkms.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
  ]
}

# Networking
module "networking" {
  source = "./modules/networking"
  
  project_id   = var.project_id
  region       = var.region
  environment  = var.environment
  
  depends_on = [module.project_services]
}

# Security
module "security" {
  source = "./modules/security"
  
  project_id   = var.project_id
  region       = var.region
  environment  = var.environment
  
  depends_on = [module.project_services]
}

# Database
module "database" {
  source = "./modules/database"
  
  project_id            = var.project_id
  region                = var.region
  environment           = var.environment
  network_id            = module.networking.network_id
  private_ip_address    = module.networking.db_private_ip
  kms_key_id           = module.security.database_encryption_key
  
  database_tier         = var.database_tier
  database_version      = "POSTGRES_15"
  deletion_protection   = var.environment == "production"
  
  depends_on = [module.networking, module.security]
}

# Cloud Run Service
module "cloud_run" {
  source = "./modules/cloud-run"
  
  project_id           = var.project_id
  region               = var.region
  environment          = var.environment
  service_name         = "proxapeople-${var.environment}"
  
  image                = var.container_image
  cpu                  = var.cloud_run_cpu
  memory               = var.cloud_run_memory
  min_instances        = var.min_instances
  max_instances        = var.max_instances
  
  vpc_connector_id     = module.networking.vpc_connector_id
  service_account_email = module.security.cloud_run_service_account
  
  env_vars = {
    NODE_ENV            = var.environment
    PORT                = "8080"
    DATABASE_URL        = module.database.connection_string
    AUTH0_DOMAIN        = var.auth0_domain
    AUTH0_CLIENT_ID     = var.auth0_client_id
    FRONTEND_URL        = var.frontend_url
  }
  
  secrets = {
    AUTH0_CLIENT_SECRET = module.security.auth0_secret_id
    JWT_SECRET          = module.security.jwt_secret_id
    DATABASE_PASSWORD   = module.database.password_secret_id
  }
  
  depends_on = [module.database, module.security]
}

# Monitoring
module "monitoring" {
  source = "./modules/monitoring"
  
  project_id          = var.project_id
  environment         = var.environment
  cloud_run_service   = module.cloud_run.service_name
  database_instance   = module.database.instance_name
  
  alert_email         = var.alert_email
  
  depends_on = [module.cloud_run, module.database]
}
```

### 3.2 Variables Configuration

```hcl
# infrastructure/terraform/variables.tf

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name (staging/production)"
  type        = string
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Environment must be staging or production"
  }
}

variable "container_image" {
  description = "Container image URL"
  type        = string
}

variable "database_tier" {
  description = "Cloud SQL machine type"
  type        = string
  default     = "db-f1-micro"
}

variable "cloud_run_cpu" {
  description = "Cloud Run CPU allocation"
  type        = string
  default     = "1"
}

variable "cloud_run_memory" {
  description = "Cloud Run memory allocation"
  type        = string
  default     = "512Mi"
}

variable "min_instances" {
  description = "Minimum Cloud Run instances"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Maximum Cloud Run instances"
  type        = number
  default     = 100
}

variable "auth0_domain" {
  description = "Auth0 domain"
  type        = string
}

variable "auth0_client_id" {
  description = "Auth0 client ID"
  type        = string
}

variable "frontend_url" {
  description = "Frontend URL for CORS"
  type        = string
}

variable "alert_email" {
  description = "Email for monitoring alerts"
  type        = string
}
```

---

## 4. Module Configurations

### 4.1 Cloud Run Module

```hcl
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
        period_seconds        = 3
        failure_threshold     = 3
      }
      
      liveness_probe {
        http_get {
          path = "/health"
        }
        initial_delay_seconds = 30
        period_seconds        = 10
      }
    }
    
    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }
  }
  
  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# IAM binding for public access
resource "google_cloud_run_service_iam_member" "public" {
  service  = google_cloud_run_v2_service.app.name
  location = google_cloud_run_v2_service.app.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Domain mapping
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
```

### 4.2 Database Module

```hcl
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
    
    disk_size                   = 10
    disk_type                   = "PD_SSD"
    disk_autoresize             = true
    disk_autoresize_limit       = 100
    
    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = true
      location                       = var.region
      
      backup_retention_settings {
        retained_backups = 30
        retention_unit   = "COUNT"
      }
    }
    
    ip_configuration {
      ipv4_enabled    = false
      private_network = var.network_id
      
      enable_private_path_for_google_cloud_services = true
    }
    
    database_flags {
      name  = "max_connections"
      value = "100"
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
  
  encryption_key_name = var.kms_key_id
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

# Outputs
output "connection_string" {
  value     = "postgresql://${google_sql_user.app.name}:${random_password.db_password.result}@${google_sql_database_instance.main.private_ip_address}:5432/${google_sql_database.main.name}?sslmode=require"
  sensitive = true
}

output "password_secret_id" {
  value = google_secret_manager_secret.db_password.id
}
```

### 4.3 Security Module

```hcl
# infrastructure/terraform/modules/security/main.tf

# Service account for Cloud Run
resource "google_service_account" "cloud_run" {
  account_id   = "cloud-run-${var.environment}"
  display_name = "Cloud Run Service Account"
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

# Secrets
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

# Generate JWT secret
resource "random_password" "jwt_secret" {
  length  = 64
  special = false # Base64 friendly
}

resource "google_secret_manager_secret_version" "jwt_secret" {
  secret      = google_secret_manager_secret.jwt_secret.id
  secret_data = random_password.jwt_secret.result
}

# Outputs
output "cloud_run_service_account" {
  value = google_service_account.cloud_run.email
}

output "database_encryption_key" {
  value = google_kms_crypto_key.database.id
}

output "auth0_secret_id" {
  value = google_secret_manager_secret.auth0_client_secret.id
}

output "jwt_secret_id" {
  value = google_secret_manager_secret.jwt_secret.id
}
```

---

## 5. Environment Configurations

### 5.1 Staging Environment

```hcl
# infrastructure/terraform/environments/staging/terraform.tfvars

project_id      = "proxapeople-staging"
region          = "us-central1"
environment     = "staging"

# Cloud Run configuration
cloud_run_cpu    = "1"
cloud_run_memory = "512Mi"
min_instances    = 0
max_instances    = 10

# Database configuration
database_tier = "db-f1-micro"

# Auth0 configuration
auth0_domain     = "proxapeople-staging.auth0.com"
auth0_client_id  = "staging_client_id"

# URLs
frontend_url = "https://staging.proxapeople.com"

# Alerts
alert_email = "devops@proxapeople.com"
```

### 5.2 Production Environment

```hcl
# infrastructure/terraform/environments/production/terraform.tfvars

project_id      = "proxapeople-production"
region          = "us-central1"
environment     = "production"

# Cloud Run configuration
cloud_run_cpu    = "2"
cloud_run_memory = "2Gi"
min_instances    = 2
max_instances    = 100

# Database configuration
database_tier = "db-n1-standard-2"

# Auth0 configuration
auth0_domain     = "proxapeople.auth0.com"
auth0_client_id  = "production_client_id"

# URLs
frontend_url = "https://app.proxapeople.com"

# Alerts
alert_email = "alerts@proxapeople.com"
```

---

## 6. State Management

### 6.1 Remote State Configuration

```hcl
# infrastructure/terraform/environments/staging/backend.tf

terraform {
  backend "gcs" {
    bucket = "proxapeople-terraform-state"
    prefix = "staging"
  }
}
```

### 6.2 State Bucket Creation

```bash
# Create state bucket
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://proxapeople-terraform-state/

# Enable versioning
gsutil versioning set on gs://proxapeople-terraform-state/

# Enable uniform bucket-level access
gsutil uniformbucketlevelaccess set on gs://proxapeople-terraform-state/
```

---

## 7. Security Best Practices

### 7.1 Principle of Least Privilege
- Each service has its own service account
- Minimal IAM roles assigned
- No default service accounts used

### 7.2 Encryption
- All data encrypted at rest using Cloud KMS
- TLS enforced for all connections
- Secrets managed through Secret Manager

### 7.3 Network Security
- Private IP for database
- VPC connector for Cloud Run
- No public IPs exposed

### 7.4 Audit Logging
- All admin activities logged
- Data access logging enabled
- Logs exported to central location

---

## 8. Deployment Process

### 8.1 Initial Setup

```bash
# 1. Authenticate with GCP
gcloud auth login
gcloud config set project $PROJECT_ID

# 2. Create state bucket
./scripts/create-state-bucket.sh

# 3. Initialize Terraform
cd infrastructure/terraform/environments/staging
terraform init

# 4. Plan deployment
terraform plan -out=tfplan

# 5. Apply configuration
terraform apply tfplan
```

### 8.2 CI/CD Integration

```yaml
# .github/workflows/terraform.yml

name: Terraform Deploy

on:
  push:
    branches: [main]
    paths:
      - 'infrastructure/terraform/**'

jobs:
  terraform:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.WIF_SERVICE_ACCOUNT }}
      
      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.7.0
      
      - name: Terraform Init
        run: terraform init
        working-directory: infrastructure/terraform/environments/staging
      
      - name: Terraform Plan
        run: terraform plan -out=tfplan
        working-directory: infrastructure/terraform/environments/staging
      
      - name: Terraform Apply
        if: github.ref == 'refs/heads/main'
        run: terraform apply -auto-approve tfplan
        working-directory: infrastructure/terraform/environments/staging
```

---

## 9. Monitoring & Alerts

### 9.1 Key Metrics
- Cloud Run request latency
- Database CPU and memory usage
- Error rates and status codes
- Active connections

### 9.2 Alert Policies
- High error rate (>5% 5xx errors)
- Database connection limit (>80%)
- High latency (p95 > 1s)
- SSL certificate expiration

---

## 10. Disaster Recovery

### 10.1 Backup Strategy
- Automated daily backups
- 30-day retention
- Point-in-time recovery enabled
- Cross-region backup copies

### 10.2 Recovery Procedures
1. Database restoration from backup
2. Cloud Run rollback to previous revision
3. Secret rotation if compromised
4. DNS failover to backup region

---

## Cost Optimization

### Estimated Monthly Costs

| Service | Staging | Production |
|---------|---------|------------|
| Cloud Run | $5-10 | $50-200 |
| Cloud SQL | $10 | $150 |
| Networking | $5 | $20 |
| Storage | $1 | $5 |
| **Total** | **~$25** | **~$375** |

### Cost Saving Measures
1. Auto-scaling to zero for staging
2. Scheduled database stop/start
3. Lifecycle policies for logs
4. Reserved instances for production

---

*End of Infrastructure Plan*