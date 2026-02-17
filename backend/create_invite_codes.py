"""
Script to create invite codes in the database.
Run this script to add new invite codes.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import secrets
import string

# Load .env (handle permission errors gracefully)
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    try:
        load_dotenv(dotenv_path=env_path, override=True)
    except PermissionError:
        # Try loading from environment variables directly
        pass

from backend.auth import get_supabase_client

def generate_invite_code(length=12):
    """Generate a random invite code."""
    alphabet = string.ascii_uppercase + string.digits
    # Create code with format: XXXX-XXXX-XXXX
    code_parts = []
    for _ in range(3):
        part = ''.join(secrets.choice(alphabet) for _ in range(4))
        code_parts.append(part)
    return '-'.join(code_parts)

def create_invite_codes(count=4):
    """Create invite codes in the database."""
    supabase = get_supabase_client()
    if not supabase:
        print("❌ Error: Could not connect to Supabase. Check your .env file.")
        return
    
    print(f"Creating {count} invite codes...\n")
    
    created_codes = []
    for i in range(count):
        code = generate_invite_code()
        try:
            result = supabase.table("invite_codes").insert({
                "code": code,
                "used": False
            }).execute()
            
            if result.data:
                created_codes.append(code)
                print(f"✅ Created invite code #{i+1}: {code}")
            else:
                print(f"❌ Failed to create invite code #{i+1}")
        except Exception as e:
            print(f"❌ Error creating invite code #{i+1}: {e}")
            # Try with a different code if there's a conflict
            code = generate_invite_code()
            try:
                result = supabase.table("invite_codes").insert({
                    "code": code,
                    "used": False
                }).execute()
                if result.data:
                    created_codes.append(code)
                    print(f"✅ Created invite code #{i+1} (retry): {code}")
            except Exception as retry_error:
                print(f"❌ Failed to create invite code #{i+1} after retry: {retry_error}")
    
    print(f"\n{'='*50}")
    print(f"Successfully created {len(created_codes)} invite codes:")
    print(f"{'='*50}")
    for code in created_codes:
        print(f"  • {code}")
    print(f"{'='*50}\n")

if __name__ == "__main__":
    # You can specify the number of codes to create
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 4
    create_invite_codes(count)

