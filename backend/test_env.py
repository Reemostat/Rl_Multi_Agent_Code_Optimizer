#!/usr/bin/env python3
"""
Test script to verify environment variables are loaded correctly.
Run this to debug .env file issues.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

print("🔍 Testing Environment Variable Loading\n")
print("="*60)

# Check if .env file exists
env_path = Path(__file__).parent / ".env"
print(f"📁 .env file path: {env_path.absolute()}")
print(f"   Exists: {env_path.exists()}\n")

if env_path.exists():
    print("📄 .env file contents (first 10 lines):")
    try:
        with open(env_path, 'r') as f:
            lines = f.readlines()[:10]
            for i, line in enumerate(lines, 1):
                # Mask sensitive values
                if '=' in line:
                    key, value = line.split('=', 1)
                    if value.strip():
                        masked = value[:4] + "..." if len(value) > 8 else "***"
                        print(f"   {i}: {key.strip()}={masked}")
                    else:
                        print(f"   {i}: {key.strip()}=")
        print()
    except Exception as e:
        print(f"   Error reading file: {e}\n")

# Load .env
print("🔄 Loading .env file...")
try:
    if env_path.exists():
        result = load_dotenv(dotenv_path=env_path, override=True)
        print(f"   Load result: {result}")
    else:
        result = load_dotenv(override=True)
        print(f"   Load result: {result} (from environment)")
    print()
except Exception as e:
    print(f"   ❌ Error loading .env: {e}\n")
    sys.exit(1)

# Check variables
print("✅ Checking environment variables:\n")
vars_to_check = {
    "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
    "SUPABASE_URL": os.getenv("SUPABASE_URL"),
    "SUPABASE_SERVICE_ROLE_KEY": os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
    "SUPABASE_JWT_SECRET": os.getenv("SUPABASE_JWT_SECRET"),
    "ALLOWED_ORIGINS": os.getenv("ALLOWED_ORIGINS"),
}

for var_name, value in vars_to_check.items():
    if value:
        # Show partial value
        if len(value) > 20:
            display = value[:8] + "..." + value[-4:]
        else:
            display = "***"
        print(f"   ✅ {var_name:30} = {display} (length: {len(value)})")
    else:
        print(f"   ❌ {var_name:30} = NOT SET")

print("\n" + "="*60)

# Summary
missing = [var for var, value in vars_to_check.items() if not value]
if missing:
    print(f"\n❌ {len(missing)} variable(s) missing: {', '.join(missing)}")
    print("\nTo fix:")
    print("1. Edit backend/.env file")
    print("2. Add missing variables")
    print("3. Restart server")
    sys.exit(1)
else:
    print("\n✅ All required variables are set!")
    print("   You can start the server now.")

