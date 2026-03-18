#!/bin/bash
set -e

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║            🚀 DEPLOY PREVIEW - WHITE-LABEL PLATFORM                          ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

COMMIT_SHA=$(git rev-parse --short HEAD)
echo "📝 Deploying commit: $COMMIT_SHA"
echo ""

# Create preview docker-compose
cat > docker-compose.preview.yml <<EOF
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
    depends_on:
      - backend-preview
    networks:
      - vcsa-preview
    restart: unless-stopped

volumes:
  mongodb_preview_data

networks:
  vcsa-preview:
    driver: bridge
EOF

# Stop existing
echo "🛑 Stopping existing services..."
docker-compose -f docker-compose.preview.yml down 2>/dev/null || true

# Start preview
echo "🚀 Starting preview services..."
docker-compose -f docker-compose.preview.yml up -d --build

echo ""
echo "⏳ Waiting for services..."
sleep 8

echo ""
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                       ✅ PREVIEW LIVE                                       ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 URLs:"
echo "   Frontend:  http://localhost:3001"
echo "   Backend:   http://localhost:8001"
echo "   API Docs:  http://localhost:8001/docs"
echo ""
echo "📊 Container Status:"
docker-compose -f docker-compose.preview.yml ps
echo ""
SCRIPT

chmod +x deploy-preview-simple.sh
./deploy-preview-simple.sh
