#!/usr/bin/env python3
"""
Seed Test Users for VCSA Local Development
Run: docker-compose exec backend python seed_test_users.py
"""

import sys
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import bcrypt
import uuid

ROOT_DIR = Path(__file__).parent
sys.path.insert(0, str(ROOT_DIR))
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'vcsa_local')

async def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

async def seed_users():
    """Seed test users"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    print(f"🔗 Conectado a MongoDB: {MONGO_URL}")
    print(f"📊 Base de datos: {DB_NAME}")

    # Clear existing test users
    test_emails = ["sales@vcsa.com", "admin@vcsa.com", "creator@vcsa.com"]
    await db.users.delete_many({"email": {"$in": test_emails}})
    await db.user_progress.delete_many({})
    await db.user_sessions.delete_many({"email": {"$in": test_emails}})

    print("🧹 Limpiando usuarios de prueba existentes...")

    # Create users
    org_id = str(uuid.uuid4())

    users = [
        {
            "user_id": str(uuid.uuid4()),
            "email": "sales@vcsa.com",
            "password_hash": await hash_password("sales123"),
            "name": "Sarah Seller",
            "role": "member",
            "level": 1,
            "points": 0,
            "membership": "free",
            "organization_id": None,
            "onboarding_completed": False,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "user_id": str(uuid.uuid4()),
            "email": "admin@vcsa.com",
            "password_hash": await hash_password("admin123"),
            "name": "Admin User",
            "role": "admin",
            "level": 5,
            "points": 1000,
            "membership": "vip",
            "organization_id": org_id,
            "onboarding_completed": True,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "user_id": str(uuid.uuid4()),
            "email": "creator@vcsa.com",
            "password_hash": await hash_password("creator123"),
            "name": "Content Creator",
            "role": "admin",
            "level": 3,
            "points": 500,
            "membership": "vip",
            "organization_id": None,
            "onboarding_completed": True,
            "created_at": datetime.now(timezone.utc)
        }
    ]

    for user in users:
        await db.users.insert_one(user)
        print(f"✅ Usuario creado: {user['email']} / {user['name']}")

    # Create initial progress for sales user
    sales_user = next(u for u in users if u['email'] == 'sales@vcsa.com')
    progress = {
        "user_id": sales_user['user_id'],
        "current_stage": 1,
        "xp": 0,
        "points": 0,
        "badges": [],
        "streak_days": 0,
        "last_activity": datetime.now(timezone.utc),
        "tracks_progress": {
            "track_1_mindset": 0,
            "track_2_discovery": 0,
            "track_3_value": 0
        },
        "completed_modules": [],
        "reviewed_breakdowns": [],
        "applied_quickwins": [],
        "bookmarks": [],
        "next_assignment": {
            "content_id": "mod_1_1",
            "title": "The Top Producer Identity",
            "type": "video",
            "track_id": "track_1_mindset"
        },
        "readiness_score": 0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    await db.user_progress.insert_one(progress)
    print(f"✅ Progress inicial creado para: {sales_user['email']}")

    # Create progress for admin user
    admin_user = next(u for u in users if u['email'] == 'admin@vcsa.com')
    progress_admin = {
        "user_id": admin_user['user_id'],
        "current_stage": 2,
        "xp": 200,
        "points": 200,
        "badges": ["first_win", "mindset_master"],
        "streak_days": 5,
        "last_activity": datetime.now(timezone.utc),
        "tracks_progress": {
            "track_1_mindset": 100,
            "track_2_discovery": 50,
            "track_3_value": 0
        },
        "completed_modules": ["mod_1_1", "mod_1_2", "mod_1_3"],
        "reviewed_breakdowns": ["bd_1"],
        "applied_quickwins": ["qw_1"],
        "bookmarks": [],
        "next_assignment": {
            "content_id": "mod_2_1",
            "title": "The Discovery Framework",
            "type": "video",
            "track_id": "track_2_discovery"
        },
        "readiness_score": 35,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    await db.user_progress.insert_one(progress_admin)
    print(f"✅ Progress inicial creado para: {admin_user['email']}")

    # Create progress for creator user
    creator_user = next(u for u in users if u['email'] == 'creator@vcsa.com')
    progress_creator = {
        "user_id": creator_user['user_id'],
        "current_stage": 1,
        "xp": 50,
        "points": 50,
        "badges": ["first_win"],
        "streak_days": 2,
        "last_activity": datetime.now(timezone.utc),
        "tracks_progress": {
            "track_1_mindset": 30,
            "track_2_discovery": 0,
            "track_3_value": 0
        },
        "completed_modules": ["mod_1_1"],
        "reviewed_breakdowns": [],
        "applied_quickwins": [],
        "bookmarks": ["mod_1_2"],
        "next_assignment": {
            "content_id": "mod_1_2",
            "title": "Pre-Tour Ritual",
            "type": "video",
            "track_id": "track_1_mindset"
        },
        "readiness_score": 15,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    await db.user_progress.insert_one(progress_creator)
    print(f"✅ Progress inicial creado para: {creator_user['email']}")

    print("\n🎉 Test users seeding completado!")
    print("\n📝 Credenciales:")
    print("   🧑‍💼 Vendedor: sales@vcsa.com / sales123")
    print("   👑 Admin:    admin@vcsa.com / admin123")
    print("   🎨 Creator:  creator@vcsa.com / creator123")

    client.close()

if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_users())
