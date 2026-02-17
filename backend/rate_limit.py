"""
Rate limiting utilities using Supabase.
"""

import os
import asyncio
from datetime import datetime, timedelta
from typing import Dict, Any
from supabase import Client
from concurrent.futures import ThreadPoolExecutor
import structlog

from backend.auth import get_supabase_client
from shared.config import DAILY_REQUEST_LIMIT

logger = structlog.get_logger()

# Thread pool for running sync Supabase calls
_executor = ThreadPoolExecutor(max_workers=5)

async def check_rate_limit(user_id: str, increment: bool = False) -> Dict[str, Any]:
    """
    Check and optionally increment user's rate limit.
    Returns dict with requests_today, daily_limit, remaining.
    """
    supabase = get_supabase_client()
    if not supabase:
        logger.error("Supabase client not available")
        return {
            "requests_today": 0,
            "daily_limit": DAILY_REQUEST_LIMIT,
            "remaining": DAILY_REQUEST_LIMIT
        }
    
    try:
        loop = asyncio.get_event_loop()
        
        # Get or create usage limit record (run in thread pool)
        result = await loop.run_in_executor(
            _executor,
            lambda: supabase.table("usage_limits").select("*").eq("user_id", user_id).execute()
        )
        
        now = datetime.now()
        if result.data:
            record = result.data[0]
            last_reset = datetime.fromisoformat(record["last_reset"].replace("Z", "+00:00"))
            
            # Reset if more than 24 hours have passed
            if now - last_reset.replace(tzinfo=None) > timedelta(days=1):
                requests_today = 0
                last_reset = now
            else:
                requests_today = record["requests_today"]
                last_reset = datetime.fromisoformat(record["last_reset"].replace("Z", "+00:00"))
            
            # Increment if requested
            if increment:
                requests_today += 1
                await loop.run_in_executor(
                    _executor,
                    lambda: supabase.table("usage_limits").update({
                        "requests_today": requests_today,
                        "last_reset": last_reset.isoformat()
                    }).eq("user_id", user_id).execute()
                )
        else:
            # Create new record
            requests_today = 1 if increment else 0
            await loop.run_in_executor(
                _executor,
                lambda: supabase.table("usage_limits").insert({
                    "user_id": user_id,
                    "requests_today": requests_today,
                    "last_reset": now.isoformat()
                }).execute()
            )
        
        remaining = max(0, DAILY_REQUEST_LIMIT - requests_today)
        
        return {
            "requests_today": requests_today,
            "daily_limit": DAILY_REQUEST_LIMIT,
            "remaining": remaining
        }
    
    except Exception as e:
        logger.error(f"Rate limit check failed: {e}")
        return {
            "requests_today": 0,
            "daily_limit": DAILY_REQUEST_LIMIT,
            "remaining": DAILY_REQUEST_LIMIT
        }

async def increment_usage(user_id: str) -> None:
    """Increment user's usage count."""
    await check_rate_limit(user_id, increment=True)

