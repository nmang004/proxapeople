# ProxaPeople - Claude Code Interaction Guide

**Project**: ProxaPeople HR Management Platform  
**Phase**: Production Ready - Enterprise Transformation Complete  
**Last Updated**: January 21, 2025

---

## Current Project Status

### ✅ Recently Completed (Last 5 Days)
- **Auth0 Integration**: Complete OAuth2/OIDC implementation replacing internal auth
- **Supabase Migration**: Cloud PostgreSQL with real-time capabilities
- **Feature-Sliced Architecture**: Scalable codebase organization implemented
- **TypeScript Resolution**: 88% error reduction (209 → 6 errors)
- **Security Hardening**: Production-ready security with RBAC
- **Production Deployment**: Vercel frontend + Google Cloud Run backend

### 🚧 Current Focus
- **RBAC System**: Fine-grained permissions (90% complete)
- **Performance Optimization**: Bundle size reduction and lazy loading
- **Mobile Responsiveness**: Enhanced responsive design

---

## Critical Technical Context

### Architecture
- **Frontend**: React 18 + TypeScript + Zustand + TanStack Query + shadcn/ui + Wouter
- **Backend**: Express.js + Drizzle ORM + Supabase PostgreSQL + Auth0 JWT
- **Pattern**: Feature-Sliced Design (domain-driven, not technical layers)
- **Authentication**: Auth0 Universal Login with JWT validation
- **State**: Zustand for client state, TanStack Query for server state

### Key File Locations
```
client/src/
├── app/store/          # Zustand stores (auth0-store.ts is primary)
├── features/           # Business domains (auth, employees, goals, etc.)
├── shared/             # Reusable UI components (shadcn/ui)
├── pages/              # Route components
└── assets/             # Static assets (logo.webp)

server/src/
├── modules/            # Feature-based backend modules
├── shared/middleware/  # Auth0, security, permissions
└── database/           # Supabase configuration

shared/
└── schema.ts          # Single source of truth for all types
```

### Database Schema Authority
- **Source**: `shared/schema.ts` - All types derive from here
- **ORM**: Drizzle with full TypeScript integration
- **Migrations**: `drizzle-kit push` applies changes
- **Key Tables**: users, goals, reviews, meetings, departments, rbac_permissions

---

## Development Workflow

### Essential Commands
```bash
npm run dev          # Start development (frontend:5173, backend:5000)
npm run check        # TypeScript validation (must pass)
npm run test         # Run Vitest unit tests
npm run test:e2e     # Playwright E2E tests
npm run db:push      # Apply schema changes to Supabase
npm run rbac:seed    # Seed permission system
```

### Code Quality Standards
- **File Size Limit**: 300 lines maximum
- **TypeScript**: Strict mode, zero errors tolerated
- **Testing**: 60% minimum coverage
- **Security**: All endpoints require Auth0 validation
- **Architecture**: Feature-Sliced Design principles

---

## Security Implementation

### Authentication Flow
1. **Frontend**: `@auth0/auth0-react` handles OAuth flows
2. **Backend**: `express-oauth2-jwt-bearer` validates JWT tokens
3. **Store**: `auth0-store.ts` manages user state and token refresh
4. **Guards**: Route protection in `auth/components/`

### Critical Security Rules
- **Never bypass authentication** - All API endpoints use `validateAuth0Token`
- **Input validation** - Use Zod schemas for all user inputs
- **RBAC enforcement** - Check permissions, not just roles
- **Environment secrets** - Never commit .env files (gitignored)

### Auth0 Configuration
```typescript
// Current setup
Domain: dev-45snae82elh3j648.us.auth0.com
Client ID: mbPpBlDPQVRHfH3ZYuCIR7qEWYoxUEB8
Audience: https://api.proxapeople.com
Scopes: openid profile email read:users update:users
```

---

## Common Development Patterns

### Adding New Features
1. **Start with schema** - Add types to `shared/schema.ts`
2. **Create feature module** - `client/src/features/[feature-name]/`
3. **Backend module** - `server/src/modules/[feature-name]/`
4. **API endpoints** - Use Auth0 middleware + Zod validation
5. **Frontend components** - Use shadcn/ui + Zustand + TanStack Query

### File Organization
```typescript
// ✅ Good: Feature-based organization
client/src/features/goals/
├── api/index.ts        # API calls
├── components/         # UI components
├── hooks/             # Custom hooks
└── types/             # Feature-specific types

// ❌ Bad: Technical layer grouping
src/components/goals/   # Mixed concerns
src/hooks/goals/        # Scattered logic
```

### Component Patterns
```typescript
// ✅ Preferred pattern
export function GoalCard({ goalId }: { goalId: string }) {
  const { data: goal } = useGoal(goalId);  // TanStack Query
  const { user } = useAuth();              // Zustand store
  
  return <Card>{/* Focused component */}</Card>;
}
```

---

## Deployment Context

### Environments
- **Development**: Local with hot reload
- **Production**: Vercel (frontend) + Google Cloud Run (backend)
- **Database**: Supabase PostgreSQL with connection pooling

### Environment Variables
```bash
# Required for development
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
VITE_AUTH0_DOMAIN=dev-45snae82elh3j648.us.auth0.com
VITE_AUTH0_CLIENT_ID=mbPpBlDPQVRHfH3ZYuCIR7qEWYoxUEB8
AUTH0_CLIENT_SECRET=[SECRET]
JWT_SECRET=[32+ char random string]
```

---

## Troubleshooting Guide

### Common Issues
- **Auth0 errors**: Check callback URLs and audience configuration
- **TypeScript errors**: Run `npm run check` and fix before proceeding
- **Database issues**: Verify Supabase connection and schema sync
- **Build failures**: Check for missing environment variables

### Testing Strategy
- **Unit Tests**: Component behavior, utility functions
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Complete user workflows, auth flows

---

## Key Success Patterns

### When Adding Features
1. **Security first** - Always implement auth before functionality
2. **Schema driven** - Define types in `shared/schema.ts` first
3. **Feature isolated** - Keep business logic in feature modules
4. **Test coverage** - Write tests for new functionality
5. **Performance aware** - Consider bundle impact and lazy loading

### When Debugging
1. **Check Auth0 logs** - Authentication issues often surface here
2. **Verify environment** - Ensure all required vars are set
3. **Database state** - Use Supabase dashboard for data inspection
4. **TypeScript first** - Fix compilation errors before runtime issues

This guide reflects the current production-ready state of ProxaPeople with Auth0 authentication, Supabase integration, and enterprise-grade security. The codebase follows modern patterns and is ready for continued development and scaling.