# Configuration and setup script for the Affiliate Panel project (Windows)

Write-Host "🚀 Starting Full Stack Setup..." -ForegroundColor Cyan

# 1. Root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Green
npm install

# 2. Backend initialization
Write-Host "⚙️  Initializing Backend..." -ForegroundColor Green
cd backend
if (-not (Test-Path .env)) {
  Write-Host "📄 Creating .env for backend from .env.example..." -ForegroundColor Yellow
  Copy-Item .env.example .env
}
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
cd ..

# 3. Frontend initialization
Write-Host "🎨 Initializing Frontend..." -ForegroundColor Green
cd frontend
if (-not (Test-Path .env)) {
  Write-Host "📄 Creating .env for frontend from .env.example..." -ForegroundColor Yellow
  Copy-Item .env.example .env
}
npm install
cd ..

Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "💡 Run 'npm run dev' in both 'backend' and 'frontend' to start development servers." -ForegroundColor Cyan
