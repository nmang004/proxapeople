# ProxaPeople - Claude Code Interaction Guide

**Project**: ProxaPeople HR Management Platform  
**Phase**: Comprehensive Enterprise Overhaul  
**Last Updated**: January 15, 2025

---

## Project Overview

ProxaPeople is undergoing a complete transformation from an insecure MVP to a production-ready, enterprise-grade HR management system. This project prioritizes security, scalability, and maintainability through systematic refactoring and architectural improvements.

### Current Status
- ✅ **Phase 1 Complete**: Comprehensive audit identifying 47 critical issues
- ✅ **Phase 2 Complete**: Solution architecture and implementation plan
- 🚧 **Phase 3 Active**: Guided implementation and validation

---

## Critical Context

### Security Priority
**WARNING**: The application currently has CRITICAL security vulnerabilities:
- No authentication on any endpoint
- Passwords stored in plaintext  
- No authorization checks
- Missing security headers
- No input validation

**Never deploy current state to production.**

### Architecture Goals
Transforming from unstructured monolith to **Feature-Sliced Design**:
```
src/
├── app/          # Application setup, providers, routing
├── features/     # Self-contained business features  
├── entities/     # Core business logic and data
├── shared/       # Reusable UI, utilities, types
└── pages/        # Route components
```

### Technology Stack
- **Frontend**: React 18 + TypeScript + Zustand + TanStack Query + shadcn/ui
- **Backend**: Express + Drizzle ORM + PostgreSQL + Auth0 + JWT
- **Infrastructure**: Docker + Terraform + Google Cloud Run
- **Testing**: Vitest + Testing Library + Playwright

---

## Implementation Roadmap

### Current Sprint: Security Foundation (Week 1-2)
1. **Epic 1**: Implement Auth0 OAuth + JWT authentication
2. **Epic 2**: Hash all passwords with bcrypt  
3. **Epic 3**: Implement RBAC authorization system

### Next Sprints
- **Week 3-4**: Backend modularization + state management
- **Week 5**: Code quality (break down 1,700+ line files)
- **Week 6**: Infrastructure as Code + containerization

---

## Key Files & Structure

### Critical Files to Refactor (Priority Order)
1. `client/src/pages/settings.tsx` - **1,708 lines** - Split into 6 components
2. `client/src/pages/dashboard.tsx` - **1,366 lines** - Split into 8 components  
3. `server/routes.ts` - **369 lines** - Modularize by feature
4. `client/src/pages/analytics.tsx` - **1,134 lines** - Extract chart logic

### New Architecture Files
```
server/src/modules/auth/          # Authentication module
server/src/modules/users/         # User management  
server/src/shared/middleware/     # Global middleware
client/src/features/auth/         # Auth UI components
client/src/app/store/            # Zustand stores
client/src/shared/api/           # API client layer
```

---

## Development Guidelines

### Security First
1. **Always implement authentication before features**
2. **Validate all inputs with Zod schemas**
3. **Use parameterized queries (Drizzle ORM)**
4. **Never log sensitive data**
5. **Apply principle of least privilege**

### Code Quality Standards
- **Maximum file size**: 300 lines
- **Single Responsibility Principle**: One concern per file
- **TypeScript strict mode**: Enabled everywhere
- **Test coverage**: 60% minimum
- **ESLint**: Zero errors tolerated

### Component Patterns
```typescript
// ✅ Good: Focused, single responsibility
export function UserProfile({ userId }: { userId: string }) {
  const { data: user } = useUser(userId);
  return <ProfileCard user={user} />;
}

// ❌ Bad: Mixed concerns, too large
export function MegaComponent() {
  // 500+ lines of mixed UI, business logic, API calls
}
```

---

## Common Tasks

### Adding New Features
1. **Start with feature module**: `client/src/features/[feature-name]/`
2. **Define entities**: Add to `client/src/entities/` if shared
3. **Create API endpoints**: Add to appropriate `server/src/modules/`
4. **Write tests**: Unit + integration coverage
5. **Update permissions**: Ensure RBAC compliance

### Refactoring Large Files
1. **Identify responsibilities**: UI, business logic, API calls
2. **Extract custom hooks**: Move logic out of components
3. **Create sub-components**: Break UI into focused pieces
4. **Move API calls**: Centralize in entity or feature API layer
5. **Validate**: Ensure functionality unchanged

### Adding Dependencies
1. **Security check**: Run `npm audit`
2. **Bundle impact**: Check size with `npm run build`
3. **TypeScript support**: Prefer typed packages
4. **Maintenance**: Check last update, GitHub stars
5. **Alternative research**: Consider lighter alternatives

---

## Testing Strategy

### Test Pyramid
```
E2E Tests (10%)
├── Authentication flow
├── Critical user journeys
└── Data integrity checks

Integration Tests (30%)
├── API endpoints
├── Database operations
└── Feature interactions

Unit Tests (60%)
├── Business logic
├── Utilities
├── Components (behavior)
└── Custom hooks
```

### Testing Commands
```bash
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests
npm run test:coverage  # Coverage report
npm run test:watch     # Watch mode
```

---

## Database Management

### Migration Process
```bash
npm run db:generate    # Generate migration from schema changes
npm run db:push        # Apply to development database
npm run db:migrate     # Apply to production database
```

### Schema Changes
1. **Always create migrations** for production
2. **Test rollbacks** for every migration
3. **Backup before major changes**
4. **Use transactions** for multi-step migrations

---

## Deployment

### Environments
- **Development**: Local with Docker Compose
- **Staging**: Google Cloud Run (auto-deploy from main)
- **Production**: Google Cloud Run (manual deployment)

### Docker Build & Deploy Process
```bash
# Build application
npm run build

# Build Docker image (CRITICAL: Use linux/amd64 for Cloud Run)
docker build --platform linux/amd64 -t proxapeople .

# Tag and push to GCR
docker tag proxapeople gcr.io/PROJECT_ID/proxapeople:latest
gcloud auth configure-docker
docker push gcr.io/PROJECT_ID/proxapeople:latest
```

### GCP Cloud Run Deployment
```bash
# Create secrets in Secret Manager
echo -n "value" | gcloud secrets create secret-name --data-file=-

# Grant service account access to secrets
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Deploy to Cloud Run (DO NOT set PORT - auto-managed)
gcloud run deploy proxapeople-production \
  --image gcr.io/PROJECT_ID/proxapeople:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --cpu 2 \
  --memory 2Gi \
  --min-instances 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production,AUTH0_DOMAIN=domain.auth0.com,AUTH0_CLIENT_ID=client_id,FRONTEND_URL=https://service-url.run.app,CORS_ORIGIN=https://service-url.run.app \
  --set-secrets DATABASE_URL=database-url:latest,JWT_SECRET=jwt-secret:latest,AUTH0_CLIENT_SECRET=auth0-secret:latest,SESSION_SECRET=session-secret:latest
```

### Required Secrets
- `DATABASE_URL`: PostgreSQL connection string with private IP
- `JWT_SECRET`: 32+ character random string
- `AUTH0_CLIENT_SECRET`: Auth0 application secret
- `SESSION_SECRET`: Session encryption key

### Post-Deployment Verification
```bash
# Test health endpoint
curl https://service-url.run.app/health

# Check logs for errors
gcloud logging read "resource.type=cloud_run_revision" --limit=20
```

---

## Troubleshooting

### Common Issues

**Authentication Errors**
- Check AUTH0 configuration
- Verify JWT secret matches
- Ensure token not expired

**Database Connection Issues**  
- Verify DATABASE_URL format
- Check VPC connector (Cloud Run)
- Confirm SSL settings

**Build Failures**
- Clear `node_modules` and reinstall
- Check TypeScript errors
- Verify environment variables

### Debug Commands
```bash
npm run check          # TypeScript check
npm run lint           # ESLint check  
npm run dev            # Development server
npm run logs           # View application logs
```

---

## Next Steps for Claude

When resuming work on ProxaPeople:

1. **Check current sprint**: Review todo list and epic progress
2. **Verify security**: Ensure no endpoints are unprotected
3. **Run tests**: Confirm all tests pass before changes
4. **Follow patterns**: Use established architecture and patterns
5. **Update docs**: Keep this guide current with changes

### Key Questions to Ask
- "What epic are we currently working on?"
- "Are all new endpoints properly secured?"
- "Do tests cover the changes?"
- "Does this follow our architectural patterns?"
- "Is the file size under 300 lines?"

---

## Resources

- **Audit Report**: `AUDIT_REPORT.md` - Security vulnerabilities and issues
- **Architecture**: `SOLUTION_ARCHITECTURE.md` - Target state and implementation plan  
- **Infrastructure**: `INFRASTRUCTURE_PLAN.md` - Terraform and GCP configuration
- **API Docs**: `docs/api/` - OpenAPI specifications (when implemented)

---

*This guide should be updated as the project evolves. Always refer to the latest version before making significant changes.*