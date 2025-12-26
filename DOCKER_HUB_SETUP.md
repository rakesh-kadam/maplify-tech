# Docker Hub Setup Guide

This guide will help you set up automated Docker image builds and pushes to Docker Hub using GitHub Actions.

## 🎯 Overview

Your Docker images will be published to:
- **Web Frontend**: `rakeshkadam/maplify-tech-web`
- **API Backend**: `rakeshkadam/maplify-tech-api`

## 📋 Prerequisites

1. Docker Hub account (username: `rakeshkadam`)
2. GitHub repository with the code
3. Docker Hub Access Token

## 🔑 Step 1: Create Docker Hub Access Token

1. **Log in to Docker Hub**: https://hub.docker.com/
2. Go to **Account Settings** → **Security**
3. Click **New Access Token**
4. Fill in the details:
   - **Description**: `GitHub Actions - Maplify Tech`
   - **Permissions**: `Read, Write, Delete`
5. Click **Generate**
6. **COPY THE TOKEN** - you won't see it again!
   - It will look like: `dckr_pat_xxxxxxxxxxxxxxxxxxxxx`

## 🔐 Step 2: Add Token to GitHub Secrets

1. Go to your GitHub repository: https://github.com/yourusername/maplify-tech
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the secret:
   - **Name**: `DOCKER_HUB_TOKEN`
   - **Value**: (paste the token you copied from Docker Hub)
5. Click **Add secret**

## ✅ Step 3: Verify Setup

Check that you have:
- ✅ Docker Hub account
- ✅ Access token created
- ✅ GitHub secret `DOCKER_HUB_TOKEN` added

## 🚀 Step 4: Trigger the Build

### Option A: Automatic Build (Push to Main)

Simply push to the main branch:

```bash
git add .
git commit -m "feat: setup Docker Hub builds"
git push origin main
```

This will automatically:
1. Build both web and API images
2. Push them to Docker Hub
3. Tag them as `latest` and with the commit SHA

### Option B: Manual Build (Workflow Dispatch)

1. Go to **Actions** tab in GitHub
2. Select **"Build & Push to Docker Hub"** workflow
3. Click **Run workflow**
4. Choose branch (usually `main`)
5. Optional: Enter custom tag (default: `latest`)
6. Click **Run workflow**

### Option C: Tag Release

Create a version tag:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

This will create images tagged as:
- `v1.0.0`
- `1.0.0`
- `1.0`
- `1`
- `latest`

## 📦 Step 5: Use the Images

### Pull Images

Once the workflow completes, pull your images:

```bash
docker pull rakeshkadam/maplify-tech-web:latest
docker pull rakeshkadam/maplify-tech-api:latest
```

### Run with Docker Compose

Use the production compose file:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Or update your existing `docker-compose.yml`:

```yaml
services:
  api:
    image: rakeshkadam/maplify-tech-api:latest
    # ... rest of config

  web:
    image: rakeshkadam/maplify-tech-web:latest
    # ... rest of config
```

## 🔍 Verify Build Status

### Check GitHub Actions

1. Go to **Actions** tab
2. Look for the latest workflow run
3. Check that all jobs are green ✅

### Check Docker Hub

1. Go to https://hub.docker.com/u/rakeshkadam
2. You should see:
   - `rakeshkadam/maplify-tech-web`
   - `rakeshkadam/maplify-tech-api`

### Test the Images

```bash
# Pull the images
docker pull rakeshkadam/maplify-tech-web:latest
docker pull rakeshkadam/maplify-tech-api:latest

# Run the stack
docker-compose -f docker-compose.prod.yml up -d

# Check if services are running
docker ps

# Test the application
curl http://localhost:8787/health    # API health check
curl http://localhost:3000           # Web frontend
```

## 📊 Workflow Details

The workflow runs when:
- ✅ Push to `main` or `develop` branches
- ✅ Pull requests to `main`
- ✅ New tags (e.g., `v1.0.0`)
- ✅ Manual trigger via GitHub Actions UI

The workflow:
1. **Builds** both web and API Docker images
2. **Scans** for security vulnerabilities
3. **Pushes** to Docker Hub
4. **Tags** appropriately based on trigger type
5. **Updates** Docker Hub repository descriptions
6. **Creates** a build summary

## 🏷️ Image Tags

Images are tagged based on how they're triggered:

| Trigger | Tags Created |
|---------|--------------|
| Push to `main` | `latest`, `main-<sha>` |
| Push to `develop` | `develop`, `develop-<sha>` |
| Tag `v1.2.3` | `v1.2.3`, `1.2.3`, `1.2`, `1`, `latest` |
| Pull Request | `pr-<number>` |
| Manual trigger | Custom tag + `latest` |

## 🔒 Security Scanning

The workflow automatically scans images for vulnerabilities using Trivy.

View scan results:
1. Go to **Actions** tab
2. Click on workflow run
3. Check the **Scan Docker Images** job
4. Review any CRITICAL or HIGH severity vulnerabilities

## 🛠️ Troubleshooting

### Build Fails: "unauthorized: authentication required"

**Solution**: Check that `DOCKER_HUB_TOKEN` secret is set correctly.

```bash
# GitHub → Settings → Secrets → Actions
# Verify DOCKER_HUB_TOKEN exists
```

### Build Fails: "manifest unknown"

**Solution**: Create the repositories on Docker Hub first (they'll be created automatically on first push, but you can pre-create them).

1. Go to https://hub.docker.com/
2. Click **Create Repository**
3. Name: `maplify-tech-web`
4. Visibility: Public
5. Repeat for `maplify-tech-api`

### Build is Slow

**Solution**: The workflow uses layer caching. First build is slow, subsequent builds are faster.

### Images Not Appearing on Docker Hub

**Solution**:
1. Check workflow completed successfully
2. Verify Docker Hub username in workflow matches yours
3. Check that repositories are public

## 📝 Best Practices

### 1. Use Semantic Versioning

```bash
# Major release (breaking changes)
git tag -a v2.0.0 -m "Major release"

# Minor release (new features)
git tag -a v1.1.0 -m "New features"

# Patch release (bug fixes)
git tag -a v1.0.1 -m "Bug fixes"
```

### 2. Tag Production Releases

Always tag production deployments:

```bash
git tag -a v1.0.0 -m "Production release 1.0.0"
git push origin v1.0.0
```

### 3. Test Before Pushing

```bash
# Build locally first
docker build -f apps/web/Dockerfile -t test-web .
docker build -f apps/api/Dockerfile -t test-api .

# Test locally
docker-compose up -d

# Then push to GitHub
git push origin main
```

### 4. Monitor Build Times

- First build: ~10-15 minutes
- Cached builds: ~3-5 minutes

### 5. Keep Token Secure

- ❌ Never commit tokens to code
- ❌ Never share tokens publicly
- ✅ Store only in GitHub Secrets
- ✅ Rotate tokens periodically (every 6 months)

## 🔄 Updating Images

### Regular Updates

```bash
# Make your changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Images are automatically rebuilt and pushed
```

### Forced Rebuild

If you need to rebuild without code changes:

1. Go to **Actions** tab
2. Select **"Build & Push to Docker Hub"**
3. Click **Run workflow**
4. Click **Run workflow** button

## 📚 Additional Resources

- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build & Push Action](https://github.com/docker/build-push-action)

## 🎉 Success!

Once you see the green checkmark ✅ in GitHub Actions, your images are live on Docker Hub!

Test them:

```bash
# Pull from Docker Hub
docker pull rakeshkadam/maplify-tech-web:latest
docker pull rakeshkadam/maplify-tech-api:latest

# Run the application
docker-compose -f docker-compose.prod.yml up -d

# Access the app
open http://localhost:3000
```

## 📞 Need Help?

- Check workflow logs in GitHub Actions
- Review [.github/workflows/docker-hub-build.yml](.github/workflows/docker-hub-build.yml)
- Open an issue on GitHub

---

**Ready to build?** Follow the steps above and push to GitHub! 🚀
