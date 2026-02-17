# Website Hosting Guide

This guide covers deploying your RL Code Agent to production.

## Architecture Overview

Your application consists of:
- **Frontend**: Next.js 15 application
- **Backend**: FastAPI Python application
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Authentication

## Prerequisites

Before deploying, ensure you have:
1. ✅ Supabase project created and configured
2. ✅ Database migrations run
3. ✅ Environment variables documented (see `.env.example` files)
4. ✅ GitHub repository set up (see `GITHUB_SETUP.md`)

## About the Docker Folder

The `docker/` folder contains:
- `backend.Dockerfile` - Containerizes your FastAPI backend
- `sandbox.Dockerfile` - Optional isolated code execution environment
- `docker-compose.yml` - Orchestrates services locally

**Is Docker relevant for deployment?** YES! Docker makes deployment easier and more consistent. Many hosting platforms support Docker deployments.

---

## Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

### Frontend: Vercel (Free tier available)

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Set **Root Directory** to `rl-code-agent/frontend`

2. **Configure Build Settings:**
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
     ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main branch

### Backend: Railway (Docker deployment)

1. **Create Account:**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service:**
   - Railway will auto-detect it's a Python project
   - Go to Settings → Source
   - Set **Root Directory** to `rl-code-agent`
   - Set **Dockerfile Path** to `docker/backend.Dockerfile`

4. **Add Environment Variables:**
   - Go to Variables tab
   - Add:
     ```
     OPENAI_API_KEY=your_openai_key
     SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
     ```

5. **Deploy:**
   - Railway will automatically build and deploy
   - Get your backend URL from the service dashboard

6. **Update Frontend:**
   - Go back to Vercel
   - Update `NEXT_PUBLIC_API_URL` to your Railway backend URL
   - Redeploy frontend

---

## Option 2: Vercel (Frontend) + Render (Backend)

### Frontend: Same as Option 1

### Backend: Render

1. **Create Account:**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub

2. **Create Web Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service:**
   - Name: `rl-code-agent-backend`
   - Region: Choose closest to your users
   - Branch: `main`
   - Root Directory: `rl-code-agent`
   - Environment: `Docker`
   - Dockerfile Path: `docker/backend.Dockerfile`
   - Docker Context: `rl-code-agent`

4. **Add Environment Variables:**
   - Scroll to "Environment Variables"
   - Add all required variables (same as Railway)

5. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy
   - Get your backend URL from the dashboard

---

## Option 3: Full Docker Deployment (Advanced)

If you have a VPS or want to use Docker Compose:

1. **Clone Repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO/rl-code-agent
   ```

2. **Create Production .env Files:**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   # Edit with production values
   ```

3. **Build and Run:**
   ```bash
   cd docker
   docker-compose up -d
   ```

4. **Set Up Reverse Proxy (Nginx):**
   - Configure Nginx to route:
     - `/` → Frontend (port 3000)
     - `/api` → Backend (port 8000)

---

## Database Setup (Supabase)

1. **Run Migrations:**
   - Go to Supabase Dashboard → SQL Editor
   - Run migrations in order:
     - `backend/supabase/migrations/001_initial_schema.sql`
     - `backend/supabase/migrations/002_ensure_invite_code_access.sql`
     - `backend/supabase/migrations/002_optimization_history.sql`
     - `backend/supabase/migrations/003_add_delta_columns.sql`

2. **Create Invite Codes:**
   ```sql
   INSERT INTO invite_codes (code) VALUES 
     ('YOUR-INVITE-CODE-1'),
     ('YOUR-INVITE-CODE-2');
   ```

3. **Get API Keys:**
   - Settings → API
   - Copy: URL, anon key, service_role key

---

## Post-Deployment Checklist

- [ ] Frontend accessible at your domain
- [ ] Backend health check: `https://your-backend-url/health`
- [ ] Environment variables set correctly
- [ ] CORS configured (backend allows frontend origin)
- [ ] Database migrations run
- [ ] Invite codes created
- [ ] Test signup flow
- [ ] Test code optimization
- [ ] Monitor logs for errors

---

## Environment Variables Summary

### Backend (Railway/Render)
```
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

---

## Troubleshooting

### Backend won't start
- Check environment variables are set
- Check logs: `railway logs` or Render dashboard
- Verify Supabase connection

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify CORS settings in backend
- Check backend is running: visit `/health`

### CORS errors
- Update `ALLOWED_ORIGINS` in backend to include your frontend URL
- Ensure no trailing slashes in URLs

### Database errors
- Verify migrations are run
- Check Supabase credentials
- Verify RLS policies are enabled

---

## Cost Estimates

- **Vercel**: Free tier (hobby) or $20/month (pro)
- **Railway**: $5/month (hobby) or pay-as-you-go
- **Render**: Free tier available or $7/month (starter)
- **Supabase**: Free tier (500MB database) or $25/month (pro)

**Total (Free tier):** $0/month
**Total (Production):** ~$30-50/month

---

## Next Steps

1. Set up monitoring (Sentry, LogRocket)
2. Configure custom domain
3. Set up CI/CD pipelines
4. Add analytics
5. Implement backup strategy

