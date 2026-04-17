#!/bin/bash

# Script to execute financial demo data seed

echo "🌱 Seeding Financial Demo Data..."
echo ""

# Execute seed script
docker exec -i vcsa-mongodb mongosh \
  -u admin \
  -p changeme \
  --authenticationDatabase admin \
  vcsa \
  < /Users/newproject/Documents/GitHub/vcsAcademy/backend/seed_financial_demo.js

echo ""
echo "✅ Seed script execution completed!"
