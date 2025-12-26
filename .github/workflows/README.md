# GitHub Actions Workflows

This directory contains all GitHub Actions workflows for the Maplify Tech project.

## Workflows Overview

### 1. CI (`ci.yml`)

**Trigger:** Push to `main`/`develop`, Pull Requests

**Purpose:** Continuous Integration - runs tests, linting, and builds

**Jobs:**
- **lint** - Runs linters and type checking
- **test-api** - Runs API tests with PostgreSQL
- **build** - Builds all packages and uploads artifacts
- **security-scan** - Scans for vulnerabilities with Trivy

**Required Secrets:** None (uses default GITHUB_TOKEN)

---

### 2. Docker Hub Build & Push (`docker-hub-build.yml`)

**Trigger:** Push to `main`/`develop`, tags (`v*.*.*`), Pull Requests, Manual

**Purpose:** Builds and pushes Docker images to Docker Hub

**Jobs:**
- **build-and-push** - Builds web and API images, pushes to Docker Hub
- **scan-images** - Scans Docker images for vulnerabilities
- **summary** - Creates build summary with pull commands

**Required Secrets:**
- `DOCKER_HUB_TOKEN` - Docker Hub access token

**Features:**
- Multi-platform builds (amd64, arm64)
- Build caching for faster builds
- Automatic tagging based on git refs
- Security scanning with Trivy
- Updates Docker Hub repository descriptions

**Setup:**
```bash
# Create Docker Hub access token at:
# https://hub.docker.com/settings/security

# Add as secret in GitHub:
# Settings → Secrets → Actions → New repository secret
# Name: DOCKER_HUB_TOKEN
# Value: <your Docker Hub token>
```

**Manual Trigger:**
- Go to Actions → "Build & Push to Docker Hub" → Run workflow
- Optional: specify custom tag

---

### 3. PR Preview (`pr-preview.yml`)

**Trigger:** Pull Request opened, synchronized, reopened

**Purpose:** Provides automated PR reviews and reports

**Jobs:**
- **pr-info** - Posts PR information as comment
- **build-preview** - Builds preview version
- **code-quality** - Posts code quality report
- **size-report** - Compares bundle sizes

**Required Secrets:** None

---

### 4. Release (`release.yml`)

**Trigger:** Tags (`v*.*.*`)

**Purpose:** Creates GitHub releases with changelogs and assets

**Jobs:**
- **create-release** - Creates GitHub release with changelog
- **build-release-assets** - Builds and uploads release artifacts
- **notify-release** - Sends notifications

**Required Secrets:**
- `SLACK_WEBHOOK_URL` - (Optional) For release notifications

**Usage:**
```bash
# Create and push a tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

---

### 5. Dependency Updates (`dependency-update.yml`)

**Trigger:** Weekly (Monday 9 AM UTC), manual trigger

**Purpose:** Automated dependency updates and security audits

**Jobs:**
- **update-dependencies** - Updates all dependencies, creates PR
- **security-audit** - Runs security audit, creates issues if vulnerabilities found

**Required Secrets:** None

---

### 6. Label Sync (`label-sync.yml`)

**Trigger:** Pull Requests

**Purpose:** Automatically labels PRs based on changed files and size

**Jobs:**
- **auto-label** - Labels based on file paths
- **size-label** - Adds size labels (xs, s, m, l, xl)

**Configuration:** `.github/labeler.yml`

---

## Configuration Files

### `dependabot.yml`
Configures Dependabot for automated dependency updates:
- NPM dependencies (root, apps, packages)
- GitHub Actions
- Docker base images

### `labeler.yml`
Defines automatic labeling rules based on file paths:
- `frontend` - apps/web/**
- `backend` - apps/api/**
- `infrastructure` - infrastructure/**
- `documentation` - **.md
- And more...

### Issue Templates

Located in `.github/ISSUE_TEMPLATE/`:
- `bug_report.md` - Bug report template
- `feature_request.md` - Feature request template
- `config.yml` - Issue template configuration

### Pull Request Template

Located at `.github/PULL_REQUEST_TEMPLATE.md`:
- Standardized PR description format
- Checklist for PR authors
- Testing requirements

---

## Setup Instructions

### 1. Required Secrets

Add these secrets in **Settings → Secrets and variables → Actions**:

#### Docker Hub (Required)
```
DOCKER_HUB_TOKEN     - Docker Hub access token
```

#### Optional
```
SLACK_WEBHOOK_URL    - Slack notifications
```

### 2. Enable GitHub Actions

1. Go to **Settings → Actions → General**
2. Under "Workflow permissions", select:
   - "Read and write permissions"
   - "Allow GitHub Actions to create and approve pull requests"

### 3. Enable Dependabot

Dependabot is configured in `dependabot.yml` and will automatically:
- Check for dependency updates weekly
- Create PRs for outdated packages
- Group updates by type (dev/prod)

### 4. Branch Protection

Recommended branch protection rules for `main`:

1. Go to **Settings → Branches → Add rule**
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1+)
   - ✅ Require status checks to pass before merging
     - Select: `Lint & Type Check`, `Build All Apps`
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings

---

## Workflow Status Badges

Add these to your README.md:

```markdown
[![CI](https://github.com/yourusername/maplify-tech/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/maplify-tech/actions/workflows/ci.yml)
[![Docker Hub Build](https://github.com/yourusername/maplify-tech/actions/workflows/docker-hub-build.yml/badge.svg)](https://github.com/yourusername/maplify-tech/actions/workflows/docker-hub-build.yml)
```

---

## Troubleshooting

### Docker Build Fails
- Check Dockerfile syntax
- Verify build context includes required files
- Check Docker layer caching
- Verify `DOCKER_HUB_TOKEN` is set correctly

### Tests Failing
- Ensure PostgreSQL service is running
- Check environment variables
- Verify database migrations

### Dependabot Issues
- Check package.json syntax
- Verify all workspaces are accessible
- Check for conflicting dependencies

### Docker Hub Authentication Fails
- Verify `DOCKER_HUB_TOKEN` secret is set
- Check token has correct permissions (Read, Write, Delete)
- Token should start with `dckr_pat_`

---

## Best Practices

1. **Always test locally before pushing**
   ```bash
   pnpm lint
   pnpm build
   pnpm test
   ```

2. **Use conventional commits**
   ```
   feat: add new feature
   fix: resolve bug
   docs: update documentation
   chore: update dependencies
   ```

3. **Keep workflows fast**
   - Use caching (pnpm, Docker layers)
   - Run jobs in parallel when possible
   - Use workflow artifacts for build outputs

4. **Security**
   - Never commit secrets to code
   - Use GitHub Secrets for sensitive data
   - Regularly update dependencies
   - Review Dependabot PRs promptly

5. **Monitoring**
   - Check workflow runs regularly
   - Set up Slack/Discord notifications
   - Monitor security alerts

6. **Docker Images**
   - Tag releases with semantic versions
   - Use `latest` tag for main branch
   - Test images before deploying to production

---

## Docker Images

Your Docker images are published to Docker Hub:

- **Web Frontend**: `rakeshkadam/maplify-tech-web`
- **API Backend**: `rakeshkadam/maplify-tech-api`

### Pulling Images

```bash
# Pull latest
docker pull rakeshkadam/maplify-tech-web:latest
docker pull rakeshkadam/maplify-tech-api:latest

# Pull specific version
docker pull rakeshkadam/maplify-tech-web:v1.0.0
docker pull rakeshkadam/maplify-tech-api:v1.0.0
```

### Running Images

```bash
# Using production docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Or manually
docker run -p 3000:80 rakeshkadam/maplify-tech-web:latest
docker run -p 8787:8787 rakeshkadam/maplify-tech-api:latest
```

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [Docker Build & Push Action](https://github.com/docker/build-push-action)

---

## Quick Reference

### Trigger Workflows Manually

1. Go to **Actions** tab
2. Select workflow
3. Click **Run workflow**
4. Choose branch and options
5. Click **Run workflow**

### Check Build Status

- **Actions Tab**: See all workflow runs
- **Commit Status**: Green checkmark on commits
- **PR Checks**: Status checks on pull requests

### View Logs

1. Go to **Actions** tab
2. Click on workflow run
3. Click on job name
4. Expand steps to see logs

---

**All workflows are configured and ready to use!** 🚀
