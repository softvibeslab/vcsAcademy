#!/bin/bash

# VCSA Monitoring Setup Script
# Setup Sentry error tracking for VCSA platform

echo "🔧 VCSA Monitoring Setup"
echo "======================="
echo ""

# Check if Sentry DSN is provided
if [ -z "$SENTRY_DSN" ]; then
    echo "❌ Error: SENTRY_DSN environment variable not set"
    echo ""
    echo "Get your DSN from: https://sentry.io/settings/projects/"
    echo "Then run:"
    echo "  export SENTRY_DSN='https://your-dsn@sentry.io/project-id'"
    echo "  ./setup-monitoring.sh"
    exit 1
fi

echo "✅ Sentry DSN detected"
echo ""

# Setup Backend
echo "📦 Setting up Backend Monitoring..."
cd backend

# Install Sentry SDK
echo "Installing sentry-sdk..."
pip install sentry-sdk[fastapi] 2>/dev/null

# Update .env
if [ -f .env ]; then
    if ! grep -q "SENTRY_DSN" .env; then
        echo ""
        echo "Adding Sentry configuration to .env..."
        cat >> .env << EOF

# Sentry Configuration
SENTRY_DSN=$SENTRY_DSN
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1
EOF
        echo "✅ Backend .env updated"
    else
        echo "⚠️  Sentry already configured in .env"
    fi
else
    echo "⚠️  .env file not found - creating from .env.example..."
    cp .env.example .env

    # Update with actual DSN
    sed -i "s|https://your-sentry-dsn@sentry.io/project-id|$SENTRY_DSN|g" .env
    echo "✅ Backend .env created"
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend Monitoring..."
cd frontend

# Install Sentry SDK
echo "Installing @sentry/react..."
npm install @sentry/react 2>/dev/null

# Update .env
if [ -f .env ]; then
    if ! grep -q "REACT_APP_SENTRY_DSN" .env; then
        echo ""
        echo "Adding Sentry configuration to .env..."
        cat >> .env << EOF

# Sentry Configuration
REACT_APP_SENTRY_DSN=$SENTRY_DSN
REACT_APP_SENTRY_ENVIRONMENT=development
REACT_APP_SENTRY_TRACES_SAMPLE_RATE=0.1
EOF
        echo "✅ Frontend .env updated"
    else
        echo "⚠️  Sentry already configured in .env"
    fi
else
    echo "⚠️  .env file not found - creating from .env.example..."
    cp .env.example .env

    # Update with actual DSN
    sed -i "s|https://your-sentry-dsn@sentry.io/project-id|$SENTRY_DSN|g" .env
    echo "✅ Frontend .env created"
fi

cd ..

echo ""
echo "======================="
echo "✅ Setup Complete!"
echo ""
echo "Next Steps:"
echo "1. Restart backend server"
echo "2. Restart frontend server"
echo "3. Check Sentry dashboard for errors"
echo ""
echo "Documentation:"
echo "  - docs/MONITORING.md"
echo "  - backend/README_MONITORING.md"
echo "  - frontend/README_MONITORING.md"
