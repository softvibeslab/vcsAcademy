"""
Agregar Cursos de Skool al Sistema Phase 1 Development System

Este script agrega los cursos de Skool como tracks y módulos en el sistema
de desarrollo Top Producer.
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import uuid

# Configuration
MONGO_URL = "mongodb://admin:vcsa_local_dev_2024@mongodb:27017"
DB_NAME = "vcsa"

# Datos de los cursos de Skool
SKOOL_COURSES = [
    {
        "title": "Breaking The Pact",
        "description": "Learn how to break traditional sales patterns and mindset limitations that hold back sales success",
        "video_url": "https://youtu.be/yN3lahhU-4c",
        "video_id": "yN3lahhU-4c",
        "category": "mindset",
        "duration": 15,
        "difficulty": "beginner"
    },
    {
        "title": "First Visit Incentives",
        "description": "Master first visit incentive strategies to create urgency and close more deals on initial contact",
        "video_url": "https://www.youtube.com/watch?v=IZFrfqD6aBY",
        "video_id": "IZFrfqD6aBY",
        "category": "technique",
        "duration": 15,
        "difficulty": "beginner"
    },
    {
        "title": "The Residence Story",
        "description": "Learn to tell compelling residence stories that resonate with clients and create emotional connections",
        "video_url": "https://www.youtube.com/watch?v=74LcxFvsMHI",
        "video_id": "74LcxFvsMHI",
        "category": "technique",
        "duration": 15,
        "difficulty": "intermediate"
    },
    {
        "title": "The Concept Pitch",
        "description": "Perfect your concept presentation skills for maximum impact and understanding of vacation club benefits",
        "video_url": "https://www.youtube.com/watch?v=zkOG6Eyi9Cc&t=2s",
        "video_id": "zkOG6Eyi9Cc",
        "category": "presentation",
        "duration": 15,
        "difficulty": "intermediate"
    },
    {
        "title": "No Comes at a Price",
        "description": "Handle price objections effectively and maintain value perception throughout the sales conversation",
        "video_url": "https://www.youtube.com/watch?v=oOrz6H7XSvU",
        "video_id": "oOrz6H7XSvU",
        "category": "objections",
        "duration": 15,
        "difficulty": "advanced"
    },
    {
        "title": "FRONT TO BACK CHALLENGE",
        "description": "Complete sales process mastery - Learn to guide prospects from initial contact to final close with confidence",
        "video_url": "https://www.youtube.com/watch?v=HmZPlXY6Dqk&t=2s",
        "video_id": "HmZPlXY6Dqk",
        "category": "complete_process",
        "duration": 20,
        "difficulty": "advanced"
    }
]

async def create_skool_track(db: AsyncIOMotorClient):
    """Crear track de Skool en Phase 1"""
    print("📚 Creando Track de Skool...")

    track_id = "track_skool_roadmap"

    track = {
        "track_id": track_id,
        "track_number": 7,  # Track adicional
        "name": "Skool RoadMAP 2026",
        "purpose": "Dominar las técnicas fundamentales de ventas de Vacation Club con contenido práctico de YouTube",
        "outcome": "Completar todos los módulos del RoadMAP 2026 y dominar las técnicas esenciales de venta",
        "total_modules": 6,
        "total_duration": 95,  # minutos totales
        "created_at": datetime.now()
    }

    # Verificar si existe
    existing = await db.phase1_tracks.find_one({"track_id": track_id})

    if existing:
        print(f"   ℹ️  Track '{track['name']}' ya existe")
        return track_id
    else:
        await db.phase1_tracks.insert_one(track)
        print(f"   ✅ Track '{track['name']}' creado")
        return track_id

async def create_modules_for_track(db: AsyncIOMotorClient, track_id: str):
    """Crear módulos para el track de Skool"""
    print("\n📖 Creando módulos...")

    for index, course in enumerate(SKOOL_COURSES, 1):
        module_number = f"7.{index}"  # 7.1, 7.2, etc.

        content_id = f"skool_content_{index}"

        # Crear contenido
        content = {
            "content_id": content_id,
            "title": course["title"],
            "description": course["description"],
            "type": "video",
            "vertical": "vacation_club",
            "difficulty": course["difficulty"],
            "duration": course["duration"],
            "video_url": course["video_url"],
            "video_id": course["video_id"],
            "key_move": f"Aplicar {course['title'].lower()} en tus presentaciones diarias",
            "tags": ["skool", "roadmap", "youtube", course["category"]],
            "content_type": "module",
            "view_count": 0,
            "created_at": datetime.now()
        }

        # Verificar si existe
        existing_content = await db.phase1_content.find_one({"content_id": content_id})

        if not existing_content:
            await db.phase1_content.insert_one(content)
            print(f"   ✅ Módulo {module_number}: {course['title']}")

        # Crear enlace track-content
        track_content = {
            "track_id": track_id,
            "content_id": content_id,
            "order_index": index,
            "module_number": module_number,
            "created_at": datetime.now()
        }

        # Verificar si existe el enlace
        existing_link = await db.phase1_track_content.find_one({
            "track_id": track_id,
            "content_id": content_id
        })

        if not existing_link:
            await db.phase1_track_content.insert_one(track_content)
            print(f"      📎 Enlace {module_number} → {content_id} creado")

async def create_quick_wins_from_skool(db: AsyncIOMotorClient):
    """Crear Quick Wins basados en los cursos de Skool"""
    print("\n⚡ Creando Quick Wins...")

    quick_wins = [
        {
            "title": "Breaking The Pact - Rompe Patrones",
            "description": "Identifica y rompe 3 patrones mentales limitantes en tu primera venta de hoy",
            "category": "mindset",
            "action": "Antes de tu próxima presentación, escribe 3 creencias limitantes y cómo las vas a romper",
            "points": 5
        },
        {
            "title": "First Visit Incentive - Crea Urgencia",
            "description": "Prepara 3 incentivos para primera visita antes de tu próxima reunión",
            "category": "technique",
            "action": "Crea una lista de incentivos específicos para cada tipo de cliente",
            "points": 5
        },
        {
            "title": "Residence Story - Cuenta Historia",
            "description": "Practica contar una historia de residencia con emociones en tu próximo tour",
            "category": "storytelling",
            "action": "Usa la estructura: situación → emoción → beneficio → acción",
            "points": 5
        },
        {
            "title": "Concept Pitch - Mejora tu Pitch",
            "description": "Refina tu presentación de concepto usando técnicas visuales en tu próxima demo",
            "category": "presentation",
            "action": "Enfócate en beneficios emocionales sobre características técnicas",
            "points": 5
        },
        {
            "title": "Price Objection - Maneja Precio",
            "description": "Practica 3 respuestas a objeciones de precio antes de tu próxima presentación",
            "category": "objections",
            "action": "Usa: re-enmarcado → valor → flexibilidad creativa",
            "points": 5
        },
        {
            "title": "Front to Back - Proceso Completo",
            "description": "Aplica el proceso completo de venta en tu próximo tour (del inicio al cierre)",
            "category": "process",
            "action": "Sigue los 5 pasos: conexión → descubrimiento → presentación → manejo de objeciones → cierre",
            "points": 10
        }
    ]

    for qw in quick_wins:
        quick_win_id = f"qw_skool_{uuid.uuid4().hex[:8]}"

        quick_win = {
            "quick_win_id": quick_win_id,
            "title": qw["title"],
            "description": qw["description"],
            "category": qw["category"],
            "actionable_step": qw["action"],
            "points": qw["points"],
            "tags": ["skool", "roadmap", "practical"],
            "difficulty": "beginner",
            "created_at": datetime.now()
        }

        # Verificar si existe
        existing = await db.phase1_quick_wins.find_one({"title": qw["title"]})

        if not existing:
            await db.phase1_quick_wins.insert_one(quick_win)
            print(f"   ✅ Quick Win: {qw['title']} (+{qw['points']} pts)")

async def create_deal_breakdowns_from_skool(db: AsyncIOMotorClient):
    """Crear Deal Breakdowns basados en los cursos de Skool"""
    print("\n📊 Creando Deal Breakdowns...")

    breakdowns = [
        {
            "title": "Breaking Price Patterns",
            "scenario": "Clienteobjiona al precio diciendo 'es muy caro'",
            "mistake": "Defender el precio inmediatamente con justificaciones lógicas",
            "correction": "Re-enmarcar la conversación hacia valor y retorno de inversión emocional",
            "key_learning": "El precio es una objeción emocional, no lógica. Maneja con emociones, no con datos.",
            "outcome": "Mejor manejo de objeciones y mayor cierre"
        },
        {
            "title": "First Visit Urgency",
            "scenario": "Cliente quiere 'pensarlo' y volver luego",
            "mistake": "Permitir irse sin crear incentivos para acción inmediata",
            "correction": "Usar incentivos de primera visita y crear escasez legítima de oportunidades",
            "key_learning": "La urgencia genuina se crea con valor y oportunidad, no con presión.",
            "outcome": "Mayor conversión en primera visita"
        },
        {
            "title": "Emotional Story Connection",
            "scenario": "Cliente parece desconectado durante la presentación",
            "mistake": "Continuar presentando características sin verificar conexión emocional",
            "correction": "Pausar y contar una historia de residencia que cree empatía y visión",
            "key_learning": "Las personas compran emociones y justifican con lógica. Conecta emocionalmente primero.",
            "outcome": "Mayor engagement y retención de información"
        }
    ]

    for db_item in breakdowns:
        breakdown_id = f"db_skool_{uuid.uuid4().hex[:8]}"

        breakdown = {
            "breakdown_id": breakdown_id,
            "title": db_item["title"],
            "scenario": db_item["scenario"],
            "mistake": db_item["mistake"],
            "correction": db_item["correction"],
            "key_learning": db_item["key_learning"],
            "outcome": db_item["outcome"],
            "category": "real_scenario",
            "tags": ["skool", "roadmap", "objections", "technique"],
            "points": 5,
            "created_at": datetime.now()
        }

        # Verificar si existe
        existing = await db.phase1_deal_breakdowns.find_one({"title": db_item["title"]})

        if not existing:
            await db.phase1_deal_breakdowns.insert_one(breakdown)
            print(f"   ✅ Deal Breakdown: {db_item['title']} (+5 pts)")

async def main():
    """Función principal"""
    print("🌱 Agregando Cursos de Skool al Sistema Phase 1...")
    print("=" * 60)

    # Conectar a MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    try:
        # Crear track
        track_id = await create_skool_track(db)

        # Crear módulos
        await create_modules_for_track(db, track_id)

        # Crear Quick Wins
        await create_quick_wins_from_skool(db)

        # Crear Deal Breakdowns
        await create_deal_breakdowns_from_skool(db)

        print("\n" + "=" * 60)
        print("✅ CURSOS DE SKOOL AGREGADOS AL SISTEMA PHASE 1")
        print("=" * 60)
        print("\n📊 Resumen:")
        print(f"   • Track: Skool RoadMAP 2026")
        print(f"   • Módulos de video: {len(SKOOL_COURSES)}")
        print(f"   • Quick Wins creados: 6")
        print(f"   • Deal Breakdowns creados: 3")
        print(f"   • Total puntos disponibles: {6*5 + 6*5 + 3*5} = 75 pts")
        print("\n🎯 Acceso:")
        print("   • http://localhost/development (Phase 1 Development)")
        print("   • Track 7: Skool RoadMAP 2026")
        print("\n✨ Todo listo para que los usuarios ganen puntos practicando!")

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())
