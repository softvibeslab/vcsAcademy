"""
Crear/Recrear Usuarios Demo Completos

Este script crea los usuarios demo que faltan
"""

import asyncio
import bcrypt
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

# Configuration
MONGO_URL = "mongodb://admin:vcsa_local_dev_2024@mongodb:27017"
DB_NAME = "vcsa"

async def hash_password(password: str) -> str:
    """Hash password with bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def create_demo_user(db: AsyncIOMotorClient, email: str, password: str, first_name: str, role: str = "member"):
    """Create demo user"""
    print(f"👤 Creando usuario: {email}")

    # Check if user exists
    existing_user = await db.users.find_one({"email": email})

    if existing_user:
        print(f"   ℹ️  Usuario '{email}' ya existe, actualizando...")
        # Update password
        hashed_password = await hash_password(password)
        await db.users.update_one(
            {"email": email},
            {"$set": {"password": hashed_password, "is_active": True, "role": role}}
        )
        print(f"   ✅ Usuario actualizado: {email}")
        return existing_user["user_id"]

    # Create new user
    user_id = f"user_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
    hashed_password = await hash_password(password)

    user_data = {
        "user_id": user_id,
        "email": email,
        "password": hashed_password,
        "first_name": first_name,
        "last_name": "Usuario",
        "role": role,
        "membership": "free" if role == "member" else "vip",
        "department": "sales",
        "location": "miami",
        "avatar_url": None,
        "phone": "+1-305-555-0100",
        "bio": f"{first_name} - Usuario demo del sistema",
        "goals": {
            "monthly_sales": 50000,
            "weekly_tours": 20,
            "conversion_rate": 25
        },
        "stats": {
            "total_sales": 0,
            "total_tours": 0,
            "conversion_rate": 0,
            "rank": "New Rep",
            "total_points": 0,
            "completed_lessons": 0
        },
        "settings": {
            "notifications_enabled": True,
            "email_updates": True,
            "language": "es"
        },
        "onboarding_completed": False,
        "created_at": datetime.now(),
        "last_login": datetime.now(),
        "is_active": True
    }

    await db.users.insert_one(user_data)
    print(f"   ✅ Usuario creado: {email} / {password}")
    return user_id

async def main():
    """Función principal"""
    print("🔄 CREANDO/RECREANDO USUARIOS DEMO")
    print("=" * 60)

    # Conectar a MongoDB
    try:
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]

        print("✅ Conectado a MongoDB\n")

        # Create demo users
        await create_demo_user(db, "demo@vcsa.com", "demo123", "Demo", "member")
        await create_demo_user(db, "nuevo@vcsa.com", "demo123", "Nuevo", "member")

        print("\n" + "=" * 60)
        print("✅ USUARIOS DEMO CREADOS/ACTUALIZADOS")
        print("=" * 60)

        print("\n👥 USUARIOS DISPONIBLES:")
        print("   1. admin@vcsa.com / admin123 (Administrador)")
        print("   2. demo@vcsa.com / demo123 (Usuario demo)")
        print("   3. nuevo@vcsa.com / demo123 (Usuario nuevo)")

        print("\n🔑 TODOS usan la misma contraseña: demo123")
        print("   (excepto admin que usa admin123)")

        print("\n🌐 ACCESO WEB:")
        print("   • http://localhost/login")

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    asyncio.run(main())