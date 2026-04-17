#!/bin/bash

cd "$(dirname "$0")"

echo "🚀 Iniciando VCSA Pocket Mobile App..."

npx expo start --tunnel --non-interactive
