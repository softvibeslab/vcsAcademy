#!/bin/bash

echo "🚀 INICIANDO SISTEMA VCSA - DEPLOY LOCAL"
echo "============================================"
echo ""

cd /Users/newproject/Documents/GitHub/vcsAcademy

echo "📂 Directorio: $(pwd)"
echo ""

echo "🏷️  CONTENEDORES NUEVOS:"
echo "   Frontend:  vcsa-web-local  (puerto 1234)"
echo "   Backend:   vcsa-api-local   (puerto 2345)"
echo "   MongoDB:   vcsa-db-local    (puerto 3456)"
echo ""

echo "🔄 Deteniendo servicios anteriores (si existen)..."
docker-compose -f docker-compose.local.yml down 2>/dev/null || true

echo ""
echo "🚀 Iniciando nuevos servicios..."
echo ""

docker-compose -f docker-compose.local.yml up -d

echo ""
echo "⏳ Esperando a que los servicios estén ready..."
sleep 10

echo ""
echo "🔍 Verificando estado de los servicios:"
docker-compose -f docker-compose.local.yml ps

echo ""
echo "============================================"
echo "✅ SISTEMA INICIADO"
echo ""
echo "🌐 ACCESO NUEVO:"
echo "   Frontend:  http://localhost:1234"
echo "   Backend:   http://localhost:2345"
echo "   MongoDB:   mongodb://localhost:3456"
echo ""
echo "👥 USUARIOS DEMO:"
echo "   Demo:  demo@vcsa.com / demo123"
echo "   Admin: admin@vcsa.com / admin123"
echo ""
echo "📋 Logs en tiempo real:"
echo "   docker-compose -f docker-compose.local.yml logs -f"
echo ""
echo "⏹️  Para detener:"
echo "   docker-compose -f docker-compose.local.yml down"
echo ""
