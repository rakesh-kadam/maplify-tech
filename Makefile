.PHONY: help install dev build clean docker-build docker-up docker-down docker-logs k8s-deploy k8s-delete k8s-status test lint

# Default target
help:
	@echo "DrawBoard - Available Commands"
	@echo "================================"
	@echo ""
	@echo "Development:"
	@echo "  make install      - Install all dependencies"
	@echo "  make dev          - Run all apps in development mode"
	@echo "  make build        - Build all apps for production"
	@echo "  make lint         - Run linting across all packages"
	@echo "  make test         - Run tests"
	@echo "  make clean        - Clean build artifacts and dependencies"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build - Build Docker images"
	@echo "  make docker-up    - Start all services with Docker Compose"
	@echo "  make docker-down  - Stop all Docker services"
	@echo "  make docker-logs  - View Docker logs"
	@echo ""
	@echo "Kubernetes:"
	@echo "  make k8s-deploy   - Deploy to Kubernetes"
	@echo "  make k8s-delete   - Delete from Kubernetes"
	@echo "  make k8s-status   - Check Kubernetes deployment status"
	@echo ""

# Development commands
install:
	@echo "📦 Installing dependencies..."
	pnpm install

dev:
	@echo "🚀 Starting development servers..."
	pnpm dev

build:
	@echo "🏗️  Building for production..."
	pnpm build

lint:
	@echo "🔍 Running linters..."
	pnpm lint

test:
	@echo "🧪 Running tests..."
	pnpm test

clean:
	@echo "🧹 Cleaning build artifacts..."
	pnpm clean
	find . -name "node_modules" -type d -prune -exec rm -rf {} +
	find . -name "dist" -type d -prune -exec rm -rf {} +
	find . -name ".turbo" -type d -prune -exec rm -rf {} +

# Docker commands
docker-build:
	@echo "🐳 Building Docker images..."
	docker-compose build

docker-up:
	@echo "🐳 Starting Docker services..."
	docker-compose up -d
	@echo "✅ Services started:"
	@echo "   - Frontend: http://localhost:3000"
	@echo "   - API: http://localhost:8787"
	@echo "   - MinIO Console: http://localhost:9001"

docker-down:
	@echo "🐳 Stopping Docker services..."
	docker-compose down

docker-logs:
	@echo "📋 Viewing Docker logs..."
	docker-compose logs -f

docker-clean:
	@echo "🧹 Cleaning Docker resources..."
	docker-compose down -v
	docker system prune -f

# Kubernetes commands
k8s-deploy:
	@echo "☸️  Deploying to Kubernetes..."
	kubectl apply -k infrastructure/kubernetes/base/
	@echo "✅ Deployment complete. Check status with: make k8s-status"

k8s-delete:
	@echo "☸️  Deleting from Kubernetes..."
	kubectl delete -k infrastructure/kubernetes/base/

k8s-status:
	@echo "☸️  Kubernetes deployment status:"
	kubectl get all -n drawboard

k8s-logs:
	@echo "📋 Viewing Kubernetes logs:"
	kubectl logs -f -l app.kubernetes.io/name=drawboard -n drawboard

k8s-port-forward:
	@echo "🔗 Setting up port forwarding..."
	@echo "Frontend will be available at http://localhost:3000"
	kubectl port-forward -n drawboard svc/drawboard-web 3000:80

# Database commands
db-migrate:
	@echo "🗄️  Running database migrations..."
	cd apps/api && pnpm prisma:migrate

db-studio:
	@echo "🎨 Opening Prisma Studio..."
	cd apps/api && pnpm prisma:studio

db-seed:
	@echo "🌱 Seeding database..."
	cd apps/api && pnpm prisma db seed

# Local Kubernetes (k3d) commands
k3d-create:
	@echo "🏗️  Creating local k3d cluster..."
	k3d cluster create drawboard --agents 2

k3d-delete:
	@echo "🗑️  Deleting local k3d cluster..."
	k3d cluster delete drawboard

k3d-deploy: k3d-create k8s-deploy
	@echo "✅ Deployed to local k3d cluster"
