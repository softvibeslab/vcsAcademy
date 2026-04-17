#!/bin/bash

echo "🚀 VCSA Pocket - Constructor de APK Android"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Asegurarse de estar en el directorio correcto
cd "$(dirname "$0")"

echo "📂 Directorio: $(pwd)"
echo ""
echo "✅ Configuración:"
echo "   - Proyecto: VCSA Pocket"
echo "   - Plataforma: Android"
echo "   - Tipo: APK"
echo ""

# Verificar sesión de Expo
echo "🔐 Verificando sesión de Expo..."
if eas whoami > /dev/null 2>&1; then
    echo "   ✅ Sesión activa: $(eas whoami | head -1)"
else
    echo "   ❌ No hay sesión activa"
    echo "   Iniciando sesión..."
    eas login
fi

echo ""
echo "📱 Iniciando construcción del APK..."
echo "   Este proceso tomará 10-15 minutos"
echo ""

# Iniciar el build
eas build --platform android --profile apk

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Proceso completado"
echo ""
echo "📧 Recibirás un email en softvibeslab@gmail.com"
echo "🔗 También puedes ver el progreso en: https://expo.dev"
echo ""
echo "⏱️  Tiempo estimado: 10-15 minutos"
echo "📱 El APK estará listo para instalar en tu teléfono Android"
echo ""
