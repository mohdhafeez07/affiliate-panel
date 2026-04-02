#!/bin/bash

# Configuration and setup script for the Affiliate Panel project

echo "🚀 Starting Full Stack Setup..."

# 1. Root dependencies
echo "📦 Installing root dependencies..."
npm install

# 2. Backend initialization
echo "⚙️  Initializing Backend..."
cd backend
if [ ! -f .env ]; then
  echo "📄 Creating .env for backend from .env.example..."
  cp .env.example .env
fi
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
cd ..

# 3. Frontend initialization
echo "🎨 Initializing Frontend..."
cd frontend
if [ ! -f .env ]; then
  echo "📄 Creating .env for frontend from .env.example..."
  cp .env.example .env
fi
npm install
cd ..

echo "✅ Setup Complete!"
echo "💡 Run 'npm run dev' in both 'backend' and 'frontend' to start development servers."
