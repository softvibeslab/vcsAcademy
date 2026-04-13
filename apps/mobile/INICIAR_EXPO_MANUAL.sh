#!/bin/bash

echo "🚀 VCSA Pocket - Iniciando Expo Go"
echo "===================================="
echo ""

# Aumentar límite de archivos
ulimit -n 10240

# Ir al directorio
cd /Users/newproject/Documents/GitHub/vcsAcademy/apps/mobile

echo "📂 Directorio: $(pwd)"
echo ""

echo "📱 Instrucciones:"
echo "1. Descarga 'Expo Go' desde Google Play Store"
echo "2. Abre Expo Go en tu Android"
echo "3. Escanea el QR code que aparecerá"
echo ""

echo "⏳ Iniciando servidor..."
echo ""

# Limpiar cache e iniciar
npx expo start --clear
