#!/bin/bash

# Vercel Deployment Health Check Script
# 
# This script checks if your API is healthy after deployment.
# Usage: ./scripts/check-deployment.sh <url>
# Example: ./scripts/check-deployment.sh https://my-api.vercel.app

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get URL from argument
API_URL="${1:-http://localhost:3000}"

echo "🔍 Checking API deployment health..."
echo "📍 Target URL: $API_URL"
echo ""

# Remove trailing slash if present
API_URL="${API_URL%/}"

# Test 1: Root endpoint
echo -n "Testing GET / ... "
if response=$(curl -s -w "\n%{http_code}" "$API_URL/" 2>/dev/null); then
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓${NC} (HTTP $http_code)"
        echo "  Response: $body"
    else
        echo -e "${RED}✗${NC} (HTTP $http_code)"
        echo "  Response: $body"
    fi
else
    echo -e "${RED}✗${NC} Failed to connect"
fi
echo ""

# Test 2: Health check endpoint
echo -n "Testing GET /api/healthz ... "
if response=$(curl -s -w "\n%{http_code}" "$API_URL/api/healthz" 2>/dev/null); then
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓${NC} (HTTP $http_code)"
        echo "  Response: $body"
    else
        echo -e "${RED}✗${NC} (HTTP $http_code)"
        echo "  Response: $body"
    fi
else
    echo -e "${RED}✗${NC} Failed to connect"
fi
echo ""

# Test 3: 404 handler
echo -n "Testing GET /nonexistent ... "
if response=$(curl -s -w "\n%{http_code}" "$API_URL/nonexistent" 2>/dev/null); then
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')
    if [ "$http_code" = "404" ]; then
        echo -e "${GREEN}✓${NC} (HTTP $http_code)"
    else
        echo -e "${YELLOW}⚠${NC} (HTTP $http_code, expected 404)"
    fi
else
    echo -e "${RED}✗${NC} Failed to connect"
fi
echo ""

echo "✅ Health check complete!"
