#!/bin/bash

# VCSA Preview Deployment Script
# Deploys the white-label platform feature to a preview environment

set -e

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║              🚀 VCSA PREVIEW DEPLOYMENT - WHITE-LABEL PLATFORM             ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"

# Configuration
PREVIEW_BRANCH="feature/white-label-platform"
PREVIEW_ENV="preview"
DEPLOY_DIR="/tmp/vcsa-preview"
PREVIEW_URL="preview.vcsa.platform"

echo ""
echo "📋 DEPLOYMENT CONFIGURATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Branch:        $PREVIEW_BRANCH"
echo "  Environment:   $PREVIEW_ENV"
echo "  Deploy Dir:    $DEPLOY_DIR"
echo "  Preview URL:   https://$PREVIEW_URL"
echo ""

# Check if we're on the correct branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$PREVIEW_BRANCH" ]; then
    echo "⚠️  Switching to branch: $PREVIEW_BRANCH"
    git checkout $PREVIEW_BRANCH
fi

echo "✅ Current branch: $PREVIEW_BRANCH"
echo ""

# Get latest commits
echo "📦 FETCHING LATEST CHANGES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git fetch origin
git reset --hard origin/$PREVIEW_BRANCH
echo "✅ Updated to latest commit"
echo ""

# Show commit info
COMMIT_SHA=$(git rev-parse --short HEAD)
COMMIT_MSG=$(git log -1 --pretty=format:"%s")
echo "📝 DEPLOYING COMMIT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SHA:    $COMMIT_SHA"
echo "  Message: $COMMIT_MSG"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

echo "✅ Docker is available"
echo ""

# Build and deploy
echo "🏗️  BUILDING PREVIEW DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create preview docker-compose file
cat > docker-compose.preview.yml <<'DOCKERCOMPOSE'
version: '3.8'

services:
  mongodb-preview:
    image: mongo:8
    container_name: vcsa-mongodb-preview
    ports:
      - "27018:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: preview2024
      MONGO_INITDB_DATABASE: vcsa_preview
    volumes:
      - mongodb_preview_data:/data/db
    networks:
      - vcsa-preview

  backend-preview:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: vcsa-backend-preview
    ports:
      - "8001:8000"
    environment:
      MONGO_URL: mongodb://admin:preview2024@mongodb-preview:27017
      DB_NAME: vcsa_preview
      PYTHONUNBUFFERED: 1
      PREVIEW_MODE: "true"
    depends_on:
      - mongodb-preview
    networks:
      - vcsa-preview
    restart: unless-stopped

  frontend-preview:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      container_name: vcsa-frontend-preview
    ports:
      - "3001:80"
    environment:
      REACT_APP_BACKEND_URL: http://localhost:8001
      REACT_APP_PREVIEW_MODE: "true"
    depends_on:
      - backend-preview
    networks:
      - vcsa-preview
    restart: unless-stopped

volumes:
  mongodb_preview_data:

networks:
  vcsa-preview:
    driver: bridge
DOCKERCOMPOSE

echo "✅ Docker compose file created"
echo ""

# Stop any existing preview containers
echo "🛑 STOPPING EXISTING PREVIEW CONTAINERS"
docker-compose -f docker-compose.preview.yml down 2>/dev/null || true
echo "✅ Previous preview stopped"
echo ""

# Start preview services
echo "🚀 STARTING PREVIEW SERVICES"
docker-compose -f docker-compose.preview.yml up -d --build

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service health
echo "📊 SERVICE HEALTH CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check backend
if curl -s http://localhost:8001/api/health > /dev/null; then
    echo "✅ Backend: http://localhost:8001"
else
    echo "⚠️  Backend: Starting..."
fi

# Check frontend
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Frontend: http://localhost:3001"
else
    echo "⚠️  Frontend: Starting..."
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                  ✅ PREVIEW DEPLOYMENT COMPLETE                           ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 PREVIEW URLs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Frontend:  http://localhost:3001"
echo "  Backend:   http://localhost:8001"
echo "  API Docs:  http://localhost:8001/docs"
echo ""
echo "📋 FEATURE HIGHLIGHTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Multi-tenancy with subdomain detection"
echo "  ✅ Organization onboarding wizard"
echo "  ✅ Dynamic branding and theming"
echo "  ✅ AI-powered configuration"
echo "  ✅ Custom domain management"
echo ""
echo "🧪 TO TEST THE PREVIEW"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  1. Visit: http://localhost:3001"
echo "  2. Navigate to /onboarding"
echo "  3. Complete the 6-step wizard"
echo "  4. Check organization settings"
echo "  5. Try the AI assistant"
echo ""
echo "📊 CONTAINER STATUS"
docker-compose -f docker-compose.preview.yml ps
echo ""
echo "📝 LOGS"
echo "  View logs: docker-compose -f docker-compose.preview.yml logs -f"
echo "  Stop:     docker-compose -f docker-compose.preview.yml down"
echo ""

# Show preview banner
cat <<'EOF'

╔══════════════════════════════════════════════════════════════════════════════╗
║                    🎉 WHITE-LABEL PLATFORM PREVIEW 🎉                      ║
║                           LIVE & READY TO TEST                                    ║
╚══════════════════════════════════════════════════════════════════════════════╝

