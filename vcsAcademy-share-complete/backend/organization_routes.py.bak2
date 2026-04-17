"""
Organization Routes for VCSA White-Label Platform

This module provides API endpoints for managing organizations, including:
- CRUD operations for organizations
- Branding and settings management
- Onboarding wizard
- AI assistant integration
- Domain verification
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from typing import List, Optional
from datetime import datetime
import secrets
import os
from motor.motor_asyncio import AsyncIOMotorClient

# Import models
from organization_models import (
    Organization,
    OrganizationCreate,
    OrganizationUpdate,
    OrganizationResponse,
    OnboardingStepData,
    AIAssistantRequest,
    AIAssistantResponse,
    AIChangeSuggestion,
    AIApplyChangeRequest
)

# Import middleware and dependencies
from middleware import (
    require_organization,
    require_org_admin,
    is_valid_subdomain,
    is_valid_custom_domain,
    verify_domain_ownership,
    check_domain_verification
)

# Import auth dependencies
# # Lazy imports to avoid circular dependency
require_auth = None
require_admin = None  
db = None

def _init_server_deps():
    global require_auth, require_admin, db
    if require_auth is None:
        from server import require_auth as _auth, require_admin as _admin, db as _db
        require_auth = _auth
        require_admin = _admin
        db = _db  # Lazy import
require_auth = None
require_admin = None
db = None

# Create router
router = APIRouter(prefix="/api/organizations", tags=["organizations"])

# ============================================================================
# Organization CRUD Endpoints
# ============================================================================

@router.post("", response_model=OrganizationResponse, status_code=201)
async def create_organization(
    org_data: OrganizationCreate,
    current_user: dict = Depends(require_auth)
):
    """
    Create a new organization (white-label instance).

    Validates slug uniqueness and creates organization with default settings.
    The creating user becomes the first organization admin.
    """
    # Check if slug is already taken
    existing = await db.organizations.find_one({"slug": org_data.slug})
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Organization with slug '{org_data.slug}' already exists"
        )

    # Validate slug format
    if not is_valid_subdomain(org_data.slug):
        raise HTTPException(
            status_code=400,
            detail="Invalid slug format. Use only lowercase letters, numbers, and hyphens."
        )

    # Check user's organization limit
    user_org_count = await db.organizations.count_documents({
        "created_by": current_user["user_id"]
    })

    # For now, allow unlimited (can add limits later based on user plan)
    if user_org_count >= 10:  # Default limit
        raise HTTPException(
            status_code=403,
            detail="You have reached the maximum number of organizations"
        )

    # Generate organization ID
    organization_id = f"org_{secrets.token_urlsafe(16)}"

    # Create organization with default settings
    organization = Organization(
        organization_id=organization_id,
        name=org_data.name,
        slug=org_data.slug,
        branding=org_data.branding,
        created_by=current_user["user_id"],
        admin_users=[current_user["user_id"]],  # Creator is first admin
        industry=org_data.industry,
        company_size=org_data.company_size,
        onboarding_completed=False,
        onboarding_step=0
    )

    # Insert into database
    await db.organizations.insert_one(organization.dict(by_alias=True))

    # Update user's organization_id
    await db.users.update_one(
        {"user_id": current_user["user_id"]},
        {"$set": {
            "organization_id": organization_id,
            "role": "org_admin"
        }}
    )

    return OrganizationResponse(**organization.dict())


@router.get("", response_model=List[OrganizationResponse])
async def list_organizations(
    skip: int = 0,
    limit: int = 50,
    current_user: dict = Depends(require_admin)  # Only system admin
):
    """
    List all organizations (system admin only).

    Supports pagination with skip/limit parameters.
    """
    cursor = db.organizations.find().skip(skip).limit(limit)
    organizations = await cursor.to_list(length=limit)

    return [OrganizationResponse(**org) for org in organizations]


@router.get("/by-slug/{slug}", response_model=OrganizationResponse)
async def get_organization_by_slug(slug: str):
    """
    Get organization by slug (used for subdomain routing).

    This endpoint is called by the frontend to load organization
    configuration based on the current subdomain.
    """
    org = await db.organizations.find_one({
        "slug": slug,
        "status": "active"
    })

    if not org:
        raise HTTPException(
            status_code=404,
            detail=f"Organization with slug '{slug}' not found"
        )

    return OrganizationResponse(**org)


@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: str,
    current_user: dict = Depends(require_auth)
):
    """
    Get organization by ID.

    Users can only view their own organization.
    System admins can view any organization.
    """
    # Check permissions
    if current_user["role"] != "admin" and current_user.get("organization_id") != org_id:
        raise HTTPException(
            status_code=403,
            detail="You can only view your own organization"
        )

    org = await db.organizations.find_one({"organization_id": org_id})

    if not org:
        raise HTTPException(
            status_code=404,
            detail=f"Organization with ID '{org_id}' not found"
        )

    return OrganizationResponse(**org)


@router.put("/{org_id}", response_model=OrganizationResponse)
async def update_organization(
    org_id: str,
    update_data: OrganizationUpdate,
    current_user: dict = Depends(require_auth),
    org_id_check: str = Depends(require_organization)
):
    """
    Update organization details.

    Only organization admins can update organization settings.
    """
    # Verify user is admin of this organization
    if current_user["role"] != "admin":
        org = await db.organizations.find_one({"organization_id": org_id})
        if not org or current_user["user_id"] not in org.get("admin_users", []):
            raise HTTPException(
                status_code=403,
                detail="Organization admin access required"
            )

    # Build update document (only include provided fields)
    update_doc = {}
    if update_data.name is not None:
        update_doc["name"] = update_data.name

    if update_data.branding is not None:
        update_doc["branding"] = update_data.branding.dict()

    if update_data.settings is not None:
        update_doc["settings"] = update_data.settings.dict()

    if update_data.limits is not None:
        update_doc["limits"] = update_data.limits.dict()

    if update_data.industry is not None:
        update_doc["industry"] = update_data.industry

    if update_data.company_size is not None:
        update_doc["company_size"] = update_data.company_size

    if update_data.target_audience is not None:
        update_doc["target_audience"] = update_data.target_audience

    # Add updated timestamp
    update_doc["updated_at"] = datetime.utcnow()

    # Perform update
    result = await db.organizations.update_one(
        {"organization_id": org_id},
        {"$set": update_doc}
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=404,
            detail=f"Organization with ID '{org_id}' not found"
        )

    # Return updated organization
    updated_org = await db.organizations.find_one({"organization_id": org_id})
    return OrganizationResponse(**updated_org)


@router.delete("/{org_id}", status_code=204)
async def delete_organization(
    org_id: str,
    current_user: dict = Depends(require_admin)  # Only system admin
):
    """
    Delete an organization (system admin only).

    WARNING: This will delete all organization data including users,
    progress, bookmarks, etc. Use with caution.
    """
    # Check if organization exists
    org = await db.organizations.find_one({"organization_id": org_id})
    if not org:
        raise HTTPException(
            status_code=404,
            detail=f"Organization with ID '{org_id}' not found"
        )

    # Soft delete (update status to cancelled)
    await db.organizations.update_one(
        {"organization_id": org_id},
        {"$set": {
            "status": "cancelled",
            "updated_at": datetime.utcnow()
        }}
    )

    return None


# ============================================================================
# Settings & Branding Endpoints
# ============================================================================

@router.get("/{org_id}/settings")
async def get_organization_settings(
    org_id: str,
    current_user: dict = Depends(require_auth)
):
    """Get organization settings."""
    if current_user["role"] != "admin" and current_user.get("organization_id") != org_id:
        raise HTTPException(status_code=403, detail="Access denied")

    org = await db.organizations.find_one(
        {"organization_id": org_id},
        projection={"settings": 1, "_id": 0}
    )

    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    return org.get("settings", {})


@router.put("/{org_id}/settings")
async def update_organization_settings(
    org_id: str,
    settings: dict,
    current_user: dict = Depends(require_auth),
    org_id_check: str = Depends(require_organization)
):
    """Update organization settings (org admin only)."""
    # Verify admin permissions
    if current_user["role"] != "admin":
        org = await db.organizations.find_one({"organization_id": org_id})
        if not org or current_user["user_id"] not in org.get("admin_users", []):
            raise HTTPException(status_code=403, detail="Organization admin access required")

    await db.organizations.update_one(
        {"organization_id": org_id},
        {
            "$set": {
                "settings": settings,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {"message": "Settings updated successfully"}


@router.get("/{org_id}/branding")
async def get_organization_branding(
    org_id: str,
    current_user: dict = Depends(require_auth)
):
    """Get organization branding configuration."""
    if current_user["role"] != "admin" and current_user.get("organization_id") != org_id:
        raise HTTPException(status_code=403, detail="Access denied")

    org = await db.organizations.find_one(
        {"organization_id": org_id},
        projection={"branding": 1, "_id": 0}
    )

    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    return org.get("branding", {})


@router.put("/{org_id}/branding")
async def update_organization_branding(
    org_id: str,
    branding: dict,
    current_user: dict = Depends(require_auth),
    org_id_check: str = Depends(require_organization)
):
    """Update organization branding (org admin only)."""
    # Verify admin permissions
    if current_user["role"] != "admin":
        org = await db.organizations.find_one({"organization_id": org_id})
        if not org or current_user["user_id"] not in org.get("admin_users", []):
            raise HTTPException(status_code=403, detail="Organization admin access required")

    await db.organizations.update_one(
        {"organization_id": org_id},
        {
            "$set": {
                "branding": branding,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {"message": "Branding updated successfully"}


# ============================================================================
# Onboarding Endpoints
# ============================================================================

@router.post("/onboarding/step")
async def save_onboarding_step(
    step_data: OnboardingStepData,
    current_user: dict = Depends(require_auth)
):
    """
    Save onboarding step progress.

    Called as user progresses through the 6-step onboarding wizard.
    """
    org_id = current_user.get("organization_id")
    if not org_id:
        raise HTTPException(
            status_code=400,
            detail="No organization associated with user"
        )

    # Build update document based on step
    update_doc = {"onboarding_step": step_data.step}
    additional_updates = {}

    # Extract step-specific data
    if step_data.step == 0:  # Welcome
        if step_data.organization_type:
            additional_updates["industry"] = step_data.organization_type

    elif step_data.step == 1:  # Branding
        branding_updates = {}
        if step_data.logo_url:
            branding_updates["logo_url"] = step_data.logo_url
        if step_data.primary_color:
            branding_updates["primary_color"] = step_data.primary_color
        if step_data.secondary_color:
            branding_updates["secondary_color"] = step_data.secondary_color

        if branding_updates:
            additional_updates["branding"] = branding_updates

    elif step_data.step == 2:  # Content
        if step_data.custom_tracks_enabled is not None:
            additional_updates["settings.custom_tracks"] = step_data.custom_tracks_enabled
        if step_data.industry_focus:
            additional_updates["target_audience"] = step_data.industry_focus

    elif step_data.step == 3:  # Settings
        if step_data.enable_gamification is not None:
            additional_updates["settings.enable_gamification"] = step_data.enable_gamification
        if step_data.enable_community is not None:
            additional_updates["settings.enable_community"] = step_data.enable_community

    elif step_data.step == 4:  # Users
        if step_data.invite_emails:
            # TODO: Send invitations to users
            additional_updates["pending_invites"] = step_data.invite_emails

    elif step_data.step == 5:  # Complete
        if step_data.completed:
            update_doc["onboarding_completed"] = True

    # Merge updates
    if additional_updates:
        for key, value in additional_updates.items():
            if "." in key:
                # Handle nested keys like "branding.logo_url"
                parts = key.split(".")
                update_doc[parts[0]] = {parts[1]: value}
            else:
                update_doc[key] = value

    # Update organization
    await db.organizations.update_one(
        {"organization_id": org_id},
        {"$set": update_doc}
    )

    return {
        "message": "Step saved successfully",
        "next_step": step_data.step + 1 if step_data.step < 5 else 5
    }


@router.get("/onboarding/status")
async def get_onboarding_status(
    current_user: dict = Depends(require_auth)
):
    """Get current onboarding status for user's organization."""
    org_id = current_user.get("organization_id")
    if not org_id:
        raise HTTPException(
            status_code=400,
            detail="No organization associated with user"
        )

    org = await db.organizations.find_one(
        {"organization_id": org_id},
        projection={
            "onboarding_completed": 1,
            "onboarding_step": 1,
            "branding": 1,
            "_id": 0
        }
    )

    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    return {
        "onboarding_completed": org.get("onboarding_completed", False),
        "onboarding_step": org.get("onboarding_step", 0),
        "branding": org.get("branding", {})
    }


@router.post("/onboarding/complete")
async def complete_onboarding(current_user: dict = Depends(require_auth)):
    """Mark onboarding as completed."""
    org_id = current_user.get("organization_id")
    if not org_id:
        raise HTTPException(
            status_code=400,
            detail="No organization associated with user"
        )

    await db.organizations.update_one(
        {"organization_id": org_id},
        {
            "$set": {
                "onboarding_completed": True,
                "onboarding_step": 5,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {"message": "Onboarding completed successfully"}


# ============================================================================
# AI Assistant Endpoints
# ============================================================================

@router.post("/{org_id}/ai/suggest", response_model=AIAssistantResponse)
async def ai_suggest_changes(
    org_id: str,
    request_data: AIAssistantRequest,
    current_user: dict = Depends(require_auth),
    org_id_check: str = Depends(require_organization)
):
    """
    Get AI-suggested changes based on user's natural language request.

    Uses Claude API to understand the request and suggest specific changes.
    """
    # Verify user is org admin
    if current_user["role"] != "admin":
        org = await db.organizations.find_one({"organization_id": org_id})
        if not org or current_user["user_id"] not in org.get("admin_users", []):
            raise HTTPException(status_code=403, detail="Organization admin access required")

    # Get organization context
    org = await db.organizations.find_one({"organization_id": org_id})
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    # Check if AI assistant is enabled
    if not org.get("settings", {}).get("enable_ai_assistant", True):
        raise HTTPException(
            status_code=403,
            detail="AI assistant is not enabled for this organization"
        )

    # TODO: Integrate with Anthropic API
    # For now, return mock response
    mock_changes = [
        AIChangeSuggestion(
            id=f"change_{secrets.token_urlsafe(8)}",
            type="branding",
            field="primary_color",
            value="#3B82F6",
            reason="Blue color conveys trust and professionalism in sales training",
            confidence=0.85
        )
    ]

    return AIAssistantResponse(
        response="I've analyzed your request and suggested some changes to improve your academy's branding and user experience.",
        changes=mock_changes,
        conversation_id=f"conv_{secrets.token_urlsafe(16)}"
    )


@router.post("/{org_id}/ai/apply")
async def ai_apply_change(
    org_id: str,
    request_data: AIApplyChangeRequest,
    current_user: dict = Depends(require_auth),
    org_id_check: str = Depends(require_organization)
):
    """
    Apply an AI-suggested change to the organization.

    Validates and applies the change, logging it for audit purposes.
    """
    # Verify user is org admin
    if current_user["role"] != "admin":
        org = await db.organizations.find_one({"organization_id": org_id})
        if not org or current_user["user_id"] not in org.get("admin_users", []):
            raise HTTPException(status_code=403, detail="Organization admin access required")

    change = request_data.change

    # Build update path based on change type
    if change.type == "branding":
        update_path = f"branding.{change.field}"
    elif change.type == "settings":
        update_path = f"settings.{change.field}"
    elif change.type == "content":
        update_path = f"settings.{change.field}"
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid change type: {change.type}"
        )

    # Apply change
    await db.organizations.update_one(
        {"organization_id": org_id},
        {"$set": {
            update_path: change.value,
            "updated_at": datetime.utcnow()
        }}
    )

    # Log change for audit
    await db.ai_changes.insert_one({
        "organization_id": org_id,
        "change_id": change.id,
        "change_type": change.type,
        "change_field": change.field,
        "old_value": None,  # Could track old value if needed
        "new_value": change.value,
        "reason": change.reason,
        "confidence": change.confidence,
        "applied_by": current_user["user_id"],
        "conversation_id": request_data.conversation_id,
        "applied_at": datetime.utcnow()
    })

    return {"message": "Change applied successfully", "change_id": change.id}


@router.get("/{org_id}/ai/history")
async def get_ai_change_history(
    org_id: str,
    skip: int = 0,
    limit: int = 50,
    current_user: dict = Depends(require_auth),
    org_id_check: str = Depends(require_organization)
):
    """Get history of AI-applied changes for audit purposes."""
    # Verify user is org admin
    if current_user["role"] != "admin":
        org = await db.organizations.find_one({"organization_id": org_id})
        if not org or current_user["user_id"] not in org.get("admin_users", []):
            raise HTTPException(status_code=403, detail="Organization admin access required")

    cursor = db.ai_changes.find(
        {"organization_id": org_id}
    ).sort("applied_at", -1).skip(skip).limit(limit)

    changes = await cursor.to_list(length=limit)

    # Convert ObjectId to string
    for change in changes:
        change["_id"] = str(change["_id"])

    return {"changes": changes, "total": len(changes)}


# ============================================================================
# Domain Verification Endpoints
# ============================================================================

@router.post("/{org_id}/domains/verify")
async def verify_custom_domain(
    org_id: str,
    domain: str,
    current_user: dict = Depends(require_auth),
    org_id_check: str = Depends(require_organization)
):
    """
    Initiate domain ownership verification.

    Returns DNS TXT record that must be added to prove domain ownership.
    """
    # Verify user is org admin
    if current_user["role"] != "admin":
        org = await db.organizations.find_one({"organization_id": org_id})
        if not org or current_user["user_id"] not in org.get("admin_users", []):
            raise HTTPException(status_code=403, detail="Organization admin access required")

    # Validate domain format
    if not is_valid_custom_domain(domain):
        raise HTTPException(
            status_code=400,
            detail="Invalid domain format"
        )

    # Generate verification instructions
    instructions = await verify_domain_ownership(domain, org_id)

    return instructions


@router.get("/{org_id}/domains/dns")
async def get_domain_dns_instructions(
    org_id: str,
    domain: str,
    current_user: dict = Depends(require_auth),
    org_id_check: str = Depends(require_organization)
):
    """Get DNS configuration instructions for custom domain."""
    # Verify user is org admin
    if current_user["role"] != "admin":
        org = await db.organizations.find_one({"organization_id": org_id})
        if not org or current_user["user_id"] not in org.get("admin_users", []):
            raise HTTPException(status_code=403, detail="Organization admin access required")

    return {
        "domain": domain,
        "dns_records": [
            {
                "type": "A",
                "name": domain,
                "value": os.environ.get("SERVER_IP", "1.2.3.4"),
                "ttl": 3600
            },
            {
                "type": "CNAME",
                "name": f"www.{domain}",
                "value": domain,
                "ttl": 3600
            }
        ],
        "instructions": f"""
        To set up your custom domain {domain}, add the following DNS records:

        1. A Record: {domain} → {os.environ.get('SERVER_IP', 'your server IP')}
        2. CNAME Record: www.{domain} → {domain}

        DNS changes may take up to 48 hours to propagate.
        """
    }
