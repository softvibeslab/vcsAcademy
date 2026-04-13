#!/bin/bash

echo "🔧 VCSA Pocket - Fix Dependencies & Build APK"
echo "=============================================="
echo ""

cd "$(dirname "$0")"

echo "📂 Directorio: $(pwd)"
echo ""

echo "🧹 Paso 1: Limpiando dependencias..."
rm -rf node_modules package-lock.json
echo "✅ Dependencias limpiadas"
echo ""

echo "📦 Paso 2: Instalando dependencias compatibles..."
npm install --legacy-peer-deps
echo "✅ Dependencias instaladas"
echo ""

echo "🔥 Paso 3: Iniciando build del APK..."
eas build --platform android --profile apk
echo ""

echo "=============================================="
echo "✅ Proceso completado"
echo ""
