#!/bin/bash

echo "🚀 Setting up Temple Management Frontend for local development..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo
echo "🎉 Frontend setup completed!"
echo
echo "Next steps:"
echo "1. Start the development server: npm start"
echo "2. Access the application at: http://localhost:4200"
echo "3. Make sure the backend is running on: http://localhost:8000"
