#!/bin/bash

echo "🚀 Iniciando VCSA Pocket Mobile App..."
echo "📱 Para obtener el código QR:"
echo ""
echo "1. Asegúrate de que la app Expo Go esté instalada en tu teléfono"
echo "2. Escanea el código QR que aparecerá a continuación"
echo ""
echo "🌐 Alternativamente, puedes acceder:"
echo "   • Metro Bundler: http://localhost:8081/status"
echo "   • Expo Dev Tools: http://localhost:19002"
echo ""

cd "$(dirname "$0")"

npx expo start
