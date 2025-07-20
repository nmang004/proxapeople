# ProxaPeople HR Management Platform

<div align="center">
  <img src="client/src/assets/logo.webp" alt="ProxaPeople Logo" width="120" height="120">
  
  **Enterprise-Grade HR Management System**
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
  [![Auth0](https://img.shields.io/badge/Auth0-EB5424?style=for-the-badge&logo=auth0&logoColor=white)](https://auth0.com/)
  [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)
  [![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
</div>

---

## 🚀 Overview

ProxaPeople is a comprehensive, enterprise-grade HR management platform built with modern technologies and security-first principles. After a complete architectural overhaul from MVP to production-ready system, it now features Auth0 authentication, Supabase database integration, and a robust Feature-Sliced Design architecture.

**Current Status**: ✅ **Production Ready** - Fully deployed and operational  
**Security Status**: ✅ **Enterprise Secure** - Auth0 authentication with RBAC

### Key Features

- 🔐 **Auth0 Universal Login** - Secure authentication with SSO support
- 👥 **Employee Directory & Org Chart** - Visual organization structure and employee profiles
- 🎯 **Goal Management** - Set, track, and measure team and individual objectives with progress tracking
- 📊 **Performance Reviews** - Comprehensive review cycles with 360-degree feedback
- 📈 **Analytics Dashboard** - Real-time insights into team performance and engagement metrics
- 🤝 **1-on-1 Meetings** - Structured meeting scheduling with notes and action items
- 📋 **Surveys & Feedback** - Employee engagement and satisfaction tracking
- ⚡ **Real-time Updates** - Live data synchronization across all users
- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **React 18** with TypeScript for modern, type-safe UI development
- **Zustand** for lightweight, scalable state management
- **TanStack Query** for efficient data fetching, caching, and synchronization
- **shadcn/ui** + **Tailwind CSS** for consistent, accessible design system
- **Framer Motion** for smooth, performant animations
- **Recharts** for interactive data visualization
- **Wouter** for lightweight client-side routing
- **Auth0 React SDK** for seamless authentication integration

#### Backend
- **Express.js** with TypeScript for robust REST API
- **Drizzle ORM** for type-safe database operations and migrations
- **Supabase PostgreSQL** for scalable, cloud-native data storage
- **Auth0** + **express-oauth2-jwt-bearer** for enterprise authentication
- **Helmet** + **CORS** for comprehensive security headers
- **Zod** for runtime input validation and type safety

#### Infrastructure & DevOps
- **Vercel** for seamless frontend deployment with global CDN
- **Supabase** for managed PostgreSQL with real-time capabilities
- **Docker** for consistent containerization across environments
- **Google Cloud Run** for scalable backend deployment
- **Terraform** for Infrastructure as Code
- **Vitest** + **Testing Library** for comprehensive unit testing
- **Playwright** for reliable end-to-end testing

### Architecture Pattern: Feature-Sliced Design

```
ProxaPeople/
├── client/                     # React frontend application
│   ├── src/
│   │   ├── app/               # Application setup, providers, routing
│   │   │   ├── providers/     # Auth0, React Query providers
│   │   │   └── store/         # Zustand stores
│   │   ├── features/          # Self-contained business features
│   │   │   ├── auth/          # Authentication (Auth0)
│   │   │   ├── employees/     # Employee management
│   │   │   ├── goals/         # Goal tracking
│   │   │   ├── performance/   # Performance reviews
│   │   │   ├── analytics/     # Dashboards and metrics
│   │   │   └── settings/      # User & system settings
│   │   ├── entities/          # Core business logic and data models
│   │   ├── shared/            # Reusable UI components and utilities
│   │   └── pages/             # Route components
│   └── tests/                 # Frontend tests
├── server/                     # Express backend application
│   ├── src/
│   │   ├── modules/           # Feature-based modules
│   │   │   ├── auth/          # Auth0 JWT validation
│   │   │   ├── users/         # User management
│   │   │   ├── analytics/     # Data aggregation
│   │   │   └── permissions/   # RBAC system
│   │   ├── shared/            # Middleware and utilities
│   │   └── database/          # Supabase configuration
│   └── tests/                 # Backend tests
├── shared/                     # Shared types and schemas
├── infrastructure/             # Terraform and Docker configurations
└── docs/                      # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Auth0** account for authentication
- **Supabase** account for database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nmang004/proxapeople.git
   cd proxapeople
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   
   Create a `.env` file in the root directory:
   ```bash
   # Database (Supabase)
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   
   # Auth0 Configuration
   VITE_AUTH0_DOMAIN=your-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your_client_id
   VITE_AUTH0_AUDIENCE=https://your-api-identifier.com
   AUTH0_CLIENT_SECRET=your_client_secret
   JWT_SECRET=your_jwt_secret_32_chars_minimum
   
   # Application
   NODE_ENV=development
   PORT=3000
   VITE_AUTH0_REDIRECT_URI=http://localhost:5173/callback
   FRONTEND_URL=http://localhost:5173
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Database setup**
   
   Apply the database schema to your Supabase instance:
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

### Auth0 Setup

1. **Create Auth0 Application**
   - Type: Single Page Application (SPA)
   - Allowed Callback URLs: `http://localhost:5173/callback`, `https://your-domain.vercel.app/callback`
   - Allowed Logout URLs: `http://localhost:5173`, `https://your-domain.vercel.app`
   - Allowed Web Origins: `http://localhost:5173`, `https://your-domain.vercel.app`

2. **Create Auth0 API**
   - Identifier: `https://your-api-identifier.com`
   - Signing Algorithm: RS256
   - Add scopes: `read:users`, `update:users`, `read:analytics`

3. **Configure User Attributes**
   - Enable: Email, Username, Picture
   - Custom attributes: Job Title, Department

## 📝 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production deployment
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking

### Testing
- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run test:e2e:ui` - Run E2E tests with UI

### Database
- `npm run db:push` - Apply schema changes to database
- `npm run rbac:seed` - Seed RBAC permissions
- `npm run rbac:audit` - Audit RBAC permissions

### Docker
- `npm run docker:build` - Build production Docker image
- `npm run docker:dev` - Start development environment
- `npm run docker:prod` - Start production environment
- `npm run docker:logs` - View container logs
- `npm run docker:clean` - Clean up Docker resources

## 🔧 Configuration

### Environment Variables

**Frontend (Vite)**
```bash
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your_spa_client_id
VITE_AUTH0_AUDIENCE=https://your-api-identifier.com
VITE_AUTH0_REDIRECT_URI=https://your-domain.com/callback
```

**Backend (Express)**
```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_SECRET=your_client_secret
JWT_SECRET=your_jwt_secret_32_chars_minimum
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.vercel.app
CORS_ORIGIN=https://your-domain.vercel.app
```

### Database Schema

The application uses Drizzle ORM with a comprehensive schema including:
- **Users** - Employee profiles and authentication data
- **Goals** - Individual and team objectives with categories and priorities
- **Reviews** - Performance evaluation cycles and feedback
- **Meetings** - 1-on-1 scheduling and notes
- **Surveys** - Employee engagement tracking
- **Departments & Teams** - Organizational structure
- **RBAC** - Role-based access control system

Schema files: `shared/schema.ts` and `migrations/`

## 🧪 Testing

### Test Architecture

```
tests/
├── unit/              # Component and utility tests (Vitest)
├── integration/       # API and feature integration tests
└── e2e/              # End-to-end user journey tests (Playwright)
```

### Testing Strategy

- **Unit Tests**: Component behavior, utility functions, business logic
- **Integration Tests**: API endpoints, database operations, Auth0 integration
- **E2E Tests**: Complete user workflows, authentication flows, critical paths

### Running Tests

```bash
# Run all unit tests
npm run test

# Run with coverage (target: 60%+)
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Watch mode for development
npm run test:watch
```

## 📦 Deployment

### Frontend (Vercel)

**Automatic Deployment**
- Connected to GitHub repository
- Auto-deploys on push to `main` branch
- Environment variables configured in Vercel dashboard

**Build Configuration**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.js" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Backend (Google Cloud Run)

**Production Deployment Process**

1. **Build Docker image**
   ```bash
   docker build --platform linux/amd64 -t proxapeople .
   ```

2. **Push to Google Container Registry**
   ```bash
   docker tag proxapeople gcr.io/PROJECT_ID/proxapeople:latest
   gcloud auth configure-docker
   docker push gcr.io/PROJECT_ID/proxapeople:latest
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy proxapeople-production \
     --image gcr.io/PROJECT_ID/proxapeople:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --cpu 2 \
     --memory 2Gi \
     --min-instances 1 \
     --max-instances 10 \
     --set-env-vars NODE_ENV=production,AUTH0_DOMAIN=domain.auth0.com \
     --set-secrets DATABASE_URL=database-url:latest,JWT_SECRET=jwt-secret:latest
   ```

**Required Secrets (Google Secret Manager)**
- `DATABASE_URL`: Supabase PostgreSQL connection string
- `JWT_SECRET`: 32+ character random string for Auth0 validation
- `AUTH0_CLIENT_SECRET`: Auth0 application secret

### Infrastructure as Code

Terraform modules available in `infrastructure/` for:
- Google Cloud Run service configuration
- Secret Manager setup
- VPC networking
- Monitoring and alerts
- IAM permissions

## 🔐 Security

### Implemented Security Features

- ✅ **Auth0 Universal Login** - Industry-standard OAuth2/OIDC authentication
- ✅ **JWT Token Validation** - Stateless, secure API authentication
- ✅ **Role-Based Access Control (RBAC)** - Granular permissions system
- ✅ **Input Validation** - Zod schema validation on all endpoints
- ✅ **Security Headers** - Helmet.js with comprehensive protection
- ✅ **Rate Limiting** - API endpoint protection against abuse
- ✅ **CORS Configuration** - Restricted cross-origin requests
- ✅ **Database Security** - Parameterized queries with Drizzle ORM
- ✅ **Environment Secrets** - All sensitive data in environment variables

### Security Best Practices

1. **Authentication**: Auth0 handles all authentication flows
2. **Authorization**: Role-based permissions on all protected resources
3. **Data Validation**: Runtime validation with Zod schemas
4. **Secure Communication**: HTTPS enforced in production
5. **Secret Management**: Google Secret Manager for production secrets
6. **Audit Logging**: Comprehensive request logging and monitoring

## 📊 Features Deep Dive

### Dashboard & Analytics
- **Real-time Metrics**: Team performance, engagement scores, goal progress
- **Interactive Charts**: Built with Recharts for responsive data visualization
- **Customizable Views**: Filter by department, team, or time period
- **Export Capabilities**: Download reports in multiple formats

### Goal Management
- **OKR Framework**: Objectives and Key Results tracking
- **Progress Visualization**: Progress rings and timeline views
- **Team Alignment**: Cascade goals from company to individual level
- **Automated Reminders**: Check-in notifications and deadline alerts

### Performance Reviews
- **360-Degree Feedback**: Collect input from peers, managers, and direct reports
- **Review Cycles**: Quarterly, annual, or custom review periods
- **Rating Scales**: Customizable evaluation criteria
- **Development Plans**: Track growth areas and career progression

### Employee Directory
- **Advanced Search**: Filter by skills, department, location, or role
- **Org Chart**: Interactive organizational structure visualization
- **Profile Management**: Comprehensive employee information
- **Onboarding**: Streamlined new hire processes

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes and add tests**
4. **Ensure all tests pass**: `npm run test`
5. **Check types**: `npm run check`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open Pull Request**

### Code Standards

- **File Size**: Maximum 300 lines per file
- **TypeScript**: Strict mode enabled everywhere
- **Testing**: 60% minimum coverage required
- **Linting**: Zero ESLint errors tolerated
- **Security**: Input validation required on all endpoints
- **Architecture**: Follow Feature-Sliced Design principles

### Pull Request Guidelines

- **Clear Description**: Explain the change and its impact
- **Test Coverage**: Include unit and integration tests
- **Security Review**: Ensure no security regressions
- **Performance**: Consider impact on bundle size and runtime
- **Documentation**: Update relevant docs and comments

## 📚 Documentation

- **[Architecture Guide](docs/architecture/)** - System design and patterns
- **[API Documentation](docs/api/)** - REST API specifications
- **[Deployment Guide](docs/deployment/)** - Production deployment instructions
- **[Security Guide](docs/security/)** - Security best practices and guidelines
- **[CLAUDE.md](CLAUDE.md)** - AI assistant interaction guide

## 🔮 Roadmap

### Recently Completed ✅
- **Auth0 Integration** - Complete authentication overhaul
- **Supabase Migration** - Cloud-native database with real-time features
- **Feature-Sliced Architecture** - Scalable, maintainable code organization
- **TypeScript Completion** - 88% error reduction (from 209 to 6 errors)
- **Test Infrastructure** - 46% test pass rate improvement
- **Production Deployment** - Vercel + Google Cloud Run setup

### Current Sprint (Q1 2025)
- 🚧 **Advanced RBAC** - Fine-grained permission system completion
- 🚧 **Performance Optimization** - Bundle size reduction and lazy loading
- 🚧 **Mobile Responsiveness** - Enhanced mobile experience

### Next Quarter (Q2 2025)
- **Advanced Analytics** - ML-powered insights and predictions
- **Mobile Application** - React Native companion app
- **Integration APIs** - Slack, Microsoft Teams, Google Workspace
- **Advanced Reporting** - Custom dashboard builder with drag-and-drop
- **Workflow Automation** - Custom business process automation

### Future Considerations
- **AI Assistant** - Natural language querying and insights
- **Multi-tenant Architecture** - Support for multiple organizations
- **Advanced Security** - SSO with enterprise identity providers
- **Offline Support** - Progressive Web App capabilities

## 📊 Performance Metrics

### Current Performance
- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **Bundle Size**: <500KB gzipped
- **Load Time**: <2s initial load, <500ms navigation
- **Test Coverage**: 60%+ with growing coverage
- **TypeScript Errors**: 6 remaining (from 209 initially)

### Monitoring
- **Error Tracking**: Real-time error monitoring and alerts
- **Performance Monitoring**: Core Web Vitals tracking
- **User Analytics**: Usage patterns and feature adoption
- **Uptime Monitoring**: 99.9% availability target

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions, issues, or contributions:

- **GitHub Issues**: [Create an issue](https://github.com/nmang004/proxapeople/issues)
- **Documentation**: [Project Docs](docs/)
- **Architecture**: [Solution Architecture](SOLUTION_ARCHITECTURE.md)
- **Security**: [Security Guidelines](docs/security/)

## 🙏 Acknowledgments

- **Auth0** for enterprise-grade authentication
- **Supabase** for seamless PostgreSQL hosting
- **Vercel** for exceptional deployment experience
- **Google Cloud** for scalable infrastructure
- **Open Source Community** for amazing tools and libraries

---

<div align="center">
  <p>Built with ❤️ for modern HR teams</p>
  <p><strong>ProxaPeople © 2025</strong></p>
  <p>Enterprise HR Management • Powered by Modern Technology</p>
</div>