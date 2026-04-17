#!/bin/bash

# VCSA Production Deployment Script
set -e

echo "🚀 Deploying VCSA Application..."

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker compose -f docker-compose.production.yml down 2>/dev/null || true

# Build and start services
echo "🔨 Building Docker images..."
docker compose -f docker-compose.production.yml build

echo "🚀 Starting services..."
docker compose -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 15

# Check service status
echo "✅ Checking service status..."
docker compose -f docker-compose.production.yml ps

echo "🌐 Application deployed successfully!"
echo ""
echo "📍 Access URLs:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📊 To view logs: docker compose -f docker-compose.production.yml logs -f"
echo "🛑 To stop: docker compose -f docker-compose.production.yml down"