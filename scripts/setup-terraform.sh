#!/bin/bash
# scripts/setup-terraform.sh
# Setup script for Terraform infrastructure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID_STAGING="proxapeople-staging"
PROJECT_ID_PRODUCTION="proxapeople-production"
REGION="us-central1"
STATE_BUCKET="proxapeople-terraform-state"

echo -e "${GREEN}🚀 Setting up ProxaPeople Terraform Infrastructure${NC}"

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    exit 1
fi

if ! command -v terraform &> /dev/null; then
    echo -e "${RED}❌ Terraform is not installed. Please install it first.${NC}"
    exit 1
fi

# Authenticate with GCP
echo -e "${YELLOW}Authenticating with Google Cloud...${NC}"
gcloud auth login
gcloud auth application-default login

# Create projects (if they don't exist)
echo -e "${YELLOW}Setting up GCP projects...${NC}"

# Note: You may need to create projects manually in GCP Console first
# and update the PROJECT_ID variables above

# Create state bucket
echo -e "${YELLOW}Creating Terraform state bucket...${NC}"
gcloud config set project $PROJECT_ID_STAGING

# Check if bucket exists
if ! gsutil ls -b gs://$STATE_BUCKET &> /dev/null; then
    echo "Creating state bucket..."
    gsutil mb -p $PROJECT_ID_STAGING -c STANDARD -l $REGION gs://$STATE_BUCKET/
    
    # Enable versioning
    gsutil versioning set on gs://$STATE_BUCKET/
    
    # Enable uniform bucket-level access
    gsutil uniformbucketlevelaccess set on gs://$STATE_BUCKET/
    
    echo -e "${GREEN}✅ State bucket created successfully${NC}"
else
    echo -e "${GREEN}✅ State bucket already exists${NC}"
fi

# Enable required APIs for staging
echo -e "${YELLOW}Enabling required APIs for staging...${NC}"
gcloud config set project $PROJECT_ID_STAGING
gcloud services enable \
    run.googleapis.com \
    sql-component.googleapis.com \
    sqladmin.googleapis.com \
    compute.googleapis.com \
    secretmanager.googleapis.com \
    cloudkms.googleapis.com \
    monitoring.googleapis.com \
    logging.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com

# Initialize Terraform for staging
echo -e "${YELLOW}Initializing Terraform for staging...${NC}"
cd infrastructure/terraform/environments/staging

# Copy example tfvars if it doesn't exist
if [ ! -f "terraform.tfvars" ]; then
    cp terraform.tfvars.example terraform.tfvars
    echo -e "${YELLOW}⚠️  Please update terraform.tfvars with your actual values${NC}"
fi

terraform init

echo -e "${GREEN}✅ Staging environment initialized${NC}"

# Initialize Terraform for production
echo -e "${YELLOW}Initializing Terraform for production...${NC}"
cd ../production

# Copy example tfvars if it doesn't exist
if [ ! -f "terraform.tfvars" ]; then
    cp terraform.tfvars.example terraform.tfvars
    echo -e "${YELLOW}⚠️  Please update terraform.tfvars with your actual values${NC}"
fi

# Enable required APIs for production
gcloud config set project $PROJECT_ID_PRODUCTION
gcloud services enable \
    run.googleapis.com \
    sql-component.googleapis.com \
    sqladmin.googleapis.com \
    compute.googleapis.com \
    secretmanager.googleapis.com \
    cloudkms.googleapis.com \
    monitoring.googleapis.com \
    logging.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com

terraform init

echo -e "${GREEN}✅ Production environment initialized${NC}"

echo -e "${GREEN}🎉 Terraform setup completed successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update terraform.tfvars files in both environments"
echo "2. Set up Auth0 tenants and update client IDs"
echo "3. Run 'terraform plan' to review infrastructure"
echo "4. Run 'terraform apply' to deploy infrastructure"
echo ""
echo -e "${YELLOW}Important files to update:${NC}"
echo "- infrastructure/terraform/environments/staging/terraform.tfvars"
echo "- infrastructure/terraform/environments/production/terraform.tfvars"