# Deployment Guide

## Overview

This guide covers deploying the RL Code Agent platform to production.

## Architecture

- **Frontend**: Next.js 15 on Vercel
- **Backend**: FastAPI on Railway/Render
- **Database**: Supabase Postgres
- **Auth**: Supabase Authentication

## Prerequisites

1. Supabase project with database
2. OpenAI API key
3. Vercel account (for frontend)
4. Railway/Render account (for backend)

## Step 1: Supabase Setup

1. Create a new Supabase project
2. Run the migration in `backend/supabase/migrations/001_initial_schema.sql`
3. Get your Supabase URL, anon key, service role key, and JWT secret
4. Create some invite codes:
   ```sql
   INSERT INTO invite_codes (code) VALUES ('INVITE-CODE-1'), ('INVITE-CODE-2');
   ```

## Step 2: Backend Deployment (Railway/Render)

### Railway

1. Create new project
2. Connect GitHub repository
3. Set root directory to `rl-code-agent/backend`
4. Add environment variables:
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_JWT_SECRET`
   - `ALLOWED_ORIGINS` (your frontend URL)
5. Deploy using `docker/backend.Dockerfile` or set build command:
   ```bash
   pip install -r requirements.txt && uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```

### Render

1. Create new Web Service
2. Connect repository
3. Set:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables (same as Railway)
5. Deploy

## Step 3: Frontend Deployment (Vercel)

1. Import project from GitHub
2. Set root directory to `rl-code-agent/frontend`
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` (your backend URL)
4. Deploy

## Step 4: RL Model

1. Train the model locally:
   ```bash
   cd rl-code-agent/rl
   python train.py
   ```
2. Upload `rl/checkpoints/ppo_code_agent.zip` to your backend
3. Update `backend/rl_model.py` to load from correct path

## Step 5: Testing

1. Visit your frontend URL
2. Sign up with an invite code
3. Test code optimization
4. Verify rate limiting works

## Security Checklist

- [ ] JWT validation enabled on all backend endpoints
- [ ] Rate limiting configured (10 requests/day)
- [ ] Code sanitization active
- [ ] Execution timeout set (2 seconds)
- [ ] Request size limits enforced
- [ ] CORS configured correctly
- [ ] Environment variables secured
- [ ] Supabase RLS policies enabled

## Monitoring

- Monitor backend logs for errors
- Track API usage in Supabase
- Monitor OpenAI API costs
- Set up alerts for rate limit violations

