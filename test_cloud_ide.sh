#!/bin/bash
# 🧪 Solar Cloud IDE - Test Script

echo "🧪 Testing Solar Cloud IDE..."

# Test backend health
echo "1️⃣ Testing backend health..."
curl -s http://localhost:4000/api/cloudide/health | jq '.'

echo ""
echo "2️⃣ Testing GitHub integration..."
# Test with a public repository
curl -s -X POST http://localhost:4000/api/cloudide/repo/load \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"owner":"facebook","repo":"react","branch":"main"}' | jq '.'

echo ""
echo "✅ Tests complete!"