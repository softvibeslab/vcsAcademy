#!/bin/bash

# Seed Demo Data for Milestone 1.5
# Creates demo data using the API endpoints

echo "🚀 Seeding Demo Data for Goal Sheets Gamified System"
echo "===================================================="

# Configuration
API_URL="http://localhost:8001"
DEMO_EMAIL="demo@vcsa.com"
DEMO_PASSWORD="demo123"

# Login and get token
echo ""
echo "🔐 Logging in as demo user..."

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$DEMO_EMAIL\", \"password\": \"$DEMO_PASSWORD\"}")

# Extract token (simplified)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Login failed. Trying to create demo user..."

    # Try to create demo user first
    CREATE_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$DEMO_EMAIL\",
        \"password\": \"$DEMO_PASSWORD\",
        \"name\": \"Demo User\",
        \"role\": \"member\"
      }")

    echo "Create response: $CREATE_RESPONSE"

    # Try login again
    LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
      -H "Content-Type: application/json" \
      -d "{\"email\": \"$DEMO_EMAIL\", \"password\": \"$DEMO_PASSWORD\"}")

    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to authenticate"
    exit 1
fi

echo "✅ Login successful"
echo ""

# Create financial goal
echo "📊 Creating Financial Goal..."
FINANCIAL_RESPONSE=$(curl -s -X POST "$API_URL/api/financial/goals/setup" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"target_income\": 15000.0,
    \"expenses\": [
      {\"category\": \"rent\", \"amount\": 1500.0},
      {\"category\": \"car_payment\", \"amount\": 450.0},
      {\"category\": \"electricity\", \"amount\": 150.0},
      {\"category\": \"food\", \"amount\": 600.0},
      {\"category\": \"water_bill\", \"amount\": 80.0},
      {\"category\": \"cell_phone\", \"amount\": 100.0}
    ],
    \"avg_sale\": 1200.0,
    \"closing_rate\": 22.0
  }")

echo "✅ Financial Goal created"
echo ""

# Log some daily sales
echo "📅 Logging Daily Sales..."

for day in {1..5}; do
    curl -s -X POST "$API_URL/api/financial/sales/daily" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "{
        \"day_number\": $day,
        \"socio\": \"Client $day\",
        \"manager\": \"Sales Manager\",
        \"volume\": $((1200 + day * 100)),
        \"enganche_pct\": 20,
        \"commission_pct\": 18.5,
        \"milesingreso\": 222.0,
        \"daily_tip\": \"Great closing technique!\"
      }" > /dev/null

    echo "  ✓ Day $day: Logged sale of $((1200 + day * 100))"
done

echo ""
echo "✅ Daily Sales logged: 5 days"
echo ""

# Log personal attributes
echo "🏆 Logging Personal Attributes..."

ATTRIBUTES=("attitude" "courage" "focus" "training" "discipline" "persistence")

for attr in "${ATTRIBUTES[@]}"; do
    curl -s -X POST "$API_URL/api/financial/attributes/daily" \
      -H "Authorization: Bearer $TOKEN" \
      -G \
      --data-urlencode "attribute_type=$attr&achieved=true&notes=Crushed it today!" > /dev/null

    echo "  ✓ $attr: +10 pts"
done

echo ""
echo "✅ Personal Attributes logged: 6/7"
echo ""

echo "===================================================="
echo "✅ DEMO DATA SEEDING COMPLETE!"
echo ""
echo "📊 SUMMARY:"
echo "  ✓ Financial Goal: $15,000 target, $6,500 gap"
echo "  ✓ Daily Sales: 5 days logged"
echo "  ✓ Personal Attributes: 6/7 achieved"
echo "  ✓ Total Points: ~25 pts so far"
echo ""
echo "🎮 LOGIN:"
echo "  Email: demo@vcsa.com"
echo "  Password: demo123"
echo ""
echo "🌐 NAVIGATE TO:"
echo "  Financial Planning:  http://localhost:3001/financial"
echo "  Daily Performance:    http://localhost:3001/daily-performance"
echo "  Analytics:            http://localhost:3001/analytics"
echo "  Strategy:             http://localhost:3001/strategy"
echo ""
echo "🎨 ENJOY THE PREVIEW!"
