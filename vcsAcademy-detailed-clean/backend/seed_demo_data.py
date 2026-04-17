"""
Seed Script for Milestone 1.5: Goal Sheets Gamified

Populates the database with demo data to showcase the complete system
"""

import asyncio
from datetime import datetime, timedelta, date
from motor.motor_async import AsyncIOMotorClient
from pymongo import DESCENDING
import uuid
import random

# Configuration
MONGO_URL = "mongodb://localhost:27019"
DB_NAME = "vcsa"

# Demo user ID
DEMO_USER_ID = "demo_user_123"

async def seed_financial_goals(db: AsyncIOMotorClient):
    """Seed financial goals for the demo user"""
    print("📊 Seeding Financial Goals...")

    today = datetime.now()
    current_month = today.strftime("%Y-%m")

    financial_goals = [
        {
            "goal_id": f"fg_{uuid.uuid4().hex[:12]}",
            "user_id": DEMO_USER_ID,
            "month": current_month,
            "target_income": 15000.0,
            "expenses": [
                {"category": "rent", "amount": 1500.0, "description": "Monthly rent"},
                {"category": "car_payment", "amount": 450.0, "description": "Car payment"},
                {"category": "electricity", "amount": 150.0, "description": "Electricity bill"},
                {"category": "food", "amount": 600.0, "description": "Groceries"},
                {"category": "water_bill", "amount": 80.0, "description": "Water bill"},
                {"category": "credit_card", "amount": 300.0, "description": "Credit card payments"},
                {"category": "gas", "amount": 200.0, "description": "Gas/fuel"},
                {"category": "cell_phone", "amount": 100.0, "description": "Cell phone"},
                {"category": "cable", "amount": 80.0, "description": "Cable & internet"},
                {"category": "insurance", "amount": 250.0, "description": "Insurance"},
                {"category": "gym", "amount": 50.0, "description": "Gym membership"},
                {"category": "entertainment", "amount": 150.0, "description": "Entertainment"},
                {"category": "other", "amount": 200.0, "description": "Miscellaneous"}
            ],
            "total_expenses": 4110.0,
            "income_gap": 10890.0,
            "avg_sale": 1200.0,
            "closing_rate": 22.0,
            "tours_needed": 42,
            "sales_needed": 10,
            "created_at": today - timedelta(days=15),
            "updated_at": today
        }
    ]

    if await db.financial_goals.count_documents({"user_id": DEMO_USER_ID}) == 0:
        await db.financial_goals.insert_many(financial_goals)
        print("✅ Financial goals seeded")
    else:
        print("ℹ️  Financial goals already exist")

async def seed_daily_sales(db: AsyncIOMotorClient):
    """Seed daily sales records for the current month"""
    print("📅 Seeding Daily Sales Records...")

    today = datetime.now()

    # Generate sales for the first 20 days of the month
    daily_sales = []
    for day in range(1, 21):
        # 70% chance of having sales on a day
        if random.random() > 0.3:
            has_sales = True
            num_sales = random.randint(1, 3)
            total_volume = 0
            total_commission = 0

            clients = ["John Smith", "Maria Garcia", "Robert Johnson", "Emily Davis", "Michael Brown",
                       "Sarah Wilson", "David Lee", "Jessica Martinez", "Chris Taylor", "Amanda White"]

            for sale_num in range(num_sales):
                volume = random.randint(800, 2000)
                total_volume += volume
                total_commission += volume * random.uniform(0.15, 0.25)

            sales_record = {
                "record_id": f"ds_{uuid.uuid4().hex[:12]}",
                "user_id": DEMO_USER_ID,
                "date": (today.replace(day=day)).strftime("%Y-%m-%d"),
                "day_number": day,
                "socio": clients[random.randint(0, len(clients)-1)] if has_sales else None,
                "manager": "Sales Manager",
                "volume": total_volume,
                "enganche_pct": random.randint(10, 30),
                "commission_pct": random.uniform(15, 25),
                "milesingreso": total_commission,
                "daily_tip": random.choice([
                    "Focus on building value before presenting price",
                    "Listening more than talking helped close the deal",
                    "Following up on objections worked well today",
                    "Great energy and enthusiasm throughout the tour",
                    "Learned a new objection handling technique"
                ]) if has_sales else None,
                "created_at": today - timedelta(days=random.randint(1, 20))
            }
            daily_sales.append(sales_record)

    if await db.daily_sales.count_documents({"user_id": DEMO_USER_ID}) == 0:
        await db.daily_sales.insert_many(daily_sales)
        print(f"✅ Daily sales seeded: {len(daily_sales)} records")
    else:
        print("ℹ️  Daily sales already exist")

async def seed_daily_attributes(db: AsyncIOMotorClient):
    """Seed daily attribute progress"""
    print("🏆 Seeding Personal Attributes...")

    today = datetime.now()
    today_str = today.strftime("%Y-%m-%d")

    attributes = [
        "attitude", "courage", "focus", "training",
        "discipline", "persistence", "commitment"
    ]

    # Seed attributes for the last 7 days
    daily_attributes = []
    for days_ago in range(6, -1, -1):
        date_str = (today - timedelta(days=days_ago)).strftime("%Y-%m-%d")

        # Weekend: no attributes
        weekday = (today - timedelta(days=days_ago)).weekday()
        if weekday >= 5:  # Saturday or Sunday
            continue

        # Weekday: seed attributes (70% chance of achieving each)
        for attr in attributes:
            if random.random() > 0.3:  # 70% achieved
                attribute_points = {
                    "attitude": 10,
                    "courage": 10,
                    "focus": 10,
                    "training": 15,
                    "discipline": 20,
                    "persistence": 15,
                    "commitment": 25
                }

                daily_attributes.append({
                    "attribute_id": f"attr_{uuid.uuid4().hex[:12]}",
                    "user_id": DEMO_USER_ID,
                    "date": date_str,
                    "attribute_type": attr,
                    "achieved": True,
                    "notes": random.choice([
                        "Great mindset today, stayed positive despite challenges",
                        "Stepped out of comfort zone and made cold calls",
                        "Maintained laser focus on top priorities",
                        "Completed training module and applied learning",
                        "Followed schedule perfectly all day",
                        "Didn't give up despite obstacles",
                        "Fully committed to goals and took massive action"
                    ]),
                    "points_earned": attribute_points[attr],
                    "created_at": today - timedelta(days=days_ago)
                })

    if await db.daily_attributes.count_documents({"user_id": DEMO_USER_ID}) == 0:
        await db.daily_attributes.insert_many(daily_attributes)
        print(f"✅ Daily attributes seeded: {len(daily_attributes)} records")
    else:
        print("ℹ️  Daily attributes already exist")

async def seed_challenges(db: AsyncIOMotorClient):
    """Seed daily challenges"""
    print("🎮 Seeding Daily Challenges...")

    today = datetime.now()
    today_str = today.strftime("%Y-%m-%d")
    weekday = today.weekday()

    # Challenge types based on weekday
    challenge_mapping = {
        0: None,  # Sunday - no challenge
        1: "monday_focus",
        2: "tuesday_courage",
        3: "wednesday_training",
        4: "thursday_discipline",
        5: "friday_persistence",
        6: None   # Saturday - no challenge
    }

    challenge_data = {
        "monday_focus": {
            "type": "monday_focus",
            "name": "Monday Focus Challenge",
            "description": "Completa 3 tareas sin distracciones",
            "points": 25,
            "tasks": 3,
            "color": "#3B82F6"
        },
        "tuesday_courage": {
            "type": "tuesday_courage",
            "name": "Tuesday Courage Challenge",
            "description": "Llama a 5 leads cold",
            "points": 25,
            "tasks": 5,
            "color": "#EF4444"
        },
        "wednesday_training": {
            "type": "wednesday_training",
            "name": "Wednesday Training Challenge",
            "description": "Completa 1 módulo de training",
            "points": 25,
            "tasks": 1,
            "color": "#8B5CF6"
        },
        "thursday_discipline": {
            "type": "thursday_discipline",
            "name": "Thursday Discipline Challenge",
            "description": "Sigue tu schedule perfectamente",
            "points": 25,
            "tasks": 4,
            "color": "#10B981"
        },
        "friday_persistence": {
            "type": "friday_persistence",
            "name": "Friday Persistence Challenge",
            "description": "No te rindas hasta lograr tu meta",
            "points": 25,
            "tasks": 1,
            "color": "#EC4899"
        }
    }

    challenge_type = challenge_mapping.get(weekday)

    if challenge_type:
        challenge_info = challenge_data[challenge_type]

        # Create completed challenge
        challenge = {
            "challenge_id": f"chal_{uuid.uuid4().hex[:12]}",
            "user_id": DEMO_USER_ID,
            "date": today_str,
            "challenge_type": challenge_type,
            "description": challenge_info["description"],
            "target_tasks": challenge_info["tasks"],
            "completed_tasks": challenge_info["tasks"],  # Already completed
            "points_awarded": challenge_info["points"],
            "completed": True,
            "notes": "Crushed it today! Focused and took massive action.",
            "created_at": today
        }

        if await db.daily_challenges.count_documents({
            "user_id": DEMO_USER_ID,
            "date": today_str,
            "challenge_type": challenge_type
        }) == 0:
            await db.daily_challenges.insert_one(challenge)
            print(f"✅ Daily challenge seeded: {challenge_info['name']}")
        else:
            print("ℹ️  Daily challenge already exists")

async def seed_badges(db: AsyncIOMotorClient):
    """Seed user badges"""
    print("🏅 Seeding User Badges...")

    today = datetime.now()

    badges = [
        {
            "badge_id": "first_sale",
            "name": "First Sale",
            "icon": "💰",
            "description": "Logged your first sale",
            "color": "#10B981",
            "awarded": True,
            "earned_at": today - timedelta(days=18)
        },
        {
            "badge_id": "sales_10",
            "name": "10 Sales Club",
            "icon": "🏆",
            "description": "Logged 10 sales total",
            "color": "#3B82F6",
            "awarded": True,
            "earned_at": today - timedelta(days=12)
        },
        {
            "badge_id": "streak_7",
            "name": "Week Warrior",
            "icon": "⚡",
            "description": "7-day daily combo streak",
            "color": "#EF4444",
            "awarded": True,
            "earned_at": today - timedelta(days=5)
        },
        {
            "badge_id": "combo_master",
            "name": "Combo Master",
            "icon": "🌟",
            "description": "Completed 25 daily combos total",
            "color": "#D4AF37",
            "awarded": True,
            "earned_at": today - timedelta(days=3)
        }
    ]

    for badge in badges:
        existing = await db.user_progress.find_one({
            "user_id": DEMO_USER_ID,
            "badges.badge_id": badge["badge_id"]
        })

        if not existing:
            await db.user_progress.update_one(
                {"user_id": DEMO_USER_ID},
                {"$push": {"badges": badge}}
            )
            print(f"✅ Badge seeded: {badge['name']}")

    print("✅ All badges seeded")

async def seed_progress(db: AsyncIOMotorClient):
    """Seed user progress"""
    print("📈 Seeding User Progress...")

    today = datetime.now()

    # Calculate points from seeded data
    total_points = 0

    # Financial goal: +25
    total_points += 25

    # Daily sales: assume ~15 sales × 10 pts = 150 pts
    total_points += 150

    # Daily attributes: assume ~35 attributes × avg 15 pts = 525 pts
    total_points += 525

    # Challenges: assume ~4 challenges × 25 pts = 100 pts
    total_points += 100

    # Badges: 4 badges × 25 pts = 100 pts
    total_points += 100

    progress_data = {
        "user_id": DEMO_USER_ID,
        "points": total_points,
        "training_streak": 5,
        "current_stage": "stage_2",
        "readiness_score": 68.5,
        "badges_awarded": 4,
        "modules_completed": 8,
        "last_active": today
    }

    existing = await db.user_progress.find_one({"user_id": DEMO_USER_ID})

    if existing:
        await db.user_progress.update_one(
            {"user_id": DEMO_USER_ID},
            {"$set": progress_data}
        )
        print(f"✅ User progress updated: {total_points} points")
    else:
        await db.user_progress.insert_one(progress_data)
        print(f"✅ User progress created: {total_points} points")

async def seed_all():
    """Seed all demo data"""
    print("🚀 Starting Demo Data Seeding...")
    print("=" * 60)

    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    await client.start_server()

    try:
        db = client[DB_NAME]

        # Seed all collections
        await seed_financial_goals(db)
        await seed_daily_sales(db)
        await seed_daily_attributes(db)
        await seed_challenges(db)
        await seed_badges(db)
        await seed_progress(db)

        print("=" * 60)
        print("✅ DEMO DATA SEEDING COMPLETE!")
        print()
        print("📊 SUMMARY:")
        print(f"  Financial Goals: ✓")
        print(f"  Daily Sales: ✓ (20 days)")
        print(f"  Personal Attributes: ✓ (35 records)")
        print(f"  Daily Challenges: ✓")
        print(f"  Badges: ✓ (4 badges)")
        print(f"  Total Points: ~900")
        print()
        print("🎮 Login with:")
        print(f"  Email: demo@vcsa.com")
        print(f"  Password: demo123")
        print()
        print("🌐 Navigate to:")
        print(f"  http://localhost:3001/financial")
        print(f"  http://localhost:3001/daily-performance")
        print(f"  http://localhost:3001/analytics")
        print(f"  http://localhost:3001/strategy")

    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(seed_all())
