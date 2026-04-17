#!/bin/bash

# VCSA Test Runner
# Run all tests (backend + frontend)

echo "🧪 VCSA Test Suite"
echo "=================="
echo ""

# Backend tests
echo "🔧 Running Backend Tests..."
cd backend
if command -v pytest &> /dev/null; then
    pytest -v --tb=short
    BACKEND_EXIT=$?
else
    echo "⚠️  Pytest not found. Skipping backend tests."
    BACKEND_EXIT=0
fi
cd ..

echo ""
echo "⚛️  Running Frontend Tests..."
cd frontend
if [ -d "node_modules" ]; then
    npm run test:ci
    FRONTEND_EXIT=$?
else
    echo "⚠️  Node modules not installed. Run 'npm install' first."
    FRONTEND_EXIT=1
fi
cd ..

echo ""
echo "=================="
if [ $BACKEND_EXIT -eq 0 ] && [ $FRONTEND_EXIT -eq 0 ]; then
    echo "✅ All tests passed!"
    exit 0
else
    echo "❌ Some tests failed. Check output above."
    exit 1
fi
