#!/bin/bash

# VCSA Proposal Deployment Script
# Deploys the investment proposal to Netlify for easy sharing

set -e

echo "🚀 VCSA Proposal Deployment"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${YELLOW}Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
fi

# Check if we're in the right directory
if [ ! -f "docs/proposal.html" ]; then
    echo -e "${YELLOW}Error: proposal.html not found in docs/${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${BLUE}📁 Proposal file found${NC}"
echo ""

# Ask for deployment name
read -p "Enter deployment name (default: vcsa-proposal): " DEPLOY_NAME
DEPLOY_NAME=${DEPLOY_NAME:-vcsa-proposal}

echo ""
echo -e "${BLUE}🌐 Deploying to Netlify...${NC}"
echo ""

# Deploy to Netlify
cd docs
netlify deploy --prod --dir=. --site="$DEPLOY_NAME"

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "Your proposal is now live at:"
echo -e "${GREEN}https://$DEPLOY_NAME.netlify.app${NC}"
echo ""
echo "Share this link with investors!"
echo ""
echo "To customize the proposal, edit:"
echo "  - docs/proposal.html (standalone version)"
echo "  - frontend/src/pages/ProposalPage.jsx (app version)"
echo "  - PROPOSAL.md (full document)"
