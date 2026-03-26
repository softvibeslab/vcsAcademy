#!/bin/bash

# VCSA Demo Launcher
# Script para abrir el demo en el navegador

echo "🚀 VCSA Demo Launcher"
echo "===================="
echo ""
echo "Opciones disponibles:"
echo ""
echo "1. Demo interactivo completo (recomendado)"
echo "2. Tour guiado de 10 pasos"
echo "3. Abrir con servidor local"
echo ""
read -p "Selecciona una opción (1-3): " option

case $option in
    1)
        echo "📱 Abriendo demo interactivo..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open index.html
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open index.html
        else
            start index.html
        fi
        ;;
    2)
        echo "📖 Abriendo tour guiado..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open tour.html
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open tour.html
        else
            start tour.html
        fi
        ;;
    3)
        echo "🌐 Iniciando servidor local..."
        echo "El demo estará disponible en http://localhost:8000"
        echo "Presiona Ctrl+C para detener el servidor"
        echo ""
        python3 -m http.server 8000
        ;;
    *)
        echo "❌ Opción no válida"
        exit 1
        ;;
esac
