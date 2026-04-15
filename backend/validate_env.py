#!/usr/bin/env python3
"""
VCSA Environment Validation Script
Validates that all required environment variables are set and properly configured

Usage:
    python validate_env.py [--strict] [--env-file .env]

Exit codes:
    0: All required variables are set
    1: Missing critical variables
    2: Missing recommended variables
"""

import os
import sys
import re
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from dotenv import load_dotenv

# ANSI color codes
RED = '\033[91m'
YELLOW = '\033[93m'
GREEN = '\033[92m'
BLUE = '\033[94m'
RESET = '\033[0m'
BOLD = '\033[1m'

class ValidationResult:
    def __init__(self):
        self.critical_errors = []
        self.warnings = []
        self.successes = []

    def add_critical(self, var_name: str, message: str):
        self.critical_errors.append((var_name, message))

    def add_warning(self, var_name: str, message: str):
        self.warnings.append((var_name, message))

    def add_success(self, var_name: str, message: str):
        self.successes.append((var_name, message))

    def has_critical_errors(self) -> bool:
        return len(self.critical_errors) > 0

    def has_warnings(self) -> bool:
        return len(self.warnings) > 0

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_url(url: str) -> bool:
    """Validate URL format"""
    pattern = r'^https?://[a-zA-Z0-9.-]+(:[0-9]+)?(/.*)?$'
    return re.match(pattern, url) is not None

def validate_mongo_url(url: str) -> bool:
    """Validate MongoDB URL format"""
    if not url:
        return False
    pattern = r'^mongodb://[^@]+@[^:]+:\d+$|^mongodb://localhost:\d+$'
    return re.match(pattern, url) is not None

def validate_strength(password: str, min_length: int = 16) -> Tuple[bool, str]:
    """Validate password strength"""
    if len(password) < min_length:
        return False, f"Password too short (min {min_length} characters)"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain number"
    if password in ['change_this', 'password', 'secret', 'placeholder']:
        return False, "Password is a common placeholder"
    return True, "OK"

def validate_environment(env_vars: Dict[str, str], strict: bool = False) -> ValidationResult:
    """Validate all environment variables"""
    result = ValidationResult()

    # ═══════════════════════════════════════════════════════════
    # CRITICAL VARIABLES (Must be set)
    # ═══════════════════════════════════════════════════════════

    # MongoDB Configuration
    mongo_url = env_vars.get('MONGO_URL')
    if not mongo_url:
        result.add_critical('MONGO_URL', 'MongoDB connection URL is required')
    elif not validate_mongo_url(mongo_url):
        result.add_warning('MONGO_URL', 'MongoDB URL format may be incorrect')

    db_name = env_vars.get('DB_NAME')
    if not db_name:
        result.add_critical('DB_NAME', 'Database name is required')
    elif db_name == 'vcsa':
        result.add_success('DB_NAME', 'Database name set')

    # Backend API Configuration
    backend_url = env_vars.get('REACT_APP_BACKEND_URL')
    if not backend_url:
        result.add_critical('REACT_APP_BACKEND_URL', 'Backend API URL is required')
    elif not validate_url(backend_url):
        result.add_warning('REACT_APP_BACKEND_URL', 'Backend URL format may be incorrect')

    # JWT Configuration
    jwt_secret = env_vars.get('JWT_SECRET')
    if not jwt_secret:
        result.add_critical('JWT_SECRET', 'JWT secret is required')
    else:
        is_strong, msg = validate_strength(jwt_secret, min_length=32)
        if not is_strong:
            if 'placeholder' in msg.lower() or jwt_secret in ['change_this_to_a_secure_random_string_in_production', 'jwt_secret']:
                result.add_critical('JWT_SECRET', f'JWT secret is using placeholder value: {msg}')
            else:
                result.add_warning('JWT_SECRET', f'JWT secret strength: {msg}')

    # Environment
    node_env = env_vars.get('NODE_ENV')
    if not node_env:
        result.add_critical('NODE_ENV', 'NODE_ENV must be set (development|production)')
    elif node_env not in ['development', 'production']:
        result.add_warning('NODE_ENV', f'NODE_ENV should be "development" or "production", got "{node_env}"')

    # ═══════════════════════════════════════════════════════════
    # PAYMENT CONFIGURATION (Important but optional for MVP)
    # ═══════════════════════════════════════════════════════════

    stripe_key = env_vars.get('STRIPE_API_KEY')
    if not stripe_key:
        if strict:
            result.add_critical('STRIPE_API_KEY', 'Stripe API key is required in strict mode')
        else:
            result.add_warning('STRIPE_API_KEY', 'Stripe API key not set (payments will not work)')
    elif stripe_key.startswith('sk_test_'):
        result.add_success('STRIPE_API_KEY', 'Using test mode Stripe key')
    elif stripe_key.startswith('sk_live_'):
        result.add_success('STRIPE_API_KEY', 'Using live Stripe key')
    else:
        result.add_warning('STRIPE_API_KEY', 'Stripe API key format may be incorrect')

    stripe_webhook = env_vars.get('STRIPE_WEBHOOK_SECRET')
    if stripe_key and not stripe_webhook:
        result.add_warning('STRIPE_WEBHOOK_SECRET', 'Stripe webhook secret not set (webhooks will not work)')

    # ═══════════════════════════════════════════════════════════
    # SECURITY CONFIGURATION
    # ═══════════════════════════════════════════════════════════

    if node_env == 'production':
        # Production-specific checks
        if 'localhost' in backend_url or '127.0.0.1' in backend_url:
            result.add_critical('REACT_APP_BACKEND_URL', 'Production backend URL should not use localhost')

        if not env_vars.get('SENTRY_DSN'):
            result.add_warning('SENTRY_DSN', 'Sentry error tracking not configured in production')

        if not env_vars.get('HTTPS_ENABLED'):
            result.add_warning('HTTPS_ENABLED', 'HTTPS should be enabled in production')

    # ═══════════════════════════════════════════════════════════
    # OPTIONAL CONFIGURATION
    # ═══════════════════════════════════════════════════════════

    # OAuth
    google_client = env_vars.get('GOOGLE_CLIENT_ID')
    if not google_client:
        result.add_warning('GOOGLE_CLIENT_ID', 'Google OAuth not configured')

    # Email
    smtp_host = env_vars.get('SMTP_HOST')
    if not smtp_host:
        result.add_warning('SMTP_HOST', 'Email notifications not configured')

    # Sentry
    sentry_dsn = env_vars.get('SENTRY_DSN')
    if sentry_dsn:
        result.add_success('SENTRY_DSN', 'Error tracking configured')
    else:
        result.add_warning('SENTRY_DSN', 'Error tracking not configured')

    # ═══════════════════════════════════════════════════════════
    # DETAILED VALIDATIONS
    # ═══════════════════════════════════════════════════════════

    # CORS Origins
    cors_origins = env_vars.get('CORS_ORIGINS')
    if cors_origins:
        origins = [o.strip() for o in cors_origins.split(',')]
        if backend_url not in origins:
            result.add_warning('CORS_ORIGINS', f'Backend URL {backend_url} not in CORS origins')

    # Feature flags
    enable_registration = env_vars.get('ENABLE_REGISTRATION', 'true')
    if enable_registration.lower() == 'false':
        result.add_warning('ENABLE_REGISTRATION', 'New user registration is disabled')

    return result

def print_results(result: ValidationResult, env_file: str):
    """Print validation results"""
    print(f"\n{BOLD}{'=' * 60}{RESET}")
    print(f"{BOLD}Environment Validation Results{RESET}")
    print(f"{BOLD}{'=' * 60}{RESET}\n")

    print(f"{BLUE}Environment file: {env_file}{RESET}\n")

    # Successes
    if result.successes:
        print(f"{GREEN}✓ VALID{RESET} - Variables properly configured:")
        for var_name, message in result.successes:
            print(f"  {GREEN}✓{RESET} {var_name}: {message}")

    # Warnings
    if result.warnings:
        print(f"\n{YELLOW}⚠ WARNINGS{RESET} - Recommended improvements:")
        for var_name, message in result.warnings:
            print(f"  {YELLOW}⚠{RESET} {var_name}: {message}")

    # Critical errors
    if result.critical_errors:
        print(f"\n{RED}✗ CRITICAL ERRORS{RESET} - Required variables missing:")
        for var_name, message in result.critical_errors:
            print(f"  {RED}✗{RESET} {var_name}: {message}")

    # Summary
    print(f"\n{BOLD}{'=' * 60}{RESET}")
    print(f"{BOLD}Summary{RESET}")
    print(f"{BOLD}{'=' * 60}{RESET}")

    total_issues = len(result.critical_errors) + len(result.warnings)
    if result.has_critical_errors():
        print(f"\n{RED}Status: FAILED{RESET}")
        print(f"{RED}Critical errors: {len(result.critical_errors)}{RESET}")
        print(f"{YELLOW}Warnings: {len(result.warnings)}{RESET}")
        print(f"{GREEN}Properly configured: {len(result.successes)}{RESET}")
    elif result.has_warnings():
        print(f"\n{YELLOW}Status: PASSED WITH WARNINGS{RESET}")
        print(f"{YELLOW}Warnings: {len(result.warnings)}{RESET}")
        print(f"{GREEN}Properly configured: {len(result.successes)}{RESET}")
    else:
        print(f"\n{GREEN}Status: PASSED{RESET}")
        print(f"{GREEN}All variables properly configured!{RESET}")

    print()

def main():
    parser = argparse.ArgumentParser(description='Validate VCSA environment configuration')
    parser.add_argument('--strict', action='store_true',
                       help='Enable strict mode (all variables must be set)')
    parser.add_argument('--env-file', default='.env',
                       help='Path to .env file (default: .env)')
    args = parser.parse_args()

    # Load environment variables
    env_file = Path(args.env_file)
    if not env_file.exists():
        print(f"{RED}Error: Environment file '{args.env_file}' not found{RESET}")
        print(f"{YELLOW}Hint: Copy .env.example to .env and fill in the values{RESET}")
        sys.exit(1)

    load_dotenv(args.env_file)
    env_vars = dict(os.environ)

    # Validate environment
    result = validate_environment(env_vars, strict=args.strict)

    # Print results
    print_results(result, args.env_file)

    # Exit with appropriate code
    if result.has_critical_errors():
        sys.exit(1)
    elif result.has_warnings():
        sys.exit(2)
    else:
        sys.exit(0)

if __name__ == '__main__':
    main()