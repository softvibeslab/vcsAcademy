"""
Ensure Admin User Exists
Script para garantizar que el usuario admin exista en la base de datos
"""

import asyncio
import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt

async def ensure_admin_exists():
    """Crear usuario admin si no existe"""

    # MongoDB connection
    MONGO_URL = os.getenv("MONGO_URL", "mongodb://admin:changeme@localhost:27019")
    DB_NAME = os.getenv("DB_NAME", "vcsa")

    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]

        print("🔗 Conectado a MongoDB")

        # Check if admin exists
        existing_admin = await db.users.find_one({"email": "admin@vcsa.com"})

        if existing_admin:
            print("✅ Usuario admin ya existe:")
            print(f"   Email: {existing_admin['email']}")
            print(f"   Role: {existing_admin.get('role', 'admin')}")
            print(f"   Name: {existing_admin.get('name', 'Admin')}")
        else:
            print("📝 Creando usuario admin...")

            # Hash password
            password = "admin123"
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            # Create admin user
            admin_user = {
                "email": "admin@vcsa.com",
                "password": hashed.decode('utf-8'),
                "name": "Admin User",
                "role": "admin",
                "membership": "premium",
                "level": 10,
                "points": 9999,
                "created_at": datetime.now(),
                "is_active": True,
                "email_verified": True
            }

            result = await db.users.insert_one(admin_user)

            print("✅ Usuario admin creado exitosamente:")
            print(f"   Email: admin@vcsa.com")
            print(f"   Password: admin123")
            print(f"   Role: admin")
            print(f"   User ID: {result.inserted_id}")

        # Verify admin can login (check password)
        admin_check = await db.users.find_one({"email": "admin@vcsa.com"})

        if admin_check:
            # Test password verification
            if bcrypt.checkpw("admin123".encode('utf-8'), admin_check['password'].encode('utf-8')):
                print("✅ Verificación de password exitosa")
            else:
                print("❌ Error en verificación de password")

        client.close()

        print("\n" + "="*50)
        print("🎯 CREDENCIALES DE ADMIN:")
        print("="*50)
        print("📧 Email:    admin@vcsa.com")
        print("🔑 Password: admin123")
        print("🌐 URL:      http://localhost")
        print("⚡ Admin Panel: http://localhost/admin/enhanced")
        print("="*50)

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

    return True

if __name__ == "__main__":
    print("🚀 Asegurando que el usuario admin existe...\n")
    result = asyncio.run(ensure_admin_exists())

    if result:
        print("\n✅ Listo! Ya puedes entrar como admin")
        sys.exit(0)
    else:
        print("\n❌ Hubo un error")
        sys.exit(1)
