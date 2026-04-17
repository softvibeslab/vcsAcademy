#!/usr/bin/env python3
"""
Seed script for coaching sessions data
Run with: python backend/seed_coaching.py
"""

import sys
import os
from pathlib import Path
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient
from uuid import uuid4

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

# Load env variables
from dotenv import load_dotenv
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'vcsa')

def seed_coaching_sessions():
    """Seed coaching sessions collection with sample data"""

    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]

    # Clear existing coaching sessions
    db.coaching_sessions.delete_many({})
    print("✓ Cleared existing coaching sessions")

    # Sample coaching sessions
    now = datetime.now(timezone.utc)
    sessions = [
        {
            "session_id": f"coaching_{uuid4().hex[:12]}",
            "title": "Weekly Group Coaching: Advanced Objection Handling",
            "description": "Live role-play and feedback on handling tough objections like price, timing, and 'need to think about it'. Learn the psychological triggers that cause objections and how to reframe them.",
            "session_type": "group",
            "scheduled_date": (now + timedelta(days=2)).isoformat(),
            "duration_minutes": 60,
            "host": {
                "name": "Sarah Mitchell",
                "bio": "15 years vacation club sales, $50M+ career sales",
                "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
            },
            "meeting_link": "https://zoom.us/j/123456789",
            "meeting_password": "vcsa2024",
            "max_attendees": 50,
            "attendees": [],
            "recording_url": None,
            "slides_url": None,
            "topics": ["objections", "closing", "roleplay"],
            "status": "scheduled",
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        },
        {
            "session_id": f"coaching_{uuid4().hex[:12]}",
            "title": "Q&A Friday: Your Questions, Real Answers",
            "description": "Open floor for any sales questions from the week. Bring your toughest scenarios, challenging prospects, and deals that got away. We'll analyze real situations and provide actionable strategies.",
            "session_type": "q&a",
            "scheduled_date": (now + timedelta(days=4)).isoformat(),
            "duration_minutes": 45,
            "host": {
                "name": "Marcus Chen",
                "bio": "Sales Coach, VCSA Founder, 20 years industry experience",
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
            },
            "meeting_link": "https://zoom.us/j/987654321",
            "meeting_password": None,
            "max_attendees": None,
            "attendees": [],
            "recording_url": None,
            "slides_url": None,
            "topics": ["general", "strategy"],
            "status": "scheduled",
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        },
        {
            "session_id": f"coaching_{uuid4().hex[:12]}",
            "title": "Strategy Review: Discovery That Sells",
            "description": "Deep dive into the discovery phase. Learn how top producers uncover needs, build value, and set up the close before the presentation even starts. We'll analyze real discovery calls from successful reps.",
            "session_type": "strategy_review",
            "scheduled_date": (now + timedelta(days=7)).isoformat(),
            "duration_minutes": 90,
            "host": {
                "name": "James Rodriguez",
                "bio": "VP of Sales, Premier Resorts International",
                "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
            },
            "meeting_link": "https://zoom.us/j/coaching-discovery",
            "meeting_password": None,
            "max_attendees": 25,
            "attendees": [],
            "recording_url": None,
            "slides_url": "https://docs.google.com/presentation/abc123",
            "topics": ["discovery", "strategy", "presentation"],
            "status": "scheduled",
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        },
        {
            "session_id": f"coaching_{uuid4().hex[:12]}",
            "title": "Group Coaching: Post-Tour Integrity",
            "description": "How to maintain relationships after the sale and build referral engines. Learn from reps who consistently generate 50%+ of their business from referrals and repeat clients.",
            "session_type": "group",
            "scheduled_date": (now + timedelta(days=10)).isoformat(),
            "duration_minutes": 60,
            "host": {
                "name": "Sarah Mitchell",
                "bio": "15 years vacation club sales, $50M+ career sales",
                "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
            },
            "meeting_link": "https://zoom.us/j/post-tour-integrity",
            "meeting_password": None,
            "max_attendees": 50,
            "attendees": [],
            "recording_url": None,
            "slides_url": None,
            "topics": ["integrity", "referrals", "relationships"],
            "status": "scheduled",
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        },
        {
            "session_id": f"coaching_{uuid4().hex[:12]}",
            "title": "Strategy Review: Analyzing Lost Deals",
            "description": "Deep dive into common reasons deals are lost and how to prevent them. We'll analyze real lost deals from the community and identify the pivot points where things went wrong.",
            "session_type": "strategy_review",
            "scheduled_date": (now - timedelta(days=7)).isoformat(),
            "duration_minutes": 60,
            "host": {
                "name": "Marcus Chen",
                "bio": "Sales Coach, VCSA Founder",
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
            },
            "meeting_link": "https://zoom.us/j/lost-deals-review",
            "meeting_password": None,
            "max_attendees": 30,
            "attendees": [],
            "recording_url": "https://vimeo.com/123456789",
            "slides_url": "https://docs.google.com/presentation/lost-deals",
            "topics": ["strategy", "closing", "analysis"],
            "status": "completed",
            "created_at": (now - timedelta(days=14)).isoformat(),
            "updated_at": (now - timedelta(days=7)).isoformat()
        },
        {
            "session_id": f"coaching_{uuid4().hex[:12]}",
            "title": "Q&A: Handling Price Objections",
            "description": "Everything you ever wanted to know about handling price objections. We covered 15+ proven responses and when to use each one.",
            "session_type": "q&a",
            "scheduled_date": (now - timedelta(days=14)).isoformat(),
            "duration_minutes": 45,
            "host": {
                "name": "James Rodriguez",
                "bio": "VP of Sales, Premier Resorts International",
                "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
            },
            "meeting_link": "https://zoom.us/j/price-objections",
            "meeting_password": None,
            "max_attendees": None,
            "attendees": [],
            "recording_url": "https://vimeo.com/987654321",
            "slides_url": None,
            "topics": ["objections", "price", "closing"],
            "status": "completed",
            "created_at": (now - timedelta(days=21)).isoformat(),
            "updated_at": (now - timedelta(days=14)).isoformat()
        }
    ]

    # Insert sessions
    result = db.coaching_sessions.insert_many(sessions)
    print(f"✓ Inserted {len(result.inserted_ids)} coaching sessions")

    # Create indexes
    db.coaching_sessions.create_index([("scheduled_date", 1), ("status", 1)])
    db.coaching_sessions.create_index([("session_type", 1)])
    db.coaching_sessions.create_index([("attendees", 1)])
    print("✓ Created indexes")

    print("\n🎉 Coaching sessions seeded successfully!")
    print(f"   - {len(sessions)} sessions created")
    print(f"   - {sum(1 for s in sessions if s['status'] == 'scheduled')} upcoming")
    print(f"   - {sum(1 for s in sessions if s['status'] == 'completed')} past")

    client.close()

if __name__ == "__main__":
    seed_coaching_sessions()
