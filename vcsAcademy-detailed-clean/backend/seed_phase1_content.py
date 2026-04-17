#!/usr/bin/env python3
"""
Seed Phase 1 Content for Top Producer Path
Run: docker-compose exec backend python seed_phase1_content.py
"""

import sys
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid

ROOT_DIR = Path(__file__).parent
sys.path.insert(0, str(ROOT_DIR))
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'vcsa_local')

PLACEHOLDER_VIDEO = "https://placehold.co/800x450/1E3A8A/D4AF37?text=Video+Coming+Soon"

async def seed_phase1():
    """Seed Phase 1 content"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    print(f"🔗 Conectado a MongoDB: {MONGO_URL}")
    print(f"📊 Base de datos: {DB_NAME}")

    # 1. Create Stages
    stages = [
        {
            "stage": 1,
            "stage_id": "stage_1",
            "name": "New Rep",
            "title": "Foundation Builder",
            "description": "Master the fundamentals and build your foundation",
            "points_required": 0,
            "estimated_weeks": "1-2",
            "color": "#D4AF37",
            "order": 1,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "stage": 2,
            "stage_id": "stage_2",
            "name": "Developing Rep",
            "title": "Rising Star",
            "description": "Execute with consistency and improve your skills",
            "points_required": 150,
            "estimated_weeks": "2-4",
            "color": "#1E3A8A",
            "order": 2,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "stage": 3,
            "stage_id": "stage_3",
            "name": "Performing Rep",
            "title": "Top Producer",
            "description": "Close consistently and achieve elite performance",
            "points_required": 450,
            "estimated_weeks": "4-8",
            "color": "#10B981",
            "order": 3,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "stage": 4,
            "stage_id": "stage_4",
            "name": "Consistent Top Producer",
            "title": "Legend",
            "description": "Industry leader and mentor to others",
            "points_required": 950,
            "estimated_weeks": "8-12",
            "color": "#EF4444",
            "order": 4,
            "created_at": datetime.now(timezone.utc)
        }
    ]

    for stage in stages:
        existing = await db.phase1_stages.find_one({"stage": stage["stage"]})
        if not existing:
            await db.phase1_stages.insert_one(stage)
            print(f"✅ Stage creado: {stage['title']}")
        else:
            print(f"⏭️  Stage ya existe: {stage['title']}")

    # 2. Create Tracks
    tracks = [
        {
            "track_id": "track_1_mindset",
            "title": "Pro Mindset",
            "description": "Build the mental framework of a top producer",
            "stage": 1,
            "order": 1,
            "modules_count": 6,
            "duration_minutes": 48,
            "difficulty": "beginner",
            "icon": "brain",
            "points": 60,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "track_id": "track_2_discovery",
            "title": "Discovery & Control",
            "description": "Master the art of uncovering needs and controlling the tour",
            "stage": 1,
            "order": 2,
            "modules_count": 6,
            "duration_minutes": 54,
            "difficulty": "beginner",
            "icon": "search",
            "points": 60,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "track_id": "track_3_value",
            "title": "Value Architecture",
            "description": "Present value that compels decision-making",
            "stage": 2,
            "order": 1,
            "modules_count": 6,
            "duration_minutes": 54,
            "difficulty": "intermediate",
            "icon": "gem",
            "points": 60,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "track_id": "track_4_decision",
            "title": "Decision Management",
            "description": "Guide prospects toward commitment",
            "stage": 2,
            "order": 2,
            "modules_count": 6,
            "duration_minutes": 60,
            "difficulty": "intermediate",
            "icon": "target",
            "points": 60,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "track_id": "track_5_objections",
            "title": "Objection Mastery",
            "description": "Convert resistance into momentum",
            "stage": 3,
            "order": 1,
            "modules_count": 6,
            "duration_minutes": 54,
            "difficulty": "advanced",
            "icon": "shield",
            "points": 60,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "track_id": "track_6_integrity",
            "title": "Post-Decision Integrity",
            "description": "Protect the sale and build referrals",
            "stage": 3,
            "order": 2,
            "modules_count": 6,
            "duration_minutes": 48,
            "difficulty": "advanced",
            "icon": "handshake",
            "points": 60,
            "created_at": datetime.now(timezone.utc)
        }
    ]

    for track in tracks:
        existing = await db.phase1_tracks.find_one({"track_id": track["track_id"]})
        if not existing:
            await db.phase1_tracks.insert_one(track)
            print(f"✅ Track creado: {track['title']}")
        else:
            print(f"⏭️  Track ya existe: {track['title']}")

    # 3. Create Badges
    badges = [
        {
            "badge_id": "first_win",
            "name": "First Win",
            "description": "Complete your first training module",
            "icon": "🏆",
            "category": "milestone",
            "requirement_type": "modules_completed",
            "requirement_count": 1,
            "points_reward": 10,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "badge_id": "mindset_master",
            "name": "Mindset Master",
            "description": "Complete all Pro Mindset modules",
            "icon": "🧠",
            "category": "track",
            "requirement_type": "track_completed",
            "track_id": "track_1_mindset",
            "points_reward": 50,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "badge_id": "discovery_master",
            "name": "Discovery Master",
            "description": "Complete all Discovery & Control modules",
            "icon": "🔍",
            "category": "track",
            "requirement_type": "track_completed",
            "track_id": "track_2_discovery",
            "points_reward": 50,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "badge_id": "streak_7",
            "name": "Week Warrior",
            "description": "7-day learning streak",
            "icon": "🔥",
            "category": "streak",
            "requirement_type": "streak_days",
            "requirement_count": 7,
            "points_reward": 30,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "badge_id": "streak_14",
            "name": "Two Week Titan",
            "description": "14-day learning streak",
            "icon": "⚡",
            "category": "streak",
            "requirement_type": "streak_days",
            "requirement_count": 14,
            "points_reward": 50,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "badge_id": "deal_analyst",
            "name": "Deal Analyst",
            "description": "Review 10 deal breakdowns",
            "icon": "📊",
            "category": "content",
            "requirement_type": "breakdowns_reviewed",
            "requirement_count": 10,
            "points_reward": 40,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "badge_id": "sales_tactician",
            "name": "Sales Tactician",
            "description": "Apply 15 quick wins",
            "icon": "⚡",
            "category": "content",
            "requirement_type": "quickwins_applied",
            "requirement_count": 15,
            "points_reward": 40,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "badge_id": "readiness_80",
            "name": "Top Producer Ready",
            "description": "Achieve 80% readiness score",
            "icon": "🎯",
            "category": "achievement",
            "requirement_type": "readiness_score",
            "requirement_count": 80,
            "points_reward": 100,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "badge_id": "stage_2_complete",
            "name": "Rising Star",
            "description": "Complete Stage 2: Developing Rep",
            "icon": "⭐",
            "category": "stage",
            "requirement_type": "stage_complete",
            "stage": 2,
            "points_reward": 75,
            "created_at": datetime.now(timezone.utc)
        }
    ]

    for badge in badges:
        existing = await db.phase1_badges.find_one({"badge_id": badge["badge_id"]})
        if not existing:
            await db.phase1_badges.insert_one(badge)
            print(f"✅ Badge creado: {badge['name']}")
        else:
            print(f"⏭️  Badge ya existe: {badge['name']}")

    # 4. Create Sample Content (Modules - First Track Only for Demo)
    modules = [
        {
            "content_id": "mod_1_1",
            "title": "The Top Producer Identity",
            "description": "Adopt the mindset and identity of elite sales performers",
            "type": "video",
            "track_id": "track_1_mindset",
            "stage": 1,
            "order": 1,
            "difficulty": "beginner",
            "duration": 8,
            "video_url": PLACEHOLDER_VIDEO,
            "key_move": "Before every tour, tell yourself: 'I am a professional sales consultant helping people make good decisions'",
            "tags": ["mindset", "foundation", "identity"],
            "transcript": "",
            "resources": [],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "content_id": "mod_1_2",
            "title": "Pre-Tour Ritual",
            "description": "Mental preparation routine before every sales tour",
            "type": "video",
            "track_id": "track_1_mindset",
            "stage": 1,
            "order": 2,
            "difficulty": "beginner",
            "duration": 6,
            "video_url": PLACEHOLDER_VIDEO,
            "key_move": "3 deep breaths, review your 3 key questions, visualize successful tour",
            "tags": ["mindset", "preparation", "routine"],
            "transcript": "",
            "resources": [],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "content_id": "mod_1_3",
            "title": "The Abundance Mindset",
            "description": "Shift from scarcity to abundance in your sales approach",
            "type": "video",
            "track_id": "track_1_mindset",
            "stage": 1,
            "order": 3,
            "difficulty": "beginner",
            "duration": 10,
            "video_url": PLACEHOLDER_VIDEO,
            "key_move": "There are always more prospects. Focus on helping, not closing.",
            "tags": ["mindset", "abundance", "psychology"],
            "transcript": "",
            "resources": [],
            "created_at": datetime.now(timezone.utc)
        }
    ]

    for module in modules:
        existing = await db.phase1_content.find_one({"content_id": module["content_id"]})
        if not existing:
            await db.phase1_content.insert_one(module)
            print(f"✅ Module creado: {module['title']}")
        else:
            print(f"⏭️  Module ya existe: {module['title']}")

    # 5. Create Deal Breakdowns
    breakdowns = [
        {
            "breakdown_id": "bd_1",
            "title": "Lost Control After Price Reveal",
            "scenario": "You presented the price and the prospect immediately said 'that's too expensive'. The conversation went downhill from there.",
            "mistake": "Revealing price before building enough value and establishing urgency",
            "correction": "Always build value, create urgency, and get commitment to the lifestyle BEFORE revealing numbers",
            "key_takeaway": "Price is only an issue when value is unclear or urgency is missing",
            "tags": ["price", "value", "timing"],
            "category": "closing",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "breakdown_id": "bd_2",
            "title": "The Missing Spouse Objection",
            "scenario": "After your entire presentation, the prospect says 'I need to talk to my spouse'",
            "mistake": "Not confirming decision-making process upfront and not setting expectations early",
            "correction": "Always ask 'Who will be involved in this decision?' before starting the tour",
            "key_takeaway": "Identify decision-makers upfront and set expectations accordingly",
            "tags": ["objections", "decision-maker", "qualification"],
            "category": "discovery",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "breakdown_id": "bd_3",
            "title": "The 'Think About It' Collapse",
            "scenario": "Prospect asks to think about it and you never hear from them again",
            "mistake": "Accepting 'think about it' without addressing the real concern or urgency",
            "correction": "Respond with 'I understand. What specific aspect would you like to think about?'",
            "key_takeaway": "'Think about it' usually means 'I don't see enough value yet'",
            "tags": ["objections", "urgency", "closing"],
            "category": "closing",
            "created_at": datetime.now(timezone.utc)
        }
    ]

    for breakdown in breakdowns:
        existing = await db.phase1_breakdowns.find_one({"breakdown_id": breakdown["breakdown_id"]})
        if not existing:
            await db.phase1_breakdowns.insert_one(breakdown)
            print(f"✅ Deal Breakdown creado: {breakdown['title']}")
        else:
            print(f"⏭️  Deal Breakdown ya existe: {breakdown['title']}")

    # 6. Create Quick Wins
    quick_wins = [
        {
            "quickwin_id": "qw_1",
            "title": "How to Recover After Losing Control",
            "category": "Recovery",
            "situation": "Prospect asks tough questions and takes control of the conversation",
            "script": "You know what, that's a great question. Let me address that, but first let me make sure I understand your main priority...",
            "outcome": "Acknowledges their question while politely taking back control",
            "tags": ["control", "recovery", "tactical"],
            "estimated_time": "2 min",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "quickwin_id": "qw_2",
            "title": "How to Answer 'We Need to Think About It'",
            "category": "Objections",
            "situation": "Prospect says they need to think about it",
            "script": "I completely understand. What specific aspect would you like to think about? Is it the investment, the timing, or something else?",
            "outcome": "Isolates the real objection and addresses it directly",
            "tags": ["objections", "closing", "rebuttals"],
            "estimated_time": "1 min",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "quickwin_id": "qw_3",
            "title": "How to Create Urgency Without Pressure",
            "category": "Urgency",
            "situation": "Prospect is interested but not ready to decide",
            "script": "This package is available today, but I should mention that similar homes in this price range tend to move quickly. Would you like me to check availability for your preferred dates?",
            "outcome": "Creates genuine urgency without using high-pressure tactics",
            "tags": ["urgency", "scarcity", "motivation"],
            "estimated_time": "2 min",
            "created_at": datetime.now(timezone.utc)
        }
    ]

    for qw in quick_wins:
        existing = await db.phase1_quickwins.find_one({"quickwin_id": qw["quickwin_id"]})
        if not existing:
            await db.phase1_quickwins.insert_one(qw)
            print(f"✅ Quick Win creado: {qw['title']}")
        else:
            print(f"⏭️  Quick Win ya existe: {qw['title']}")

    print("\n🎉 Phase 1 content seeding completado!")
    print(f"\n📊 Resumen:")
    print(f"   - Stages: {len(stages)}")
    print(f"   - Tracks: {len(tracks)}")
    print(f"   - Badges: {len(badges)}")
    print(f"   - Modules: {len(modules)}")
    print(f"   - Deal Breakdowns: {len(breakdowns)}")
    print(f"   - Quick Wins: {len(quick_wins)}")
    client.close()

if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_phase1())
