# Monitoring and Alerting Setup

## Overview

This document describes the monitoring and alerting setup for the ProxaPeople application deployed on Google Cloud Platform.

## Monitoring Stack

- **Google Cloud Monitoring**: Primary monitoring service
- **Google Cloud Logging**: Centralized logging
- **Uptime Checks**: Application availability monitoring
- **Alert Policies**: Automated incident response

## Alert Configuration

### Email Notifications

To configure email notifications for alerts:

1. **Update Terraform Variables**: Edit `infrastructure/terraform/environments/production/terraform.tfvars`
   ```hcl
   # Replace with your actual email address
   alert_email = "admin@yourcompany.com"
   ```

2. **Apply Terraform Changes**:
   ```bash
   cd infrastructure/terraform/environments/production
   terraform plan
   terraform apply
   ```

3. **Verify Email Channel**: 
   - Go to Google Cloud Console > Monitoring > Alerting
   - Check "Notification Channels" to ensure email is configured
   - Test the notification channel

### Configured Alerts

The following alerts are automatically configured:

#### 1. High Error Rate Alert
- **Threshold**: 5% error rate (production), 10% (staging)
- **Duration**: 5 minutes
- **Metric**: HTTP 4xx/5xx responses
- **Action**: Email notification

#### 2. High Latency Alert
- **Threshold**: 1 second (production), 2 seconds (staging)
- **Duration**: 5 minutes
- **Metric**: 95th percentile response time
- **Action**: Email notification

#### 3. Database High CPU Alert
- **Threshold**: 80% CPU usage
- **Duration**: 5 minutes
- **Metric**: Cloud SQL CPU utilization
- **Action**: Email notification

#### 4. Database High Connections Alert
- **Threshold**: 160 connections (production), 80 (staging)
- **Duration**: 5 minutes
- **Metric**: PostgreSQL active connections
- **Action**: Email notification

#### 5. Service Down Alert
- **Threshold**: Service unavailable
- **Duration**: 5 minutes
- **Metric**: Uptime check failures
- **Action**: Email notification

## Uptime Checks

### Health Endpoint Monitoring

- **Endpoint**: `/health`
- **Method**: GET
- **Frequency**: Every 5 minutes
- **Timeout**: 10 seconds
- **SSL Validation**: Enabled
- **Global Checker**: Static IP checkers

### Health Check Response

The application returns the following health check response:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "environment": "production"
}
```

## Log-Based Metrics

### Error Rate Metric

- **Name**: `error_rate_production`
- **Filter**: `resource.type="cloud_run_revision" AND severity>=ERROR`
- **Type**: Gauge metric
- **Labels**: service_name

## Monitoring Dashboard

### Key Metrics Tracked

1. **Application Metrics**:
   - Request volume
   - Response time (p50, p95, p99)
   - Error rate
   - Throughput

2. **Infrastructure Metrics**:
   - Cloud Run CPU/Memory usage
   - Database connections
   - Database CPU/Memory usage
   - Network traffic

3. **Business Metrics**:
   - User sessions
   - API endpoint usage
   - Feature adoption

## Troubleshooting

### Common Issues

1. **Email Notifications Not Received**:
   - Check spam/junk folders
   - Verify email address in Terraform variables
   - Ensure notification channel is enabled
   - Check Google Cloud Console > Monitoring > Alerting

2. **False Positive Alerts**:
   - Review alert thresholds
   - Check for maintenance windows
   - Verify application health endpoints

3. **Missing Alerts**:
   - Check alert policy status
   - Verify metric filters
   - Review notification channel configuration

### Alert Fatigue Prevention

1. **Threshold Tuning**: Regularly review and adjust alert thresholds
2. **Alert Grouping**: Configure alert policies to reduce noise
3. **Auto-Resolution**: Set appropriate auto-close timers (30 minutes)
4. **Escalation**: Configure escalation policies for critical alerts

## Maintenance

### Regular Tasks

1. **Monthly Review**:
   - Review alert effectiveness
   - Adjust thresholds based on performance trends
   - Update notification channels

2. **Quarterly Review**:
   - Evaluate new monitoring requirements
   - Review incident response procedures
   - Update documentation

3. **Annual Review**:
   - Assess overall monitoring strategy
   - Plan monitoring infrastructure improvements
   - Review compliance requirements

## Cost Optimization

### Monitoring Costs

- **Log Retention**: 30 days (configurable)
- **Metric Retention**: 6 months
- **Alert Evaluations**: Included in GCP free tier
- **Uptime Checks**: 3 checks included free

### Cost Reduction Tips

1. Use log-based metrics instead of custom metrics where possible
2. Implement log filtering to reduce ingestion costs
3. Use sampling for high-volume metrics
4. Regular cleanup of unused dashboards and alerts

## Security

### Alert Security

- Email notifications use TLS encryption
- Access to monitoring data requires IAM permissions
- Alert policies are version controlled in Terraform
- Sensitive data is excluded from log aggregation

### Compliance

- Monitoring setup meets SOC 2 requirements
- Log retention policies comply with data protection regulations
- Alert configurations are auditable
- Incident response procedures are documented

## Getting Started

1. **Configure Email**: Update `terraform.tfvars` with your email
2. **Deploy Infrastructure**: Run `terraform apply`
3. **Test Alerts**: Trigger a test alert to verify configuration
4. **Create Dashboards**: Set up custom dashboards for your team
5. **Document Procedures**: Create runbooks for common incidents

## Support

For monitoring and alerting issues:
- Check Google Cloud Console > Monitoring
- Review application logs in Cloud Logging
- Consult this documentation
- Contact the infrastructure team