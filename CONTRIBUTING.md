# Contributing to Maplify Tech

Thank you for your interest in contributing to Maplify Tech! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

## 📜 Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Browser, Docker/Kubernetes version)
- **Logs** from browser console or container logs

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** for the enhancement
- **Mockups or examples** if applicable
- **Alternative solutions** you've considered

### Pull Requests

- Fill in the pull request template
- Follow the coding guidelines
- Include tests for new features
- Update documentation as needed
- Ensure CI/CD checks pass

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+ and pnpm
- Docker and Docker Compose
- Git

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/maplify-tech.git
cd maplify-tech

# Install dependencies
pnpm install

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Start services with Docker Compose
docker-compose up -d postgres minio

# Run database migrations
cd apps/api
pnpm prisma migrate dev

# Start development servers
cd ../..
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8787
- MinIO Console: http://localhost:9001

### Development Workflow

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm --filter @maplify-tech/web dev
pnpm --filter @maplify-tech/api dev

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## 📁 Project Structure

```
maplify-tech/
├── apps/
│   ├── web/              # React frontend
│   │   ├── src/
│   │   │   ├── components/   # React components
│   │   │   ├── hooks/        # Custom React hooks
│   │   │   ├── lib/          # API client and utilities
│   │   │   ├── types/        # TypeScript types
│   │   │   └── utils/        # Utility functions
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── api/              # Node.js backend
│       ├── src/
│       │   ├── routes/       # API routes
│       │   ├── middleware/   # Express middleware
│       │   ├── lib/          # Utilities (auth, prisma, minio)
│       │   └── index.ts      # Server entry point
│       ├── prisma/           # Database schema and migrations
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   └── shared/           # Shared TypeScript types
│
├── infrastructure/
│   ├── kubernetes/       # K8s manifests
│   └── docker/          # Docker configurations
│
└── docs/                # Documentation
```

## 💻 Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types, avoid `any` unless absolutely necessary
- Use interfaces for object shapes
- Export types from `packages/shared` when used across apps

### React

- Use functional components with hooks
- Keep components small and focused
- Use custom hooks for reusable logic
- Follow React best practices

### Node.js/Express

- Use async/await for asynchronous code
- Proper error handling with try/catch
- Validate input with Zod schemas
- Use middleware for cross-cutting concerns

### Code Style

- Use ES6+ features
- 2 spaces for indentation
- Semicolons required
- Single quotes for strings (except in JSX)
- Trailing commas in multiline objects/arrays

### Naming Conventions

- **Files**: camelCase for utilities, PascalCase for components
- **Components**: PascalCase (e.g., `WhiteboardCanvas.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useBoards.ts`)
- **Functions**: camelCase (e.g., `generateThumbnail`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase (e.g., `BoardMetadata`)

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or tooling changes
- `ci`: CI/CD changes

### Examples

```bash
feat(web): add board export to PDF
fix(api): resolve authentication token expiration issue
docs: update deployment guide for Kubernetes
refactor(shared): consolidate type definitions
perf(api): optimize board thumbnail generation
test(web): add unit tests for board management
chore: update dependencies
```

### Commit Message Guidelines

- Use imperative mood ("add" not "added" or "adds")
- Keep subject line under 72 characters
- Capitalize first letter of subject
- No period at the end of subject
- Separate subject from body with blank line
- Wrap body at 72 characters
- Use body to explain what and why, not how

## 🔄 Pull Request Process

### Before Submitting

1. **Update your fork**
   ```bash
   git remote add upstream https://github.com/original-owner/maplify-tech.git
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, tested code
   - Follow coding guidelines
   - Update documentation

4. **Test your changes**
   ```bash
   pnpm test
   pnpm lint
   pnpm build
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

### Pull Request Template

When creating a PR, include:

**Description**
- What does this PR do?
- Why is this change needed?

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Testing**
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests pass

**Checklist**
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All CI checks pass

**Screenshots** (if applicable)

**Related Issues**
Closes #123

### Review Process

1. At least one maintainer must approve
2. All CI checks must pass
3. No merge conflicts
4. Code review feedback addressed
5. Documentation updated if needed

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm --filter @maplify-tech/web test
pnpm --filter @maplify-tech/api test

# Run tests in watch mode
pnpm test --watch
```

### Integration Tests

```bash
# Start test environment
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
pnpm test:integration
```

### Manual Testing

Before submitting a PR, manually test:

1. **Frontend**
   - Board creation and editing
   - Authentication flow
   - Export/import functionality
   - Theme switching
   - Responsive design

2. **Backend**
   - API endpoints
   - Database migrations
   - File upload to MinIO
   - Error handling

3. **Docker/Kubernetes**
   - Build images successfully
   - Containers start without errors
   - Health checks pass
   - Persistent data survives restarts

## 📚 Additional Resources

- [Architecture Overview](MONOREPO_KUBERNETES_GUIDE.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Kubernetes Guide](KUBERNETES_COMPLETE_GUIDE.md)
- [Security Policy](SECURITY.md)
- [Feature Documentation](FEATURES.md)

## 🙋 Getting Help

- **Documentation**: Check the [docs/](docs/) folder
- **Issues**: Search existing [GitHub Issues](https://github.com/yourusername/maplify-tech/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/yourusername/maplify-tech/discussions)
- **Discord**: Join our community server (link)

## 🎉 Recognition

Contributors will be recognized in:
- [README.md](README.md) Contributors section
- Release notes
- Project documentation

Thank you for contributing to Maplify Tech! 🎨
