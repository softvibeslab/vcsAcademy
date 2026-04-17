#!/bin/bash

echo "🚀 VCSA Pocket - Build APK Android"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile

echo "📂 Directorio: $(pwd)"
echo ""
echo "✅ Proyecto configurado con projectId:"
echo "   2595a981-f335-4ccc-b1b3-675c3eb735b0"
echo ""
echo "🔐 Verificando sesión..."
if eas whoami > /dev/null 2>&1; then
    echo "   ✅ Sesión activa: $(eas whoami | head -1)"
else
    echo "   ❌ No hay sesión activa"
    echo "   Iniciando sesión..."
    eas login
fi

echo ""
echo "📱 Iniciando build del APK..."
echo "   Plataforma: Android"
echo "   Tipo: APK"
echo "   Tiempo estimado: 10-15 minutos"
echo ""

# Iniciar el build
eas build --platform android --profile apk

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Build iniciado"
echo ""
echo "📧 Recibirás un email en softvibeslab@gmail.com"
echo "🔗 O ve a: https://expo.dev/accounts/softvibeslab/projects"
echo ""
echo "⏱️  Tiempo estimado: 10-15 minutos"
echo ""
