#!/bin/bash

echo "🔍 Verifying Environment Variables"
echo ""

# Check backend .env
echo "📋 Backend Environment Variables (backend/.env):"
if [ -f "backend/.env" ]; then
    cd backend
    source venv/bin/activate 2>/dev/null || true
    python3 << 'PYEOF'
import os
from dotenv import load_dotenv
load_dotenv()

vars_to_check = [
    "OPENAI_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_JWT_SECRET",
    "ALLOWED_ORIGINS"
]

print("\nBackend Variables:")
for var in vars_to_check:
    value = os.getenv(var)
    if value:
        # Show first/last few chars for security
        if len(value) > 10:
            display = value[:4] + "..." + value[-4:]
        else:
            display = "***"
        print(f"  ✅ {var}: {display}")
    else:
        print(f"  ❌ {var}: NOT SET")
PYEOF
    cd ..
else
    echo "  ❌ backend/.env file not found!"
fi

echo ""
echo "📋 Frontend Environment Variables (frontend/.env.local):"
if [ -f "frontend/.env.local" ]; then
    cd frontend
    node << 'NODEEOF'
require('dotenv').config({path: '.env.local'});

const vars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_API_URL"
];

console.log("\nFrontend Variables:");
vars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        const display = value.length > 10 ? value.substring(0, 4) + "..." + value.substring(value.length - 4) : "***";
        console.log(`  ✅ ${varName}: ${display}`);
    } else {
        console.log(`  ❌ ${varName}: NOT SET`);
    }
});
NODEEOF
    cd ..
else
    echo "  ❌ frontend/.env.local file not found!"
fi

echo ""
echo "✅ Verification complete!"

