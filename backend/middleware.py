"""
Multi-Tenancy Middleware for VCSA White-Label Platform

This module provides middleware for extracting and validating organization context
from incoming requests based on subdomain, custom domain, or authenticated user.
"""

from fastapi import Request, HTTPException, Depends
from typing import Optional
import re
from motor.motor_asyncio import AsyncIOMotorClient
import os

# Database connection (shared with server.py)
# from server import db  # Moved to avoid circular import


async def get_organization_from_request(request: Request) -> Optional[str]:
    """
    Extract organization_id from request using multiple strategies:

    1. Subdomain extraction: acme.vcsa.com → organization with slug="acme"
    2. Custom domain header: X-Organization-ID header
    3. Custom domain lookup: academy.acme.com → organization with custom_domain
    4. Authenticated user: Extract from user's organization_id

    Args:
        request: FastAPI Request object

    Returns:
        organization_id if found, None otherwise
    """
    host = request.headers.get("host", "localhost")

    # Strategy 1: Extract subdomain for *.vcsa.com domains
    if "vcsa.com" in host or "localhost" in host:
        parts = host.split(".")

        # Handle: subdomain.vcsa.com or subdomain.localhost
        if len(parts) >= 1:
            subdomain = parts[0]

            # Skip www and empty subdomains
            if subdomain not in ["www", "vcsa", "localhost", ""]:
                # Look up organization by slug
                org = await db.organizations.find_one({
                    "slug": subdomain,
                    "status": "active"
                })

                if org:
                    # Store in request state for later use
                    request.state.organization = org
                    request.state.organization_id = org["organization_id"]
                    return org["organization_id"]

    # Strategy 2: Check for custom domain via header (for reverse proxy setups)
    org_id_header = request.headers.get("X-Organization-ID")
    if org_id_header:
        # Validate that organization exists
        org = await db.organizations.find_one({
            "organization_id": org_id_header,
            "status": "active"
        })

        if org:
            request.state.organization = org
            request.state.organization_id = org["organization_id"]
            return org["organization_id"]

    # Strategy 3: Look up by custom domain
    # For domains like academy.acme.com that are mapped to organization
    if host and host not in ["vcsa.com", "www.vcsa.com", "localhost"]:
        org = await db.organizations.find_one({
            "custom_domain": host,
            "status": "active"
        })

        if org:
            request.state.organization = org
            request.state.organization_id = org["organization_id"]
            return org["organization_id"]

        # Also check domains array
        org = await db.organizations.find_one({
            "domains": host,
            "status": "active"
        })

        if org:
            request.state.organization = org
            request.state.organization_id = org["organization_id"]
            return org["organization_id"]

    # Strategy 4: Get from authenticated user (if available)
    if hasattr(request.state, "user") and request.state.user:
        user_org_id = request.state.user.get("organization_id")
        if user_org_id:
            # Validate organization exists and is active
            org = await db.organizations.find_one({
                "organization_id": user_org_id,
                "status": "active"
            })

            if org:
                request.state.organization = org
                request.state.organization_id = org["organization_id"]
                return org["organization_id"]

    # Strategy 5: Default organization for main platform
    # This handles requests to vcsa.com without subdomain
    if host in ["vcsa.com", "www.vcsa.com", "localhost"]:
        org = await db.organizations.find_one({
            "slug": "vcsa",
            "status": "active"
        })

        if org:
            request.state.organization = org
            request.state.organization_id = org["organization_id"]
            return org["organization_id"]

    # No organization found
    return None


async def require_organization(request: Request) -> str:
    """
    Dependency function that requires a valid organization context.
    Raises HTTPException if no organization is found.

    Use this in endpoints that require organization context:

    @router.get("/api/some-endpoint")
    async def some_endpoint(org_id: str = Depends(require_organization)):
        # org_id is guaranteed to be valid
        ...

    Args:
        request: FastAPI Request object

    Returns:
        organization_id (valid and active)

    Raises:
        HTTPException: 404 if organization not found or inactive
    """
    org_id = await get_organization_from_request(request)

    if not org_id:
        raise HTTPException(
            status_code=404,
            detail="Organization not found. Please check your URL or contact support."
        )

    return org_id


async def require_org_admin(
    request: Request,
    org_id: str = Depends(require_organization)
) -> str:
    """
    Dependency that requires user to be an organization admin.

    Checks if the authenticated user is in the organization's admin_users list
    or has a system admin role.

    Args:
        request: FastAPI Request object
        org_id: Organization ID from require_organization

    Returns:
        organization_id if user is admin

    Raises:
        HTTPException: 403 if user is not an admin
    """
    user = request.state.user if hasattr(request.state, "user") else None

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Authentication required"
        )

    # Check if user is system admin
    if user.get("role") == "admin":
        return org_id

    # Check if user is organization admin
    organization = request.state.organization if hasattr(request.state, "organization") else None

    if organization and user.get("user_id") in organization.get("admin_users", []):
        return org_id

    raise HTTPException(
        status_code=403,
        detail="Organization admin access required"
    )


async def inject_organization_context(request: Request, call_next):
    """
    Middleware function to automatically inject organization context into all requests.

    This middleware should be added to the FastAPI app to automatically
    populate request.state.organization and request.state.organization_id.

    Usage in server.py:
    app.middleware("http")(inject_organization_context)
    """
    # Try to get organization from request
    org_id = await get_organization_from_request(request)

    # Store in request state (already done by get_organization_from_request)
    # This allows subsequent code to access it easily

    # Continue processing the request
    response = await call_next(request)

    # Add organization context to response headers (useful for debugging)
    if org_id:
        response.headers["X-Organization-ID"] = org_id

    return response


def is_valid_subdomain(slug: str) -> bool:
    """
    Validate that a slug is safe to use as a subdomain.

    Rules:
    - Only lowercase letters, numbers, and hyphens
    - Must start with a letter
    - Must end with a letter or number
    - No consecutive hyphens
    - Length: 3-50 characters

    Args:
        slug: Proposed subdomain/slug

    Returns:
        True if valid, False otherwise
    """
    if not slug or len(slug) < 3 or len(slug) > 50:
        return False

    # Check pattern: starts with letter, contains only allowed chars
    if not re.match(r'^[a-z][a-z0-9-]*[a-z0-9]$', slug):
        return False

    # No consecutive hyphens
    if '--' in slug:
        return False

    return True


def is_valid_custom_domain(domain: str) -> bool:
    """
    Validate that a custom domain is properly formatted.

    Args:
        domain: Domain to validate

    Returns:
        True if valid, False otherwise
    """
    if not domain or len(domain) > 253:
        return False

    # Basic domain validation
    pattern = r'^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.([a-zA-Z0-9]+\.)*[a-zA-Z]{2,}$'
    return re.match(pattern, domain) is not None


async def verify_domain_ownership(domain: str, organization_id: str) -> dict:
    """
    Generate DNS verification instructions for custom domain setup.

    This creates a TXT record that the domain owner must add to prove ownership.

    Args:
        domain: Custom domain to verify
        organization_id: Organization claiming the domain

    Returns:
        Dictionary with verification instructions
    """
    # Generate unique verification token
    import secrets
    verification_token = f"vcsa-verify={secrets.token_urlsafe(32)}"

    # Store verification token in database
    await db.domain_verifications.insert_one({
        "domain": domain,
        "organization_id": organization_id,
        "token": verification_token,
        "status": "pending",
        "created_at": datetime.utcnow()
    })

    return {
        "domain": domain,
        "status": "pending",
        "dns_record_type": "TXT",
        "dns_record_name": f"_vcsa-verification.{domain}",
        "dns_record_value": verification_token,
        "instructions": f"""
        To verify ownership of {domain}, add the following TXT record to your DNS:

        Type: TXT
        Name: _vcsa-verification.{domain}
        Value: {verification_token}

        DNS changes may take up to 48 hours to propagate.
        """
    }


async def check_domain_verification(domain: str) -> dict:
    """
    Check if a custom domain has been verified via DNS.

    Args:
        domain: Domain to check

    Returns:
        Dictionary with verification status
    """
    # Look up verification record
    verification = await db.domain_verifications.find_one({
        "domain": domain,
        "status": "pending"
    })

    if not verification:
        return {
            "domain": domain,
            "status": "not_found",
            "message": "No pending verification found for this domain"
        }

    # In production, you would perform actual DNS lookup here
    # For now, return pending status
    return {
        "domain": domain,
        "status": "pending",
        "message": "DNS verification not yet implemented",
        "token": verification["token"]
    }
