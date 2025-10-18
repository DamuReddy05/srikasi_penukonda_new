#!/bin/bash

echo "🚀 Setting up Temple Management System Frontend"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "✗ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "✗ Node.js 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✓ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "✗ npm is not installed. Please install npm first."
    exit 1
fi

echo "✓ npm $(npm -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if npm install; then
    echo "✓ Dependencies installed successfully"
else
    echo "✗ Failed to install dependencies"
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f "src/environments/environment.ts" ]; then
    echo ""
    echo "⚠️  Please update src/environments/environment.ts with your configuration"
fi

echo ""
echo "🎉 Frontend setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update src/environments/environment.ts with your API configuration"
echo "2. Start the development server: npm start"
echo "3. Access the application at: http://localhost:4200"
echo ""
echo "Available commands:"
echo "  npm start     - Start development server"
echo "  npm run build - Build for production"
echo "  npm test      - Run tests"
