# GitHub Workflows Explained

Simple explanations of what each workflow does.

## 1. label-sync.yml - Auto-Label Pull Requests

### What it does
Automatically adds labels to your Pull Requests based on:
- Which files you changed
- How many lines you changed

### When it runs
- ✅ When you create a PR
- ✅ When you push new commits to a PR
- ✅ When you reopen a PR

### Example

**You create a PR that changes:**
```
apps/web/src/App.tsx        (50 lines)
apps/api/src/routes/auth.ts (30 lines)
README.md                   (10 lines)
```

**Labels added automatically:**
- `frontend` (because you changed apps/web/*)
- `backend` (because you changed apps/api/*)
- `documentation` (because you changed *.md)
- `size/s` (because you changed 90 lines total)

### Label Rules

Labels are defined in [.github/labeler.yml](.github/labeler.yml):

| Files Changed | Label Added |
|---------------|-------------|
| apps/web/** | `frontend` |
| apps/api/** | `backend` |
| apps/api/prisma/** | `database` |
| infrastructure/** | `infrastructure` |
| .github/workflows/** | `ci/cd` |
| **/*.md | `documentation` |
| **/package.json | `dependencies` |

### Size Labels

| Lines Changed | Label |
|---------------|-------|
| 0-10 | `size/xs` |
| 11-100 | `size/s` |
| 101-500 | `size/m` |
| 501-1000 | `size/l` |
| 1000+ | `size/xl` |

### Why it's useful
- No manual labeling needed
- Easy to filter PRs by type
- See PR size at a glance
- Better organization

---

## 2. release.yml - Create GitHub Releases

### What it does
Creates a professional GitHub Release with:
- Changelog (what changed)
- Docker pull commands
- Downloadable build files
- Installation instructions
- Slack notification (optional)

### When it runs
Only when you push a **version tag** like `v1.0.0`

### How to use

```bash
# Create a version tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push the tag
git push origin v1.0.0
```

The workflow automatically creates a release!

### What you get

A GitHub Release page that looks like:

```
┌──────────────────────────────────────────────────┐
│ Release v1.0.0                                   │
├──────────────────────────────────────────────────┤
│                                                  │
│ ## What's Changed                                │
│ - feat: add user authentication by @you          │
│ - fix: resolve memory leak by @you               │
│ - docs: update README by @you                    │
│                                                  │
│ ## Docker Images                                 │
│                                                  │
│ Pull the Docker images from Docker Hub:          │
│ ```bash                                          │
│ docker pull rakeshkadam/maplify-tech-web:v1.0.0  │
│ docker pull rakeshkadam/maplify-tech-api:v1.0.0  │
│ ```                                              │
│                                                  │
│ Or use latest:                                   │
│ ```bash                                          │
│ docker pull rakeshkadam/maplify-tech-web:latest  │
│ docker pull rakeshkadam/maplify-tech-api:latest  │
│ ```                                              │
│                                                  │
│ ## Quick Start                                   │
│                                                  │
│ Run with Docker Compose:                         │
│ ```bash                                          │
│ docker-compose -f docker-compose.prod.yml up -d  │
│ ```                                              │
│                                                  │
│ ## Assets                                        │
│ 📦 maplify-tech-web-v1.0.0.tar.gz (Download)     │
│ 📦 maplify-tech-api-v1.0.0.tar.gz (Download)     │
│                                                  │
└──────────────────────────────────────────────────┘
```

### The 3 Jobs

**Job 1: Create Release**
- Extracts version from tag (v1.0.0 → 1.0.0)
- Generates changelog from recent commits
- Creates the GitHub Release

**Job 2: Build Assets**
- Builds web and API packages
- Creates downloadable .tar.gz archives
- Uploads them to the release

**Job 3: Notify (Optional)**
- Sends Slack notification about the release
- Requires `SLACK_WEBHOOK_URL` secret

### Tag Naming

The workflow recognizes these tag patterns:

| Tag | Type | Pre-release? |
|-----|------|--------------|
| `v1.0.0` | Production | No |
| `v1.0.0-beta.1` | Beta | Yes |
| `v1.0.0-rc.1` | Release Candidate | Yes |
| `v1.0.0-alpha.1` | Alpha | Yes |

### Why it's useful
- Professional release notes automatically
- Users can download specific versions
- Clear Docker pull commands
- Track what changed in each version

---

## Quick Comparison

| Feature | label-sync.yml | release.yml |
|---------|---------------|-------------|
| **Trigger** | Pull Requests | Version Tags |
| **Frequency** | Every PR | When you create a release |
| **Manual Action** | None | Push a tag |
| **Result** | Labeled PRs | GitHub Release |
| **Purpose** | Organization | Distribution |

---

## Do I Need These?

### label-sync.yml
**Keep it if:**
- ✅ You use PRs for development
- ✅ You want organized PRs
- ✅ You have multiple contributors

**Remove it if:**
- ❌ You don't use PRs
- ❌ You manually label everything
- ❌ Small solo project

### release.yml
**Keep it if:**
- ✅ You want professional releases
- ✅ You version your software
- ✅ You have users downloading releases

**Remove it if:**
- ❌ You don't create releases
- ❌ You only use Docker images
- ❌ Development/testing only

---

## How to Remove Them

If you don't need these workflows:

```bash
# Remove label sync
rm .github/workflows/label-sync.yml
rm .github/labeler.yml

# Remove releases
rm .github/workflows/release.yml

# Commit the changes
git add .github/
git commit -m "ci: remove unused workflows"
git push
```

---

## Common Questions

### Q: Can I customize the labels?
**A:** Yes! Edit [.github/labeler.yml](.github/labeler.yml)

### Q: Can I change PR size thresholds?
**A:** Yes! Edit the `xs_max_size`, `s_max_size`, etc. in label-sync.yml

### Q: Do I need Slack for releases?
**A:** No, it's optional. The workflow continues without it.

### Q: Can I manually create releases?
**A:** Yes, but the workflow automates it for you.

### Q: What if I don't want changelog?
**A:** You can remove the changelog generator step from release.yml

---

## Summary

**label-sync.yml**: Automatically organizes your PRs with labels
**release.yml**: Creates professional GitHub releases when you tag versions

Both are optional but helpful for maintaining a professional project! 🚀
