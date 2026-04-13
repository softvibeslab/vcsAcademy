"""
Agregar Información Demo y Nuevo Usuario Demo

Este script agrega:
1. Nuevo usuario demo con datos actualizados
2. Progreso demo en cursos
3. Actividad demo reciente
4. Estadísticas demo realistas
"""

import asyncio
import json
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt

# Configuration
MONGO_URL = "mongodb://admin:vcsa_local_dev_2024@mongodb:27017"
DB_NAME = "vcsa"

async def hash_password(password: str) -> str:
    """Hash password with bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def create_demo_user(db: AsyncIOMotorClient):
    """Crear nuevo usuario demo actualizado"""
    print("👤 Creando nuevo usuario demo...")

    # Check if user exists
    existing_user = await db.users.find_one({"email": "nuevo@vcsa.com"})

    if existing_user:
        print("   ℹ️  Usuario 'nuevo@vcsa.com' ya existe")
        return existing_user["user_id"]

    # Create new demo user
    user_id = f"user_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    hashed_password = await hash_password("demo123")

    user_data = {
        "user_id": user_id,
        "email": "nuevo@vcsa.com",
        "password": hashed_password,
        "first_name": "Nuevo",
        "last_name": "Usuario",
        "role": "member",
        "membership": "free",
        "department": "sales",
        "location": "miami",
        "avatar_url": None,
        "phone": "+1-305-555-0123",
        "bio": "Nuevo representante de ventas aprendiendo el sistema",
        "goals": {
            "monthly_sales": 50000,
            "weekly_tours": 20,
            "conversion_rate": 25
        },
        "stats": {
            "total_sales": 0,
            "total_tours": 0,
            "conversion_rate": 0,
            "rank": "New Rep"
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
    print(f"   ✅ Usuario demo creado: nuevo@vcsa.com / demo123")
    return user_id

async def add_demo_progress(db: AsyncIOMotorClient, user_id: str):
    """Agregar progreso demo para el usuario"""
    print("\n📊 Agregando progreso demo...")

    # Get Skool course lessons
    lessons = await db.lessons.find({"course_id": "skool_free_resources"}).to_list(20)

    if not lessons:
        print("   ⚠️  No se encontraron lecciones para crear progreso")
        return

    # Create progress for first 3 lessons (50% completion)
    completed_lessons = lessons[:3]

    for lesson in completed_lessons:
        # Check if progress already exists
        existing = await db.user_progress.find_one({
            "user_id": user_id,
            "content_id": lesson["lesson_id"]
        })

        if not existing:
            progress_data = {
                "progress_id": f"prog_{user_id}_{lesson['lesson_id']}",
                "user_id": user_id,
                "content_id": lesson["lesson_id"],
                "content_type": "lesson",
                "completed": True,
                "completed_at": datetime.now() - timedelta(hours=len(completed_lessons) * 2),
                "points_earned": 10,
                "time_spent_minutes": 15,
                "created_at": datetime.now() - timedelta(days=1)
            }
            await db.user_progress.insert_one(progress_data)
            print(f"   ✅ Progreso agregado: {lesson['title']}")

    # Update user stats
    await db.users.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "stats.total_points": len(completed_lessons) * 10,
                "stats.completed_lessons": len(completed_lessons),
                "stats.last_activity": datetime.now()
            }
        }
    )

    print(f"   ✅ Estadísticas actualizadas: {len(completed_lessons)} lecciones completadas")

async def add_demo_activity(db: AsyncIOMotorClient, user_id: str):
    """Agregar actividad demo reciente"""
    print("\n📝 Agregando actividad demo...")

    activities = [
        {
            "activity_id": f"act_{user_id}_1",
            "user_id": user_id,
            "activity_type": "lesson_completed",
            "description": "Completó lección: Breaking The Pact",
            "points_earned": 10,
            "metadata": {"lesson_title": "Breaking The Pact", "course": "Skool RoadMAP 2026"},
            "created_at": datetime.now() - timedelta(hours=6)
        },
        {
            "activity_id": f"act_{user_id}_2",
            "user_id": user_id,
            "activity_type": "lesson_completed",
            "description": "Completó lección: First Visit Incentives",
            "points_earned": 10,
            "metadata": {"lesson_title": "First Visit Incentives", "course": "Skool RoadMAP 2026"},
            "created_at": datetime.now() - timedelta(hours=4)
        },
        {
            "activity_id": f"act_{user_id}_3",
            "user_id": user_id,
            "activity_type": "lesson_completed",
            "description": "Completó lección: The Residence Story",
            "points_earned": 10,
            "metadata": {"lesson_title": "The Residence Story", "course": "Skool RoadMAP 2026"},
            "created_at": datetime.now() - timedelta(hours=2)
        },
        {
            "activity_id": f"act_{user_id}_4",
            "user_id": user_id,
            "activity_type": "course_started",
            "description": "Inició curso: Free Resources - The RoadMAP 2026",
            "points_earned": 0,
            "metadata": {"course_title": "Free Resources - The RoadMAP 2026"},
            "created_at": datetime.now() - timedelta(days=1)
        },
        {
            "activity_id": f"act_{user_id}_5",
            "user_id": user_id,
            "activity_type": "login",
            "description": "Inicio de sesión",
            "points_earned": 0,
            "metadata": {"ip": "192.168.1.100"},
            "created_at": datetime.now() - timedelta(minutes=30)
        }
    ]

    for activity in activities:
        existing = await db.user_activity.find_one({"activity_id": activity["activity_id"]})
        if not existing:
            await db.user_activity.insert_one(activity)

    print(f"   ✅ {len(activities)} actividades demo agregadas")

async def add_demo_bookmarks(db: AsyncIOMotorClient, user_id: str):
    """Agregar bookmarks demo"""
    print("\n🔖 Agregando bookmarks demo...")

    bookmarks = [
        {
            "bookmark_id": f"bm_{user_id}_1",
            "user_id": user_id,
            "content_id": "lesson_65c4ae24eb26",  # Breaking The Pact
            "content_type": "lesson",
            "title": "Breaking The Pact - Revisar antes de presentación",
            "tags": ["before_tour", "mindset", "importante"],
            "notes": "Repasar patrones mentales antes de cada presentación",
            "created_at": datetime.now() - timedelta(days=2)
        },
        {
            "bookmark_id": f"bm_{user_id}_2",
            "user_id": user_id,
            "content_id": "lesson_1e4c467f20e1",  # First Visit Incentives
            "content_type": "lesson",
            "title": "First Visit Incentives - Técnicas de urgencia",
            "tags": ["closing_help", "incentives", "técnicas"],
            "notes": "Usar incentivos específicos para crear urgencia",
            "created_at": datetime.now() - timedelta(days=1)
        }
    ]

    for bookmark in bookmarks:
        existing = await db.bookmarks.find_one({"bookmark_id": bookmark["bookmark_id"]})
        if not existing:
            await db.bookmarks.insert_one(bookmark)

    print(f"   ✅ {len(bookmarks)} bookmarks demo agregados")

async def update_existing_demo_user(db: AsyncIOMotorClient):
    """Actualizar el usuario demo existente"""
    print("\n🔄 Actualizando usuario demo existente...")

    # Update demo@vcsa.com
    result = await db.users.update_one(
        {"email": "demo@vcsa.com"},
        {
            "$set": {
                "last_login": datetime.now(),
                "is_active": True,
                "stats.last_activity": datetime.now(),
                "stats.total_points": 60,
                "stats.completed_lessons": 6,
                "membership": "vip"
            }
        }
    )

    if result.modified_count > 0:
        print("   ✅ Usuario demo@vcsa.com actualizado")

async def main():
    """Función principal"""
    print("🌱 AGREGANDO INFORMACIÓN DEMO Y NUEVO USUARIO")
    print("=" * 60)

    # Conectar a MongoDB
    try:
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]

        print("✅ Conectado a MongoDB")

        # Crear nuevo usuario demo
        user_id = await create_demo_user(db)

        # Agregar progreso demo
        await add_demo_progress(db, user_id)

        # Agregar actividad demo
        await add_demo_activity(db, user_id)

        # Agregar bookmarks demo
        await add_demo_bookmarks(db, user_id)

        # Actualizar usuario demo existente
        await update_existing_demo_user(db)

        print("\n" + "=" * 60)
        print("✅ INFORMACIÓN DEMO AGREGADA EXITOSAMENTE")
        print("=" * 60)

        print("\n👥 USUARIOS DEMO DISPONIBLES:")
        print("   1. nuevo@vcsa.com / demo123 (Nuevo usuario con progreso)")
        print("   2. demo@vcsa.com / demo123 (Usuario existente actualizado)")
        print("   3. admin@vcsa.com / admin123 (Administrador)")

        print("\n📊 DATOS DEMO AGREGADOS:")
        print(f"   • Nuevo usuario: nuevo@vcsa.com")
        print(f"   • Progreso: 3/6 lecciones completadas (50%)")
        print(f"   • Puntos ganados: 30 puntos")
        print(f"   • Actividades recientes: 5 registros")
        print(f"   • Bookmarks: 2 guardados")

        print("\n🎯 ACCESO:")
        print("   • http://localhost (landing page)")
        print("   • http://localhost/courses (biblioteca de cursos)")
        print("   • http://localhost/training-library (nueva biblioteca)")
        print("   • http://localhost/dashboard (dashboard principal)")

        print("\n✨ Todo listo para probar con el nuevo usuario demo!")

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    asyncio.run(main())