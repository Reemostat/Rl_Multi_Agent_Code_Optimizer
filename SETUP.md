# Setup Guide

## Local Development Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- Supabase account
- OpenAI API key

### 1. Backend Setup

```bash
cd rl-code-agent/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:
```bash
OPENAI_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
SUPABASE_JWT_SECRET=your_secret
ALLOWED_ORIGINS=http://localhost:3000
```

Run backend:
```bash
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd rl-code-agent/frontend
npm install
```

Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run frontend:
```bash
npm run dev
```

### 3. Database Setup

1. Create Supabase project
2. Run migration: `backend/supabase/migrations/001_initial_schema.sql`
3. Create invite codes:
   ```sql
   INSERT INTO invite_codes (code) VALUES ('TEST-CODE-123');
   ```

### 4. RL Model Training (Optional)

```bash
cd rl-code-agent/rl
pip install -r requirements.txt
python train.py
```

This will create `rl/checkpoints/ppo_code_agent.zip` which the backend will load.

### 5. Testing

1. Visit http://localhost:3000
2. Sign up with invite code
3. Paste code and optimize

## Docker Setup

```bash
cd rl-code-agent
docker-compose -f docker/docker-compose.yml up
```

## Troubleshooting

- **Import errors**: Ensure PYTHONPATH includes project root
- **Model not loading**: Check `rl/checkpoints/` directory exists
- **Auth errors**: Verify Supabase credentials and JWT secret
- **Rate limiting**: Check `usage_limits` table in Supabase

