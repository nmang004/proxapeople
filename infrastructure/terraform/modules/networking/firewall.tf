/*
 * COMMENTED OUT FOR VERCEL/SUPABASE MIGRATION
 * 
 * This file contains GCP firewall rules for ProxaPeople.
 * It has been commented out as part of the migration from GCP Cloud Run + Cloud SQL
 * to Vercel (frontend) + Supabase (backend/database).
 * 
 * This configuration is preserved for reference and potential future use.
 */

/*
# infrastructure/terraform/modules/networking/firewall.tf

# Allow ingress from VPC connector to database
resource "google_compute_firewall" "allow_database_access" {
  name    = "allow-database-access-${var.environment}"
  network = google_compute_network.main.name

  allow {
    protocol = "tcp"
    ports    = ["5432"]
  }

  source_ranges = [google_compute_subnetwork.connector.ip_cidr_range]
  target_tags   = ["database"]
}

# Allow health checks for VPC connector
resource "google_compute_firewall" "allow_health_checks" {
  name    = "allow-health-checks-${var.environment}"
  network = google_compute_network.main.name

  allow {
    protocol = "tcp"
    ports    = ["8080"]
  }

  source_ranges = ["130.211.0.0/22", "35.191.0.0/16"]
  target_tags   = ["cloud-run"]
}

# Deny all other traffic by default (implicit in GCP)
*/