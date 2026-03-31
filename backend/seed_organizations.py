#!/usr/bin/env python3
"""
Seed Test Organization for VCSA Local Development
Run: docker-compose exec backend python seed_organizations.py
"""

import sys
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid

ROOT_DIR = Path(__file__).parent
sys.path.insert(0, str(ROOT_DIR))
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'vcsa_local')

async def seed_organizations():
    """Seed test organization"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    print(f"🔗 Conectado a MongoDB: {MONGO_URL}")
    print(f"📊 Base de datos: {DB_NAME}")

    # Get admin user's organization ID
    admin_user = await db.users.find_one({"email": "admin@vcsa.com"})
    org_id = admin_user.get("organization_id") if admin_user else str(uuid.uuid4())

    # Clear existing test orgs
    await db.organizations.delete_many({"slug": "test-sales-academy"})

    print("🧹 Limpiando organizaciones de prueba existentes...")

    organization = {
        "organization_id": org_id,
        "name": "Test Sales Academy",
        "slug": "test-sales-academy",
        "status": "active",
        "plan": "enterprise",
        "industry": "Sales Training",
        "company_size": "small",
        "target_audience": "Sales Representatives, Sales Managers",
        "branding": {
            "logo_url": "https://ui-avatars.com/api/?name=Test+Sales+Academy&background=D4AF37&color=fff&size=256&font-size=0.33",
            "logo_dark_url": None,
            "favicon_url": None,
            "primary_color": "#D4AF37",
            "secondary_color": "#1E3A8A",
            "accent_color": "#F59E0B",
            "background_color": "#020204",
            "card_background": "#0A0A0B",
            "text_primary": "#F1F5F9",
            "text_secondary": "#94A3B8",
            "font_heading": "Playfair Display",
            "font_body": "DM Sans",
            "font_mono": "JetBrains Mono",
            "site_name": "Test Sales Academy",
            "tagline": "Transform Your Sales Team",
            "site_description": "Premium sales training platform",
            "hero_title": "Welcome to Test Sales Academy",
            "hero_subtitle": "Master the art of sales"
        },
        "settings": {
            "enable_ai_assistant": False,
            "custom_tracks": False,
            "enable_gamification": True,
            "enable_badges": True,
            "enable_leaderboard": True,
            "enable_deal_breakdowns": True,
            "enable_quick_wins": True,
            "enable_community": True,
            "enable_events": True
        },
        "limits": {
            "max_users": 50,
            "max_admins": 5,
            "max_tracks": 20,
            "api_calls_per_month": -1
        },
        "admin_users": [admin_user["user_id"]] if admin_user else [],
        "domains": [],
        "pending_invites": [],
        "onboarding_completed": True,
        "onboarding_step": 5,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "created_by": admin_user["user_id"] if admin_user else None
    }

    await db.organizations.insert_one(organization)
    print(f"✅ Organización creada: Test Sales Academy")
    print(f"   ID: {org_id}")
    print(f"   Slug: test-sales-academy")
    print(f"   Plan: Enterprise")

    # Create a branding config
    branding_config = {
        "config_id": str(uuid.uuid4()),
        "name": "Test Sales Academy Branding",
        "is_active": True,
        "organization_id": org_id,
        "colors": {
            "primary": "#D4AF37",
            "secondary": "#1E3A8A",
            "accent": "#F59E0B",
            "background": "#020204",
            "card_background": "#0A0A0B",
            "text_main": "#F8FAFC",
            "text_muted": "#94A3B8"
        },
        "images": {
            "logo_url": "https://ui-avatars.com/api/?name=TSA&background=D4AF37&color=fff&size=256",
            "logo_dark_url": None,
            "favicon_url": None,
            "hero_background": None,
            "login_background": None
        },
        "typography": {
            "font_heading": "Playfair Display",
            "font_body": "DM Sans",
            "font_mono": "JetBrains Mono"
        },
        "texts": {
            "site_name": "Test Sales Academy",
            "tagline": "Transform Your Sales Team",
            "site_description": "Premium sales training platform for vacation club professionals"
        },
        "ui_config": {
            "border_radius": "0",
            "button_style": "sharp",
            "card_style": "glass",
            "animation_level": "normal"
        },
        "gradients": {
            "primary_gradient": "linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)",
            "secondary_gradient": "linear-gradient(180deg, #020204 0%, #0F172A 100%)"
        },
        "social": {
            "facebook_url": None,
            "twitter_url": None,
            "instagram_url": None,
            "linkedin_url": None,
            "youtube_url": None
        },
        "advanced": {
            "custom_css": "",
            "head_scripts": "",
            "body_scripts": ""
        },
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "created_by": admin_user["user_id"] if admin_user else None
    }

    await db.branding_configs.insert_one(branding_config)
    print(f"✅ Branding config creado para la organización")

    print("\n🎉 Organization seeding completado!")
    print("\n📊 Detalles:")
    print(f"   🏢 Organización: Test Sales Academy")
    print(f"   🔗 Slug: test-sales-academy")
    print(f"   👤 Admin: admin@vcsa.com")
    print(f"   🎨 Primary Color: #D4AF37 (Gold)")
    print(f"   🎨 Secondary Color: #1E3A8A (Navy)")

    client.close()

if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_organizations())
