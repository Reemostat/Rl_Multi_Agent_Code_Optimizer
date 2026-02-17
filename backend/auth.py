"""
JWT authentication utilities for Supabase.
Uses Supabase service role to verify ES256 tokens.
"""

import os
from typing import Optional, Dict, Any
from supabase import create_client, Client
import structlog
from dotenv import load_dotenv
from pathlib import Path

logger = structlog.get_logger()

# --------------------------------------------------
# Load Environment Variables
# --------------------------------------------------

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    logger.warning("Supabase credentials not fully configured")


# --------------------------------------------------
# Verify JWT via Supabase (ES256 Compatible)
# --------------------------------------------------

def verify_jwt(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify JWT by asking Supabase directly.
    Works for ES256-based projects.
    """
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        logger.error("Supabase not configured properly")
        return None

    try:
        client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        response = client.auth.get_user(token)

        if response and response.user:
            return {
                "sub": response.user.id,
                "email": response.user.email
            }

        return None

    except Exception as e:
        logger.error(f"JWT verification failed: {e}")
        return None


# --------------------------------------------------
# Extract User ID
# --------------------------------------------------

def get_user_id(payload: Dict[str, Any]) -> Optional[str]:
    return payload.get("sub")


# --------------------------------------------------
# Supabase Client (Server-Side)
# --------------------------------------------------

def get_supabase_client() -> Optional[Client]:
    """
    Create Supabase client using service role key.
    Used for rate limiting and server-side DB access.
    """
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        logger.error("Supabase service role credentials not configured")
        return None

    try:
        return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    except Exception as e:
        logger.error(f"Failed to create Supabase client: {e}")
        return None
