#!/bin/bash

# Setup script to create environment files

echo "🚀 RL Code Agent - Environment Setup"
echo ""

# Backend .env
echo "Creating backend/.env..."
cat > backend/.env << 'EOF'
# Backend Environment Variables
# Fill in your actual values below

OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
ALLOWED_ORIGINS=http://localhost:3000
EOF

# Frontend .env.local
echo "Creating frontend/.env.local..."
cat > frontend/.env.local << 'EOF'
# Frontend Environment Variables
# Fill in your actual values below

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF

echo "✅ Environment files created!"
echo ""
echo "📝 Next steps:"
echo "1. Fill in backend/.env with your credentials"
echo "2. Fill in frontend/.env.local with your credentials"
echo "3. Run database migration in Supabase"
echo ""
echo "See QUICKSTART.md for detailed instructions"

