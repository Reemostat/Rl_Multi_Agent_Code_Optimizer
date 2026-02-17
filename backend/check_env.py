#!/usr/bin/env python3
"""
Quick script to check if all required environment variables are set.
Run this before starting the server to verify configuration.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path, override=True)
else:
    load_dotenv(override=True)
    print("⚠️  Warning: backend/.env file not found")
    print("   Trying to load from environment...\n")

required_vars = {
    "OPENAI_API_KEY": {
        "description": "OpenAI API key for LLM optimization",
        "where": "https://platform.openai.com/api-keys",
        "example": "sk-..."
    },
    "SUPABASE_URL": {
        "description": "Supabase project URL",
        "where": "Supabase Dashboard → Settings → API → Project URL",
        "example": "https://xxxxx.supabase.co"
    },
    "SUPABASE_SERVICE_ROLE_KEY": {
        "description": "Supabase service role key (server-side only)",
        "where": "Supabase Dashboard → Settings → API → service_role key",
        "example": "eyJhbGc..."
    },
    "SUPABASE_JWT_SECRET": {
        "description": "Supabase JWT secret for token verification",
        "where": "Supabase Dashboard → Settings → API → JWT Settings → JWT Secret",
        "example": "your-jwt-secret-string"
    },
    "ALLOWED_ORIGINS": {
        "description": "CORS allowed origins (comma-separated)",
        "where": "Your frontend URL",
        "example": "http://localhost:3000",
        "optional": True
    }
}

print("🔍 Checking Environment Variables\n")
print("="*70)

all_set = True
for var_name, info in required_vars.items():
    value = os.getenv(var_name)
    if value:
        # Show partial value for security
        if len(value) > 20:
            display = value[:8] + "..." + value[-4:]
        else:
            display = "***"
        print(f"✅ {var_name:30} = {display}")
    else:
        print(f"❌ {var_name:30} = NOT SET")
        if not info.get("optional"):
            all_set = False
            print(f"   Description: {info['description']}")
            print(f"   Where to get: {info['where']}")
            print(f"   Example: {info['example']}")
            print()

print("="*70)

if all_set:
    print("\n✅ All required environment variables are set!")
    print("   You can start the server with: uvicorn main:app --reload\n")
    sys.exit(0)
else:
    print("\n❌ Some required environment variables are missing!")
    print("   Please create or update backend/.env file with the missing variables.")
    print("   See ENV_SETUP.md for detailed instructions.\n")
    sys.exit(1)

