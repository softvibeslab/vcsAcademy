#!/bin/bash

echo "🚀 VCSA Pocket - Crear Proyecto en Expo"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile

echo "📋 PASO 1: Verificar sesión de Expo"
echo ""
if eas whoami > /dev/null 2>&1; then
    echo "✅ Sesión activa: $(eas whoami | head -1)"
else
    echo "❌ No hay sesión activa. Iniciando..."
    eas login
fi

echo ""
echo "📋 PASO 2: Crear proyecto en Expo"
echo ""
echo "🌐 Abriendo navegador para crear proyecto..."
echo ""

# Abrir el dashboard de Expo en el navegador
open "https://expo.dev"

echo ""
echo "📋 SIGUE ESTOS PASOS EN EL NAVEGADOR:"
echo ""
echo "1. Inicia sesión con: softvibeslab@gmail.com"
echo "2. Clic en 'New Project'"
echo "3. Nombre del proyecto: vcsa-pocket"
echo "4. Clic en 'Create'"
echo "5. Copia el projectId que te mostrarán"
echo "6. Vuelve a esta terminal y presiona ENTER"
echo ""

read -p "Presiona ENTER cuando tengas el projectId..."

echo ""
echo "📋 PASO 3: Ingresa el projectId de Expo"
echo ""
read -p "Pega aquí el projectId: " PROJECT_ID

if [ ! -z "$PROJECT_ID" ]; then
    echo ""
    echo "✅ Actualizando app.json..."

    # Actualizar app.json con el projectId real
    cat > app.json << EOF
{
  "expo": {
    "name": "VCSA Pocket",
    "slug": "vcsa-pocket",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "dark",
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.vcsa.pocket"
    },
    "android": {
      "package": "com.vcsa.pocket",
      "permissions": [
        "RECORD_AUDIO",
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    },
    "web": {
      "bundler": "metro"
    },
    "extra": {
      "eas": {
        "projectId": "$PROJECT_ID"
      }
    }
  }
}
EOF

    echo "✅ projectId actualizado: $PROJECT_ID"
    echo ""
    echo "📋 PASO 4: Iniciando construcción del APK..."
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
else
    echo ""
    echo "❌ No ingresaste un projectId válido"
    echo "Por favor, crea el proyecto en https://expo.dev y obtén el ID"
fi
