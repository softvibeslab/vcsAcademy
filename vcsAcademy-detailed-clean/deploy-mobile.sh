#!/bin/bash

##############################################################################
# VCSA Mobile APK Build Script
# Genera APK de Android usando Expo EAS
##############################################################################

set -e

MOBILE_DIR="/Users/newproject/Documents/GitHub/vcsAcademy/vcsa-mobile"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║        📱 VCSA MOBILE - APK BUILDER                               ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar si estamos en el directorio correcto
cd "$MOBILE_DIR" || {
    echo "❌ Error: No se encontró el directorio vcsa-mobile"
    exit 1
}

# Verificar node y npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "   Instalar: https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ Directorio: $MOBILE_DIR"
echo "✅ Node: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Opciones
echo "Selecciona método de build:"
echo "1) EAS Build (Recomendado - Cloud)"
echo "2) Local Build (Requiere Android SDK)"
echo ""
read -p "Opción (1 o 2): " choice

case $choice in
  1)
    echo ""
    echo "🚀 MÉTODO EAS BUILD (Cloud)"
    echo "─────────────────────────────────────────"
    echo ""
    echo "Este método:"
    echo "  • Usa servidores de Expo"
    echo "  • No requiere Android SDK local"
    echo "  • Genera APK optimizado"
    echo "  • Tiempo: 10-20 minutos"
    echo ""
    read -p "¿Continuar? (y/n): " confirm

    if [[ $confirm == [yY] ]]; then
      # Instalar dependencias
      echo ""
      echo "📦 Instalando dependencias..."
      npm install || {
        echo "❌ Error al instalar dependencias"
        exit 1
      }
      echo "✅ Dependencias instaladas"
      echo ""

      # Verificar Expo CLI
      if ! command -v expo &> /dev/null; then
        echo "📦 Instalando Expo CLI..."
        npm install -g expo-cli
        echo "✅ Expo CLI instalado"
        echo ""
      fi

      # Login en Expo
      echo "🔐 Login en Expo..."
      echo "   (Se abrirá navegador para autenticarse)"
      echo ""
      expo login || {
        echo "⚠️  Warning: Login puede ya estar completado"
      }
      echo ""

      # Configurar EAS
      echo "⚙️  Configurando EAS..."
      eas build:configure || {
        echo "⚠️  Warning: EAS puede ya estar configurado"
      }
      echo ""

      # Iniciar build
      echo "🔨 Iniciando build de Android APK..."
      echo "   (Esto tomará 10-20 minutos)"
      echo "   Puedes monitorear el progreso en: https://expo.dev"
      echo ""

      eas build --platform android || {
        echo ""
        echo "❌ Error durante build"
        echo "   Revisa: https://expo.dev para ver logs"
        exit 1
      }

      echo ""
      echo "✅ BUILD COMPLETADO"
      echo ""
      echo "📥 Descargar APK:"
      echo "   1. Visita: https://expo.dev"
      echo "   2. Busca proyecto: vcsa-mobile-preview"
      echo "   3. Ve a 'Builds'"
      echo "   4. Descarga el APK"
      echo ""
    fi
    ;;

  2)
    echo ""
    echo "🚀 MÉTODO LOCAL BUILD"
    echo "─────────────────────────────────────────"
    echo ""
    echo "Este método:"
    echo "  • Compila localmente"
    echo "  • Requiere Android SDK"
    echo "  • Tiempo: 30-60 minutos"
    echo "  • Más control pero más complejo"
    echo ""
    read -p "¿Continuar? (y/n): " confirm

    if [[ $confirm == [yY] ]]; then
      # Instalar dependencias
      echo ""
      echo "📦 Instalando dependencias..."
      npm install || {
        echo "❌ Error al instalar dependencias"
        exit 1
      }
      echo "✅ Dependencias instaladas"
      echo ""

      # Preparar Android build
      echo "🤖 Preparando build de Android..."
      expo build:android || {
        echo ""
        echo "❌ Error durante build local"
        echo "   Asegúrate de tener Android SDK instalado"
        echo "   Y variables de entorno configuradas"
        exit 1
      }

      echo ""
      echo "✅ BUILD COMPLETADO"
      echo ""
      echo "📥 APK generado:"
      echo "   vcsa-mobile/android/app/build/outputs/apk/debug/vcsa-mobile.apk"
      echo ""
    fi
    ;;

  *)
    echo "❌ Opción inválida"
    exit 1
    ;;
esac

echo "═════════════════════════════════════════════════════════════════"
echo ""
echo "📱 INSTALACIÓN DEL APK"
echo ""
echo "1. Transfiere el APK a tu dispositivo Android"
echo "2. En tu dispositivo: Settings → Security → Unknown sources"
echo "3. Habilita 'Unknown sources'"
echo "4. Abre el APK desde File Manager"
echo "5. Instala"
echo ""
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo "✅ VCSA Mobile APK Builder completado"
echo ""
