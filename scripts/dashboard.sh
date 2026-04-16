#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# VCSA Deployment Dashboard
# ═══════════════════════════════════════════════════════════════
#
# Deployment status dashboard script
#
# Features:
# - Current deployment status
# - Recent deployments
# - Health check results
# - System metrics
# - Quick actions
#
# Author: VCSA DevOps Team
# Created: April 2026
# Status: Production Ready
# ═══════════════════════════════════════════════════════════════

#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="${API_URL:-http://localhost:8000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"

# Print colored output
print_color() {
    local color=$1
    shift
    echo -e "${color}$*${NC}"
}

# Print section header
print_header() {
    echo ""
    print_color "$BLUE" "════════════════════════════════════════"
    print_color "$BLUE" "$1"
    print_color "$BLUE" "════════════════════════════════════════"
    echo ""
}

# Check service health
check_health() {
    local url=$1
    local name=$2

    if curl -f -s "$url" >/dev/null 2>&1; then
        print_color "$GREEN" "✓ $name is healthy"
        return 0
    else
        print_color "$RED" "✗ $name is unhealthy"
        return 1
    fi
}

# Get deployment info
get_deployment_info() {
    print_header "DEPLOYMENT INFORMATION"

    # Current commit
    local commit=$(git rev-parse HEAD 2>/dev/null || echo "N/A")
    local branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "N/A")
    local author=$(git log -1 --format='%an' 2>/dev/null || echo "N/A")
    local date=$(git log -1 --format='%ad' --date=short 2>/dev/null || echo "N/A")

    echo "Branch:     $branch"
    echo "Commit:     $commit"
    echo "Author:     $author"
    echo "Date:       $date"
}

# Health checks
health_checks() {
    print_header "HEALTH CHECKS"

    check_health "$API_URL/api/health" "Backend API"
    check_health "$FRONTEND_URL" "Frontend"
    check_health "$API_URL/api/health/detailed" "Detailed Health"
}

# Docker status
docker_status() {
    print_header "DOCKER STATUS"

    docker-compose ps
}

# System metrics
system_metrics() {
    print_header "SYSTEM METRICS"

    # Disk usage
    print_color "$YELLOW" "Disk Usage:"
    df -h | grep -E "(Filesystem|/dev/sda|/dev/vda)"

    # Memory usage
    print_color "$YELLOW" "\nMemory Usage:"
    free -h

    # CPU usage
    print_color "$YELLOW" "\nCPU Usage:"
    top -bn1 | grep "Cpu(s)" || echo "N/A"

    # Docker stats
    print_color "$YELLOW" "\nDocker Stats:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" || echo "N/A"
}

# Recent deployments
recent_deployments() {
    print_header "RECENT DEPLOYMENTS"

    if [ -f "/var/log/vcsavibes/deploy.log" ]; then
        tail -n 10 /var/log/vcsavibes/deploy.log
    else
        print_color "$YELLOW" "No deployment log found"
    fi
}

# Quick actions
show_actions() {
    print_header "QUICK ACTIONS"

    echo "1) Deploy to staging"
    echo "2) View logs"
    echo "3) Restart services"
    echo "4) Create backup"
    echo "5) Run health checks"
    echo "6) Exit"
    echo ""
}

# Execute action
execute_action() {
    case $1 in
        1)
            print_color "$GREEN" "Deploying to staging..."
            git push origin develop
            ;;
        2)
            print_color "$GREEN" "Showing logs (Ctrl+C to exit)..."
            docker-compose logs -f
            ;;
        3)
            print_color "$GREEN" "Restarting services..."
            docker-compose restart
            ;;
        4)
            print_color "$GREEN" "Creating backup..."
            /opt/vcsavibes/scripts/backup.sh
            ;;
        5)
            health_checks
            ;;
        6)
            print_color "$GREEN" "Goodbye!"
            exit 0
            ;;
        *)
            print_color "$RED" "Invalid option"
            ;;
    esac
}

# Main dashboard loop
dashboard() {
    while true; do
        clear
        print_color "$BLUE" "╔═════════════════════════════════════════════════╗"
        print_color "$BLUE" "║           VCSA Deployment Dashboard                  ║"
        print_color "$BLUE" "║           Status: $(date '+%Y-%m-%d %H:%M:%S')               ║"
        print_color "$BLUE" "╚═════════════════════════════════════════════════╝"
        echo ""

        get_deployment_info
        health_checks
        docker_status
        system_metrics
        recent_deployments
        show_actions

        read -p "Select action (1-6): " choice
        execute_action $choice

        read -p "Press Enter to continue..."
    done
}

# Run dashboard
dashboard
