#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# VCSA Environment Configuration Audit Script
# Reviews all environment configuration files and generates a report
# ═══════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[91m'
YELLOW='\033[93m'
GREEN='\033[92m'
BLUE='\033[94m'
RESET='\033[0m'
BOLD='\033[1m'

# Configuration
PROJECT_ROOT="/rogervibes/vcs/Vcsa-"
REPORT_FILE="${PROJECT_ROOT}/ENVIRONMENT_AUDIT_REPORT.md"
TEMP_DIR=$(mktemp -d)

# Audit results
CRITICAL_ISSUES=0
WARNINGS=0
SUCCESS_ITEMS=0

echo -e "${BOLD}VCSA Environment Configuration Audit${RESET}"
echo -e "${BOLD}========================================${RESET}\n"

# Create report header
cat > "$REPORT_FILE" << 'EOF'
# VCSA Environment Configuration Audit Report

**Generated**: $(date)
**Environment**: $(uname -a)
**Project Root**: /rogervibes/vcs/Vcsa-

---

## Executive Summary

EOF

# ═══════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════

check_file_exists() {
    local file=$1
    local description=$2

    echo -e "\n${BLUE}Checking:${RESET} $description ($file)"

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ File exists${RESET}"
        echo "### ✅ $description" >> "$REPORT_FILE"
        echo "**Status**: Present" >> "$REPORT_FILE"
        echo "**File**: \`$file\`" >> "$REPORT_FILE"
        ((SUCCESS_ITEMS++))
        return 0
    else
        echo -e "${RED}✗ File missing${RESET}"
        echo "### ❌ $description" >> "$REPORT_FILE"
        echo "**Status**: Missing" >> "$REPORT_FILE"
        echo "**File**: \`$file\`" >> "$REPORT_FILE"
        ((CRITICAL_ISSUES++))
        return 1
    fi
}

check_env_var() {
    local file=$1
    local var_name=$2
    local required=$3
    local description=$4

    if [ ! -f "$file" ]; then
        return 1
    fi

    # Check if variable exists in file
    if grep -q "^${var_name}=" "$file"; then
        local value=$(grep "^${var_name}=" "$file" | cut -d'=' -f2)

        # Check if it's a placeholder/default value
        if echo "$value" | grep -qiE "placeholder|change_this|example|your_|here"; then
            if [ "$required" = "required" ]; then
                echo -e "  ${RED}✗${RESET} $var_name: Using placeholder value"
                echo "- **$var_name**: ⚠️ Using placeholder value (\`$value\`)" >> "$REPORT_FILE"
                ((WARNINGS++))
                return 1
            else
                echo -e "  ${YELLOW}⚠${RESET} $var_name: Optional but using placeholder"
                echo "- **$var_name**: ℹ️ Optional (\`$value\`)" >> "$REPORT_FILE"
                return 0
            fi
        else
            echo -e "  ${GREEN}✓${RESET} $var_name: Configured"
            echo "- **$var_name**: ✅ Configured" >> "$REPORT_FILE"
            return 0
        fi
    else
        if [ "$required" = "required" ]; then
            echo -e "  ${RED}✗${RESET} $var_name: Missing"
            echo "- **$var_name**: ❌ Missing" >> "$REPORT_FILE"
            ((CRITICAL_ISSUES++))
            return 1
        else
            echo -e "  ${YELLOW}⚠${RESET} $var_name: Not set (optional)"
            echo "- **$var_name**: ℹ️ Not set (optional)" >> "$REPORT_FILE"
            return 0
        fi
    fi
}

check_security_risk() {
    local file=$1
    local pattern=$2
    local description=$3

    if [ ! -f "$file" ]; then
        return 0
    fi

    if grep -qiE "$pattern" "$file"; then
        echo -e "  ${RED}✗${RESET} Security risk: $description"
        echo "- 🚨 **Security Risk**: $description" >> "$REPORT_FILE"
        ((CRITICAL_ISSUES++))
        return 1
    fi
    return 0
}

# ═══════════════════════════════════════════════════════════════
# AUDIT SECTIONS
# ═══════════════════════════════════════════════════════════════

# 1. Check .env files
echo "## 1. Environment Files" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

check_file_exists "${PROJECT_ROOT}/.env" "Root .env file"
if [ $? -eq 0 ]; then
    check_env_var "${PROJECT_ROOT}/.env" "DB_NAME" "required" "Database name"
    check_env_var "${PROJECT_ROOT}/.env" "REACT_APP_BACKEND_URL" "required" "Backend API URL"
    check_env_var "${PROJECT_ROOT}/.env" "STRIPE_API_KEY" "optional" "Stripe API key"
fi

check_file_exists "${PROJECT_ROOT}/.env.example" "Root .env.example template"

check_file_exists "${PROJECT_ROOT}/.env.production" "Production .env file"
if [ $? -eq 0 ]; then
    check_env_var "${PROJECT_ROOT}/.env.production" "DB_NAME" "required" "Database name"
    check_env_var "${PROJECT_ROOT}/.env.production" "REACT_APP_BACKEND_URL" "required" "Backend API URL"
fi

echo "" >> "$REPORT_FILE"

# 2. Check backend configuration
echo "## 2. Backend Configuration" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

check_file_exists "${PROJECT_ROOT}/backend/.env" "Backend .env file"
if [ $? -eq 0 ]; then
    check_env_var "${PROJECT_ROOT}/backend/.env" "MONGO_URL" "required" "MongoDB connection URL"
    check_env_var "${PROJECT_ROOT}/backend/.env" "DB_NAME" "required" "Database name"
    check_env_var "${PROJECT_ROOT}/backend/.env" "JWT_SECRET" "required" "JWT secret"
    check_env_var "${PROJECT_ROOT}/backend/.env" "STRIPE_API_KEY" "optional" "Stripe API key"

    # Security checks
    check_security_risk "${PROJECT_ROOT}/backend/.env" "JWT_SECRET=.*changeme|JWT_SECRET=.*secret" "JWT secret using default value"
    check_security_risk "${PROJECT_ROOT}/backend/.env" "MONGO_URL=.*admin:changeme" "MongoDB using default password"
fi

check_file_exists "${PROJECT_ROOT}/backend/.env.example" "Backend .env.example template"
check_file_exists "${PROJECT_ROOT}/backend/validate_env.py" "Environment validation script"

echo "" >> "$REPORT_FILE"

# 3. Check frontend configuration
echo "## 3. Frontend Configuration" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

check_file_exists "${PROJECT_ROOT}/frontend/.env" "Frontend .env file"
if [ $? -eq 0 ]; then
    check_env_var "${PROJECT_ROOT}/frontend/.env" "REACT_APP_BACKEND_URL" "required" "Backend API URL"
    check_env_var "${PROJECT_ROOT}/frontend/.env" "NODE_ENV" "required" "Node environment"
    check_env_var "${PROJECT_ROOT}/frontend/.env" "REACT_APP_STRIPE_PUBLISHABLE_KEY" "optional" "Stripe publishable key"
fi

check_file_exists "${PROJECT_ROOT}/frontend/.env.example" "Frontend .env.example template"

echo "" >> "$REPORT_FILE"

# 4. Check Docker configuration
echo "## 4. Docker Configuration" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

check_file_exists "${PROJECT_ROOT}/docker-compose.yml" "Docker Compose configuration"

if [ -f "${PROJECT_ROOT}/docker-compose.yml" ]; then
    echo -e "${GREEN}✓${RESET} Docker Compose configuration exists"
    echo "### 🐳 Docker Configuration" >> "$REPORT_FILE"
    echo "**Status**: Present" >> "$REPORT_FILE"

    # Check for environment variables in docker-compose.yml
    if grep -q "MONGO_ROOT_PASSWORD" "${PROJECT_ROOT}/docker-compose.yml"; then
        echo "- 🔒 MongoDB root password: Configured in docker-compose.yml" >> "$REPORT_FILE"
        check_env_var "${PROJECT_ROOT}/.env" "MONGO_ROOT_PASSWORD" "required" "MongoDB root password"
    fi

    ((SUCCESS_ITEMS++))
else
    echo -e "${RED}✗${RESET} Docker Compose configuration missing"
    ((CRITICAL_ISSUES++))
fi

echo "" >> "$REPORT_FILE"

# 5. Check security best practices
echo "## 5. Security Best Practices" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Check for .env in .gitignore
if [ -f "${PROJECT_ROOT}/.gitignore" ]; then
    if grep -q "^\.env$" "${PROJECT_ROOT}/.gitignore"; then
        echo -e "${GREEN}✓${RESET} .env in .gitignore"
        echo "- ✅ .env files in .gitignore" >> "$REPORT_FILE"
        ((SUCCESS_ITEMS++))
    else
        echo -e "${RED}✗${RESET} .env NOT in .gitignore"
        echo "- ❌ .env files NOT in .gitignore" >> "$REPORT_FILE"
        ((CRITICAL_ISSUES++))
    fi
fi

# Check for example templates
EXAMPLE_FILES=(
    "${PROJECT_ROOT}/.env.example"
    "${PROJECT_ROOT}/backend/.env.example"
    "${PROJECT_ROOT}/frontend/.env.example"
)

MISSING_EXAMPLES=0
for file in "${EXAMPLE_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        ((MISSING_EXAMPLES++))
    fi
done

if [ $MISSING_EXAMPLES -eq 0 ]; then
    echo -e "${GREEN}✓${RESET} All .env.example templates present"
    echo "- ✅ All .env.example templates present" >> "$REPORT_FILE"
    ((SUCCESS_ITEMS++))
else
    echo -e "${YELLOW}⚠${RESET} Missing $MISSING_EXAMPLES .env.example file(s)"
    echo "- ⚠️ Missing $MISSING_EXAMPLES .env.example file(s)" >> "$REPORT_FILE"
    ((WARNINGS++))
fi

echo "" >> "$REPORT_FILE"

# 6. Generate recommendations
echo "## 6. Recommendations" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

echo "### 🎯 Priority Actions" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

if [ $CRITICAL_ISSUES -gt 0 ]; then
    echo "1. **URGENT**: Fix $CRITICAL_ISSUES critical issue(s) marked above" >> "$REPORT_FILE"
fi

if [ $WARNINGS -gt 0 ]; then
    echo "2. **IMPORTANT**: Address $WARNINGS warning(s) marked above" >> "$REPORT_FILE"
fi

echo "3. **SECURITY**: Rotate all secrets and passwords in production" >> "$REPORT_FILE"
echo "4. **VALIDATION**: Run \`python backend/validate_env.py\` before deployment" >> "$REPORT_FILE"
echo "5. **DOCUMENTATION**: Keep .env.example files updated with current variables" >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"

# ═══════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════

echo "## 7. Summary" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << EOF
| Metric | Count |
|--------|-------|
| ✅ Success Items | $SUCCESS_ITEMS |
| ⚠️ Warnings | $WARNINGS |
| ❌ Critical Issues | $CRITICAL_ISSUES |

### Overall Status

EOF

if [ $CRITICAL_ISSUES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    STATUS="🟢 PASSED"
    echo "**Status**: 🟢 **PASSED** - All checks passed!" >> "$REPORT_FILE"
    echo -e "${GREEN}Overall Status: PASSED${RESET}"
elif [ $CRITICAL_ISSUES -eq 0 ]; then
    STATUS="🟡 PASSED WITH WARNINGS"
    echo "**Status**: 🟡 **PASSED WITH WARNINGS** - Review warnings" >> "$REPORT_FILE"
    echo -e "${YELLOW}Overall Status: PASSED WITH WARNINGS${RESET}"
else
    STATUS="🔴 FAILED"
    echo "**Status**: 🔴 **FAILED** - Fix critical issues" >> "$REPORT_FILE"
    echo -e "${RED}Overall Status: FAILED${RESET}"
fi

echo "" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << EOF
---
**Next Steps**:
1. Review critical issues and warnings above
2. Update .env files with proper values
3. Run validation script: \`python backend/validate_env.py\`
4. Test configuration locally before deploying

**Report Generated**: $(date)
**Script**: $(basename "$0")
EOF

# ═══════════════════════════════════════════════════════════════
# CLEANUP
# ═══════════════════════════════════════════════════════════════

rm -rf "$TEMP_DIR"

# ═══════════════════════════════════════════════════════════════
# FINAL OUTPUT
# ═══════════════════════════════════════════════════════════════

echo ""
echo -e "${BOLD}========================================${RESET}"
echo -e "${BOLD}Audit Complete${RESET}"
echo -e "${BOLD}========================================${RESET}"
echo ""
echo -e "Results: ${GREEN}✓${RESET} $SUCCESS_ITEMS | ${YELLOW}⚠${RESET} $WARNINGS | ${RED}✗${RESET} $CRITICAL_ISSUES"
echo -e "Status: $STATUS"
echo ""
echo -e "📄 Full report: ${BLUE}$REPORT_FILE${RESET}"
echo ""

# Exit with appropriate code
if [ $CRITICAL_ISSUES -gt 0 ]; then
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    exit 2
else
    exit 0
fi