#!/bin/bash

# 🚀 CODEX SETUP SCRIPT - Fix Executable Permissions
# This script fixes the missing executable permissions for node_modules binaries

echo "🔧 Setting up Crookmon for Codex environment..."
echo "📁 Fixing executable permissions for node_modules/.bin/*"

# Make all files in node_modules/.bin executable
chmod +x node_modules/.bin/*

echo "✅ Jest binary permissions fixed"
echo "✅ All node_modules binaries are now executable"

# Verify Jest is now executable
if [ -x "node_modules/.bin/jest" ]; then
    echo "🎉 SUCCESS: Jest binary is now executable!"
else
    echo "❌ ERROR: Jest binary still not executable"
    exit 1
fi

echo ""
echo "🧪 Testing Jest execution..."

# Test Jest directly
if ./node_modules/.bin/jest --version; then
    echo "✅ Jest version check successful"
else
    echo "❌ Jest version check failed"
    exit 1
fi

echo ""
echo "🚀 Running full test suite..."

# Run the actual tests
npm test

echo ""
echo "🎉 SETUP COMPLETE! Codex environment is ready."
echo "📝 You can now run: npm test, npm run test:coverage, etc."
