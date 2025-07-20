/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP networking main configuration for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/networking/main.tf

# VPC Network
resource "google_compute_network" "main" {
  name                    = "proxapeople-${var.environment}"
  auto_create_subnetworks = false
  routing_mode           = "REGIONAL"
}

# Private subnet for database
resource "google_compute_subnetwork" "private" {
  name          = "proxapeople-private-${var.environment}"
  ip_cidr_range = "10.0.1.0/24"
  region        = var.region
  network       = google_compute_network.main.id
  
  private_ip_google_access = true
}

# Subnet for VPC connector
resource "google_compute_subnetwork" "connector" {
  name          = "proxapeople-connector-${var.environment}"
  ip_cidr_range = "10.0.2.0/28"
  region        = var.region
  network       = google_compute_network.main.id
}

# Private service connection for Cloud SQL
resource "google_compute_global_address" "private_ip_address" {
  name          = "proxapeople-private-ip-${var.environment}"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.main.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.main.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

# VPC Access Connector for Cloud Run
resource "google_vpc_access_connector" "connector" {
  name          = "proxa-conn-${var.environment}"
  region        = var.region
  
  subnet {
    name = google_compute_subnetwork.connector.name
  }
  
  machine_type = "e2-micro"
  min_instances = 2
  max_instances = 3
}

# Cloud Router for NAT
resource "google_compute_router" "router" {
  name    = "proxapeople-router-${var.environment}"
  region  = var.region
  network = google_compute_network.main.id
}

# Cloud NAT for outbound internet access
resource "google_compute_router_nat" "nat" {
  name                               = "proxapeople-nat-${var.environment}"
  router                             = google_compute_router.router.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}
*/