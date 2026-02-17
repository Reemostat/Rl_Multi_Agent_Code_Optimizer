# GitHub Setup Guide

This guide will help you safely push your project to GitHub without exposing private files.

## Step 1: Verify Your .gitignore

Your `.gitignore` file is already configured to exclude:
- ✅ Environment files (`.env`, `.env.local`, etc.)
- ✅ Virtual environments (`venv/`, `node_modules/`)
- ✅ Build outputs (`.next/`, `dist/`, etc.)
- ✅ RL checkpoints and logs
- ✅ IDE and OS files

**Before proceeding, double-check that you don't have any `.env files committed:**
```bash
cd rl-code-agent
git status
```

If you see any `.env` files listed, they need to be removed from git history (see Step 3).

## Step 2: Initialize Git Repository (if not already done)

```bash
cd /Users/rishitmaheshwari/Desktop/rlproject/rl-code-agent

# Initialize git if not already done
git init

# Check current status
git status
```

## Step 3: Remove Any Committed Private Files

If you've previously committed `.env` files or other sensitive data:

```bash
# Remove .env files from git tracking (but keep local files)
git rm --cached backend/.env 2>/dev/null || true
git rm --cached frontend/.env.local 2>/dev/null || true
git rm --cached .env 2>/dev/null || true

# Remove any other sensitive files
git rm --cached -r venv/ 2>/dev/null || true
git rm --cached -r node_modules/ 2>/dev/null || true

# Commit the removal
git commit -m "Remove sensitive files from git tracking"
```

## Step 4: Create .env.example Files (Already Created)

The `.env.example` files have been created for you:
- `backend/.env.example` - Shows required backend environment variables
- `frontend/.env.example` - Shows required frontend environment variables

These are safe to commit as they don't contain actual secrets.

## Step 5: Stage and Commit Your Code

```bash
# Add all files (respecting .gitignore)
git add .

# Review what will be committed
git status

# Commit
git commit -m "Initial commit: RL Code Agent project"
```

## Step 6: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name your repository (e.g., `rl-code-agent`)
4. **DO NOT** initialize with README, .gitignore, or license (you already have these)
5. Click "Create repository"

## Step 7: Connect and Push

```bash
# Add your GitHub repository as remote
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 8: Verify Nothing Sensitive Was Committed

After pushing, check your GitHub repository:
1. Visit your repository on GitHub
2. Search for `.env` - you should NOT find any `.env` files
3. Check that `backend/.env.example` and `frontend/.env.example` exist (these are safe)

## Security Checklist

Before pushing, ensure:
- [ ] No `.env` files are in the repository
- [ ] No API keys or secrets in code files
- [ ] `venv/` and `node_modules/` are excluded
- [ ] `.env.example` files exist (template only, no real values)
- [ ] `.gitignore` is properly configured

## If You Accidentally Committed Secrets

If you've already pushed secrets to GitHub:

1. **Immediately rotate/regenerate all exposed secrets:**
   - Regenerate OpenAI API key
   - Regenerate Supabase service role key
   - Update all environment variables

2. **Remove from git history:**
   ```bash
   # Use git filter-branch or BFG Repo-Cleaner
   # This is complex - consider using GitHub's secret scanning
   ```

3. **Enable GitHub Secret Scanning:**
   - Go to repository Settings → Security → Secret scanning
   - Enable secret scanning alerts

## Next Steps

After your code is on GitHub:
1. Set up environment variables on your hosting platform (see `DEPLOYMENT.md`)
2. Configure GitHub Actions for CI/CD (optional)
3. Add collaborators if needed
4. Set up branch protection rules for production

