# Quick Start Guide

Get the RL Code Agent running in 5 minutes.

## Prerequisites

- Python 3.11+
- Node.js 18+
- Supabase account (free tier works)
- OpenAI API key

## Step 1: Supabase Setup (5 min)

1. Create project at https://supabase.com
2. Go to SQL Editor
3. Run `backend/supabase/migrations/001_initial_schema.sql`
4. Create an invite code:
   ```sql
   INSERT INTO invite_codes (code) VALUES ('MY-INVITE-CODE');
   ```
5. Get your credentials:
   - Project URL
   - Anon key (Settings → API)
   - Service role key (Settings → API)
   - JWT secret (Settings → API → JWT Settings)

## Step 2: Backend (2 min)

```bash
cd rl-code-agent/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env
cat > .env << EOF
OPENAI_API_KEY=sk-your-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
ALLOWED_ORIGINS=http://localhost:3000
EOF

# Run
uvicorn main:app --reload
```

Backend runs on http://localhost:8000

## Step 3: Frontend (2 min)

```bash
cd rl-code-agent/frontend
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF

# Run
npm run dev
```

Frontend runs on http://localhost:3000

## Step 4: Test It!

1. Visit http://localhost:3000
2. Click "Sign Up"
3. Enter your invite code: `MY-INVITE-CODE`
4. Create account
5. Paste this code:
   ```python
   def sum_list(nums):
       total = 0
       for num in nums:
           total = total + num
       return total
   ```
6. Click "Optimize"
7. See the results! 🎉

## Optional: Train RL Model

```bash
cd rl-code-agent/rl
pip install -r requirements.txt
python train.py
```

Model saves to `rl/checkpoints/ppo_code_agent.zip` (backend will auto-load if present)

## Troubleshooting

- **"Invalid token"**: Check JWT secret matches Supabase
- **"Model not loaded"**: This is OK - backend uses fallback strategy
- **"Rate limit exceeded"**: Check `usage_limits` table in Supabase
- **CORS errors**: Verify `ALLOWED_ORIGINS` includes frontend URL

## Next Steps

- Read `SETUP.md` for detailed setup
- Read `DEPLOYMENT.md` for production deployment
- Read `PROJECT_SUMMARY.md` for architecture overview

