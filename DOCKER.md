# ProxaPeople Docker Guide

## Overview

ProxaPeople includes a comprehensive Docker setup for both development and production environments. This guide covers containerization, orchestration, and deployment strategies.

## Quick Start

### Development Environment

```bash
# Start development environment with PostgreSQL and pgAdmin
npm run docker:dev

# View logs
npm run docker:logs:dev

# Stop development environment
npm run docker:dev:down
```

### Production Environment

```bash
# Start production environment
npm run docker:prod

# View logs
npm run docker:logs

# Stop production environment
npm run docker:prod:down
```

## Docker Configuration

### Dockerfile

The multi-stage Dockerfile includes:
- **Dependencies stage**: Installs only production dependencies with cache optimization
- **Builder stage**: Builds the application for production
- **Runner stage**: Creates minimal production image with security hardening

**Key Features:**
- Multi-stage build for optimized image size
- Non-root user for security
- dumb-init for proper signal handling
- Health checks for container monitoring
- Security headers and minimal attack surface

### Environment Configuration

#### Production (.env)
```bash
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://postgres:password@db:5432/proxapeople
AUTH0_DOMAIN=your-production.auth0.com
# ... other production variables
```

#### Development (docker-compose.dev.yml)
- Uses port 5000 for consistency with local development
- Includes volume mounts for hot reloading
- Lower bcrypt rounds for faster development
- Includes pgAdmin for database management

## Available Scripts

### Build Commands
```bash
npm run docker:build          # Build production image
npm run docker:build:dev      # Build development image
npm run docker:run            # Run single container with .env file
```

### Development Commands
```bash
npm run docker:dev            # Start development environment
npm run docker:dev:down       # Stop development environment
npm run docker:logs:dev       # View development logs
```

### Production Commands
```bash
npm run docker:prod           # Start production environment (detached)
npm run docker:prod:down      # Stop production environment
npm run docker:logs           # View production logs
```

### Cleanup Commands
```bash
npm run docker:clean          # Remove unused containers and volumes
npm run docker:clean:all      # Remove all containers, images, and volumes
```

## Service Configuration

### Application Service
- **Production**: Port 8080, optimized build, health checks
- **Development**: Port 5000, volume mounts, hot reloading

### Database Service
- **PostgreSQL 15 Alpine**: Lightweight, secure database
- **Persistent volumes**: Data survives container restarts
- **Health checks**: Ensures database readiness
- **Initialization scripts**: Automatic setup on first run

### Development Extras
- **pgAdmin**: Web-based PostgreSQL management (port 5050)
- **Volume mounts**: Source code hot reloading
- **Separate network**: Isolated development environment

## Health Checks

All services include comprehensive health checks:

### Application Health
- **Endpoint**: `/health`
- **Response**: JSON with status, timestamp, environment
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3

### Database Health
- **Check**: `pg_isready` command
- **Interval**: 10 seconds
- **Timeout**: 5 seconds
- **Retries**: 5

## Security Features

### Container Security
- Non-root user (nodejs:1001)
- Minimal Alpine Linux base
- No shell access in production
- Read-only file system where possible

### Network Security
- Isolated Docker networks
- No unnecessary port exposure
- Internal service communication

### Environment Security
- Environment variable validation
- Secrets management ready
- No hardcoded credentials

## Performance Optimization

### Build Optimization
- Multi-stage builds reduce image size
- Layer caching for faster rebuilds
- Only production dependencies in final image
- esbuild for fast server bundling

### Runtime Optimization
- dumb-init for proper process management
- Health checks for container orchestration
- Resource limits (can be configured)
- Horizontal scaling ready

## Deployment Options

### Local Development
```bash
npm run docker:dev
```
Access:
- Application: http://localhost:5000
- Database: localhost:5433
- pgAdmin: http://localhost:5050

### Production Deployment
```bash
# Set production environment variables
cp .env.example .env
# Edit .env with production values

# Deploy
npm run docker:prod
```

### Cloud Deployment
The production configuration is ready for:
- **Google Cloud Run**: Direct container deployment
- **AWS ECS**: Container orchestration
- **Kubernetes**: With minimal modifications
- **Docker Swarm**: Multi-node deployment

## Monitoring and Logging

### Application Logs
```bash
# Production logs
npm run docker:logs

# Development logs
npm run docker:logs:dev

# Follow specific service
docker-compose logs -f app
```

### Health Monitoring
- Health endpoints exposed for external monitoring
- Container health status available via Docker API
- Ready for integration with monitoring tools

## Troubleshooting

### Common Issues

**Port Conflicts**
```bash
# Check port usage
lsof -i :5000
lsof -i :8080

# Use different ports if needed
PORT=3000 npm run docker:dev
```

**Database Connection Issues**
```bash
# Check database status
docker-compose ps db

# Check database logs
docker-compose logs db

# Reset database
docker-compose down -v && docker-compose up
```

**Build Failures**
```bash
# Clean Docker cache
npm run docker:clean:all

# Rebuild from scratch
docker-compose build --no-cache
```

### Debug Mode
For development debugging:
```bash
# Run with debug output
DEBUG=* npm run docker:dev

# Access container shell
docker-compose exec app sh
```

## Migration from Legacy Setup

If migrating from a non-Docker setup:

1. **Backup your data**:
   ```bash
   pg_dump your_database > backup.sql
   ```

2. **Update environment variables**:
   - Copy `.env.example` to `.env`
   - Update database URL to use container hostname

3. **Run migrations**:
   ```bash
   npm run docker:dev
   # In another terminal:
   docker-compose exec app npm run db:push
   ```

4. **Restore data if needed**:
   ```bash
   docker-compose exec db psql -U postgres -d proxapeople_dev < backup.sql
   ```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Build and test Docker image
  run: |
    npm run docker:build
    docker run --rm proxapeople npm test
```

### Pre-deployment Checks
```bash
# Validate configuration
docker-compose config

# Security scan
docker scan proxapeople

# Performance test
docker run --rm proxapeople npm run test:e2e
```

## Future Enhancements

Planned improvements:
- [ ] Kubernetes manifests
- [ ] Multi-architecture builds (ARM64)
- [ ] Redis container for session storage
- [ ] Nginx reverse proxy container
- [ ] SSL/TLS termination
- [ ] Container registry integration
- [ ] Automated security scanning

---

For more information, see:
- [Dockerfile](./Dockerfile)
- [Docker Compose Production](./docker-compose.yml)
- [Docker Compose Development](./docker-compose.dev.yml)
- [Environment Variables](./.env.example)