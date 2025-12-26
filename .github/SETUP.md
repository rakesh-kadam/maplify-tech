# GitHub Actions Setup Guide

This guide will help you set up GitHub Actions for the Maplify Tech project.

## Quick Start

### 1. Enable GitHub Actions

GitHub Actions is enabled by default, but verify:

1. Go to **Settings → Actions → General**
2. Under "Actions permissions", select:
   - ✅ "Allow all actions and reusable workflows"
3. Under "Workflow permissions", select:
   - ✅ "Read and write permissions"
   - ✅ "Allow GitHub Actions to create and approve pull requests"
4. Click **Save**

### 2. Configure Docker Hub Secret

Add the Docker Hub token in **Settings → Secrets and variables → Actions → New repository secret**:

#### Required for Docker Builds

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `DOCKER_HUB_TOKEN` | Docker Hub access token | Go to https://hub.docker.com/settings/security → New Access Token |

#### Optional

| Secret Name | Description | Required For |
|-------------|-------------|--------------|
| `SLACK_WEBHOOK_URL` | Slack webhook URL | Release notifications |

### 3. Create Docker Hub Access Token

```bash
# Go to Docker Hub
# https://hub.docker.com/settings/security

# 1. Click "New Access Token"
# 2. Description: "GitHub Actions - Maplify Tech"
# 3. Permissions: Read, Write, Delete
# 4. Click "Generate"
# 5. COPY THE TOKEN (starts with dckr_pat_...)
```

Then add it as `DOCKER_HUB_TOKEN` secret in GitHub.

## Workflows Explained

### Automatic Triggers

| Workflow | When It Runs |
|----------|--------------|
| **CI** | Every push to main/develop, every PR |
| **Docker Hub Build** | Every push to main/develop, every tag, PRs, or manual |
| **PR Preview** | Every PR |
| **Release** | When you push a tag like `v1.0.0` |
| **Dependency Update** | Every Monday at 9 AM UTC |
| **Label Sync** | Every PR |

### Manual Triggers

Some workflows can be triggered manually:

1. Go to **Actions** tab
2. Select workflow (e.g., "Build & Push to Docker Hub")
3. Click **Run workflow**
4. Choose options (e.g., custom tag)
5. Click **Run workflow**

## First Build

### Step 1: Push Your Code

```bash
git add .
git commit -m "feat: initial setup with GitHub Actions"
git push origin main
```

This will trigger:
- ✅ CI workflow (tests, linting, builds)
- ✅ Docker Hub Build workflow (builds and pushes images)

### Step 2: Verify CI Passes

1. Go to **Actions** tab
2. Check that CI workflow is green ✅
3. Check that Docker images are built and pushed to Docker Hub

### Step 3: Pull and Test Images

After the workflow completes (~10-15 minutes):

```bash
# Pull your images
docker pull rakeshkadam/maplify-tech-web:latest
docker pull rakeshkadam/maplify-tech-api:latest

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Test the application
curl http://localhost:3000
curl http://localhost:8787/health
```

### Step 4: Create Your First Release

```bash
# Tag your release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

This will:
- ✅ Build Docker images with `v1.0.0` tag
- ✅ Create GitHub Release with changelog
- ✅ Upload build artifacts
- ✅ Send Slack notification (if configured)

## Branch Protection

Protect your `main` branch:

1. Go to **Settings → Branches → Add rule**
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 1
   - ✅ Require status checks to pass:
     - `Lint & Type Check`
     - `Build All Apps`
   - ✅ Require conversation resolution
   - ✅ Require linear history
4. Click **Create**

## Notifications

### Slack Notifications (Optional)

1. Create Slack webhook:
   - Go to Slack → Apps → Incoming Webhooks
   - Create new webhook
   - Copy URL

2. Add to GitHub:
   - Settings → Secrets → New secret
   - Name: `SLACK_WEBHOOK_URL`
   - Value: (paste webhook URL)

## Troubleshooting

### Docker Build Fails

Common issues:
- ✅ Check Dockerfile exists in `apps/web/` and `apps/api/`
- ✅ Verify `DOCKER_HUB_TOKEN` is set correctly
- ✅ Check for syntax errors in Dockerfile

### Docker Hub Authentication Fails

- ✅ Verify `DOCKER_HUB_TOKEN` secret is set
- ✅ Check token has correct permissions (Read, Write, Delete)
- ✅ Token should start with `dckr_pat_`

## Checklist

Use this checklist to verify your setup:

- [ ] GitHub Actions enabled
- [ ] Workflow permissions set to "Read and write"
- [ ] `DOCKER_HUB_TOKEN` secret added
- [ ] Branch protection enabled for `main`
- [ ] First Docker build successful
- [ ] CI workflow passing
- [ ] Docker images on Docker Hub
- [ ] Dependabot enabled

---

**You're all set!** Your GitHub Actions pipeline is ready to use. 🚀
