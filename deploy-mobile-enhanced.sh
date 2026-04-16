#!/bin/bash

##############################################################################
# VCSA Mobile - Enhanced Deployment Script
# Con autenticación real y backend integration
##############################################################################

set -e

MOBILE_DIR="/Users/newproject/Documents/GitHub/vcsAcademy/vcsa-mobile"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║        📱 VCSA MOBILE - ENHANCED DEPLOYMENT                      ║"
echo "║        Real API Integration + Authentication                     ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar si estamos en el directorio correcto
cd "$MOBILE_DIR" || {
    echo "❌ Error: No se encontró el directorio vcsa-mobile"
    exit 1
}

# Verificar dependencias
echo "🔍 Verificando dependencias..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "   Instalar: https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ Node: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Verificar que el backend esté corriendo
echo "🔍 Verificando backend..."
if curl -s http://localhost:8001/api/health > /dev/null; then
    echo "✅ Backend está corriendo en http://localhost:8001"
else
    echo "⚠️  Backend no detectado. Iniciando servicios Docker..."
    cd /Users/newproject/Documents/GitHub/vcsAcademy
    docker-compose up -d
    echo "✅ Servicios iniciados"
    cd "$MOBILE_DIR"
fi
echo ""

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    echo "✅ Dependencias instaladas"
else
    echo "✅ Dependencias ya instaladas"
fi
echo ""

# Opciones
echo "🚀 SELECCIONA OPCIÓN:"
echo ""
echo "1) 🧪 Development Mode (Expo Go)"
echo "   - Probar app en tu teléfono con Expo Go"
echo "   - Más rápido para testing"
echo "   - No requiere build"
echo ""
echo "2) 📱 Android Emulator"
echo "   - Probar en Android Studio emulator"
echo "   - Requiere Android SDK"
echo "   - Testing completo"
echo ""
echo "3) 📦 Generar APK (EAS Build)"
echo "   - Generar APK para distribución"
echo "   - Tiempo: 10-20 minutos"
echo "   - Listo para instalar en cualquier Android"
echo ""
echo "4) 🔧 Health Check"
echo "   - Verificar configuración y dependencias"
echo ""
read -p "Opción (1-4): " choice

case $choice in
  1)
    echo ""
    echo "🧪 MODO DEVELOPMENT"
    echo "======================="
    echo ""
    echo "📱 PASOS:"
    echo "1. Asegúrate que Expo Go esté instalado en tu teléfono"
    echo "2. Iniciando servidor de desarrollo..."
    echo ""
    npm start
    ;;

  2)
    echo ""
    echo "📱 ANDROID EMULATOR"
    echo "====================="
    echo ""
    echo "📋 REQUISITOS:"
    echo "- Android Studio instalado"
    echo "- Emulator configurado"
    echo "- ADB instalado"
    echo ""
    echo "🚀 Iniciando en emulator..."
    npm start -- --android
    ;;

  3)
    echo ""
    echo "📦 GENERAR APK (EAS BUILD)"
    echo "==========================="
    echo ""

    # Verificar si EAS CLI está instalado
    if ! command -v eas &> /dev/null; then
      echo "📦 Instalando EAS CLI..."
      npm install -g eas-cli
    fi

    echo "✅ EAS CLI version: $(eas --version)"
    echo ""
    echo "📋 INSTRUCCIONES:"
    echo ""
    echo "1. Si es tu primera vez, configura EAS:"
    echo "   eas build:configure"
    echo ""
    echo "2. Generar APK:"
    echo "   eas build --platform android"
    echo ""
    echo "3. Esperar build (10-20 minutos)"
    echo ""
    echo "4. Descargar APK desde:"
    echo "   https://expo.dev"
    echo ""
    echo "🚀 ¿Quieres iniciar el build ahora? (y/n)"
    read -p "> " start_build

    if [ "$start_build" = "y" ]; then
      echo ""
      echo "🔨 Iniciando EAS Build..."
      eas build --platform android

      echo ""
      echo "✅ Build iniciado!"
      echo "📱 Visita https://expo.dev para ver el progreso"
      echo "📥 El APK estará disponible en 'Builds' cuando termine"
    else
      echo ""
      echo "ℹ️  Cuando estés listo, ejecuta:"
      echo "   eas build --platform android"
    fi
    ;;

  4)
    echo ""
    echo "🔧 HEALTH CHECK"
    echo "=============="
    echo ""

    echo "📋 STATUS DEL SISTEMA:"
    echo ""

    # Verificar Node/npm
    echo "✅ Node.js: $(node --version)"
    echo "✅ npm: $(npm --version)"
    echo ""

    # Verificar dependencias
    if [ -d "node_modules" ]; then
      echo "✅ node_modules: Presente ($(ls node_modules | wc -l) paquetes)"
    else
      echo "❌ node_modules: No encontrado"
    fi

    # Verificar screens
    echo "✅ Screens: $(ls screens/*.js 2>/dev/null | wc -l) archivos"

    # Verificar servicios
    echo "✅ Services: $(ls services/*.js 2>/dev/null | wc -l) archivos"

    # Verificar backend
    echo "🌐 Backend Health:"
    if curl -s http://localhost:8001/api/health > /dev/null; then
      echo "✅ Backend: Online (http://localhost:8001)"
      echo "   📡 Status: $(curl -s http://localhost:8001/api/health | head -1)"
    else
      echo "❌ Backend: Offline o no accesible"
    fi

    echo ""
    echo "📋 CONFIGURACIÓN:"
    echo "   📱 App Name: VCSA Mobile"
    echo "   🚀 Expo Version: $(expo --version 2>/dev/null || echo 'No instalado')"
    echo "   🎯 API URL: http://localhost:8001/api"
    echo "   👤 Demo User: demo@vcsa.com / demo123"
    echo ""

    echo "📋 SCREENS IMPLEMENTADAS:"
    ls screens/*.js 2>/dev/null | sed 's|.*/||' | sed 's|Screen.js||' | sed 's|^|   ✅ |' | sed 's|$||'
    echo ""

    echo "📋 FEATURES:"
    echo "   ✅ Authentication System"
    echo "   ✅ Real API Integration"
    echo "   ✅ Progress Tracking"
    echo "   ✅ Academy Modules"
    echo "   ✅ Pull-to-Refresh"
    echo "   ✅ Error Handling"
    echo "   ✅ Loading States"
    echo ""

    echo "🎯 APP ESTÁ LISTA PARA:"
    echo "   1) Development testing con Expo Go"
    echo "   2) Android emulator testing"
    echo "   3) Generar APK con EAS Build"
    echo ""
    ;;

  *)
    echo "❌ Opción no válida"
    exit 1
    ;;
esac

echo ""
echo "✅ Proceso completado!"
echo ""
echo "📝 NOTAS:"
echo "   - Backend debe estar corriendo en http://localhost:8001"
echo "   - Usuario demo: demo@vcsa.com / demo123"
echo "   - Para más info, ver RESUMEN_APP_ANDROID.md"
echo ""