project_id      = "proxapeople-production"
region          = "us-central1"
environment     = "production"

# Container image
container_image = "us-central1-docker.pkg.dev/proxapeople-production/proxapeople/app:latest"

# Cloud Run configuration
cloud_run_cpu    = "2"
cloud_run_memory = "2Gi"
min_instances    = 1
max_instances    = 100

# Database configuration
database_tier = "db-custom-1-3840"

# Auth0 configuration
auth0_domain     = "dev-45snae82elh3j648.us.auth0.com"
auth0_client_id  = "3ylhlRL1bujy8Df92FcaHlhmoJ7jQYjV"
auth0_audience   = "https://proxapeople-api"

# URLs
frontend_url = "https://your-domain.com"

# Alerts
alert_email = "your-email@example.com"