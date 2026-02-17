"""
FastAPI backend for RL Code Agent.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load .env BEFORE anything else
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
import structlog
import difflib

from backend.auth import verify_jwt
from backend.rate_limit import check_rate_limit, increment_usage
from backend.optimization_loop import OptimizationLoop
from backend.history import save_optimization_history
from shared.sanitize import validate_code_length, sanitize_code
from shared.config import MAX_CODE_LENGTH, BACKEND_PORT

# --------------------------------------------------
# Logging
# --------------------------------------------------

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.JSONRenderer()
    ]
)
logger = structlog.get_logger()

# --------------------------------------------------
# Validate Required Environment Variables
# --------------------------------------------------

def validate_env_vars():
    required = [
        "OPENAI_API_KEY",
        "SUPABASE_URL",
        "SUPABASE_SERVICE_ROLE_KEY",
    ]

    missing = [var for var in required if not os.getenv(var)]

    if missing:
        print("\n⚠️ Missing required environment variables:\n")
        for var in missing:
            print(f"  ❌ {var}")
        print("\nAdd them to backend/.env and restart.\n")
    else:
        print("✅ Environment variables configured.\n")

validate_env_vars()

# --------------------------------------------------
# FastAPI Setup
# --------------------------------------------------

app = FastAPI(
    title="RL Code Agent API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

security = HTTPBearer()

# --------------------------------------------------
# Models
# --------------------------------------------------

class OptimizeRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=10000)
    max_refinements: int = Field(default=3, ge=1, le=5)
    runtime_preference: float = Field(default=0.6, ge=0.0, le=1.0)
    memory_preference: float = Field(default=0.25, ge=0.0, le=1.0)
    quality_preference: float = Field(default=0.15, ge=0.0, le=1.0)


class OptimizeResponse(BaseModel):
    optimized_code: str
    strategy: str
    strategy_label: str
    reward: float
    metrics: Dict[str, Any]
    trace: list[Dict[str, Any]]
    objective_weights: Dict[str, float]
    diff: Dict[str, Any]
    warnings: list[str]
    rl_meta_action: Optional[Dict[str, Any]] = None


class MetricsResponse(BaseModel):
    requests_today: int
    daily_limit: int
    remaining: int


# --------------------------------------------------
# Auth Dependency (NO JWT SECRET NEEDED)
# --------------------------------------------------

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_jwt(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    return payload


# --------------------------------------------------
# Endpoints
# --------------------------------------------------

from backend.rl_model import is_model_loaded, load_model

@app.get("/")
async def root():
    """
    Root endpoint - API information.
    """
    return {
        "name": "RL Code Agent API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "metrics": "/metrics (requires auth)",
            "optimize": "/optimize (requires auth)",
            "docs": "/docs",
            "openapi": "/openapi.json"
        },
        "message": "Welcome to RL Code Agent API. Visit /docs for interactive API documentation."
    }

@app.get("/health")
async def health():
    """
    Health check endpoint with RL model status.
    Confirms whether PPO model is loaded and ready.
    """
    try:
        # Ensure model attempt load (safe if already loaded)
        load_model()
        model_status = is_model_loaded()
    except Exception as e:
        logger.error(f"Health check model error: {e}")
        model_status = False

    return {
        "status": "healthy",
        "model_loaded": model_status
    }


@app.get("/metrics", response_model=MetricsResponse)
@limiter.limit("50/minute")
async def get_metrics(
    request: Request,
    payload: dict = Depends(verify_token)
):
    user_id = payload.get("sub")

    metrics = await check_rate_limit(user_id, increment=False)

    return MetricsResponse(
        requests_today=metrics["requests_today"],
        daily_limit=metrics["daily_limit"],
        remaining=metrics["remaining"]
    )


@app.post("/optimize", response_model=OptimizeResponse)
@limiter.limit("50/minute")
async def optimize(
    request: Request,
    optimize_req: OptimizeRequest,
    payload: dict = Depends(verify_token)
):
    user_id = payload.get("sub")

    # Rate limit
    rate_limit = await check_rate_limit(user_id, increment=False)
    if rate_limit["remaining"] <= 0:
        raise HTTPException(
            status_code=429,
            detail="Daily limit exceeded"
        )

    # Validate code is not empty
    if not optimize_req.code or not optimize_req.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    
    # Validate code length
    is_valid, error_msg = validate_code_length(
        optimize_req.code,
        MAX_CODE_LENGTH
    )
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    # Run optimization loop
    loop = OptimizationLoop()
    result = await loop.optimize(
        code=optimize_req.code,
        max_refinements=optimize_req.max_refinements,
        runtime_preference=optimize_req.runtime_preference,
        memory_preference=optimize_req.memory_preference,
        quality_preference=optimize_req.quality_preference
    )

    # Generate diff
    original_code, _ = sanitize_code(optimize_req.code)
    result["diff"] = generate_diff(original_code, result["optimized_code"])

    # Increment usage
    await increment_usage(user_id)

    # Save history
    try:
        await save_optimization_history(user_id, result)
    except Exception as e:
        logger.warning(f"History save failed: {e}")

    return OptimizeResponse(**result)


# --------------------------------------------------
# Diff Utility
# --------------------------------------------------

def generate_diff(original: str, optimized: str) -> Dict[str, Any]:
    original_lines = original.split("\n")
    optimized_lines = optimized.split("\n")

    diff = list(difflib.unified_diff(
        original_lines,
        optimized_lines,
        lineterm="",
        fromfile="original",
        tofile="optimized"
    ))

    return {
        "unified_diff": diff,
        "line_changes": len([
            d for d in diff
            if d.startswith(("+", "-")) and not d.startswith(("+++", "---"))
        ])
    }


# --------------------------------------------------
# Run
# --------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", BACKEND_PORT))
    print(f"\n🚀 Starting backend server on port {port}...\n")
    uvicorn.run(app, host="0.0.0.0", port=port)
