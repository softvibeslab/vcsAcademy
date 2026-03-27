#!/usr/bin/env python3
"""
Seed Branding Configuration

Script para inicializar la configuración de branding por defecto
"""
import sys
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone

# Agregar el directorio del backend al path
ROOT_DIR = Path(__file__).parent
sys.path.insert(0, str(ROOT_DIR))

# Cargar variables de entorno
load_dotenv(ROOT_DIR / '.env')

# Configuración de MongoDB
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'vcsa')


async def seed_branding():
    """Crear configuración de branding por defecto"""
    try:
        # Conectar a MongoDB
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]

        print(f"🔗 Conectado a MongoDB: {MONGO_URL}")
        print(f"📊 Base de datos: {DB_NAME}")

        # Verificar si ya existe configuración activa
        existing = await db.branding_configs.find_one({"is_active": True})

        if existing:
            print("✅ Ya existe una configuración de branding activa")
            print(f"   ID: {existing['_id']}")
            print(f"   Nombre: {existing.get('name', 'N/A')}")
            return

        # Crear configuración por defecto
        default_config = {
            "name": "Default Branding",
            "is_active": True,
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
                "logo_url": "/logo.png",
                "logo_dark_url": "/logo-dark.png",
                "favicon_url": "/favicon.ico",
                "hero_background": None,
                "login_background": None
            },
            "typography": {
                "font_heading": "Playfair Display",
                "font_body": "DM Sans",
                "font_mono": "JetBrains Mono"
            },
            "texts": {
                "site_name": "Vacation Club Sales Academy",
                "tagline": "The Performance Operating System for Vacation Club Sales Teams",
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
            "created_by": "system"
        }

        # Insertar configuración
        result = await db.branding_configs.insert_one(default_config)

        print("✅ Configuración de branding por defecto creada exitosamente")
        print(f"   ID: {result.inserted_id}")
        print(f"   Nombre: {default_config['name']}")

        # Crear configuraciones adicionales de ejemplo
        example_configs = [
            {
                "name": "Blue Corporate",
                "is_active": False,
                "colors": {
                    "primary": "#2563EB",
                    "secondary": "#1E40AF",
                    "accent": "#3B82F6",
                    "background": "#0F172A",
                    "card_background": "#1E293B",
                    "text_main": "#F8FAFC",
                    "text_muted": "#94A3B8"
                },
                "images": {
                    "logo_url": "/logo.png",
                    "logo_dark_url": "/logo-dark.png",
                    "favicon_url": "/favicon.ico",
                    "hero_background": None,
                    "login_background": None
                },
                "typography": {
                    "font_heading": "Inter",
                    "font_body": "Inter",
                    "font_mono": "JetBrains Mono"
                },
                "texts": {
                    "site_name": "Sales Academy",
                    "tagline": "Professional Sales Training Platform",
                    "site_description": "Comprehensive sales training for professionals"
                },
                "ui_config": {
                    "border_radius": "8",
                    "button_style": "rounded",
                    "card_style": "elevated",
                    "animation_level": "minimal"
                },
                "gradients": {
                    "primary_gradient": "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                    "secondary_gradient": "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)"
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
                "created_by": "system"
            },
            {
                "name": "Green Nature",
                "is_active": False,
                "colors": {
                    "primary": "#10B981",
                    "secondary": "#059669",
                    "accent": "#34D399",
                    "background": "#022C22",
                    "card_background": "#064E3B",
                    "text_main": "#ECFDF5",
                    "text_muted": "#6EE7B7"
                },
                "images": {
                    "logo_url": "/logo.png",
                    "logo_dark_url": "/logo-dark.png",
                    "favicon_url": "/favicon.ico",
                    "hero_background": None,
                    "login_background": None
                },
                "typography": {
                    "font_heading": "DM Sans",
                    "font_body": "DM Sans",
                    "font_mono": "JetBrains Mono"
                },
                "texts": {
                    "site_name": "Eco Sales Academy",
                    "tagline": "Sustainable Sales Training",
                    "site_description": "Environmentally conscious sales training"
                },
                "ui_config": {
                    "border_radius": "12",
                    "button_style": "pill",
                    "card_style": "glass",
                    "animation_level": "normal"
                },
                "gradients": {
                    "primary_gradient": "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                    "secondary_gradient": "linear-gradient(180deg, #022C22 0%, #064E3B 100%)"
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
                "created_by": "system"
            }
        ]

        for config in example_configs:
            result = await db.branding_configs.insert_one(config)
            print(f"✅ Configuración de ejemplo creada: {config['name']} (ID: {result.inserted_id})")

        # Cerrar conexión
        client.close()

        print("\n🎉 Branding seeding completado exitosamente")

    except Exception as e:
        print(f"❌ Error durante el seeding: {e}")
        raise


if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_branding())
