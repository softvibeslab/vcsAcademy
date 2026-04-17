#!/usr/bin/env python3
"""
Create Admin User - Script para crear usuario admin en la base de datos
"""
import asyncio
import sys
import os
from datetime import datetime, timezone
import uuid

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt

async def create_admin_user():
    """Crear usuario admin"""

    # MongoDB connection
    MONGO_URL = os.getenv("MONGO_URL", "mongodb://admin:changeme@localhost:27019")
    DB_NAME = os.getenv("DB_NAME", "vcsa")

    print("🔗 Conectando a MongoDB...")
    print(f"   URL: {MONGO_URL}")
    print(f"   DB: {DB_NAME}")

    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]

        # Delete existing admin if exists
        print("\n🗑️  Limpiando admin existente...")
        await db.users.delete_many({"email": "admin@vcsa.com"})

        # Hash password
        password = "admin123"
        print(f"\n🔐 Hasheando password...")
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        print(f"   Hash: {hashed.decode('utf-8')[:50]}...")

        # Create admin user
        print("\n📝 Creando usuario admin...")
        admin_user = {
            "user_id": f"user_{uuid.uuid4().hex[:12]}",
            "email": "admin@vcsa.com",
            "password_hash": hashed.decode('utf-8'),
            "name": "Admin User",
            "picture": None,
            "role": "admin",
            "membership": "vip",
            "level": 10,
            "points": 9999,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True,
            "email_verified": True
        }

        result = await db.users.insert_one(admin_user)
        print(f"✅ Usuario admin creado!")
        print(f"   User ID: {result.inserted_id}")

        # Verify admin was created
        print("\n🔍 Verificando usuario...")
        admin_check = await db.users.find_one({"email": "admin@vcsa.com"})

        if admin_check:
            print("✅ Usuario verificado en base de datos:")
            print(f"   Email: {admin_check['email']}")
            print(f"   Name: {admin_check.get('name')}")
            print(f"   Role: {admin_check.get('role')}")
            print(f"   Level: {admin_check.get('level')}")
            print(f"   Points: {admin_check.get('points')}")

            # Test password verification
            print("\n🔐 Verificando password...")
            password_field = admin_check.get('password_hash', admin_check.get('password', ''))
            if bcrypt.checkpw(password.encode('utf-8'), password_field.encode('utf-8')):
                print("✅ Password verificado correctamente!")
            else:
                print("❌ Error en verificación de password")

        client.close()

        print("\n" + "="*60)
        print("🎯 CREDENCIALES DE ADMIN:")
        print("="*60)
        print("📧 Email:       admin@vcsa.com")
        print("🔑 Password:    admin123")
        print("🌐 Frontend:    http://localhost")
        print("⚡ Admin Panel: http://localhost/admin")
        print("="*60)
        print("\n✅ Listo! Ya puedes hacer login con estas credenciales\n")

        return True

    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🚀 Creando usuario admin...\n")
    result = asyncio.run(create_admin_user())

    if result:
        sys.exit(0)
    else:
        sys.exit(1)
