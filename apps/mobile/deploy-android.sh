#!/bin/bash

echo "🚀 VCSA Pocket - Deploy Android APK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cambiar al directorio del proyecto
cd "$(dirname "$0")"

echo "📍 Directorio actual: $(pwd)"
echo ""

# Verificar archivo de configuración
echo "✅ Verificando configuración..."
if [ -f "app.json" ]; then
    echo "   ✓ app.json encontrado"
    cat app.json | grep -A 2 "projectId"
else
    echo "   ✗ app.json no encontrado"
    exit 1
fi

echo ""
echo "📱 Iniciando deploy de Android..."
echo ""

# Ejecutar build
eas build --platform android --profile apk --non-interactive

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Proceso iniciado"
echo ""
echo "📧 Recibirás un email en softvibeslab@gmail.com cuando esté listo"
echo "🔗 También puedes ver el progreso en: https://expo.dev"
echo ""
