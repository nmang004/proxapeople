# infrastructure/terraform/main.tf
# COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION - Original GCP Infrastructure Configuration

/*
# Terraform configuration is defined in versions.tf

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
    "servicenetworking.googleapis.com",
    "vpcaccess.googleapis.com",
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
    DATABASE_URL        = module.database.connection_string
    AUTH0_DOMAIN        = var.auth0_domain
    AUTH0_CLIENT_ID     = var.auth0_client_id
    AUTH0_AUDIENCE      = var.auth0_audience
    FRONTEND_URL        = var.frontend_url
  }
  
  secrets = {
    AUTH0_CLIENT_SECRET = module.security.auth0_secret_id
    JWT_SECRET          = module.security.jwt_secret_id
    DATABASE_PASSWORD   = module.database.password_secret_id
    SESSION_SECRET      = module.security.session_secret_id
  }
  
  depends_on = [module.database, module.security]
}
*/

/*
# Monitoring - temporarily disabled to complete core deployment
module "monitoring" {
  source = "./modules/monitoring"
  
  project_id          = var.project_id
  environment         = var.environment
  cloud_run_service   = module.cloud_run.service_name
  database_instance   = module.database.instance_name
  
  alert_email         = var.alert_email
  
  depends_on = [module.cloud_run, module.database]
}
*/