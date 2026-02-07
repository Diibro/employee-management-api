#!/bin/bash

# Employee Management API Setup Script

echo "🚀 Setting up Employee Management API..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi
echo "✅ Node.js found: $(node --version)"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi
echo "✅ pnpm found: $(pnpm --version)"

# Check MySQL
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL not found. Please install MySQL v8 or higher."
    echo "   macOS: brew install mysql"
    echo "   Ubuntu: sudo apt-get install mysql-server"
fi

# Check Redis
if ! command -v redis-cli &> /dev/null; then
    echo "⚠️  Redis not found. Please install Redis v6 or higher."
    echo "   macOS: brew install redis"
    echo "   Ubuntu: sudo apt-get install redis-server"
    echo "   Or run: docker run -d -p 6379:6379 redis:7-alpine"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Setup environment file
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your database credentials."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Update .env file with your database credentials"
echo "   2. Create MySQL database: CREATE DATABASE employee_management;"
echo "   3. Start Redis server"
echo "   4. Run: pnpm start:dev"
echo ""
echo "📚 Documentation: http://localhost:3000/api"
echo ""
