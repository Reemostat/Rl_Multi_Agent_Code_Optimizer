# Quick Deployment Checklist

## 🚀 Quick Start

### 1. Prepare for GitHub

```bash
cd /Users/rishitmaheshwari/Desktop/rlproject/rl-code-agent

# Check what will be committed
git status

# Make sure no .env files are tracked
git rm --cached backend/.env 2>/dev/null || true
git rm --cached frontend/.env.local 2>/dev/null || true

# Commit everything
git add .
git commit -m "Initial commit: RL Code Agent"
```

### 2. Push to GitHub

```bash
# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 3. Deploy Backend (Railway - Recommended)

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select your repo
3. Settings → Source → Set Root Directory: `rl-code-agent`
4. Settings → Dockerfile Path: `docker/backend.Dockerfile`
5. Variables tab → Add:
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ALLOWED_ORIGINS` (your frontend URL)
6. Deploy! Get your backend URL

### 4. Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → Add New Project
2. Import GitHub repo
3. Root Directory: `rl-code-agent/frontend`
4. Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` (your Railway backend URL)
5. Deploy!

## 📝 Environment Variables Needed

### Backend (.env)
```
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

## 🐳 About Docker

The `docker/` folder is **very relevant** for deployment! It:
- Containerizes your backend for consistent deployment
- Works with Railway, Render, and other platforms
- Makes deployment easier and more reliable

## ✅ Security Checklist

Before pushing to GitHub:
- [ ] No `.env` files in repository
- [ ] `.gitignore` is working (check `git status`)
- [ ] No API keys in code files
- [ ] `venv/` and `node_modules/` excluded

## 📚 Full Guides

- **GitHub Setup**: See `GITHUB_SETUP.md`
- **Hosting Details**: See `HOSTING_GUIDE.md`
- **Original Deployment**: See `DEPLOYMENT.md`

