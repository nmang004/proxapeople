# ProxaPeople Production Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the ProxaPeople application to Google Cloud Platform using the provided Terraform infrastructure.

## Prerequisites

### Required Tools

- **Terraform**: >= 1.7.0
- **Google Cloud SDK**: Latest version
- **Docker**: For building container images
- **Node.js**: >= 20.x for local development

### Required Accounts

- **Google Cloud Platform**: With billing enabled
- **Auth0**: For authentication services
- **GitHub**: For source code management (optional)

## Infrastructure Overview

### Architecture Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Google Cloud Platform                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │   Cloud Run     │    │   Cloud SQL     │                 │
│  │  (Application)  │◄──►│  (PostgreSQL)   │                 │
│  └─────────────────┘    └─────────────────┘                 │
│           │                       │                         │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │  Load Balancer  │    │  VPC Network    │                 │
│  │   (HTTPS/SSL)   │    │   (Private IP)  │                 │
│  └─────────────────┘    └─────────────────┘                 │
│           │                       │                         │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │   Monitoring    │    │   Security      │                 │
│  │  (Alerts/Logs)  │    │  (IAM/Secrets)  │                 │
│  └─────────────────┘    └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### Key Resources

- **Cloud Run**: Containerized application hosting
- **Cloud SQL**: PostgreSQL database
- **VPC Network**: Private networking
- **Load Balancer**: SSL termination and routing
- **Cloud Monitoring**: Alerts and metrics
- **IAM**: Access control and permissions

## Initial Setup

### 1. Google Cloud Project Setup

```bash
# Create a new GCP project
gcloud projects create proxapeople-production-$(date +%s)

# Set the project
export PROJECT_ID=proxapeople-production-$(date +%s)
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable sql-component.googleapis.com
gcloud services enable vpcaccess.googleapis.com
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

### 2. Terraform State Backend

```bash
# Create a bucket for Terraform state
gsutil mb gs://proxapeople-terraform-state

# Enable versioning
gsutil versioning set on gs://proxapeople-terraform-state
```

### 3. Service Account Setup

```bash
# Create Terraform service account
gcloud iam service-accounts create terraform-sa \
  --display-name="Terraform Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:terraform-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/editor"

# Create and download key
gcloud iam service-accounts keys create terraform-key.json \
  --iam-account="terraform-sa@$PROJECT_ID.iam.gserviceaccount.com"

# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/terraform-key.json"
```

## Configuration

### 1. Environment Variables

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL=postgresql://username:password@private-ip:5432/proxapeople

# Auth0
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=your-audience

# JWT
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Application
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://your-domain.com

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=https://your-domain.com
CORS_CREDENTIALS=true

# Session
SESSION_SECRET=your-session-secret
SESSION_MAX_AGE=86400000
```

### 2. Terraform Configuration

Copy and customize the Terraform variables:

```bash
cd infrastructure/terraform/environments/production
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
# Project configuration
project_id = "proxapeople-production-123456"
region     = "us-central1"

# Container image
container_image = "gcr.io/proxapeople-production-123456/proxapeople:latest"

# Cloud Run configuration
cloud_run_cpu    = "2"
cloud_run_memory = "2Gi"
min_instances    = 2
max_instances    = 100

# Database configuration
database_tier = "db-n1-standard-2"

# Auth0 configuration
auth0_domain    = "your-domain.auth0.com"
auth0_client_id = "your-client-id"

# URLs
frontend_url = "https://your-domain.com"

# Monitoring
alert_email = "admin@yourcompany.com"
```

## Deployment Process

### 1. Build and Push Container Image

```bash
# Build the application
npm run build

# Build Docker image
docker build -t proxapeople .

# Tag for GCR
docker tag proxapeople gcr.io/$PROJECT_ID/proxapeople:latest

# Push to GCR
docker push gcr.io/$PROJECT_ID/proxapeople:latest
```

### 2. Deploy Infrastructure

```bash
# Initialize Terraform
cd infrastructure/terraform/environments/production
terraform init

# Plan deployment
terraform plan

# Apply infrastructure
terraform apply
```

### 3. Configure Secrets

```bash
# Create database password secret
echo -n "your-database-password" | gcloud secrets create db-password --data-file=-

# Create JWT secret
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-

# Create Auth0 client secret
echo -n "your-auth0-client-secret" | gcloud secrets create auth0-client-secret --data-file=-
```

### 4. Deploy Application

```bash
# Deploy to Cloud Run
gcloud run deploy proxapeople-production \
  --image gcr.io/$PROJECT_ID/proxapeople:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --cpu 2 \
  --memory 2Gi \
  --min-instances 2 \
  --max-instances 100 \
  --set-env-vars NODE_ENV=production \
  --set-secrets DATABASE_URL=db-password:latest \
  --set-secrets JWT_SECRET=jwt-secret:latest \
  --set-secrets AUTH0_CLIENT_SECRET=auth0-client-secret:latest
```

## Post-Deployment Tasks

### 1. Domain Configuration

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service proxapeople-production \
  --domain your-domain.com \
  --region us-central1
```

### 2. SSL Certificate

```bash
# Create managed SSL certificate
gcloud compute ssl-certificates create proxapeople-ssl \
  --domains your-domain.com \
  --global
```

### 3. Database Setup

```bash
# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 4. Monitoring Setup

```bash
# Test VPC connectivity
node scripts/test-vpc-connectivity.js

# Verify monitoring alerts
gcloud alpha monitoring policies list
```

## Verification

### 1. Application Health

```bash
# Check application status
curl https://your-domain.com/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2025-01-15T10:00:00.000Z",
#   "environment": "production"
# }
```

### 2. Database Connectivity

```bash
# Test database connection
npm run test:db

# Check database logs
gcloud logging read "resource.type=cloudsql_database" --limit=10
```

### 3. Security Verification

```bash
# Test SSL/TLS
curl -I https://your-domain.com

# Check security headers
curl -I https://your-domain.com | grep -E "(Strict-Transport-Security|Content-Security-Policy|X-Frame-Options)"
```

## Troubleshooting

### Common Issues

1. **Container Build Failures**:
   ```bash
   # Check Docker logs
   docker logs proxapeople
   
   # Verify Node.js version
   node --version
   ```

2. **Database Connection Issues**:
   ```bash
   # Check VPC connector
   gcloud compute networks vpc-access connectors list
   
   # Verify database instance
   gcloud sql instances describe proxapeople-production
   ```

3. **Cloud Run Deployment Failures**:
   ```bash
   # Check service logs
   gcloud run services describe proxapeople-production --region us-central1
   
   # View application logs
   gcloud logging read "resource.type=cloud_run_revision" --limit=50
   ```

4. **SSL Certificate Issues**:
   ```bash
   # Check certificate status
   gcloud compute ssl-certificates describe proxapeople-ssl
   
   # Verify domain mapping
   gcloud run domain-mappings describe --domain your-domain.com
   ```

### Debug Commands

```bash
# Application logs
gcloud logging read "resource.type=cloud_run_revision" --limit=100

# Database logs
gcloud logging read "resource.type=cloudsql_database" --limit=50

# Infrastructure status
terraform plan -detailed-exitcode

# Resource monitoring
gcloud monitoring metrics list
```

## Maintenance

### Regular Tasks

1. **Weekly**:
   - Review application logs
   - Check monitoring alerts
   - Verify backup status

2. **Monthly**:
   - Update dependencies
   - Review security patches
   - Analyze performance metrics

3. **Quarterly**:
   - Infrastructure cost review
   - Security audit
   - Disaster recovery test

### Backup and Recovery

```bash
# Create database backup
gcloud sql backups create \
  --instance proxapeople-production \
  --description "Manual backup $(date)"

# List backups
gcloud sql backups list --instance proxapeople-production

# Restore from backup
gcloud sql backups restore BACKUP_ID \
  --restore-instance proxapeople-production
```

## Security Considerations

### Best Practices

1. **Secrets Management**:
   - Use Google Secret Manager
   - Rotate secrets regularly
   - Never commit secrets to version control

2. **Network Security**:
   - Use VPC for database connections
   - Enable SSL/TLS everywhere
   - Implement proper firewall rules

3. **Access Control**:
   - Follow principle of least privilege
   - Use IAM roles and policies
   - Regular access reviews

4. **Monitoring**:
   - Enable audit logging
   - Set up security alerts
   - Monitor for anomalies

### Compliance

- SOC 2 Type II compliance
- GDPR compliance for EU users
- HIPAA compliance (if applicable)
- PCI DSS compliance for payment processing

## Cost Optimization

### Resource Optimization

1. **Cloud Run**:
   - Use minimum required CPU/memory
   - Configure auto-scaling properly
   - Monitor cold starts

2. **Database**:
   - Right-size database instances
   - Use read replicas for read-heavy workloads
   - Implement connection pooling

3. **Monitoring**:
   - Use log sampling for high-volume logs
   - Configure appropriate retention periods
   - Optimize metric collection

### Cost Monitoring

```bash
# View billing information
gcloud billing budgets list

# Export billing data
gcloud billing accounts list
```

## Support

For deployment issues:
- Check Google Cloud Console
- Review this documentation
- Contact the infrastructure team
- Create a support ticket

---

**Last Updated**: January 2025
**Version**: 1.0
**Maintainer**: Infrastructure Team