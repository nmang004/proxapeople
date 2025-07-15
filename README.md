# ProxaPeople HR Management Platform

<div align="center">
  <img src="attached_assets/LogoIcon_Purple.png" alt="ProxaPeople Logo" width="120" height="120">
  
  **Enterprise-Grade HR Management System**
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
  [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)
</div>

---

## 🚀 Overview

ProxaPeople is a comprehensive HR management platform designed for modern enterprises. It provides tools for employee management, performance reviews, goal tracking, team analytics, and organizational development.

**Current Status**: 🚧 **Phase 3 Active** - Guided implementation and validation  
**Security Status**: ⚠️ **Under Development** - Do not deploy to production

### Key Features

- 👥 **Employee Directory & Org Chart** - Visual organization structure and employee profiles
- 🎯 **Goal Management** - Set, track, and measure team and individual objectives
- 📊 **Performance Reviews** - Comprehensive review cycles and feedback systems
- 📈 **Analytics Dashboard** - Real-time insights into team performance and engagement
- 🤝 **1-on-1 Meetings** - Structured meeting scheduling and note-taking
- 📋 **Surveys & Feedback** - Employee engagement and satisfaction tracking
- 🔐 **Role-Based Access Control** - Granular permissions and security management

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **React 18** with TypeScript for modern UI development
- **Zustand** for lightweight state management
- **TanStack Query** for efficient data fetching and caching
- **shadcn/ui** + **Tailwind CSS** for consistent design system
- **Framer Motion** for smooth animations
- **Recharts** for data visualization

#### Backend
- **Express.js** with TypeScript for REST API
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** for reliable data storage
- **Auth0** + **JWT** for secure authentication
- **bcrypt** for password hashing
- **Helmet** + **CORS** for security headers

#### Infrastructure & DevOps
- **Docker** for containerization
- **Google Cloud Run** for scalable deployment
- **Terraform** for Infrastructure as Code
- **Vitest** + **Testing Library** for unit testing
- **Playwright** for end-to-end testing

### Project Structure

```
ProxaPeople/
├── client/                     # React frontend application
│   ├── src/
│   │   ├── app/               # Application setup, providers, routing
│   │   ├── features/          # Self-contained business features
│   │   ├── entities/          # Core business logic and data models
│   │   ├── shared/            # Reusable UI components and utilities
│   │   └── pages/             # Route components
│   └── tests/                 # Frontend tests
├── server/                     # Express backend application
│   ├── src/
│   │   ├── modules/           # Feature-based modules
│   │   ├── shared/            # Shared utilities and middleware
│   │   └── database/          # Database configuration and migrations
│   └── tests/                 # Backend tests
├── shared/                     # Shared types and schemas
├── infrastructure/             # Terraform and Docker configurations
└── docs/                      # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 14+
- **Docker** (optional, for containerized development)

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
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

### Docker Development

For a fully containerized development environment:

```bash
npm run docker:dev
```

## 📝 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:ui` - Run E2E tests with UI

### Database
- `npm run db:push` - Apply schema changes to development database
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

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/proxapeople

# Authentication (Auth0)
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
JWT_SECRET=your_jwt_secret_key

# Application
NODE_ENV=development
PORT=3000
```

### Database Schema

The application uses Drizzle ORM for database management. Schema files are located in `shared/schema.ts`.

To apply schema changes:
```bash
npm run db:push
```

## 🧪 Testing

### Test Structure

```
tests/
├── unit/              # Component and utility tests
├── integration/       # API and feature integration tests
└── e2e/              # End-to-end user journey tests
```

### Running Tests

```bash
# Run all unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Deployment

### Production Build

```bash
npm run build
npm run docker:build
```

### Environment Setup

The application supports multiple deployment environments:

- **Development** - Local development with hot reload
- **Staging** - Auto-deployment from main branch
- **Production** - Manual deployment with full monitoring

### Infrastructure

Infrastructure is managed with Terraform. See `infrastructure/` directory for:

- Google Cloud Run configuration
- PostgreSQL database setup
- Monitoring and logging
- Security and networking

## 🔐 Security

### Current Security Implementation

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Input validation with Zod
- ✅ Security headers with Helmet
- ✅ Rate limiting on API endpoints

### Security Guidelines

1. All API endpoints require authentication
2. Role-based permissions enforced on all resources
3. Input validation on all user-provided data
4. Secure password storage with bcrypt hashing
5. JWT tokens with expiration and refresh logic

## 📊 Features Overview

### Employee Management
- Employee directory with search and filtering
- Organizational chart visualization
- Employee profiles and contact information
- Department and team management

### Performance Management
- Goal setting and progress tracking
- Performance review cycles
- 360-degree feedback collection
- Achievement recognition and rewards

### Analytics & Reporting
- Team performance dashboards
- Engagement score tracking
- Custom reports and insights
- Data export capabilities

### Meeting Management
- 1-on-1 meeting scheduling
- Meeting notes and action items
- Follow-up tracking
- Integration with calendar systems

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm run test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Guidelines

- **File Size**: Maximum 300 lines per file
- **TypeScript**: Strict mode enabled
- **Testing**: 60% minimum coverage
- **Linting**: Zero ESLint errors
- **Security**: Input validation required

### Architecture Principles

- **Feature-Sliced Design** for scalable organization
- **Single Responsibility Principle** for maintainable code
- **Security First** approach in all implementations
- **Test-Driven Development** for reliable features

## 📚 Documentation

- [Architecture Documentation](docs/architecture/) - System design and patterns
- [API Documentation](docs/api/) - REST API specifications
- [Deployment Guide](docs/deployment/) - Production deployment instructions
- [CLAUDE.md](CLAUDE.md) - AI assistant interaction guide

## 🔮 Roadmap

### Current Sprint (Weeks 1-2)
- ✅ Security foundation implementation
- ✅ Authentication and authorization
- 🚧 RBAC system completion

### Upcoming Features
- **Advanced Analytics** - ML-powered insights
- **Mobile Application** - React Native app
- **Integration APIs** - Slack, Microsoft Teams
- **Advanced Reporting** - Custom dashboard builder
- **AI Assistant** - Natural language querying

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions, issues, or contributions:

- **GitHub Issues**: [Create an issue](https://github.com/nmang004/proxapeople/issues)
- **Documentation**: [Project Docs](docs/)
- **Architecture**: [Solution Architecture](SOLUTION_ARCHITECTURE.md)

---

<div align="center">
  <p>Built with ❤️ for modern HR teams</p>
  <p>ProxaPeople © 2025</p>
</div>