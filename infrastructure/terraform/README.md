# ProxaPeople Terraform Infrastructure

This directory contains the complete Infrastructure as Code (IaC) configuration for deploying ProxaPeople to Google Cloud Platform using Terraform.

## Architecture Overview

The infrastructure is designed with security, scalability, and maintainability in mind:

- **Multi-environment support**: Separate configurations for staging and production
- **Modular design**: Reusable modules for each service component
- **Security-first**: Encryption at rest, private networking, IAM least privilege
- **Monitoring**: Comprehensive alerting and observability

## Directory Structure

```
infrastructure/terraform/
├── modules/                    # Reusable Terraform modules
│   ├── project/               # GCP API enablement
│   ├── networking/            # VPC, subnets, firewall rules
│   ├── security/              # IAM, KMS, Secret Manager
│   ├── database/              # Cloud SQL PostgreSQL
│   ├── cloud-run/             # Cloud Run service
│   └── monitoring/            # Alerts and uptime checks
├── environments/               # Environment-specific configurations
│   ├── staging/               # Staging environment
│   └── production/            # Production environment
├── main.tf                    # Root module configuration
├── variables.tf               # Input variables
├── outputs.tf                 # Output values
└── versions.tf                # Provider requirements
```

## Prerequisites

1. **Google Cloud SDK**: Install and authenticate
   ```bash
   # Install gcloud CLI
   curl https://sdk.cloud.google.com | bash
   
   # Authenticate
   gcloud auth login
   gcloud auth application-default login
   ```

2. **Terraform**: Version 1.7.0 or later
   ```bash
   # Install via Homebrew (macOS)
   brew install terraform
   
   # Or download from https://terraform.io/downloads
   ```

3. **GCP Projects**: Create staging and production projects
   - `proxapeople-staging-[unique-id]`
   - `proxapeople-production-[unique-id]`

4. **Auth0 Setup**: Configure Auth0 tenants for authentication
   - Staging tenant: `proxapeople-staging.auth0.com`
   - Production tenant: `proxapeople.auth0.com`

## Quick Start

1. **Run the setup script**:
   ```bash
   ./scripts/setup-terraform.sh
   ```

2. **Update configuration files**:
   - `environments/staging/terraform.tfvars`
   - `environments/production/terraform.tfvars`

3. **Deploy staging environment**:
   ```bash
   cd environments/staging
   terraform plan
   terraform apply
   ```

## Configuration

### Required Variables

Each environment requires the following variables in `terraform.tfvars`:

```hcl
# Project configuration
project_id      = "your-gcp-project-id"
region          = "us-central1"

# Container image
container_image = "gcr.io/your-project/proxapeople:latest"

# Auth0 configuration
auth0_domain     = "your-domain.auth0.com"
auth0_client_id  = "your_auth0_client_id"

# URLs
frontend_url = "https://your-domain.com"

# Monitoring
alert_email = "alerts@your-domain.com"
```

### Environment Differences

| Resource | Staging | Production |
|----------|---------|------------|
| **Cloud Run CPU** | 1 vCPU | 2 vCPU |
| **Cloud Run Memory** | 512Mi | 2Gi |
| **Min Instances** | 0 | 2 |
| **Max Instances** | 10 | 100 |
| **Database Tier** | db-f1-micro | db-n1-standard-2 |
| **Backup Retention** | 7 days | 30 days |

## Deployment

### Manual Deployment

1. **Initialize Terraform**:
   ```bash
   cd environments/staging  # or production
   terraform init
   ```

2. **Plan changes**:
   ```bash
   terraform plan
   ```

3. **Apply changes**:
   ```bash
   terraform apply
   ```

### CI/CD Deployment

The infrastructure includes GitHub Actions workflows for automated deployment:

- **Staging**: Auto-deploys on push to `main` branch
- **Production**: Manual workflow dispatch with approval required

#### Setup GitHub Actions

1. Configure Workload Identity Federation:
   ```bash
   # Create service account
   gcloud iam service-accounts create github-actions \
     --display-name="GitHub Actions"
   
   # Add IAM roles
   gcloud projects add-iam-policy-binding PROJECT_ID \
     --member="serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/editor"
   ```

2. Add repository secrets:
   - `WIF_PROVIDER`: Workload Identity Provider
   - `WIF_SERVICE_ACCOUNT`: Service account email

## Security Features

### Encryption
- **Data at rest**: All data encrypted with Cloud KMS
- **Data in transit**: TLS 1.2+ enforced everywhere
- **Secrets**: Managed through Secret Manager

### Network Security
- **Private networking**: Database only accessible via VPC
- **No public IPs**: All resources use private networking
- **Firewall rules**: Restrictive ingress/egress rules

### IAM & Access Control
- **Service accounts**: Dedicated accounts per service
- **Least privilege**: Minimal required permissions
- **No default accounts**: Custom service accounts only

## Monitoring & Alerting

### Key Metrics
- Cloud Run request latency and error rates
- Database CPU, memory, and connection usage
- Application uptime and availability

### Alert Thresholds
- **Error rate**: >5% (production), >10% (staging)
- **Latency**: >1s p95 (production), >2s (staging)
- **Database CPU**: >80%
- **Database connections**: >80% of limit

## Cost Optimization

### Estimated Monthly Costs

| Service | Staging | Production |
|---------|---------|------------|
| Cloud Run | $5-10 | $50-200 |
| Cloud SQL | $10 | $150 |
| Networking | $5 | $20 |
| Storage | $1 | $5 |
| **Total** | **~$25** | **~$375** |

### Cost-Saving Features
- Auto-scaling to zero for staging
- Optimized machine types per environment
- Automated backup retention policies

## Troubleshooting

### Common Issues

**Terraform Init Fails**
```bash
# Check GCP authentication
gcloud auth list
gcloud auth application-default login
```

**Permission Denied**
```bash
# Ensure service account has required roles
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="user:your-email@domain.com" \
  --role="roles/editor"
```

**State Lock Issues**
```bash
# Force unlock (use carefully)
terraform force-unlock LOCK_ID
```

### Getting Help

1. Check Terraform logs: `TF_LOG=DEBUG terraform apply`
2. Validate configuration: `terraform validate`
3. Review GCP console for resource status
4. Check Cloud Logging for application errors

## Contributing

When modifying infrastructure:

1. Test changes in staging first
2. Run `terraform fmt` before committing
3. Update documentation for new resources
4. Ensure cost impact is considered

## Security Considerations

- Never commit `terraform.tfvars` files
- Use Workload Identity Federation for CI/CD
- Regularly rotate secrets and keys
- Monitor for security vulnerabilities
- Follow principle of least privilege

---

For detailed implementation guides, see the [Infrastructure Plan](../../INFRASTRUCTURE_PLAN.md).