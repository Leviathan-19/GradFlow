# Branch Synchronization Guide

## Problem

Your `Dev` branch has 73 commits and `QA` branch has only 50 commits. They are not synchronized.

## Solution: Merge Dev into QA

### Option 1: Merge via Git Commands (Recommended)

**For PowerShell (Windows):**
```powershell
# 1. Make sure you're on QA branch
git checkout QA

# 2. Pull latest changes from remote QA
git pull origin QA

# 3. Merge Dev into QA
git merge Dev

# 4. If there are conflicts, resolve them, then:
git add .
git commit -m "Merge Dev into QA - sync branches"

# 5. Push to remote QA
git push origin QA
```

**For Bash/Linux/Mac:**
```bash
# 1. Make sure you're on QA branch
git checkout QA

# 2. Pull latest changes from remote QA
git pull origin QA

# 3. Merge Dev into QA
git merge Dev

# 4. If there are conflicts, resolve them, then:
git add .
git commit -m "Merge Dev into QA - sync branches"

# 5. Push to remote QA
git push origin QA
```

**One-liner (PowerShell):**
```powershell
git checkout QA; git pull origin QA; git merge Dev; git push origin QA
```

**One-liner (Bash):**
```bash
git checkout QA && git pull origin QA && git merge Dev && git push origin QA
```

### Option 2: Merge via GitHub Web Interface

1. Go to your repository on GitHub
2. Click on **Pull requests** tab
3. Click **New pull request**
4. Set:
   - **base:** `QA` (where you want to merge TO)
   - **compare:** `Dev` (what you want to merge FROM)
5. Click **Create pull request**
6. Review changes
7. Click **Merge pull request**
8. Click **Confirm merge**

### Option 3: Force Sync QA with Dev (⚠️ Use with caution)

**Warning:** This will overwrite QA with Dev completely. Only use if you're sure QA doesn't have important changes.

**PowerShell:**
```powershell
# 1. Make sure you're on QA branch
git checkout QA

# 2. Reset QA to match Dev exactly
git reset --hard Dev

# 3. Force push (⚠️ This overwrites remote QA)
git push origin QA --force
```

**Bash:**
```bash
# 1. Make sure you're on QA branch
git checkout QA

# 2. Reset QA to match Dev exactly
git reset --hard Dev

# 3. Force push (⚠️ This overwrites remote QA)
git push origin QA --force
```

## After Merging

Once branches are synchronized:

1. **Verify commits are equal:**
   ```powershell
   # PowerShell
   (git log --oneline Dev).Count
   (git log --oneline QA).Count
   ```
   
   ```bash
   # Bash
   git log --oneline Dev | wc -l  # Should show same number
   git log --oneline QA | wc -l   # Should show same number
   ```

2. **Push to QA** to trigger workflows:
   ```powershell
   git checkout QA
   git push origin QA
   ```

## Manual Workflow Execution

Even if branches are synchronized, you can manually trigger workflows for first-time setup:

### Via GitHub Web Interface

1. Go to your repository on GitHub
2. Click on **Actions** tab
3. Select the workflow you want to run (e.g., "Build & Push Users Domain")
4. Click **Run workflow** button (top right)
5. Select branch: `QA`
6. Check **"Build all services regardless of changes"** checkbox
7. Click **Run workflow**

### Via GitHub CLI

```bash
# Install GitHub CLI if not installed
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: sudo apt install gh

# Login
gh auth login

# Run workflow manually
gh workflow run "Build & Push Users Domain" `
  --ref QA `
  -f build_all=true

gh workflow run "Build & Push Auth Domain" `
  --ref QA `
  -f build_all=true

gh workflow run "Build & Push File Service Domain" `
  --ref QA `
  -f build_all=true

gh workflow run "Build & Push API Gateway" `
  --ref QA `
  -f build_all=true
```

**Note:** In PowerShell, use backticks (`) for line continuation instead of backslashes (\).

### Via API

**PowerShell:**
```powershell
# Get your GitHub token from Settings > Developer settings > Personal access tokens
$GITHUB_TOKEN = "your-token"
$REPO = "your-username/your-repo"

# Run Users workflow
Invoke-RestMethod -Method Post `
  -Uri "https://api.github.com/repos/$REPO/actions/workflows/users.yml/dispatches" `
  -Headers @{
    "Authorization" = "token $GITHUB_TOKEN"
    "Accept" = "application/vnd.github.v3+json"
  } `
  -Body (@{
    ref = "QA"
    inputs = @{
      build_all = "true"
    }
  } | ConvertTo-Json)
```

**Bash:**
```bash
# Get your GitHub token from Settings > Developer settings > Personal access tokens
GITHUB_TOKEN="your-token"
REPO="your-username/your-repo"

# Run Users workflow
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$REPO/actions/workflows/users.yml/dispatches \
  -d '{"ref":"QA","inputs":{"build_all":"true"}}'
```

## Workflow Behavior

### Automatic Execution (on push)

- ✅ Only runs if files in specific paths changed
- ✅ Only builds services that changed
- ✅ Efficient - saves build time

### Manual Execution (workflow_dispatch)

- ✅ Can run anytime, even without changes
- ✅ Option to build all services (`build_all: true`)
- ✅ Useful for first-time setup
- ✅ Useful for rebuilding everything

## First-Time Setup Workflow

1. **Synchronize branches:**
   ```powershell
   # PowerShell
   git checkout QA
   git pull origin QA
   git merge Dev
   git push origin QA
   ```

2. **Manually trigger all workflows:**
   - Go to GitHub Actions
   - Run each workflow with `build_all: true`
   - Or use GitHub CLI/API as shown above

3. **Verify builds:**
   - Check Docker Hub for images
   - Verify all services were built

## Troubleshooting

### Branches still not synchronized?

**PowerShell:**
```powershell
# Check commit differences
git log Dev..QA --oneline  # Commits in Dev but not in QA
git log QA..Dev --oneline  # Commits in QA but not in Dev

# See branch divergence
git log --oneline --graph --all --decorate
```

**Bash:**
```bash
# Check commit differences
git log Dev..QA --oneline  # Commits in Dev but not in QA
git log QA..Dev --oneline  # Commits in QA but not in Dev

# See branch divergence
git log --oneline --graph --all --decorate
```

### Workflow not running?

1. **Check workflow file syntax:**
   - Go to Actions tab
   - Look for syntax errors

2. **Check branch name:**
   - Workflows trigger on `QA` branch
   - Make sure you're pushing to correct branch

3. **Check path filters:**
   - If using `paths:` filter, make sure files changed match
   - Use `build_all: true` for manual execution

### Workflow runs but doesn't build?

- Check if `build_all` input is set to `true`
- Check if path filters match changed files
- Check workflow logs for errors

## Best Practices

1. **Keep branches synchronized:**
   - Merge Dev → QA regularly
   - Don't let branches diverge too much

2. **Use manual execution for:**
   - First-time setup
   - Rebuilding everything
   - Testing workflows

3. **Use automatic execution for:**
   - Regular development
   - Only building what changed
   - Faster CI/CD cycles

4. **Branch strategy:**
   ```
   Dev (development) → QA (testing) → Main (production)
   ```

## Summary

1. **Sync branches:** 
   - PowerShell: `git checkout QA; git pull origin QA; git merge Dev; git push origin QA`
   - Bash: `git checkout QA && git pull origin QA && git merge Dev && git push origin QA`
2. **Manual execution:** Use GitHub Actions UI with `build_all: true`
3. **Automatic execution:** Happens on push if paths match
4. **First-time setup:** Merge branches, then manually trigger all workflows
