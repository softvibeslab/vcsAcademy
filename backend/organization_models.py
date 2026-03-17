"""
Organization Models for VCSA White-Label Platform

This module defines the data models for multi-tenant organization management,
including branding, settings, and limits.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, EmailStr
from enum import Enum


class OrganizationStatus(str, Enum):
    """Organization status"""
    ACTIVE = "active"
    SUSPENDED = "suspended"
    CANCELLED = "cancelled"


class OrganizationPlan(str, Enum):
    """Organization pricing plan"""
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"


class OrganizationBranding(BaseModel):
    """Complete visual branding customization for an organization"""
    # Visual Identity
    logo_url: str = Field(..., description="URL to organization logo")
    logo_dark_url: Optional[str] = Field(None, description="URL to dark mode logo")
    favicon_url: Optional[str] = Field(None, description="URL to favicon")

    # Dynamic Colors (theme customization)
    primary_color: str = Field("#D4AF37", description="Primary brand color")
    secondary_color: str = Field("#1E3A8A", description="Secondary brand color")
    background_color: str = Field("#020204", description="Background color")
    text_primary: str = Field("#F1F5F9", description="Primary text color")
    text_secondary: str = Field("#94A3B8", description="Secondary text color")

    # Typography
    font_heading: str = Field("Playfair Display", description="Heading font family")
    font_body: str = Field("DM Sans", description="Body text font family")

    # Customizable Text Content
    site_name: str = Field("Sales Academy", description="Site name displayed in header")
    tagline: str = Field("Transform Your Sales Team", description="Site tagline")
    hero_title: str = Field("Become a Top Producer", description="Hero section title")
    hero_subtitle: str = Field(
        "Master the art of vacation club sales with our comprehensive training platform",
        description="Hero section subtitle"
    )

    # Email Branding
    email_from_name: str = Field(..., description="Email sender name")
    email_from_address: EmailStr = Field(..., description="Email sender address")
    email_footer_text: str = Field(
        "Powered by VCSA",
        description="Footer text for emails"
    )

    # Custom CSS (advanced customization)
    custom_css: Optional[str] = Field(None, description="Custom CSS to inject")


class OrganizationSettings(BaseModel):
    """Organization configuration and feature flags"""
    # General Settings
    timezone: str = Field("UTC", description="Organization timezone")
    language: str = Field("en", description="Default language (en, es)")
    currency: str = Field("USD", description="Currency for payments")

    # Content Settings
    custom_tracks: bool = Field(False, description="Enable custom tracks")
    custom_modules: bool = Field(False, description="Enable custom modules")
    enable_ai_assistant: bool = Field(True, description="Enable AI assistant feature")

    # Gamification Settings
    enable_gamification: bool = Field(True, description="Enable points and badges")
    enable_badges: bool = Field(True, description="Enable badge system")
    enable_leaderboard: bool = Field(False, description="Enable leaderboard")
    enable_streaks: bool = Field(True, description="Enable training streaks")

    # Content Library
    enable_deal_breakdowns: bool = Field(True, description="Enable deal breakdowns")
    enable_quick_wins: bool = Field(True, description="Enable quick wins library")

    # Integrations
    stripe_enabled: bool = Field(False, description="Enable Stripe payments")
    google_oauth_enabled: bool = Field(False, description="Enable Google OAuth")
    sentry_dsn: Optional[str] = Field(None, description="Sentry DSN for error tracking")

    # Notifications
    email_notifications_enabled: bool = Field(True, description="Enable email notifications")
    push_notifications_enabled: bool = Field(False, description="Enable push notifications")

    # Community Features
    enable_community: bool = Field(True, description="Enable community features")
    enable_events: bool = Field(True, description="Enable events calendar")
    moderate_posts: bool = Field(True, description="Require moderation for posts")

    # Advanced Settings
    allow_custom_domains: bool = Field(True, description="Allow custom domain mapping")
    api_access_enabled: bool = Field(False, description="Enable API access")


class OrganizationLimits(BaseModel):
    """Resource and usage limits for an organization"""
    # User Limits
    max_users: int = Field(-1, description="Maximum users (-1 = unlimited)")
    max_admins: int = Field(5, description="Maximum organization admins")
    max_managers: int = Field(10, description="Maximum team managers")

    # Content Limits
    max_custom_tracks: int = Field(6, description="Maximum custom tracks")
    max_custom_modules_per_track: int = Field(10, description="Maximum modules per track")
    max_storage_mb: int = Field(10240, description="Maximum storage in MB (10GB default)")

    # API Limits
    api_calls_per_month: int = Field(-1, description="API calls per month (-1 = unlimited)")
    ai_assistant_calls_per_month: int = Field(100, description="AI assistant calls per month")

    # Feature Limits
    max_custom_domains: int = Field(1, description="Maximum custom domains")
    max_webhooks: int = Field(5, description="Maximum webhook integrations")


class Organization(BaseModel):
    """
    Main organization/tenant model for white-label platform

    Represents a complete white-label instance with its own branding,
    content, settings, and isolated user base.
    """
    # Identity
    organization_id: str = Field(..., description="Unique organization identifier")
    name: str = Field(..., min_length=1, max_length=100, description="Organization name")
    slug: str = Field(
        ...,
        min_length=3,
        max_length=50,
        pattern="^[a-z0-9-]+$",
        description="URL-safe identifier (e.g., 'acme-sales-academy')"
    )

    # Branding & Customization
    branding: OrganizationBranding = Field(..., description="Visual branding configuration")

    # Domains
    domains: List[str] = Field(
        default_factory=list,
        description="List of domains (e.g., ['acme.vcsa.com'])"
    )
    custom_domain: Optional[str] = Field(None, description="Custom domain (e.g., 'academy.acme.com')")

    # Configuration
    settings: OrganizationSettings = Field(
        default_factory=OrganizationSettings,
        description="Organization settings and feature flags"
    )

    feature_flags: Dict[str, bool] = Field(
        default_factory=dict,
        description="Additional feature flags for experimentation"
    )

    # State & Plan
    status: OrganizationStatus = Field(OrganizationStatus.ACTIVE, description="Organization status")
    plan: OrganizationPlan = Field(OrganizationPlan.ENTERPRISE, description="Pricing plan")

    # Limits
    limits: OrganizationLimits = Field(
        default_factory=OrganizationLimits,
        description="Resource and usage limits"
    )

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")
    created_by: str = Field(..., description="User ID of creator")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Last update timestamp")

    # Onboarding State
    onboarding_completed: bool = Field(False, description="Whether onboarding wizard is complete")
    onboarding_step: int = Field(0, ge=0, le=5, description="Current onboarding step (0-5)")

    # Industry & Context (for AI assistant)
    industry: Optional[str] = Field(None, description="Industry for AI context")
    company_size: Optional[str] = Field(None, description="Company size (small, medium, large)")
    target_audience: Optional[str] = Field(None, description="Target audience description")

    # Admin Team
    admin_users: List[str] = Field(
        default_factory=list,
        description="List of user IDs with organization admin role"
    )


class OrganizationCreate(BaseModel):
    """Request model for creating a new organization"""
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=3, max_length=50, pattern="^[a-z0-9-]+$")
    branding: OrganizationBranding
    industry: Optional[str] = None
    company_size: Optional[str] = None


class OrganizationUpdate(BaseModel):
    """Request model for updating an organization"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    branding: Optional[OrganizationBranding] = None
    settings: Optional[OrganizationSettings] = None
    limits: Optional[OrganizationLimits] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    target_audience: Optional[str] = None


class OrganizationResponse(BaseModel):
    """Response model for organization data"""
    organization_id: str
    name: str
    slug: str
    branding: OrganizationBranding
    domains: List[str]
    custom_domain: Optional[str]
    settings: OrganizationSettings
    status: str
    plan: str
    limits: OrganizationLimits
    created_at: datetime
    onboarding_completed: bool
    onboarding_step: int


class OnboardingStepData(BaseModel):
    """Data model for onboarding step completion"""
    step: int = Field(..., ge=0, le=5, description="Step number (0-5)")
    data: dict = Field(..., description="Step data to save")

    # Step 0: Welcome
    organization_type: Optional[str] = None  # 'sales_training', 'customer_success', etc.

    # Step 1: Branding
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None

    # Step 2: Content
    custom_tracks_enabled: Optional[bool] = None
    industry_focus: Optional[str] = None

    # Step 3: Settings
    enable_gamification: Optional[bool] = None
    enable_community: Optional[bool] = None

    # Step 4: Users
    invite_emails: Optional[List[str]] = None

    # Step 5: Complete
    completed: Optional[bool] = None


class AIChangeSuggestion(BaseModel):
    """AI-suggested change model"""
    id: str = Field(..., description="Unique change identifier")
    type: str = Field(..., description="Change type: branding, content, settings")
    field: str = Field(..., description="Field to change")
    value: Any = Field(..., description="New value")
    reason: str = Field(..., description="Explanation of why this change is suggested")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score (0-1)")


class AIConversationMessage(BaseModel):
    """Message in AI assistant conversation"""
    role: str = Field(..., pattern="^(user|assistant)$", description="Message role")
    content: str = Field(..., description="Message content")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class AIAssistantRequest(BaseModel):
    """Request model for AI assistant"""
    message: str = Field(..., min_length=1, max_length=2000, description="User message to AI")
    context: Optional[dict] = Field(None, description="Additional context for AI")


class AIAssistantResponse(BaseModel):
    """Response model for AI assistant"""
    response: str = Field(..., description="AI text response")
    changes: List[AIChangeSuggestion] = Field(
        default_factory=list,
        description="Suggested changes"
    )
    conversation_id: str = Field(..., description="Conversation identifier")


class AIApplyChangeRequest(BaseModel):
    """Request model for applying AI-suggested change"""
    change: AIChangeSuggestion = Field(..., description="Change to apply")
    conversation_id: str = Field(..., description="Conversation identifier")
