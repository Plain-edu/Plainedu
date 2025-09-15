#!/bin/bash

echo "🚀 Setting up PlainEdu Codespace with MySQL..."

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
until mysqladmin ping -h localhost --silent; do
    echo "Waiting for MySQL..."
    sleep 2
done
echo "✅ MySQL is ready!"

# Install dependencies
echo "📦 Installing backend dependencies..."
cd /workspaces/Plainedu/back && npm install

echo "📦 Installing frontend dependencies..."  
cd /workspaces/Plainedu/front && npm install

# Test MySQL connection
echo "🔧 Testing MySQL connection..."
mysql -h localhost -u root -pplain -e "SHOW DATABASES;" || echo "❌ MySQL connection failed"

# Create database if not exists (should be handled by docker-entrypoint-initdb.d)
echo "📊 Database setup complete!"

# Make scripts executable
chmod +x /workspaces/Plainedu/start-dev.sh
chmod +x /workspaces/Plainedu/start-backend.sh
chmod +x /workspaces/Plainedu/stop-backend.sh

echo "✅ PlainEdu Codespace setup complete!"
echo ""
echo "🎯 Quick Start:"
echo "  ./start-dev.sh     - Start both frontend and backend"
echo "  ./start-backend.sh - Start backend only (for API testing)"
echo ""
echo "🌐 Access URLs will be auto-generated for Codespaces"