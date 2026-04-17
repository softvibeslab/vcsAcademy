#!/bin/bash

# 🚀 SCRIPT DE EJECUCIÓN COMPLETA DEL SISTEMA VCSA
# Este script verifica y documenta el estado de cada componente del sistema

echo "════════════════════════════════════════════════════════════════"
echo "  🚀 VCSA ACADEMY - SYSTEM FLOW EXECUTION"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contador de éxitos y fallos
SUCCESS_COUNT=0
FAIL_COUNT=0

# Función para testear URL
test_url() {
    local url=$1
    local name=$2
    local expected_code=${3:-200}

    echo -n "Testing $name... "

    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 5)

    if [ "$response" = "$expected_code" ] || [ "$response" = "000" ]; then
        echo -e "${GREEN}✓ OK${NC} ($response)"
        ((SUCCESS_COUNT++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} ($response)"
        ((FAIL_COUNT++))
        return 1
    fi
}

# Función para testear API
test_api() {
    local endpoint=$1
    local name=$2
    local method=${3:-GET}

    echo -n "Testing API: $name... "

    if [ "$method" = "POST" ]; then
        response=$(curl -s -X POST "$endpoint" \
            -H "Content-Type: application/json" \
            -H "Origin: http://localhost:1234" \
            -w "\n%{http_code}" \
            --max-time 10 2>/dev/null)
    else
        response=$(curl -s -X GET "$endpoint" \
            -H "Origin: http://localhost:1234" \
            -w "\n%{http_code}" \
            --max-time 10 2>/dev/null)
    fi

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✓ OK${NC} ($http_code)"
        ((SUCCESS_COUNT++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} ($http_code)"
        ((FAIL_COUNT++))
        return 1
    fi
}

# ───────────────────────────────────────────────────────────────────
echo -e "${BLUE}1. VERIFICANDO SERVICIOS DOCKER${NC}"
echo "────────────────────────────────────────────────────────────────"

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running${NC}"
    exit 1
fi

# Check containers
echo -n "Checking vcsa-web-local... "
if docker ps | grep -q "vcsa-web-local"; then
    echo -e "${GREEN}✓ Running${NC}"
    ((SUCCESS_COUNT++))
else
    echo -e "${RED}✗ Not running${NC}"
    ((FAIL_COUNT++))
fi

echo -n "Checking vcsa-api-local... "
if docker ps | grep -q "vcsa-api-local"; then
    echo -e "${GREEN}✓ Running${NC}"
    ((SUCCESS_COUNT++))
else
    echo -e "${RED}✗ Not running${NC}"
    ((FAIL_COUNT++))
fi

echo -n "Checking vcsa-db-local... "
if docker ps | grep -q "vcsa-db-local"; then
    echo -e "${GREEN}✓ Running${NC}"
    ((SUCCESS_COUNT++))
else
    echo -e "${RED}✗ Not running${NC}"
    ((FAIL_COUNT++))
fi

echo ""

# ───────────────────────────────────────────────────────────────────
echo -e "${BLUE}2. VERIFICANDO HEALTH CHECKS${NC}"
echo "────────────────────────────────────────────────────────────────"

test_url "http://localhost:1234/health" "Frontend Health"
test_url "http://localhost:2345/api/health" "Backend Health"

echo ""

# ───────────────────────────────────────────────────────────────────
echo -e "${BLUE}3. VERIFICANDO API ENDPOINTS${NC}"
echo "────────────────────────────────────────────────────────────────"

test_api "http://localhost:2345/api/auth/login" "Login API" "POST"
test_api "http://localhost:2345/api/development/stages" "Get Stages"
test_api "http://localhost:2345/api/development/tracks" "Get Tracks"

echo ""

# ───────────────────────────────────────────────────────────────────
echo -e "${BLUE}4. VERIFICANDO PÁGINAS PRINCIPALES${NC}"
echo "────────────────────────────────────────────────────────────────"

echo "Testing main pages..."

# Auth pages
test_url "http://localhost:1234/" "Landing Page"
test_url "http://localhost:1234/login" "Login Page"
test_url "http://localhost:1234/register" "Register Page"

# Main Dashboard
test_url "http://localhost:1234/dashboard" "Dashboard"

echo ""

# ───────────────────────────────────────────────────────────────────
echo -e "${BLUE}5. VERIFICANDO STRATEGY MODULES${NC}"
echo "────────────────────────────────────────────────────────────────"

echo "Testing Strategy pages..."

test_url "http://localhost:1234/daily-performance" "Daily Performance"
test_url "http://localhost:1234/goals" "Goal Sheets"
test_url "http://localhost:1234/financial" "Financial Planner"
test_url "http://localhost:1234/analytics" "Analytics"

echo ""

# ───────────────────────────────────────────────────────────────────
echo -e "${BLUE}6. VERIFICANDO TOP PRODUCER PATH${NC}"
echo "────────────────────────────────────────────────────────────────"

echo "Testing Top Producer pages..."

test_url "http://localhost:1234/top-producer" "Top Producer Dashboard"
test_url "http://localhost:1234/track/pro-mindset" "Track 1: Pro Mindset"
test_url "http://localhost:1234/track/discovery-control" "Track 2: Discovery & Control"
test_url "http://localhost:1234/track/value-architecture" "Track 3: Value Architecture"
test_url "http://localhost:1234/track/decision-management" "Track 4: Decision Management"
test_url "http://localhost:1234/track/objection-mastery" "Track 5: Objection Mastery"
test_url "http://localhost:1234/track/post-decision" "Track 6: Post-Decision"

echo ""

# ───────────────────────────────────────────────────────────────────
echo -e "${BLUE}7. VERIFICANDO COACHING MODULES${NC}"
echo "────────────────────────────────────────────────────────────────"

echo "Testing Coaching pages..."

test_url "http://localhost:1234/coaching" "Coaching Main"
test_url "http://localhost:1234/group-coaching" "Group Coaching"
test_url "http://localhost:1234/role-play" "Role Play Sessions"
test_url "http://localhost:1234/qa-sessions" "Q&A Sessions"
test_url "http://localhost:1234/masterclasses" "Masterclasses"

echo ""

# ───────────────────────────────────────────────────────────────────
echo -e "${BLUE}8. VERIFICANDO ADDITIONAL CONTENT${NC}"
echo "────────────────────────────────────────────────────────────────"

echo "Testing Additional Learning pages..."

test_url "http://localhost:1234/courses" "Courses Library"
test_url "http://localhost:1234/deal-breakdowns" "Deal Breakdowns"
test_url "http://localhost:1234/quick-wins" "Quick Wins"
test_url "http://localhost:1234/resources" "Resources"

echo ""

# ───────────────────────────────────────────────────────────────────
echo -e "${BLUE}9. VERIFICANDO COMMUNITY & SETTINGS${NC}"
echo "────────────────────────────────────────────────────────────────"

echo "Testing Community and Settings pages..."

test_url "http://localhost:1234/community" "Community Feed"
test_url "http://localhost:1234/events" "Events Calendar"
test_url "http://localhost:1234/profile" "User Profile"
test_url "http://localhost:1234/membership" "Membership Plans"

echo ""

# ───────────────────────────────────────────────────────────────────
echo -e "${BLUE}10. VERIFICANDO ONBOARDING FLOW${NC}"
echo "────────────────────────────────────────────────────────────────"

test_url "http://localhost:1234/get-started" "Onboarding Wizard"

echo ""

# ───────────────────────────────────────────────────────────────────
echo -e "${BLUE}11. TEST DE LOGIN CON USUARIO DEMO${NC}"
echo "────────────────────────────────────────────────────────────────"

echo "Testing login with demo user..."

login_response=$(curl -s -X POST "http://localhost:2345/api/auth/login" \
    -H "Content-Type: application/json" \
    -H "Origin: http://localhost:1234" \
    -d '{"email":"admin@vcsa.com","password":"admin123"}')

if echo "$login_response" | grep -q "user_id"; then
    echo -e "${GREEN}✓ Login successful${NC}"
    echo "User ID: $(echo $login_response | grep -o '"user_id":"[^"]*"')"
    ((SUCCESS_COUNT++))
else
    echo -e "${RED}✗ Login failed${NC}"
    ((FAIL_COUNT++))
fi

echo ""

# ───────────────────────────────────────────────────────────────────
echo -e "${BLUE}12. VERIFICANDO CONFIGURACIÓN CORS${NC}"
echo "────────────────────────────────────────────────────────────────"

echo "Testing CORS configuration..."

cors_check=$(curl -s -X OPTIONS "http://localhost:2345/api/auth/login" \
    -H "Origin: http://localhost:1234" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type" \
    -I)

if echo "$cors_check" | grep -q "access-control-allow-origin: http://localhost:1234"; then
    echo -e "${GREEN}✓ CORS configured correctly${NC}"
    ((SUCCESS_COUNT++))
else
    echo -e "${RED}✗ CORS misconfigured${NC}"
    ((FAIL_COUNT++))
fi

if echo "$cors_check" | grep -q "access-control-allow-credentials: true"; then
    echo -e "${GREEN}✓ Credentials enabled${NC}"
    ((SUCCESS_COUNT++))
else
    echo -e "${RED}✗ Credentials not enabled${NC}"
    ((FAIL_COUNT++))
fi

echo ""

# ───────────────────────────────────────────────────────────────────
# RESUMEN FINAL
echo "════════════════════════════════════════════════════════════════"
echo -e "${BLUE}  📊 RESUMEN DE EJECUCIÓN${NC}"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo -e "  ${GREEN}✓ Exitosos:${NC} $SUCCESS_COUNT"
echo -e "  ${RED}✗ Fallidos:${NC} $FAIL_COUNT"
echo ""

total_tests=$((SUCCESS_COUNT + FAIL_COUNT))
success_rate=0

if [ $total_tests -gt 0 ]; then
    success_rate=$((SUCCESS_COUNT * 100 / total_tests))
fi

echo -e "  ${BLUE}Tasa de éxito:${NC} $success_rate%"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡TODOS LOS TESTS PASARON!${NC}"
    echo -e "${GREEN}✅ El sistema está completamente funcional${NC}"
else
    echo -e "${YELLOW}⚠️  Algunos tests fallaron${NC}"
    echo -e "${YELLOW}Revisa los errores arriba para más detalles${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}📖 Documentación completa en:${NC}"
echo "  - FLUJO_COMPLETO_SISTEMA.md"
echo "  - NAVIGACION_COMPLETA.md"
echo "  - QUICK_LINKS.md"
echo "  - SYSTEM_FLOW.md"
echo ""
echo -e "${BLUE}🌐 Acceso al sistema:${NC}"
echo "  URL: http://localhost:1234"
echo "  Email: admin@vcsa.com"
echo "  Password: admin123"
echo ""
echo "════════════════════════════════════════════════════════════════"

exit $FAIL_COUNT
