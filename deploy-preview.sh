#!/bin/bash

# VCSA MVP Preview Deployment - Validation Script
# Script para validar que todos los componentes del MVP estén funcionando

echo "🚀 VCSA MVP PREVIEW DEPLOYMENT - VALIDATION"
echo "============================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contador de tests
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Función para ejecutar tests
run_test() {
    local test_name=$1
    local test_command=$2

    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing: $test_name... "

    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo "1️⃣  CHECKING CONTAINERS"
echo "========================"

# Check if containers are running
run_test "Frontend container is running" "docker ps | grep -q vcsa-frontend"
run_test "Backend container is running" "docker ps | grep -q vcsa-backend"
run_test "MongoDB container is running" "docker ps | grep -q vcsa-mongodb"

echo ""
echo "2️⃣  CHECKING ENDPOINTS"
echo "========================"

# Test public endpoints
run_test "Health check endpoint" "curl -f http://localhost:8001/api/health"
run_test "Public courses endpoint" "curl -f http://localhost:8001/api/public/courses"
run_test "Phase 1 tracks endpoint" "curl -f http://localhost:8001/api/development/tracks"
run_test "Skool track endpoint" "curl -f http://localhost:8001/api/development/tracks/track_skool_roadmap"
run_test "Admin team stats endpoint" "curl -f http://localhost:8001/api/ai-assistant/public/admin/team-stats"
run_test "Knowledge items endpoint" "curl -f http://localhost:8001/api/ai-assistant/public/knowledge/items"
run_test "Files list endpoint" "curl -f http://localhost:8001/api/ai-assistant/public/files/list"

echo ""
echo "3️⃣  CHECKING FRONTEND PAGES"
echo "=========================="

# Test frontend pages
run_test "Frontend is accessible" "curl -f http://localhost/"
run_test "Courses page is accessible" "curl -f http://localhost/courses"
run_test "Development page is accessible" "curl -f http://localhost/development"
run_test "Admin panel is accessible" "curl -f http://localhost/admin"

echo ""
echo "4️⃣  CHECKING DATABASE"
echo "===================="

# Check MongoDB collections
run_test "MongoDB users collection" "docker exec vcsa-mongodb mongosh -u admin -p vcsa_local_dev_2024 --authenticationDatabase admin vcsa --quiet --eval 'db.users.countDocuments()'"
run_test "MongoDB courses collection" "docker exec vcsa-mongodb mongosh -u admin -p vcsa_local_dev_2024 --authenticationDatabase admin vcsa --quiet --eval 'db.courses.countDocuments()'"
run_test "MongoDB Phase 1 tracks" "docker exec vcsa-mongodb mongosh -u admin -p vcsa_local_dev_2024 --authenticationDatabase admin vcsa --quiet --eval 'db.phase1_tracks.countDocuments()'"

echo ""
echo "5️⃣  CHECKING INTEGRATION"
echo "======================"

# Check content integration
echo -e "${BLUE}Checking Skool courses...${NC}"
SKOOL_COURSES=$(curl -s http://localhost:8001/api/public/courses | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('total', 0))" 2>/dev/null)
if [ "$SKOOL_COURSES" -ge 2 ]; then
    echo -e "  ${GREEN}✅${NC} Skool courses: $SKOOL_COURSES courses available"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "  ${RED}❌${NC} Skool courses: Not found (expected 2+)"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo -e "${BLUE}Checking Phase 1 Skool track...${NC}"
SKOOL_TRACK=$(curl -s "http://localhost:8001/api/development/tracks/track_skool_roadmap" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data.get('modules', [])))" 2>/dev/null)
if [ "$SKOOL_TRACK" -eq 6 ]; then
    echo -e "  ${GREEN}✅${NC} Phase 1 Skool track: $SKOOL_TRACK modules"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "  ${RED}❌${NC} Phase 1 Skool track: Expected 6 modules, got $SKOOL_TRACK"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "6️⃣  CHECKING AI ASSISTANT"
echo "======================"

# Test AI assistant
run_test "AI public chat endpoint" "curl -f -X POST http://localhost:8001/api/ai-assistant/public/chat -H 'Content-Type: application/json' -d '{\"message\":\"test\",\"conversation_history\":[]}'"

echo ""
echo "7️⃣  SUMMARY"
echo "=========="

echo -e "${BLUE}Total Tests:${NC} $TOTAL_TESTS"
echo -e "${GREEN}Passed:${NC} $PASSED_TESTS"
echo -e "${RED}Failed:${NC} $FAILED_TESTS"

# Calculate percentage
if [ $TOTAL_TESTS -gt 0 ]; then
    PASS_PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "${BLUE}Success Rate:${NC} $PASS_PERCENTAGE%"

    if [ $PASS_PERCENTAGE -ge 80 ]; then
        echo -e "\n${GREEN}🎉 MVP READY FOR PREVIEW!${NC}"
        echo ""
        echo "📱 Access URLs:"
        echo "   • Frontend: http://localhost"
        echo "   • Courses: http://localhost/courses"
        echo "   • Phase 1: http://localhost/development"
        echo "   • Admin: http://localhost/admin"
        echo ""
        echo "👤 Test Users:"
        echo "   • Demo: demo@vcsa.com / demo123"
        echo "   • Admin: admin@vcsa.com / admin123"
        echo ""
        exit 0
    else
        echo -e "\n${RED}⚠️  ISSUES FOUND - Please review failed tests${NC}"
        exit 1
    fi
else
    echo -e "\n${RED}❌ No tests were executed${NC}"
    exit 1
fi
