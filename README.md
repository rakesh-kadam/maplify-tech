# Maplify Tech - Self-Hosted Collaborative Whiteboard

<div align="center">

<img src="docs/assets/logo.png" alt="Maplify Tech Logo" width="200"/>

<br/>
<br/>
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Native-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)

**A production-ready, self-hosted whiteboard application built with React and Excalidraw**

🔗 **Live Demo**: [www.maplifytech.com](https://www.maplifytech.com)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🌟 Features

### Core Capabilities
- ✏️ **Full Drawing Tools** - Powered by Excalidraw: shapes, text, arrows, freehand drawing
- 📁 **Multi-Board Management** - Create, rename, duplicate, and organize unlimited boards
- 🔍 **Visual Search** - Find boards instantly with thumbnail previews and tag-based search
- 💾 **Auto-Save** - Never lose work with automatic 5-second saves
- 📤 **Export Options** - PNG, SVG, and native `.drawboard` JSON format
- 📥 **Import/Export** - Share boards or backup your entire workspace
- 🌓 **Theme Support** - Light, dark, and automatic system-based themes
- 🔐 **User Authentication** - Secure JWT-based authentication with bcrypt hashing
- ☁️ **Cloud Storage** - S3-compatible MinIO storage for scalable file management

### Technical Highlights
- ⚡ **Production Ready** - Battle-tested on Kubernetes with auto-scaling
- 🎨 **Modern Stack** - React 18, TypeScript, Vite, Tailwind CSS
- 🗄️ **PostgreSQL Database** - Reliable, scalable relational database
- 📦 **Monorepo Architecture** - Turborepo with pnpm workspaces
- 🐳 **Fully Containerized** - Docker and Kubernetes ready
- 🔄 **Horizontal Scaling** - Auto-scaling with HPA support
- 🛡️ **Security First** - Non-root containers, RBAC, network policies

## 📦 Project Structure

```
drawboard/
├── apps/
│   ├── web/                 # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── hooks/       # Custom hooks
│   │   │   ├── lib/         # API client
│   │   │   └── utils/       # Utilities
│   │   └── Dockerfile
│   │
│   └── api/                 # Node.js + Express backend
│       ├── src/
│       │   ├── routes/      # API endpoints
│       │   ├── middleware/  # Express middleware
│       │   └── lib/         # Auth, DB, storage
│       ├── prisma/          # Database schema
│       └── Dockerfile
│
├── packages/
│   └── shared/              # Shared TypeScript types
│
├── infrastructure/
│   ├── kubernetes/          # K8s manifests
│   └── docker/              # Docker configs
│
└── docs/                    # Documentation
```

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended for Testing)

The fastest way to get started:

```bash
# Clone the repository
git clone https://github.com/yourusername/maplify-tech.git
cd maplify-tech

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Start all services
docker-compose up -d

# Visit http://localhost:3000
```

**What's included:**
- Frontend (React app) → http://localhost:3000
- Backend API → http://localhost:8787
- PostgreSQL database → localhost:5432
- MinIO S3 storage → http://localhost:9000

### Option 2: Local Development

For development with hot-reload:

```bash
# Install dependencies
pnpm install

# Start infrastructure services
docker-compose up -d postgres minio

# Run database migrations
cd apps/api
pnpm prisma migrate dev

# Start development servers (in separate terminals)
pnpm dev  # Starts both frontend and backend
```

- Frontend: http://localhost:5173 (Vite dev server)
- Backend: http://localhost:8787 (with hot-reload)

### Option 3: Kubernetes Deployment

For production or self-hosting:

```bash
# Create local k3d cluster (or use existing cluster)
k3d cluster create maplify-tech --agents 2

# Deploy application
kubectl apply -k infrastructure/kubernetes/base/

# Port forward to access
kubectl port-forward -n maplify-tech svc/maplify-tech-web 3000:80

# Visit http://localhost:3000
```

See [KUBERNETES_COMPLETE_GUIDE.md](KUBERNETES_COMPLETE_GUIDE.md) for detailed instructions.

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│          Users (Browser)                 │
└──────────────┬──────────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────────┐
│         Ingress / Load Balancer          │
│  ┌──────────┐         ┌──────────┐      │
│  │ Frontend │◄───────►│ Backend  │      │
│  │  (Web)   │         │  (API)   │      │
│  │ React    │         │ Node.js  │      │
│  └──────────┘         └─────┬────┘      │
│                             │            │
│                    ┌────────┴────────┐   │
│                    ▼                 ▼   │
│            ┌──────────┐      ┌──────────┐
│            │PostgreSQL│      │  MinIO   │
│            │ Database │      │ Storage  │
│            └──────────┘      └──────────┘
└─────────────────────────────────────────┘
```

## 🎯 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Excalidraw, Tailwind CSS |
| **Backend** | Node.js, Express, Prisma ORM |
| **Database** | PostgreSQL 16 |
| **Storage** | MinIO (S3-compatible) |
| **Authentication** | JWT, bcrypt |
| **State Management** | Zustand |
| **Orchestration** | Kubernetes, Docker Compose |
| **Monorepo** | Turborepo, pnpm workspaces |

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute to the project |
| [FEATURES.md](FEATURES.md) | Detailed feature documentation |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment guide |
| [KUBERNETES_COMPLETE_GUIDE.md](KUBERNETES_COMPLETE_GUIDE.md) | Complete K8s setup guide |
| [SECURITY.md](SECURITY.md) | Security policy and best practices |

## 🔧 Configuration

### Environment Variables

**Frontend (`apps/web/.env`)**
```env
VITE_API_URL=http://localhost:8787
```

**Backend (`apps/api/.env`)**
```env
# Server
NODE_ENV=development
PORT=8787

# Database
DATABASE_URL=postgresql://drawboard:drawboard123@localhost:5432/drawboard

# MinIO Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123

# Authentication
JWT_SECRET=your-secret-key-change-in-production

# CORS
CORS_ORIGIN=http://localhost:5173
```

⚠️ **Important**: Change default secrets in production! See [SECURITY.md](SECURITY.md) for best practices.

## 🐳 Docker

### Build Images

```bash
# Build frontend
docker build -t maplify-tech-web:latest -f apps/web/Dockerfile .

# Build backend
docker build -t maplify-tech-api:latest -f apps/api/Dockerfile .
```

### Push to Registry

```bash
# Tag images
docker tag maplify-tech-web:latest your-registry.com/maplify-tech-web:latest
docker tag maplify-tech-api:latest your-registry.com/maplify-tech-api:latest

# Push to registry
docker push your-registry.com/maplify-tech-web:latest
docker push your-registry.com/maplify-tech-api:latest
```

## ☸️ Kubernetes

### Quick Deploy

```bash
# Create secrets
kubectl create secret generic maplify-tech-secrets \
  --from-literal=JWT_SECRET="$(openssl rand -base64 32)" \
  --from-literal=DATABASE_URL="postgresql://user:pass@postgres:5432/maplify" \
  -n maplify-tech

# Deploy
kubectl apply -k infrastructure/kubernetes/base/

# Check status
kubectl get all -n maplify-tech
```

### Resource Requirements

| Component | Min CPU | Min Memory | Storage |
|-----------|---------|------------|---------|
| Frontend | 100m | 128Mi | - |
| Backend | 200m | 256Mi | - |
| PostgreSQL | 250m | 256Mi | 10Gi |
| MinIO | 500m | 512Mi | 50Gi |
| **Total** | **~1 CPU** | **~1.5GB** | **60GB** |

## 🛡️ Security

- ✅ JWT authentication with secure password hashing
- ✅ HTTPS/TLS support with cert-manager
- ✅ Network policies for pod isolation
- ✅ Non-root container users
- ✅ Resource limits to prevent DoS
- ✅ CORS protection
- ✅ Input validation with Zod schemas

**Found a security issue?** Please report it privately via [SECURITY.md](SECURITY.md)

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Development Workflow

```bash
# Install dependencies
pnpm install

# Run all apps in development
pnpm dev

# Run specific app
pnpm --filter @drawboard/web dev
pnpm --filter @drawboard/api dev

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with amazing open-source projects:

- [Excalidraw](https://excalidraw.com/) - The whiteboard engine
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Prisma](https://www.prisma.io/) - Database ORM
- [MinIO](https://min.io/) - S3-compatible storage
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Kubernetes](https://kubernetes.io/) - Orchestration

## 🌟 Star History

If you find Maplify Tech useful, please consider giving it a star ⭐

## 💬 Community & Support

- 📚 **Documentation**: Check the [docs](docs/) folder
- 🐛 **Bug Reports**: [Open an issue](https://github.com/yourusername/maplify-tech/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Open an issue](https://github.com/yourusername/maplify-tech/issues/new?template=feature_request.md)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/maplify-tech/discussions)

## 🗺️ Roadmap

- [ ] Real-time collaboration
- [ ] Board templates library
- [ ] Mobile app (React Native)
- [ ] Offline-first PWA
- [ ] API webhooks
- [ ] LDAP/OAuth integration
- [ ] Advanced permissions system

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/maplify-tech?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/maplify-tech?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/maplify-tech)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/maplify-tech)

---

<div align="center">

**Made with ❤️ for the self-hosted community**

*Deploy anywhere. Own your data. Scale infinitely.*

[⬆ Back to Top](#maplify-tech---self-hosted-collaborative-whiteboard)

</div>
