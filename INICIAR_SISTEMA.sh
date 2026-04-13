#!/bin/bash

echo "🚀 INICIANDO SISTEMA VCSA"
echo "========================="
echo ""

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "⚠️  Docker no está corriendo"
    echo "📋 INSTRUCCIONES:"
    echo ""
    echo "1. Abre Docker Desktop en tu Mac"
    echo "2. Espera a que Docker esté completamente iniciado"
    echo "3. Vuelve a ejecutar este script"
    echo ""
    echo "O si Docker Desktop no está instalado:"
    echo "→ Descárgalo de: https://www.docker.com/products/docker-desktop/"
    echo ""
    exit 1
fi

echo "✅ Docker está corriendo"
echo ""

# Ir al directorio del proyecto
cd /Users/newproject/Documents/GitHub/vcsAcademy

echo "📂 Directorio: $(pwd)"
echo ""

echo "🔄 Iniciando servicios (MongoDB, Backend, Frontend)..."
echo ""

# Iniciar servicios
docker-compose up -d

echo ""
echo "⏳ Esperando a que los servicios estén ready..."
echo ""

sleep 10

echo "🔍 Verificando estado de los servicios..."
docker-compose ps

echo ""
echo "========================="
echo "✅ SISTEMA INICIADO"
echo ""
echo "🌐 ACCESO:"
echo "   Frontend:  http://localhost"
echo "   Backend:   http://localhost:8001"
echo "   MongoDB:   mongodb://localhost:27019"
echo ""
echo "👥 USUARIOS DEMO:"
echo "   Demo:  demo@vcsa.com / demo123"
echo "   Admin: admin@vcsa.com / admin123"
echo ""
echo "📋 Logs en tiempo real:"
echo "   docker-compose logs -f"
echo ""
