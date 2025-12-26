# GitHub Actions Quick Reference

## What Runs When?

### Push to `main` branch
```bash
git push origin main
```
**Workflows:**
- ✅ Docker Hub Build (builds & pushes images)

**Time:** ~10-15 minutes

---

### Create Pull Request
```bash
git push origin feature/my-feature
# Then create PR on GitHub
```
**Workflows:**
- ✅ CI (lint, test, build)
- ✅ Label Sync (auto-labels PR)

**Time:** ~5-8 minutes

---

### Create Release Tag
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```
**Workflows:**
- ✅ Docker Hub Build (builds with version tags)
- ✅ Release (creates GitHub release)

**Time:** ~10-15 minutes

---

### Weekly (Automatic)
**Monday 9 AM UTC:**
- ✅ CI (weekly tests)
- ✅ Dependency Update (check for updates)

---

## Manual Triggers

### Build Docker Images Now
1. Go to **Actions** tab
2. Click **"Build & Push to Docker Hub"**
3. Click **"Run workflow"**
4. Select branch (usually `main`)
5. Optional: Enter custom tag
6. Click **"Run workflow"**

### Run Tests Now
1. Go to **Actions** tab
2. Click **"CI"**
3. Click **"Run workflow"**
4. Select branch
5. Click **"Run workflow"**

### Update Dependencies Now
1. Go to **Actions** tab
2. Click **"Dependency Updates"**
3. Click **"Run workflow"**
4. Click **"Run workflow"**

---

## Workflow Summary

| Workflow | Triggers | Purpose |
|----------|----------|---------|
| **docker-hub-build.yml** | Push to main, tags, manual | Build & push Docker images |
| **ci.yml** | PRs, weekly, manual | Test, lint, build |
| **label-sync.yml** | PRs | Auto-label PRs |
| **release.yml** | Tags only | Create releases |
| **dependency-update.yml** | Weekly, manual | Update dependencies |

---

## Skip CI

Add `[skip ci]` to commit message to skip workflows:

```bash
git commit -m "docs: update README [skip ci]"
```

---

## Check Workflow Status

### In Terminal
```bash
# Install GitHub CLI
gh workflow list

# View runs
gh run list

# View specific run
gh run view
```

### In Browser
1. Go to repository
2. Click **Actions** tab
3. See all workflows and runs

---

## Common Scenarios

### Scenario 1: Quick Fix
```bash
git checkout -b fix/typo
# Make changes
git commit -m "fix: correct typo"
git push origin fix/typo
# Create PR → CI runs
# Merge PR → Docker builds
```

### Scenario 2: New Feature
```bash
git checkout -b feature/awesome
# Make changes
git commit -m "feat: add awesome feature"
git push origin feature/awesome
# Create PR → CI runs + Labels
# Get approval
# Merge → Docker builds
# Tag release → Release created
```

### Scenario 3: Emergency Hotfix
```bash
git checkout -b hotfix/critical
# Fix the bug
git commit -m "fix: critical bug"
git push origin hotfix/critical
# Skip PR if needed (not recommended)
git checkout main
git merge hotfix/critical
git push origin main
# → Docker builds immediately
```

---

## Troubleshooting

### Workflow not running?
Check:
- ✅ Workflow file syntax is correct
- ✅ Branch name matches trigger
- ✅ No `[skip ci]` in commit message

### Workflow failed?
1. Go to Actions tab
2. Click on failed workflow
3. Expand failed job
4. Read error message
5. Fix and push again

### Need to re-run?
1. Go to failed workflow run
2. Click **"Re-run failed jobs"**
3. Or click **"Re-run all jobs"**

---

## Best Practices

✅ **Always create PRs** - Let CI test before merging
✅ **Tag releases** - Use semantic versioning (v1.0.0)
✅ **Review weekly updates** - Check dependency update PRs
✅ **Monitor Actions tab** - Keep an eye on workflow health
✅ **Use manual triggers** - For testing before PR

---

## Quick Links

- [Workflow Optimization Guide](.github/WORKFLOW_OPTIMIZATION.md)
- [Setup Guide](.github/SETUP.md)
- [Workflows README](.github/workflows/README.md)
- [Docker Hub Setup](../DOCKER_HUB_SETUP.md)

---

**Questions?** Check the documentation or open an issue! 🚀
