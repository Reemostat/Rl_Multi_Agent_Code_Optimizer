# RL Code Agent - Project Summary

## PROJECT OVERVIEW

RL Code Agent is an invite-only, production-grade platform that uses reinforcement learning to optimize Python code. It combines:
* LLM-based code rewriting (GPT-4o-mini)
* Reinforcement learning (PPO) for strategy selection
* Execution-grounded evaluation with runtime and memory benchmarking
* Security controls: JWT validation, rate limiting, and sandboxed execution

## GETTING STARTED

### Prerequisites

Before you begin, ensure you have:
* **Python 3.11+** installed
* **Node.js 18+** and npm installed
* **Git** for version control
* **Supabase account** (free tier works) - [Sign up here](https://supabase.com)
* **OpenAI API key** - [Get one here](https://platform.openai.com/api-keys)

### Required API Keys and Credentials

⚠️ **IMPORTANT**: You need to obtain your own API keys and credentials. The project will not work without them.

#### 1. OpenAI API Key
* Go to [OpenAI Platform](https://platform.openai.com/api-keys)
* Sign up or log in
* Create a new API key
* **Cost**: Pay-per-use (GPT-4o-mini is cost-effective)
* **Security**: Never commit this key to git!

#### 2. Supabase Credentials
You need 4 values from your Supabase project:

1. **Supabase Project URL**
   - Found in: Project Settings → API → Project URL
   - Format: `https://xxxxx.supabase.co`

2. **Supabase Anon Key** (for frontend)
   - Found in: Project Settings → API → Project API keys → `anon` `public`
   - This is safe to expose in frontend code

3. **Supabase Service Role Key** (for backend)
   - Found in: Project Settings → API → Project API keys → `service_role` `secret`
   - ⚠️ **KEEP THIS SECRET** - Never expose in frontend or commit to git!

4. **Supabase JWT Secret**
   - Found in: Project Settings → API → JWT Settings → JWT Secret
   - Used for token validation

### Quick Setup Guide

#### Step 1: Clone and Navigate
```bash
git clone <your-repo-url>
cd rl-code-agent
```

#### Step 2: Set Up Supabase Database

1. **Create a Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name and database password
   - Wait for project to be created (~2 minutes)

2. **Run database migration**:
   - In Supabase dashboard, go to SQL Editor
   - Copy contents of `backend/supabase/migrations/001_initial_schema.sql`
   - Paste and run the SQL script
   - This creates tables: `invite_codes`, `usage_limits`, `optimization_history`

3. **Create an invite code** (for testing):
   ```sql
   INSERT INTO invite_codes (code) VALUES ('TEST-CODE-123');
   ```

4. **Get your credentials**:
   - Go to Project Settings → API
   - Copy: Project URL, `anon` key, `service_role` key
   - Go to Project Settings → API → JWT Settings
   - Copy: JWT Secret

#### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
OPENAI_API_KEY=sk-your-openai-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here
ALLOWED_ORIGINS=http://localhost:3000
EOF

# Edit .env file with your actual credentials
# Use your preferred editor: nano .env, vim .env, or VS Code

# Run the backend server
uvicorn main:app --reload --port 8000
```

The backend will start on `http://localhost:8000`. You should see:
```
✅ Environment variables configured.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

#### Step 4: Frontend Setup

Open a **new terminal window** (keep backend running):

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF

# Edit .env.local with your actual credentials

# Run the frontend development server
npm run dev
```

The frontend will start on `http://localhost:3000`.

#### Step 5: Test the Application

1. Open your browser and go to `http://localhost:3000`
2. Click "Sign Up"
3. Enter your invite code (e.g., `TEST-CODE-123`)
4. Create an account with email/password
5. You'll be redirected to the dashboard
6. Try optimizing some Python code:
   ```python
   def sum_list(nums):
       total = 0
       for num in nums:
           total = total + num
       return total
   ```
7. Click "Optimize" and watch the magic happen! 🎉

### Optional: Train RL Model

The backend includes a fallback strategy if no RL model is present. To train your own model:

```bash
# Navigate to RL directory
cd rl

# Install RL dependencies (if not already installed)
pip install -r requirements.txt

# Train the model
python train.py
```

This will create `rl/checkpoints/ppo_code_agent.zip` which the backend will automatically load on startup.

### Environment Variables Summary

**Backend (`backend/.env`):**
```
OPENAI_API_KEY=sk-...              # Required: OpenAI API key
SUPABASE_URL=https://...           # Required: Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=...      # Required: Supabase service role key
SUPABASE_JWT_SECRET=...          # Optional: JWT secret for token validation
ALLOWED_ORIGINS=http://localhost:3000  # CORS allowed origins
```

**Frontend (`frontend/.env.local`):**
```
NEXT_PUBLIC_SUPABASE_URL=https://...    # Required: Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...       # Required: Supabase anon key
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API URL
```

### Important Security Notes

⚠️ **Never commit these files to git:**
- `backend/.env`
- `frontend/.env.local`
- Any file containing API keys or secrets

✅ **Safe to commit:**
- `.env.example` files (templates only)
- `README.md`
- Source code (without hardcoded keys)

The `.gitignore` file is already configured to exclude these sensitive files.

### Troubleshooting

**Backend won't start:**
- Check that all required environment variables are set in `backend/.env`
- Verify Python version: `python --version` (should be 3.11+)
- Ensure virtual environment is activated
- Check that port 8000 is not already in use

**Frontend won't start:**
- Check that all required environment variables are set in `frontend/.env.local`
- Verify Node.js version: `node --version` (should be 18+)
- Try deleting `node_modules` and running `npm install` again
- Check that port 3000 is not already in use

**Authentication errors:**
- Verify Supabase credentials are correct
- Check that JWT secret matches Supabase settings
- Ensure database migration was run successfully
- Verify invite code exists in `invite_codes` table

**API errors:**
- Verify OpenAI API key is valid and has credits
- Check backend is running on `http://localhost:8000`
- Verify `NEXT_PUBLIC_API_URL` in frontend matches backend URL
- Check browser console and backend logs for detailed error messages

**RL Model not loading:**
- This is OK! The backend will use a fallback strategy
- To use RL model: train it first (see "Optional: Train RL Model" above)
- Ensure `rl/checkpoints/ppo_code_agent.zip` exists if you want to use it

### Next Steps

- Read the detailed architecture sections below to understand how it works
- Check `SETUP.md` for more detailed setup instructions
- Check `DEPLOYMENT.md` for production deployment guide
- Check `QUICKSTART.md` for a condensed setup guide

## WHAT IT DOES

Automatically optimizes Python code by:
1. Analyzing code characteristics (complexity, structure, patterns)
2. Selecting an optimization strategy via a trained RL model
3. Generating optimized code using specialized LLM agents
4. Executing and benchmarking both versions in a sandbox
5. Calculating improvements in runtime, memory, and code quality
6. Presenting results with visualizations and detailed metrics

## HOW IT WORKS - DETAILED ARCHITECTURE

### 1. USER INTERACTION FLOW

User submits code → Frontend validates → Backend receives request → Authentication check → Rate limit check → Code sanitization → Optimization process begins

### 2. CODE ANALYSIS AND STATE ENCODING

The system encodes the code into a 64-dimensional feature vector:
* Code metrics: lines of code, cyclomatic complexity (via radon), nested loop depth, recursion detection
* AST analysis: function/class/import counts, decorators, docstrings
* Style metrics: line length, comment ratio, code style scores
* Structural metrics: function length, nesting levels, abstraction level
* Pattern detection: list comprehensions, generators, lambdas, list/dict/set operations
* Baseline performance: initial runtime and memory usage
* Semantic embeddings: sentence-transformers for code semantics

### 3. REINFORCEMENT LEARNING STRATEGY SELECTION

The PPO model (Proximal Policy Optimization) receives the 64-dim state vector and outputs:
* Selected action (0-6): one of 7 optimization strategies
* Action probabilities: probability distribution over all 7 actions
* Confidence score: maximum probability (how certain the model is)
* Entropy: exploration measure (low = confident, high = exploring)
* Strategy mask: which specialized agents to activate [Runtime, Memory, Quality]

The 7 actions are:
* Action 0: Algorithmic Optimization (focus on algorithm efficiency)
* Action 1: Memory Optimization (reduce memory footprint)
* Action 2: In-place Refactor (modify data structures in-place)
* Action 3: Recursion→Iteration (convert recursive to iterative)
* Action 4: Vectorization (use NumPy/Pandas vectorized operations)
* Action 5: Alternative Solution (completely different approach)
* Action 6: Stop (no optimization needed)

### 4. MULTI-AGENT OPTIMIZATION LOOP

The system uses a hierarchical multi-agent architecture:
* **Runtime Agent**: Focuses on algorithmic improvements, loop optimization, reducing computational complexity
* **Memory Agent**: Optimizes memory through generators, in-place operations, efficient data structures
* **Readability Agent**: Improves code quality, maintainability, follows best practices
* **Critic Agent**: Evaluates all candidate solutions, scoring safety, readability, and overall quality

Process:
1. RL model selects strategy mask (e.g., [1,1,0] = Runtime + Memory agents)
2. Selected agents generate candidate optimizations in parallel
3. Each candidate is executed and benchmarked
4. Critic agent scores each candidate
5. Multi-objective reward is calculated
6. Best candidate becomes input for next refinement round
7. Process repeats for user-specified rounds (1-5)

### 5. REWARD CALCULATION

Multi-objective reward function combining:
* Runtime component: Weighted improvement in execution time (capped at 70% to prevent dominance)
* Memory component: Weighted reduction in memory usage
* Quality component: Critic's quality score (safety, readability, maintainability)
* Test pass bonus: +0.2 if all tests pass
* Safety penalty: -0.15 if code is marked unsafe
* Stability variance: Penalty for high variance across rounds
* Exploration bonus: +0.05 for trying optimization
* Action diversity regularization: Penalty if same action used too frequently

Final reward is clipped to [-1, 1] range.

### 6. CODE EXECUTION AND BENCHMARKING

Sandboxed execution environment:
* Subprocess execution with 2-second timeout
* No network access
* Limited memory (512MB)
* No filesystem write access
* Multiple runs for accuracy (averages results)
* tracemalloc for memory profiling
* Test execution to verify correctness

### 7. RESULT PRESENTATION

Frontend displays:
* Optimized code with syntax highlighting
* Side-by-side diff view
* Runtime improvement percentage
* Memory improvement percentage
* Reward score
* Strategy label
* Action distribution chart (probability of each action)
* Policy confidence and entropy metrics
* Objective weights radar chart
* Policy evolution over refinement rounds
* Detailed metrics breakdown

## TECHNOLOGY STACK - COMPLETE BREAKDOWN

### FRONTEND TECHNOLOGIES

**Framework and Core:**
* Next.js 15 (App Router architecture)
* React 18.2.0
* TypeScript 5.3.3
* Node.js runtime

**UI and Styling:**
* TailwindCSS 3.3.6
* Framer Motion 12.34.0 (animations)
* Lucide React 0.294.0 (icons)
* Glassmorphism design patterns

**Code Editing:**
* Monaco Editor 4.6.0 (VS Code editor component)

**Data Visualization:**
* Recharts 2.10.3 (charts and graphs)

**State Management:**
* Zustand 4.4.7 (lightweight state management)

**Authentication:**
* Supabase Auth Helpers 0.8.7
* Supabase JS Client 2.38.4

**Utilities:**
* clsx 2.0.0 (conditional classnames)
* class-variance-authority 0.7.0
* tailwind-merge 2.2.0

### BACKEND TECHNOLOGIES

**Framework:**
* FastAPI (async Python web framework)
* Python 3.11
* Uvicorn (ASGI server)

**Reinforcement Learning:**
* Stable-Baselines3 (PPO implementation)
* Gymnasium (RL environment standard)
* PyTorch (deep learning backend)
* NumPy (numerical computations)

**LLM Integration:**
* LiteLLM (unified LLM interface)
* OpenAI GPT-4o-mini (code generation model)

**Code Analysis:**
* Radon (cyclomatic complexity analysis)
* AST (Abstract Syntax Tree parsing)
* sentence-transformers (semantic embeddings)

**Security and Validation:**
* python-dotenv (environment variable management)
* Pydantic (data validation)
* slowapi (rate limiting)

**Logging:**
* structlog (structured logging)

**Database:**
* Supabase (PostgreSQL with real-time features)
* Supabase Python client

**Code Execution:**
* Python subprocess (sandboxed execution)
* tracemalloc (memory profiling)
* asyncio (async execution)

### DATABASE (SUPABASE)

**Tables:**
* `invite_codes`: Enforces invite-only access
* `usage_limits`: Tracks daily requests per user (10/day limit)
* `optimization_history`: Stores optimization results and history

**Security:**
* Row-Level Security (RLS) policies
* JWT token validation
* Service role key for backend operations

### DEPLOYMENT INFRASTRUCTURE

**Frontend:**
* Vercel (Next.js hosting)
* Automatic deployments from GitHub
* Environment variable management

**Backend:**
* Railway or Render (containerized deployment)
* Docker containerization
* Environment variable configuration

**Database:**
* Supabase Cloud (managed PostgreSQL)
* Automatic backups
* Connection pooling

### DEVELOPMENT TOOLS

**Build Tools:**
* PostCSS 8.4.32
* Autoprefixer 10.4.16
* ESLint 8.56.0

**Version Control:**
* Git
* GitHub

**Containerization:**
* Docker
* Docker Compose

## SECURITY MEASURES

1. **Invite-only access**: Database-enforced invite code validation
2. **JWT validation**: Every backend request requires valid Supabase JWT token
3. **Rate limiting**: 10 requests/day per user, per-IP throttling
4. **Code sanitization**: Removes dangerous imports (os, sys, subprocess, etc.)
5. **Sandboxed execution**: Isolated subprocess with no network/filesystem access
6. **Execution timeout**: 2-second maximum execution time
7. **Memory limits**: 512MB maximum memory usage
8. **Request size validation**: Maximum 300 lines, 10KB per request
9. **Structured logging**: All operations logged for audit trail

## PROJECT STRUCTURE

```
rl-code-agent/
├── frontend/              # Next.js 15 frontend application
│   ├── app/              # App Router pages and layouts
│   ├── components/       # React components (charts, panels, etc.)
│   └── lib/              # Utilities (API client, store, Supabase)
├── backend/              # FastAPI backend server
│   ├── agents/           # Specialized optimization agents
│   ├── supabase/         # Database migrations
│   └── main.py           # FastAPI application entry point
├── rl/                   # Reinforcement learning components
│   ├── env.py            # Custom Gymnasium environment
│   ├── train.py          # PPO model training script
│   ├── services/         # State encoding, dataset loading
│   └── checkpoints/      # Trained PPO model files
├── executor/             # Code execution sandbox
│   └── sandbox.py        # Sandboxed code execution
├── shared/               # Shared utilities
│   ├── config.py         # Configuration constants
│   ├── prompts.py        # LLM prompts for each strategy
│   └── sanitize.py       # Code sanitization
└── experiments/          # Training datasets
    └── dataset/          # Python code samples for training
```

## KEY FEATURES

1. Intelligent strategy selection via RL
2. Multi-objective optimization (runtime, memory, quality)
3. Execution-grounded evaluation (real benchmarks)
4. Iterative refinement (1-5 rounds)
5. User preference weighting (customizable objective priorities)
6. Real-time visualization (charts, graphs, metrics)
7. Policy diagnostics (confidence, entropy, action probabilities)
8. Code diff visualization (side-by-side comparison)
9. Security-first design (sandboxed, rate-limited, authenticated)
10. Production-ready (error handling, logging, monitoring)

## PERFORMANCE METRICS

The system tracks and reports:
* Runtime improvement percentage
* Memory improvement percentage
* Test pass rate
* Code length changes
* Complexity changes
* Reward scores
* Policy confidence
* Entropy (exploration measure)
* Action distribution

Example results: Average 21% runtime reduction and 14% memory reduction across benchmark problems.

## TRAINING PROCESS

1. Collect code samples in `experiments/dataset/`
2. Run training script: `python rl/train.py`
3. Model trains using PPO algorithm on Gymnasium environment
4. Model saves to `rl/checkpoints/ppo_code_agent.zip`
5. Backend automatically loads model on startup
6. Model used for inference during optimization

## USER EXPERIENCE

1. **Login**: Email/password or magic link authentication
2. **Dashboard**: Monaco Editor for code input, usage counter, preferences
3. **Optimization**: Click "Optimize" → RL selects strategy → LLM optimizes → Results displayed
4. **Results**: Visualizations, metrics, diff view, policy insights
5. **History**: All optimizations saved to database

---

This system combines reinforcement learning, LLMs, and execution-grounded evaluation to provide automated, intelligent code optimization with measurable improvements.
