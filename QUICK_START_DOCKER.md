# Quick Start - Docker Hub Build

## 🎯 Goal
Automatically build and push Docker images to `rakeshkadam/maplify-tech-web` and `rakeshkadam/maplify-tech-api`

## ⚡ 3-Step Setup

### 1️⃣ Get Docker Hub Token (2 minutes)

```bash
# Go to Docker Hub
open https://hub.docker.com/settings/security

# Create token:
# - Click "New Access Token"
# - Name: "GitHub Actions - Maplify Tech"
# - Permissions: Read, Write, Delete
# - Copy the token (starts with dckr_pat_...)
```

### 2️⃣ Add to GitHub Secrets (1 minute)

```bash
# Go to your GitHub repo
open https://github.com/YOUR_USERNAME/maplify-tech/settings/secrets/actions

# Add secret:
# - Click "New repository secret"
# - Name: DOCKER_HUB_TOKEN
# - Value: [paste token from step 1]
# - Click "Add secret"
```

### 3️⃣ Push to GitHub (1 minute)

```bash
# Add all files
git add .

# Commit
git commit -m "feat: setup Docker Hub automation"

# Push (this triggers the build!)
git push origin main
```

## ✅ Verify Build

```bash
# Check GitHub Actions
# Go to: https://github.com/YOUR_USERNAME/maplify-tech/actions

# After ~10 minutes, pull your images:
docker pull rakeshkadam/maplify-tech-web:latest
docker pull rakeshkadam/maplify-tech-api:latest

# Run the stack
docker-compose -f docker-compose.prod.yml up -d

# Test it
curl http://localhost:3000
curl http://localhost:8787/health
```

## 🎉 Done!

Your images are now automatically built and pushed to Docker Hub whenever you push to `main` or create a tag!

## 🔄 Common Commands

```bash
# Pull latest images
docker pull rakeshkadam/maplify-tech-web:latest
docker pull rakeshkadam/maplify-tech-api:latest

# Run production stack
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop stack
docker-compose -f docker-compose.prod.yml down

# Trigger manual build (GitHub UI)
# Actions → "Build & Push to Docker Hub" → Run workflow
```

## 📦 Available Images

After build completes:

| Service | Image | Pull Command |
|---------|-------|--------------|
| Web | `rakeshkadam/maplify-tech-web:latest` | `docker pull rakeshkadam/maplify-tech-web:latest` |
| API | `rakeshkadam/maplify-tech-api:latest` | `docker pull rakeshkadam/maplify-tech-api:latest` |

## 🏷️ Image Tags

| Push Type | Tag Created |
|-----------|-------------|
| Push to `main` | `latest` |
| Tag `v1.0.0` | `v1.0.0`, `1.0.0`, `1.0`, `1`, `latest` |
| Develop branch | `develop` |

## 🚀 Deploy Anywhere

Once images are on Docker Hub, deploy anywhere:

```bash
# Local
docker-compose -f docker-compose.prod.yml up -d

# Remote server
ssh user@server
docker pull rakeshkadam/maplify-tech-web:latest
docker pull rakeshkadam/maplify-tech-api:latest
docker-compose -f docker-compose.prod.yml up -d

# Kubernetes
kubectl set image deployment/web web=rakeshkadam/maplify-tech-web:latest
kubectl set image deployment/api api=rakeshkadam/maplify-tech-api:latest
```

## 🆘 Troubleshooting

**Build fails with "unauthorized"**
→ Check `DOCKER_HUB_TOKEN` secret is set in GitHub

**Images not on Docker Hub**
→ Wait for GitHub Actions workflow to complete (~10 mins)
→ Check Actions tab for errors

**Can't pull images**
→ Make sure repositories are public on Docker Hub
→ Or login: `docker login` (then enter username/password)

---

**Need detailed docs?** See [DOCKER_HUB_SETUP.md](DOCKER_HUB_SETUP.md)
