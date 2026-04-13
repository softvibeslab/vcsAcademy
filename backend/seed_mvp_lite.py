"""
MVP Lite Database Seeder
Populates MongoDB with realistic demo data for testing
"""
import asyncio
import os
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import random

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'vcsa')

# Sample data
TRAINING_SESSIONS = [
    {
        "session_id": "session-1",
        "title": "Session 1: Foundation of Sales Excellence",
        "category": "Mindset",
        "duration": "45 min",
        "difficulty": "beginner",
        "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "key_takeaway": "Adopt the champion mindset before every tour - visualize success",
        "description": "Learn the foundational principles that separate top producers from average sales representatives.",
        "instructor": "Maria Garcia",
        "points": 10,
        "modules_count": 6,
        "completed_modules": 0,
        "related_sessions": [
            {"id": "session-2", "title": "Session 2: Discovery & Control", "category": "Discovery"},
            {"id": "session-3", "title": "Session 3: Value Architecture", "category": "Value"}
        ],
        "resources": [
            {"id": 1, "title": "Session Workbook", "type": "pdf", "file_size": 2500000, "page_count": 15},
            {"id": 2, "title": "Goal Setting Template", "type": "template", "file_size": 500000}
        ],
        "created_at": datetime.now(timezone.utc)
    },
    {
        "session_id": "session-2",
        "title": "Session 2: Discovery & Control",
        "category": "Discovery",
        "duration": "50 min",
        "difficulty": "beginner",
        "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "key_takeaway": "Ask powerful questions that uncover the customer's true desires",
        "description": "Master the art of discovery and control the sales conversation from start to finish.",
        "instructor": "John Smith",
        "points": 10,
        "modules_count": 6,
        "completed_modules": 0,
        "related_sessions": [
            {"id": "session-3", "title": "Session 3: Value Architecture", "category": "Value"}
        ],
        "resources": [
            {"id": 1, "title": "Discovery Questions Guide", "type": "pdf", "file_size": 1800000, "page_count": 12}
        ],
        "created_at": datetime.now(timezone.utc)
    },
    {
        "session_id": "session-3",
        "title": "Session 3: Value Architecture",
        "category": "Value",
        "duration": "55 min",
        "difficulty": "intermediate",
        "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "key_takeaway": "Build irresistible value propositions that make price irrelevant",
        "description": "Learn how to architect value throughout your presentation and handle price objections with ease.",
        "instructor": "Sarah Johnson",
        "points": 10,
        "modules_count": 6,
        "completed_modules": 0,
        "related_sessions": [
            {"id": "session-4", "title": "Session 4: Decision Management", "category": "Closing"}
        ],
        "resources": [
            {"id": 1, "title": "Value Building Framework", "type": "pdf", "file_size": 3200000, "page_count": 20},
            {"id": 2, "title": "Objection Handling Script", "type": "template", "file_size": 750000}
        ],
        "created_at": datetime.now(timezone.utc)
    }
]

COACHING_EVENTS = [
    {
        "id": 1,
        "title": "Advanced Closing Techniques Masterclass",
        "description": "Learn advanced closing techniques used by top producers in the industry",
        "instructor": "Maria Garcia",
        "date": (datetime.now(timezone.utc) + timedelta(days=3)).strftime("%Y-%m-%d"),
        "time": "2:00 PM EST",
        "duration": "90 min",
        "location": "Zoom",
        "type": "group-coaching",
        "registered": False,
        "attendees": 45,
        "max_attendees": 100,
        "recording_available": False,
        "topics": ["Handling objections", "Closing techniques", "Follow-up strategies"],
        "rating": 4.9,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": 2,
        "title": "Role Play: Handling Price Objections",
        "scenario": "Practice responding to \"it's too expensive\" objections using value-building techniques",
        "instructor": "John Smith",
        "date": (datetime.now(timezone.utc) + timedelta(days=5)).strftime("%Y-%m-%d"),
        "time": "3:00 PM EST",
        "duration": "60 min",
        "location": "Zoom",
        "type": "roleplay",
        "registered": False,
        "attendees": 20,
        "max_attendees": 30,
        "recording_available": False,
        "skill_focus": ["Objection handling", "Value building", "Confidence"],
        "format": "Small group practice",
        "level": "intermediate",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": 3,
        "title": "Q&A Session: Overcoming Sales Slumps",
        "description": "Get your questions answered about overcoming sales slumps and getting back on track",
        "instructor": "Sarah Johnson",
        "date": (datetime.now(timezone.utc) - timedelta(days=2)).strftime("%Y-%m-%d"),
        "time": "4:00 PM EST",
        "duration": "45 min",
        "location": "Zoom",
        "type": "qa",
        "registered": False,
        "attendees": 60,
        "recording_available": True,
        "upcoming_questions": [
            "How to handle 'I need to think about it?'",
            "Best approach for follow-up calls?",
            "Dealing with competitive comparisons"
        ],
        "answered_count": 156,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": 4,
        "title": "Group Coaching: Value Architecture Deep Dive",
        "description": "Master the art of building irresistible value propositions",
        "instructor": "Maria Garcia",
        "date": (datetime.now(timezone.utc) + timedelta(days=7)).strftime("%Y-%m-%d"),
        "time": "3:00 PM EST",
        "duration": "60 min",
        "location": "Zoom",
        "type": "group-coaching",
        "registered": False,
        "attendees": 28,
        "max_attendees": 50,
        "recording_available": False,
        "topics": ["Value presentation", "Benefit stacking", "Price anchoring"],
        "rating": 4.8,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": 5,
        "title": "Role Play: The Close",
        "scenario": "Master closing techniques through repeated practice scenarios",
        "instructor": "John Smith",
        "date": (datetime.now(timezone.utc) + timedelta(days=10)).strftime("%Y-%m-%d"),
        "time": "2:00 PM EST",
        "duration": "90 min",
        "location": "Zoom",
        "type": "roleplay",
        "registered": False,
        "attendees": 8,
        "max_attendees": 15,
        "recording_available": False,
        "skill_focus": ["Closing techniques", "Timing", "Reading the room"],
        "format": "1-on-1 coaching",
        "level": "advanced",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": 6,
        "title": "Q&A: New Rep Essentials",
        "description": "Common questions and answers for new sales representatives",
        "instructor": "Sarah Johnson",
        "date": (datetime.now(timezone.utc) - timedelta(days=7)).strftime("%Y-%m-%d"),
        "time": "3:00 PM EST",
        "duration": "45 min",
        "location": "Zoom",
        "type": "qa",
        "registered": False,
        "attendees": 45,
        "recording_available": True,
        "upcoming_questions": [],
        "answered_count": 67,
        "created_at": datetime.now(timezone.utc)
    }
]

RESOURCES = [
    {
        "resource_id": "res-1",
        "title": "Complete Sales Script Library",
        "description": "Collection of proven sales scripts for every stage of the sales process",
        "resource_type": "script",
        "category": "closing",
        "content": None,
        "file_url": "https://example.com/sales-scripts.pdf",
        "file_type": "pdf",
        "tags": ["scripts", "closing", "templates"],
        "related_content": ["session-3", "session-4"],
        "difficulty": "beginner",
        "usage_count": 234,
        "created_by": "admin",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "resource_id": "res-2",
        "title": "Objection Handling Framework",
        "description": "Step-by-step framework for handling any objection with confidence",
        "resource_type": "framework",
        "category": "objections",
        "content": None,
        "file_url": "https://example.com/objection-framework.pdf",
        "file_type": "pdf",
        "tags": ["framework", "objections", "technique"],
        "related_content": ["session-4"],
        "difficulty": "intermediate",
        "usage_count": 189,
        "created_by": "admin",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "resource_id": "res-3",
        "title": "Goal Setting Template",
        "description": "Monthly and weekly goal setting template for sales representatives",
        "resource_type": "template",
        "category": "performance",
        "content": None,
        "file_url": "https://example.com/goal-template.xlsx",
        "file_type": "xlsx",
        "tags": ["template", "goals", "planning"],
        "related_content": ["session-1"],
        "difficulty": "beginner",
        "usage_count": 456,
        "created_by": "admin",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "resource_id": "res-4",
        "title": "Discovery Questions Checklist",
        "description": "Comprehensive checklist of powerful discovery questions",
        "resource_type": "checklist",
        "category": "discovery",
        "content": None,
        "file_url": "https://example.com/discovery-checklist.pdf",
        "file_type": "pdf",
        "tags": ["checklist", "discovery", "questions"],
        "related_content": ["session-2"],
        "difficulty": "beginner",
        "usage_count": 321,
        "created_by": "admin",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "resource_id": "res-5",
        "title": "Value Building Case Study",
        "description": "Real-world case study of effective value building techniques",
        "resource_type": "case_study",
        "category": "value",
        "content": None,
        "file_url": "https://example.com/value-case-study.pdf",
        "file_type": "pdf",
        "tags": ["case study", "value", "technique"],
        "related_content": ["session-3"],
        "difficulty": "intermediate",
        "usage_count": 156,
        "created_by": "admin",
        "created_at": datetime.now(timezone.utc)
    }
]

DEMO_USERS = [
    {
        "user_id": "demo-user-1",
        "email": "demo@vcsa.com",
        "name": "Demo User",
        "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYkW5tLtLJq",  # demo123
        "picture": None,
        "level": 1,
        "points": 0,
        "membership": "free",
        "role": "rep",
        "team_id": None,
        "manager_id": None,
        "created_at": datetime.now(timezone.utc)
    }
]

async def seed_database():
    """Seed MongoDB with demo data"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    print("🌱 Starting MVP Lite database seeding...")
    print(f"   MongoDB: {MONGO_URL}")
    print(f"   Database: {DB_NAME}")
    print()

    try:
        # Clear existing demo data
        print("🧹 Clearing existing demo data...")
        await db.training_sessions.delete_many({})
        await db.coaching_events.delete_many({})
        await db.resources.delete_many({})
        print("✓ Cleared existing data")

        # Insert training sessions
        print("📚 Inserting training sessions...")
        result = await db.training_sessions.insert_many(TRAINING_SESSIONS)
        print(f"✓ Inserted {len(result.inserted_ids)} training sessions")

        # Insert coaching events
        print("🎓 Inserting coaching events...")
        result = await db.coaching_events.insert_many(COACHING_EVENTS)
        print(f"✓ Inserted {len(result.inserted_ids)} coaching events")

        # Insert resources
        print("📥 Inserting resources...")
        result = await db.resources.insert_many(RESOURCES)
        print(f"✓ Inserted {len(result.inserted_ids)} resources")

        # Check if demo user exists
        demo_user = await db.users.find_one({"email": "demo@vcsa.com"})
        if not demo_user:
            print("👤 Creating demo user...")
            await db.users.insert_one(DEMO_USERS[0])
            print("✓ Demo user created (demo@vcsa.com / demo123)")
        else:
            print("✓ Demo user already exists")

        print()
        print("🎉 Database seeding completed successfully!")
        print()
        print("📊 Summary:")
        print(f"   - {len(TRAINING_SESSIONS)} training sessions")
        print(f"   - {len(COACHING_EVENTS)} coaching events")
        print(f"   - {len(RESOURCES)} resources")
        print(f"   - 1 demo user")
        print()
        print("🔐 Demo Credentials:")
        print("   Email: demo@vcsa.com")
        print("   Password: demo123")
        print()

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
