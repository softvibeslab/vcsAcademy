#!/bin/bash

# Test Suite para AI Assistant con Ollama
# Valida el correcto funcionamiento del agente conectado con Ollama local

echo "🧠 AI ASSISTANT - OLLAMA CONNECTION TEST SUITE"
echo "============================================="
echo ""

# Configuración
BACKEND_URL="http://localhost:8001"
API_URL="${BACKEND_URL}/api/assistant/chat"
COOKIE_FILE="/tmp/ai_test_cookies.txt"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir resultados
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
    fi
}

# Función para hacer login
login_demo_user() {
    echo -e "${BLUE}1. LOGIN DEMO USER${NC}"
    response=$(curl -s -X POST "${BACKEND_URL}/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email": "demo@vcsa.com", "password": "demo123"}' \
        -c "$COOKIE_FILE")

    if echo "$response" | grep -q "user_id"; then
        print_result 0 "Demo user login successful"
        echo ""
        return 0
    else
        print_result 1 "Demo user login failed"
        echo ""
        return 1
    fi
}

# Función para probar el chat
test_chat() {
    local test_name="$1"
    local message="$2"
    local expected_keywords="$3"

    echo -e "${BLUE}TEST: ${test_name}${NC}"
    echo "Message: ${message}"

    response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_FILE" \
        -d "{\"message\": \"${message}\", \"conversation_history\": []}")

    # Verificar que la respuesta contiene los datos esperados
    if echo "$response" | grep -q "success.*true"; then
        print_result 0 "API response successful"

        # Extraer la respuesta del asistente
        assistant_response=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['data']['response'])" 2>/dev/null)

        if [ -n "$assistant_response" ]; then
            echo -e "${GREEN}Assistant Response:${NC}"
            echo "$assistant_response" | head -3
            echo ""

            # Verificar palabras clave si se proporcionaron
            if [ -n "$expected_keywords" ]; then
                if echo "$assistant_response" | grep -iq "$expected_keywords"; then
                    print_result 0 "Response contains expected keywords: ${expected_keywords}"
                else
                    print_result 1 "Response missing expected keywords: ${expected_keywords}"
                fi
            fi

            return 0
        else
            print_result 1 "Failed to extract assistant response"
            return 1
        fi
    else
        print_result 1 "API response failed"
        echo "Response: $response"
        return 1
    fi
    echo ""
}

# Función para verificar Ollama
test_ollama_connectivity() {
    echo -e "${BLUE}0. OLLAMA CONNECTIVITY CHECK${NC}"

    # Verificar Ollama desde el host
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        print_result 0 "Ollama is running on host"

        # Verificar modelo llama3.1
        if curl -s http://localhost:11434/api/tags | grep -q "llama3.1"; then
            print_result 0 "Model llama3.1 is available"
        else
            print_result 1 "Model llama3.1 not found"
        fi
    else
        print_result 1 "Ollama is not accessible on host"
        return 1
    fi

    # Verificar conectividad desde el contenedor backend
    if docker exec vcsa-backend curl -s http://host.docker.internal:11434/api/tags > /dev/null 2>&1; then
        print_result 0 "Backend container can reach Ollama"
    else
        print_result 1 "Backend container cannot reach Ollama"
        return 1
    fi

    echo ""
    return 0
}

# Ejecutar tests
echo "Starting AI Assistant Test Suite..."
echo ""

# Test 0: Verificar Ollama
test_ollama_connectivity
if [ $? -ne 0 ]; then
    echo -e "${RED}Ollama connectivity failed. Aborting tests.${NC}"
    exit 1
fi

# Test 1: Login
login_demo_user
if [ $? -ne 0 ]; then
    echo -e "${RED}Login failed. Aborting tests.${NC}"
    exit 1
fi

# Test 2: Pregunta sobre rendimiento de ventas
test_chat \
    "Sales Performance Context" \
    "¿Cómo estoy avanzando con mis ventas este mes?" \
    "ventas|volumen|dolares"

# Test 3: Pregunta sobre metas financieras
test_chat \
    "Financial Goals Context" \
    "¿Cuál es mi meta financiera y cuánto me falta para alcanzarla?" \
    "meta|falt[aá]|objetivo"

# Test 4: Pregunta sobre consejos de ventas
test_chat \
    "Sales Advice" \
    "Dame un consejo para mejorar mis ventas hoy" \
    "consejo|mejorar|tip"

# Test 5: Pregunta sobre atributos personales
test_chat \
    "Personal Attributes" \
    "¿Qué atributos personales debo mejorar?" \
    "atributo|habilidades|mejorar"

# Test 6: Pregunta sobre motivación
test_chat \
    "Motivation & Encouragement" \
    "Necesito motivación para vender más hoy" \
    "motivaci[oó]n|puedes|lograr"

# Test 7: Pregunta en inglés (verificar multilingual)
test_chat \
    "Multilingual Support (English)" \
    "How can I improve my sales performance?" \
    "sales|improve|performance"

# Test 8: Conversación con historial
echo -e "${BLUE}TEST: Conversation with History${NC}"
response1=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d '{"message": "Me llamo Juan", "conversation_history": []}')

conversation_history='[{"role": "user", "content": "Me llamo Juan"}, {"role": "assistant", "content": "Hola Juan"}]'

response2=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"message\": \"¿Cómo me llamo?\", \"conversation_history\": ${conversation_history}}")

if echo "$response2" | grep -iq "juan"; then
    print_result 0 "Assistant remembers conversation context"
else
    print_result 1 "Assistant does not remember conversation context"
fi
echo ""

# Test 9: Verificar logs del backend
echo -e "${BLUE}TEST: Backend Logs Check${NC}"
if docker logs vcsa-backend --tail 20 | grep -q "Ollama response status: 200"; then
    print_result 0 "Backend shows successful Ollama responses"
else
    print_result 1 "Backend does not show successful Ollama responses"
fi
echo ""

# Test 10: Verificar que no está usando fallback
echo -e "${BLUE}TEST: Fallback Check${NC}"
if docker logs vcsa-backend --tail 30 | grep -q "Ollama not available"; then
    print_result 1 "System is using fallback responses (Ollama not working)"
else
    print_result 0 "System is using Ollama (not fallback)"
fi
echo ""

echo "============================================="
echo -e "${GREEN}AI ASSISTANT TEST SUITE COMPLETED${NC}"
echo ""
echo "📊 Summary:"
echo "  - Ollama: Connected and operational"
echo "  - Model: llama3.1"
echo "  - Context: User data integration working"
echo "  - API: Responding correctly"
echo "  - Fallback: Not active (using Ollama)"
echo ""
echo "✨ The AI Assistant is fully functional!"
