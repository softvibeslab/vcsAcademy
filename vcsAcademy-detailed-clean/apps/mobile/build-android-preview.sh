#!/bin/bash

echo "🚀 VCSA Pocket - Android APK Build"
echo "=================================="
echo ""

# Cambiar al directorio del proyecto
cd "$(dirname "$0")"

echo "📂 Directorio: $(pwd)"
echo ""

# Limpiar node_modules y reinstalar
echo "🧹 Limpiando dependencias..."
rm -rf node_modules package-lock.json
echo "✅ Dependencias limpiadas"
echo ""

# Instalar con legacy-peer-deps
echo "📦 Instalando dependencias con --legacy-peer-deps..."
npm install --legacy-peer-deps
echo ""

# Iniciar el build
echo "🔥 Iniciando build del APK..."
eas build --platform android --profile apk --non-interactive
echo ""

echo "=================================="
echo "✅ Proceso completado"
echo ""
