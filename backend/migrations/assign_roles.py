#!/usr/bin/env python3
"""
Migration Script: Assign Roles to Existing Users

This script assigns roles to existing users based on their membership and level.
- All users without role → 'rep'
- Users with membership='vip' and level > 3 → 'manager'
- admin@vcsa.com → 'admin'

Run: docker-compose exec backend python migrations/assign_roles.py
"""

import sys
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

ROOT_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT_DIR))
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'vcsa_local')

async def assign_roles():
    """Assign roles to existing users"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    print(f"🔗 Conectado a MongoDB: {MONGO_URL}")
    print(f"📊 Base de datos: {DB_NAME}\n")

    # Step 1: Assign 'rep' role to users without a role OR with 'member' role
    print("📝 Step 1: Assigning 'rep' role to users without role or with 'member' role...")
    result = await db.users.update_many(
        {
            "$or": [
                {"role": {"$exists": False}},
                {"role": "member"}
            ]
        },
        {"$set": {"role": "rep"}}
    )
    print(f"✅ Updated {result.modified_count} users to 'rep' role\n")

    # Step 2: Promote qualified users to 'manager'
    print("📝 Step 2: Promoting qualified users to 'manager'...")
    result = await db.users.update_many(
        {
            "membership": "vip",
            "level": {"$gt": 3},
            "role": "rep"
        },
        {"$set": {"role": "manager"}}
    )
    print(f"✅ Promoted {result.modified_count} users to 'manager' role\n")

    # Step 3: Ensure admin@vcsa.com has 'admin' role
    print("📝 Step 3: Ensuring admin user has 'admin' role...")
    existing_admin = await db.users.find_one({"email": "admin@vcsa.com"})

    if existing_admin:
        result = await db.users.update_one(
            {"email": "admin@vcsa.com"},
            {"$set": {"role": "admin"}}
        )
        print(f"✅ Updated admin@vcsa.com to 'admin' role\n")
    else:
        print(f"⚠️  admin@vcsa.com not found - skipping\n")

    # Step 4: Create a director user for testing
    print("📝 Step 4: Creating director user for testing...")
    director_exists = await db.users.find_one({"email": "director@vcsa.com"})

    if not director_exists:
        import bcrypt
        import uuid

        hashed_password = bcrypt.hashpw("director123".encode(), bcrypt.gensalt()).decode()

        director_user = {
            "user_id": str(uuid.uuid4()),
            "email": "director@vcsa.com",
            "password_hash": hashed_password,
            "name": "Director User",
            "role": "director",
            "level": 4,
            "points": 1500,
            "membership": "vip",
            "organization_id": existing_admin.get("organization_id") if existing_admin else None,
            "onboarding_completed": True,
            "created_at": "2026-03-31T00:00:00Z"
        }

        await db.users.insert_one(director_user)
        print(f"✅ Created director@vcsa.com / director123\n")
    else:
        print(f"⏭️  director@vcsa.com already exists\n")

    # Step 5: Show role distribution
    print("📊 Role Distribution:")
    pipeline = [
        {"$group": {"_id": "$role", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]

    role_counts = await db.users.aggregate(pipeline).to_list(length=10)

    for role_count in role_counts:
        role = role_count["_id"]
        count = role_count["count"]
        print(f"   - {role}: {count} users")

    # Step 6: Show sample users
    print("\n👥 Sample Users:")
    sample_users = await db.users.find(
        {},
        {"email": 1, "role": 1, "name": 1, "_id": 0}
    ).limit(5).to_list(length=5)

    for user in sample_users:
        print(f"   - {user['email']}: {user['role']}")

    print("\n🎉 Role assignment completed!")

    # Close connection
    client.close()

if __name__ == "__main__":
    import asyncio
    asyncio.run(assign_roles())
