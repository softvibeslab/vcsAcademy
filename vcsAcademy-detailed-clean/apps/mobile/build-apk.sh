#!/bin/bash

echo "🚀 VCSA Pocket - Constructor de APK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Este script construirá un APK de Android para VCSA Pocket"
echo ""

cd "$(dirname "$0")"

# Verificar si hay una sesión activa
if ! eas whoami > /dev/null 2>&1; then
    echo "❌ No hay sesión de Expo activa. Iniciando sesión..."
    eas login
fi

echo "📱 Iniciando construcción del APK..."
echo ""

# Construir el APK
eas build --platform android --profile apk

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Proceso de construcción iniciado"
echo ""
echo "📧 Recibirás un email cuando el APK esté listo"
echo "🔗 También puedes ver el progreso en: https://expo.dev"
echo ""
echo "⏱️  El proceso suele tomar 5-10 minutos"
echo ""
