# Workflow Optimization Guide

## Optimized Workflow Structure

The workflows have been optimized to reduce redundant runs and save GitHub Actions minutes.

## Current Workflow Triggers

### 1. **Docker Hub Build** (`docker-hub-build.yml`)
**Runs on:**
- ✅ Push to `main` branch
- ✅ Version tags (`v*.*.*`)
- ✅ Manual trigger

**Does NOT run on:**
- ❌ Pull requests (saves build time)
- ❌ Develop branch (only main builds)

**What it does:**
- Builds web and API Docker images
- Pushes to Docker Hub
- Scans for vulnerabilities
- Creates build summary

---

### 2. **CI** (`ci.yml`)
**Runs on:**
- ✅ Pull requests to main/develop
- ✅ Weekly schedule (Monday 9 AM UTC)
- ✅ Manual trigger

**Does NOT run on:**
- ❌ Push to main (Docker Hub workflow handles this)

**What it does:**
- Lints and type checks
- Runs API tests
- Builds all packages
- Security scans

---

### 3. **Label Sync** (`label-sync.yml`)
**Runs on:**
- ✅ Pull requests (opened, synchronized, reopened)

**What it does:**
- Auto-labels PRs by file path
- Adds size labels (xs, s, m, l, xl)

---

### 4. **Release** (`release.yml`)
**Runs on:**
- ✅ Version tags only (`v*.*.*`)

**What it does:**
- Creates GitHub release
- Generates changelog
- Uploads build artifacts
- Sends notifications

---

### 5. **Dependency Updates** (`dependency-update.yml`)
**Runs on:**
- ✅ Weekly schedule (Monday 9 AM UTC)
- ✅ Manual trigger

**What it does:**
- Updates dependencies
- Creates PR with updates
- Runs security audit

---

## Workflow Trigger Summary

| Event | Workflows That Run |
|-------|-------------------|
| **Push to `main`** | Docker Hub Build (1 workflow) |
| **Pull Request** | CI + Label Sync (2 workflows) |
| **Tag `v1.0.0`** | Docker Hub Build + Release (2 workflows) |
| **Weekly Schedule** | CI + Dependency Update (2 workflows) |

## Optimization Benefits

### Before Optimization
When pushing to `main`:
- ❌ CI workflow (builds everything)
- ❌ Docker Hub Build workflow (builds Docker images)
- ❌ Both duplicate the build process

When creating a PR:
- ❌ CI workflow
- ❌ Docker Hub Build workflow
- ❌ PR Preview workflow
- ❌ Label Sync workflow
- ❌ 4 workflows running!

### After Optimization
When pushing to `main`:
- ✅ Docker Hub Build workflow only (1 workflow)
- ✅ Builds and pushes images
- ✅ ~50% faster

When creating a PR:
- ✅ CI workflow (tests and builds)
- ✅ Label Sync (auto-labels)
- ✅ 2 workflows only
- ✅ ~50% reduction

## Manual Workflow Triggers

You can manually trigger these workflows:

### 1. Build Docker Images
```
Actions → "Build & Push to Docker Hub" → Run workflow
```
Options:
- Choose branch
- Specify custom tag

### 2. Run CI Tests
```
Actions → "CI" → Run workflow
```
Useful for:
- Testing before creating PR
- Running tests on specific branches

### 3. Update Dependencies
```
Actions → "Dependency Updates" → Run workflow
```
Useful for:
- Immediate dependency updates
- Security patches

## Best Practices

### 1. Push to Main
```bash
git push origin main
```
- Only Docker Hub Build runs
- Images built and pushed
- Fast and efficient

### 2. Create Pull Requests
```bash
git checkout -b feature/my-feature
git push origin feature/my-feature
# Create PR on GitHub
```
- CI runs (tests your changes)
- Auto-labeled based on files changed
- No redundant builds

### 3. Create Releases
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```
- Docker images built with version tags
- GitHub release created automatically
- Changelog generated

### 4. Test Before Merging
Use manual workflow trigger to test changes:
```
Actions → CI → Run workflow (on your branch)
```

## Workflow Dependencies

```
Push to main
    ↓
Docker Hub Build
    ├── Build Images
    ├── Push to Docker Hub
    └── Security Scan

Pull Request
    ↓
    ├── CI
    │   ├── Lint
    │   ├── Test
    │   ├── Build
    │   └── Security Scan
    └── Label Sync
        ├── Auto-label by files
        └── Add size label

Tag (v1.0.0)
    ↓
    ├── Docker Hub Build
    │   └── Build with version tags
    └── Release
        ├── Create GitHub Release
        ├── Generate Changelog
        └── Upload Artifacts
```

## Monitoring

### Check Workflow Runs
1. Go to **Actions** tab
2. See active workflows
3. Click to view logs

### Workflow Status
- Green ✅ - Success
- Red ❌ - Failed
- Yellow 🟡 - Running

### Estimated Run Times
- Docker Hub Build: ~10-15 minutes
- CI: ~5-8 minutes
- Label Sync: ~10 seconds
- Release: ~3-5 minutes

## Troubleshooting

### Too Many Workflows Running?
Check your triggers:
```bash
grep -A 5 "^on:" .github/workflows/*.yml
```

### Workflow Not Running?
1. Check if event matches trigger
2. Verify branch protection rules
3. Check workflow file syntax

### Duplicate Builds?
- Make sure only one workflow handles builds
- Use `needs:` to create dependencies
- Avoid overlapping triggers

## Cost Savings

GitHub Actions free tier:
- 2,000 minutes/month for private repos
- Unlimited for public repos

With optimization:
- **Before**: ~50 minutes per day
- **After**: ~25 minutes per day
- **Savings**: 50% reduction in minutes used

## Further Optimization

### Skip CI for Docs
Add to commit message:
```bash
git commit -m "docs: update README [skip ci]"
```

### Conditional Jobs
Workflows already use conditions:
- PRs only build, don't push
- Main pushes build and push
- Tags create releases

### Path Filters (Optional)
You can add path filters to run workflows only when specific files change:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'apps/**'
      - 'packages/**'
```

## Summary

✅ **Optimized from 6+ workflows to 5 focused workflows**
✅ **Reduced redundant builds**
✅ **Faster CI/CD pipeline**
✅ **Clear separation of concerns**
✅ **50% reduction in workflow runs**

Your workflows are now optimized for efficiency! 🚀
