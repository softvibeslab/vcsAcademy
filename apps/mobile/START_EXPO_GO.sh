#!/bin/bash

echo "🚀 Iniciando VCSA Pocket con Expo Go"
echo "====================================="
echo ""

# Cambiar al directorio del proyecto móvil
cd "$(dirname "$0")"

echo "📂 Directorio: $(pwd)"
echo ""

echo "📱 Instrucciones:"
echo "1. Descarga 'Expo Go' desde Google Play Store en tu Android"
echo "2. Abre Expo Go"
echo "3. Escanea el QR code que aparecerá abajo"
echo "4. La app usará la API remota por defecto"
echo ""

echo "⏳ Iniciando servidor de desarrollo..."
echo ""

export EXPO_PUBLIC_API_URL="${EXPO_PUBLIC_API_URL:-https://api.salesmastersminds.com/api}"

npx expo start --go --tunnel
