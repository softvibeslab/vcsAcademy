"""
School Creation Routes for VCSA Platform

Simplified school creation flow for the new onboarding experience.
"""

from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import uuid
from datetime import datetime
import re
from pydantic import BaseModel, Field

from organization_models import (
    Organization,
    OrganizationCreate,
    OrganizationResponse,
    OrganizationBranding,
    OrganizationSettings,
    OrganizationLimits,
    OrganizationStatus,
    OrganizationPlan
)

router = APIRouter(prefix="/api/schools", tags=["schools"])


class SchoolCreateRequest(BaseModel):
    """Simplified school creation request"""
    name: str = Field(..., min_length=1, max_length=100, description="School name")
    learning_outcome: Optional[str] = Field(None, description="Desired learning outcomes")
    logo_url: Optional[str] = Field(None, description="School logo URL")
    primary_color: str = Field("#D4AF37", description="Primary brand color")
    secondary_color: str = Field("#1E3A8A", description="Secondary brand color")
    industry: str = Field("Sales Training", description="Industry/sector")


class SchoolCreateResponse(BaseModel):
    """Response after school creation"""
    success: bool
    message: str
    school: Optional[OrganizationResponse] = None
    school_id: Optional[str] = None


def generate_slug(name: str) -> str:
    """Generate URL-safe slug from school name"""
    # Convert to lowercase and replace spaces with hyphens
    slug = name.lower().strip()
    # Remove special characters except spaces and hyphens
    slug = re.sub(r'[^\w\s-]', '', slug)
    # Replace spaces with hyphens
    slug = re.sub(r'[-\s]+', '-', slug)
    # Ensure it starts with a letter
    slug = slug.lstrip('0123456789-')
    # Limit length
    if len(slug) > 50:
        slug = slug[:50].rstrip('-')
    return slug


async def check_slug_exists(db, slug: str) -> bool:
    """Check if a slug already exists in the database"""
    existing = await db.organizations.find_one({"slug": slug})
    return existing is not None


async def make_unique_slug(db, base_slug: str) -> str:
    """Make slug unique by adding suffix if needed"""
    slug = base_slug
    counter = 1

    while await check_slug_exists(db, slug):
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug


@router.post("/create", response_model=SchoolCreateResponse)
async def create_school(
    request: SchoolCreateRequest,
    db: AsyncIOMotorClient = Depends(lambda: None)
):
    """
    Create a new school with simplified onboarding flow

    This endpoint is designed for the 7-minute school creation experience.
    It automatically generates a slug, sets up default branding, and creates
    the organization with sensible defaults.
    """
    try:
        # Get database connection (will be injected by dependency)
        from server import db as database
        db = database

        # Generate unique slug from school name
        base_slug = generate_slug(request.name)
        unique_slug = await make_unique_slug(db, base_slug)

        # Generate unique school ID
        school_id = str(uuid.uuid4())

        # Create default branding based on user input
        branding = OrganizationBranding(
            logo_url=request.logo_url or f"https://ui-avatars.com/api/?name={request.name}&background=6366f1&color=fff&size=256",
            logo_dark_url=None,
            favicon_url=None,
            primary_color=request.primary_color,
            secondary_color=request.secondary_color,
            background_color="#020204",
            text_primary="#F1F5F9",
            text_secondary="#94A3B8",
            font_heading="Playfair Display",
            font_body="DM Sans",
            site_name=request.name,
            tagline=request.learning_outcome or "Transform your team with AI-powered training",
            hero_title=f"Welcome to {request.name}",
            hero_subtitle=request.learning_outcome or "Master the skills that matter most",
            email_from_name=request.name,
            email_from_address=f"admin@{unique_slug}.com",
            email_footer_text=f"Powered by {request.name}"
        )

        # Create default settings optimized for AI assistant
        settings = OrganizationSettings(
            enable_ai_assistant=True,
            custom_tracks=False,
            custom_modules=False,
            enable_gamification=True,
            enable_badges=True,
            enable_leaderboard=True,
            enable_streaks=True,
            enable_deal_breakdowns=True,
            enable_quick_wins=True,
            enable_community=True,
            enable_events=True
        )

        # Create default limits for starter plan
        limits = OrganizationLimits(
            max_users=50,
            max_admins=5,
            max_managers=10,
            max_custom_tracks=6,
            max_custom_modules_per_track=10,
            max_storage_mb=10240,  # 10GB
            api_calls_per_month=-1,  # Unlimited
            ai_assistant_calls_per_month=500,  # Generous AI allowance
            max_custom_domains=1,
            max_webhooks=5
        )

        # Create the organization document
        organization = Organization(
            organization_id=school_id,
            name=request.name,
            slug=unique_slug,
            branding=branding,
            settings=settings,
            limits=limits,
            status=OrganizationStatus.ACTIVE,
            plan=OrganizationPlan.ENTERPRISE,  # Start with enterprise features for demo
            industry=request.industry,
            company_size="small",
            target_audience=request.learning_outcome,
            onboarding_completed=False,
            onboarding_step=1,  # Step 1 = basic info complete, proceed to interview
            admin_users=[],
            domains=[]
        )

        # Convert to dict and add timestamps
        org_dict = organization.model_dump()
        org_dict['created_at'] = datetime.utcnow()
        org_dict['updated_at'] = datetime.utcnow()

        # Insert into database
        result = await db.organizations.insert_one(org_dict)

        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Failed to create school")

        # Fetch the created school
        created_school = await db.organizations.find_one({"_id": result.inserted_id})

        # Convert ObjectId to string for response
        created_school['_id'] = str(created_school['_id'])

        # Create response
        response = SchoolCreateResponse(
            success=True,
            message=f"School '{request.name}' created successfully!",
            school=OrganizationResponse(**created_school),
            school_id=school_id
        )

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating school: {str(e)}")


@router.get("/{school_id}", response_model=OrganizationResponse)
async def get_school(
    school_id: str,
    db: AsyncIOMotorClient = Depends(lambda: None)
):
    """Get school details by ID"""
    try:
        from server import db as database
        db = database

        school = await db.organizations.find_one({"organization_id": school_id})

        if not school:
            raise HTTPException(status_code=404, detail="School not found")

        # Convert ObjectId to string
        school['_id'] = str(school['_id'])

        return OrganizationResponse(**school)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching school: {str(e)}")


@router.get("/slug/{slug}", response_model=OrganizationResponse)
async def get_school_by_slug(
    slug: str,
    db: AsyncIOMotorClient = Depends(lambda: None)
):
    """Get school details by slug"""
    try:
        from server import db as database
        db = database

        school = await db.organizations.find_one({"slug": slug})

        if not school:
            raise HTTPException(status_code=404, detail="School not found")

        # Convert ObjectId to string
        school['_id'] = str(school['_id'])

        return OrganizationResponse(**school)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching school: {str(e)}")