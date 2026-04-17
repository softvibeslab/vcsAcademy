"""
Seed Script for Skool Courses from CSV

Populates the database with courses from the Skool CSV file
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import uuid
import csv

# Configuration
MONGO_URL = "mongodb://admin:vcsa_local_dev_2024@mongodb:27017"
DB_NAME = "vcsa"

# Courses from CSV
SKOOL_COURSES = [
    {
        "modulo": "FREE RESOURCES (The RoadMAP 2026)",
        "titulo": "Breaking The Pact",
        "copy": "",
        "link": "https://youtu.be/yN3lahhU-4c"
    },
    {
        "modulo": "FREE RESOURCES (The RoadMAP 2026)",
        "titulo": "First Visit Incentives",
        "copy": "",
        "link": "https://www.youtube.com/watch?v=IZFrfqD6aBY"
    },
    {
        "modulo": "FREE RESOURCES (The RoadMAP 2026)",
        "titulo": "The Residence Story",
        "copy": "",
        "link": "https://www.youtube.com/watch?v=74LcxFvsMHI"
    },
    {
        "modulo": "FREE RESOURCES (The RoadMAP 2026)",
        "titulo": "The Concept Pitch",
        "copy": "",
        "link": "https://www.youtube.com/watch?v=zkOG6Eyi9Cc&t=2s"
    },
    {
        "modulo": "FREE RESOURCES (The RoadMAP 2026)",
        "titulo": "No Comes at a Price",
        "copy": "",
        "link": "https://www.youtube.com/watch?v=oOrz6H7XSvU"
    },
    {
        "modulo": "PART 1 of The FRONT TO BACK CHALLENGE",
        "titulo": "FRONT TO BACK CHALLENGE",
        "copy": "",
        "link": "https://www.youtube.com/watch?v=HmZPlXY6Dqk&t=2s"
    }
]

async def seed_courses(db: AsyncIOMotorClient):
    """Seed courses from Skool CSV"""
    print("📚 Seeding Skool Courses...")

    # Create main course
    course = {
        "course_id": "skool_free_resources",
        "title": "Free Resources - The RoadMAP 2026",
        "description": "Recursos gratuitos para dominar las ventas de Vacation Club",
        "category": "Training",
        "level": "beginner",
        "duration": "6 videos",
        "thumbnail": "https://img.youtube.com/vi/yN3lahhU-4c/maxresdefault.jpg",
        "instructor": "VCSA Team",
        "price": 0,
        "is_public": True,
        "tags": ["free", "training", "sales", "roadmap"],
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

    # Check if course exists
    existing_course = await db.courses.find_one({"course_id": course["course_id"]})

    if existing_course:
        print(f"ℹ️  Course '{course['title']}' already exists")
        course_id = existing_course["course_id"]
    else:
        await db.courses.insert_one(course)
        print(f"✅ Course '{course['title']}' created")
        course_id = course["course_id"]

    # Create lessons from CSV data
    lesson_order = 1
    for course_data in SKOOL_COURSES:
        # Extract YouTube video ID
        video_url = course_data["link"]
        video_id = None

        if "youtu.be/" in video_url:
            video_id = video_url.split("youtu.be/")[1].split("?")[0]
        elif "youtube.com/watch" in video_url:
            video_id = video_url.split("v=")[1].split("&")[0]

        # Create lesson
        lesson = {
            "lesson_id": f"lesson_{uuid.uuid4().hex[:12]}",
            "course_id": course_id,
            "title": course_data["titulo"],
            "description": f"Part of {course_data['modulo']}",
            "content": course_data.get("copy", ""),
            "video_url": video_url,
            "video_id": video_id,
            "duration": "10:00",  # Default duration
            "order": lesson_order,
            "is_public": True,
            "resources": [],
            "quiz": [],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        # Check if lesson exists
        existing_lesson = await db.lessons.find_one({"lesson_id": lesson["lesson_id"]})

        if not existing_lesson:
            await db.lessons.insert_one(lesson)
            print(f"  ✅ Lesson '{lesson['title']}' added")
        else:
            print(f"  ℹ️  Lesson '{lesson['title']}' already exists")

        lesson_order += 1

    print("\n📊 Summary:")
    print(f"  - Course: {course['title']}")
    print(f"  - Total lessons: {len(SKOOL_COURSES)}")
    print(f"  - All lessons are PUBLIC (no authentication required)")

async def seed_coaching_page_courses(db: AsyncIOMotorClient):
    """Add courses to the coaching page"""
    print("\n📖 Adding courses to Coaching Page...")

    # Create coaching course category
    coaching_course = {
        "course_id": "coaching_roadmap",
        "title": "The RoadMAP 2026 - Complete Training",
        "description": "Domina las ventas de Vacation Club con nuestro entrenamiento completo",
        "category": "Coaching",
        "level": "all",
        "duration": "6 modules",
        "thumbnail": "https://img.youtube.com/vi/yN3lahhU-4c/maxresdefault.jpg",
        "instructor": "VCSA Team",
        "is_public": True,
        "tags": ["roadmap", "training", "free"],
        "created_at": datetime.now()
    }

    existing = await db.courses.find_one({"course_id": coaching_course["course_id"]})
    if not existing:
        await db.courses.insert_one(coaching_course)
        print("✅ Coaching course created")
    else:
        print("ℹ️  Coaching course already exists")

async def main():
    """Main seeding function"""
    print("🌱 Starting Skool Courses Seed...\n")

    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    try:
        # Seed courses
        await seed_courses(db)

        # Seed coaching page
        await seed_coaching_page_courses(db)

        print("\n✨ Skool courses seeded successfully!")
        print("\n📝 Note: These courses are PUBLIC and accessible without authentication")
        print("🎯 Users can now see them in the Courses and Coaching pages\n")

    except Exception as e:
        print(f"❌ Error seeding courses: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())
