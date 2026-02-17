# RL Code Agent - Project Summary

## Overview

A production-grade, invite-only autonomous code optimization platform that combines:
- **LLM-based code rewriting** (GPT-4o-mini via LiteLLM)
- **Reinforcement Learning** (Stable-Baselines3 PPO) for strategy selection
- **Execution-grounded evaluation** with runtime and memory benchmarking
- **Strict security controls** including JWT validation, rate limiting, and sandboxed execution

## Architecture

### Monorepo Structure

```
rl-code-agent/
├── frontend/          # Next.js 15 (App Router, TypeScript)
├── backend/           # FastAPI with JWT auth, rate limiting
├── rl/                # Gymnasium env + Stable-Baselines3 PPO
├── executor/          # Sandboxed code execution
├── shared/            # Prompts, config, sanitization
├── experiments/       # Training datasets
└── docker/            # Docker configs
```

### Key Components

#### Frontend (`frontend/`)
- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS
- **Editor**: Monaco Editor for code editing
- **Visualization**: Recharts for runtime/memory graphs
- **State**: Zustand for client state
- **Auth**: Supabase Authentication (email/password + magic link)
- **Middleware**: JWT validation, redirects unauthenticated users

#### Backend (`backend/`)
- **Framework**: FastAPI
- **Endpoints**:
  - `POST /optimize` - Main optimization endpoint
  - `GET /metrics` - User usage metrics
  - `GET /health` - Health check with model status
- **Security**:
  - JWT validation on all requests (Supabase public key)
  - Rate limiting with `slowapi` (10 requests/day per user)
  - Code sanitization (removes dangerous imports)
  - Request size validation (max 300 lines, 10KB)
  - Per-IP throttling
- **LLM**: GPT-4o-mini via LiteLLM (max_tokens=500, temperature=0.2)

#### RL Component (`rl/`)
- **Environment**: Custom `CodeOptimizationEnv` (Gymnasium)
- **Observation Space**: 32-dimensional float vector
  - Lines of code, cyclomatic complexity (radon)
  - Nested loop depth, recursion flag
  - AST node counts, baseline runtime/memory
  - Lint score, test pass ratio
  - Embedding features (sentence-transformers)
- **Action Space**: Discrete(7)
  - 0: Algorithmic optimization
  - 1: Memory optimization
  - 2: In-place refactor
  - 3: Recursion-to-iteration
  - 4: Vectorization
  - 5: Alternative solution
  - 6: Stop
- **Model**: PPO (MlpPolicy, [256,256], lr=3e-4, n_steps=512, batch_size=64)
- **Training**: Offline on curated dataset, saves to `checkpoints/ppo_code_agent.zip`

#### Executor (`executor/`)
- **Sandbox**: Subprocess execution with 2-second timeout
- **Security**: No network, limited memory, no filesystem write
- **Benchmarking**: Multiple runs for accuracy, tracemalloc for memory

#### Database (Supabase)
- **Tables**:
  - `invite_codes`: Enforces invite-only access
  - `usage_limits`: Tracks daily requests per user (10/day limit)
- **RLS**: Row-level security enabled

## Features

### User Flow

1. **Login**: Clean login page with email/password or magic link
2. **Invite Code**: Required for signup (validated against `invite_codes` table)
3. **Dashboard**: 
   - Monaco Editor for code input
   - Usage counter (X/10 requests remaining)
   - Model status indicator
4. **Optimization**:
   - Click "Optimize" → RL selects strategy → LLM optimizes → Executes & benchmarks
   - Side-by-side diff (difflib)
   - Runtime improvement graph (Recharts)
   - Memory usage graph
   - Strategy label (e.g., "Algorithmic Optimization")
   - Reward score (-1 to 1)

### Reward Function

```
reward = 0.6 * runtime_improvement_ratio
       + 0.25 * memory_improvement_ratio
       + 0.2 * test_pass_rate
       - 0.1 * code_length_growth
       - 0.05 * complexity_increase
```

Clipped to [-1, 1]

### Security Measures

- ✅ Invite-only access (database-enforced)
- ✅ JWT validation on every backend request
- ✅ Rate limiting (10/day per user, per-IP throttling)
- ✅ Code sanitization (removes os, sys, subprocess, etc.)
- ✅ Execution timeout (2 seconds)
- ✅ Memory limits (512MB)
- ✅ Request size validation
- ✅ Structured logging

## Deployment

### Frontend (Vercel)
- Next.js 15 with environment variables
- Automatic deployments from GitHub

### Backend (Railway/Render)
- FastAPI in Docker container
- Environment variables for API keys
- Loads trained PPO model at startup

### Database (Supabase)
- Postgres with RLS policies
- Migration scripts included

## Training

1. Place code samples in `experiments/dataset/*.py`
2. Run `python rl/train.py`
3. Model saves to `rl/checkpoints/ppo_code_agent.zip`
4. Backend loads model on startup

## Metrics & Reporting

The system tracks:
- Runtime improvement percentage
- Memory improvement percentage
- Test pass rate
- Code length changes
- Complexity changes
- Reward scores

Example: "Average 21% runtime reduction and 14% memory reduction across 200 benchmark problems"

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript, TailwindCSS, Monaco Editor, Recharts, Zustand
- **Backend**: FastAPI, Python 3.11, Uvicorn
- **RL**: Gymnasium, Stable-Baselines3, PyTorch
- **LLM**: OpenAI GPT-4o-mini via LiteLLM
- **Database**: Supabase (Postgres)
- **Auth**: Supabase Authentication
- **Deployment**: Vercel (frontend), Railway/Render (backend)
- **Containerization**: Docker

## Next Steps

1. Train PPO model on larger dataset
2. Deploy to production
3. Monitor API costs and usage
4. Iterate on reward function based on real-world results
5. Add more optimization strategies
6. Implement caching for repeated prompts (Redis optional)

## License

MIT

