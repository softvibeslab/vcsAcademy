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
echo ""

echo "⏳ Iniciando servidor de desarrollo..."
echo ""

npm start
