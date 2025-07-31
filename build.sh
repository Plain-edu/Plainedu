#!/bin/bash
echo "Building Plain Edu Frontend..."

# Navigate to frontend directory
cd front

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

echo "Build completed successfully!"
