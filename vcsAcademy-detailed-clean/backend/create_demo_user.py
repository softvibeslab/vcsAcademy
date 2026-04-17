#!/usr/bin/env python3
"""
Script to create a new demo user with complete demo data
This will create a user account with realistic performance data
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone, timedelta
import bcrypt
from uuid import uuid4

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:3456')
DB_NAME = os.environ.get('DB_NAME', 'vcsa')

async def create_demo_user():
    """Create a new demo user with complete data"""

    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    try:
        # Check if demo user already exists
        existing_user = await db.users.find_one({'email': 'sarah.johnson@vcsa.com'})
        if existing_user:
            print("✅ Demo user already exists!")
            print(f"   Email: sarah.johnson@vcsa.com")
            print(f"   Password: demo123")
            return

        # Hash password
        password = b'demo123'
        hashed = bcrypt.hashpw(password, bcrypt.gensalt())

        # Create user document
        user_id = str(uuid4())

        user_doc = {
            'user_id': user_id,
            'name': 'Sarah Johnson',
            'email': 'sarah.johnson@vcsa.com',
            'password_hash': hashed.decode('utf-8'),
            'role': 'member',
            'tier': 'premium',
            'status': 'active',
            'avatar_url': None,
            'phone': '+1 (555) 123-4567',
            'location': 'Miami, FL',
            'bio': 'Passionate sales professional with 3 years of experience in vacation club sales. Achieved Top Producer status in 2024.',
            'company': 'Miami Vacation Club',
            'created_at': datetime.now(timezone.utc).isoformat(),
            'last_login': datetime.now(timezone.utc).isoformat(),
            'email_verified': True,
            'onboarding_completed': True,
            'onboarding_completed_at': (datetime.now(timezone.utc) - timedelta(days=30)).isoformat(),

            # Performance metrics
            'level': 'Performing Rep',
            'points': 2450,
            'streak_days': 14,
            'total_sales': 285000,
            'total_tours': 156,
            'total_closes': 42,
            'conversion_rate': 26.9,

            # Goals
            'monthly_income_goal': 18000,
            'annual_income_goal': 216000,

            # Training progress
            'training_modules_completed': 24,
            'training_progress': {
                'pro_mindset': 6,
                'discovery_control': 6,
                'value_architecture': 4,
                'decision_management': 4,
                'objection_mastery': 2,
                'post_sale_integrity': 2
            },

            # Badges earned
            'badges': [
                {'badge_id': 'first_sale', 'earned_at': (datetime.now(timezone.utc) - timedelta(days=85)).isoformat()},
                {'badge_id': 'week_warrior', 'earned_at': (datetime.now(timezone.utc) - timedelta(days=70)).isoformat()},
                {'badge_id': 'month_master', 'earned_at': (datetime.now(timezone.utc) - timedelta(days=60)).isoformat()},
                {'badge_id': 'rising_star', 'earned_at': (datetime.now(timezone.utc) - timedelta(days=45)).isoformat()},
                {'badge_id': 'knowledge_seeker', 'earned_at': (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()},
                {'badge_id': 'perfect_week', 'earned_at': (datetime.now(timezone.utc) - timedelta(days=14)).isoformat()},
                {'badge_id': 'objection_crusher', 'earned_at': (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()}
            ],

            # Financial data
            'financial_data': {
                'current_monthly_income': 15200,
                'savings_rate': 32,
                'savings_goals': [
                    {'name': 'Emergency Fund', 'target': 30000, 'current': 22000},
                    {'name': 'Down Payment', 'target': 80000, 'current': 45000}
                ]
            },

            # Settings
            'settings': {
                'email_notifications': True,
                'push_notifications': True,
                'weekly_report': True,
                'timezone': 'America/New_York',
                'currency': 'USD'
            }
        }

        # Insert user
        result = await db.users.insert_one(user_doc)
        print(f"✅ User created with ID: {result.inserted_id}")

        # Create user progress document
        progress_doc = {
            'user_id': user_id,
            'current_stage': 'Stage 3: Performing Rep',
            'points': 2450,
            'streak_days': 14,
            'readiness_score': 73,
            'badges_earned': 7,
            'modules_completed': 24,
            'breakdowns_reviewed': 12,
            'quick_wins_applied': 15,
            'last_activity': datetime.now(timezone.utc).isoformat(),
            'created_at': datetime.now(timezone.utc).isoformat(),
            'updated_at': datetime.now(timezone.utc).isoformat()
        }

        await db.user_progress.insert_one(progress_doc)
        print("✅ Progress document created")

        # Create daily performance data for last 30 days
        today = datetime.now(timezone.utc)
        for i in range(30):
            date = today - timedelta(days=i)

            # Generate realistic daily metrics
            import random
            tours = random.randint(2, 6)
            presentations = int(tours * random.uniform(0.8, 0.95))
            closes = random.randint(0, 2) if presentations > 0 else 0
            revenue = closes * random.randint(12000, 18000)

            performance_doc = {
                'user_id': user_id,
                'date': date.isoformat(),
                'metrics': {
                    'tours_given': tours,
                    'presentations': presentations,
                    'closes': closes,
                    'revenue': revenue,
                    'prospects_added': random.randint(1, 4),
                    'follow_ups_completed': random.randint(5, 15),
                    'calls_made': random.randint(10, 30)
                },
                'attributes': {
                    'morning_routine': random.choice([True, False]),
                    'mindset_minutes': random.randint(10, 30),
                    'scripts_practiced': random.randint(0, 5),
                    'training_completed': random.choice([True, False]),
                    'team_helped': random.randint(0, 3),
                    'gratitude_journal': random.choice([True, False]),
                    'goals_reviewed': random.choice([True, False])
                },
                'streak_day': 30 - i,
                'points_earned': (tours * 10) + (presentations * 5) + (closes * 20),
                'created_at': datetime.now(timezone.utc).isoformat()
            }

            await db.daily_performance.insert_one(performance_doc)

        print("✅ 30 days of performance data created")

        # Create goal sheet entries
        goals = [
            {
                'user_id': user_id,
                'category': 'income',
                'title': 'Monthly Income Target',
                'description': 'Achieve $18,000 in monthly sales',
                'target': 18000,
                'current': 15200,
                'deadline': (datetime.now(timezone.utc) + timedelta(days=15)).isoformat(),
                'status': 'in_progress',
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'user_id': user_id,
                'category': 'activity',
                'title': 'Monthly Tours',
                'description': 'Complete 100 tours this month',
                'target': 100,
                'current': 72,
                'deadline': (datetime.now(timezone.utc) + timedelta(days=15)).isoformat(),
                'status': 'in_progress',
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'user_id': user_id,
                'category': 'skill',
                'title': 'Objection Mastery',
                'description': 'Master top 10 objection responses',
                'target': 10,
                'current': 7,
                'deadline': (datetime.now(timezone.utc) + timedelta(days=45)).isoformat(),
                'status': 'in_progress',
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'user_id': user_id,
                'category': 'performance',
                'title': 'Conversion Rate',
                'description': 'Maintain 25% tour-to-close ratio',
                'target': 25,
                'current': 26.9,
                'deadline': (datetime.now(timezone.utc) + timedelta(days=15)).isoformat(),
                'status': 'in_progress',
                'created_at': datetime.now(timezone.utc).isoformat()
            }
        ]

        for goal in goals:
            await db.goals.insert_one(goal)

        print("✅ Goal sheet entries created")

        # Create coaching session registrations
        upcoming_events = [
            {
                'user_id': user_id,
                'event_id': str(uuid4()),
                'event_type': 'group_coaching',
                'title': 'Advanced Objection Handling',
                'date': (datetime.now(timezone.utc) + timedelta(days=2)).isoformat(),
                'time': '15:00',
                'status': 'registered',
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'user_id': user_id,
                'event_id': str(uuid4()),
                'event_type': 'role_play',
                'title': 'Price Negotiation Practice',
                'date': (datetime.now(timezone.utc) + timedelta(days=5)).isoformat(),
                'time': '10:00',
                'status': 'registered',
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'user_id': user_id,
                'event_id': str(uuid4()),
                'event_type': 'qa_session',
                'title': "Ask a Top Producer",
                'date': (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
                'time': '14:00',
                'status': 'registered',
                'created_at': datetime.now(timezone.utc).isoformat()
            }
        ]

        for event in upcoming_events:
            await db.coaching_registrations.insert_one(event)

        print("✅ Coaching registrations created")

        print("\n" + "="*60)
        print("🎉 DEMO USER CREATED SUCCESSFULLY!")
        print("="*60)
        print("\n📧 Login Credentials:")
        print("   Email: sarah.johnson@vcsa.com")
        print("   Password: demo123")
        print("\n👤 User Profile:")
        print("   Name: Sarah Johnson")
        print("   Role: Premium Member")
        print("   Level: Performing Rep (Stage 3)")
        print(f"   Points: {user_doc['points']}")
        print(f"   Streak: {user_doc['streak_days']} days")
        print(f"   Sales: ${user_doc['total_sales']:,}")
        print(f"   Conversion: {user_doc['conversion_rate']}%")
        print("\n✨ Demo Data Included:")
        print("   ✓ 30 days of performance data")
        print("   ✓ 4 active goals with progress")
        print("   ✓ 3 upcoming coaching events")
        print("   ✓ 24 training modules completed")
        print("   ✓ 7 badges earned")
        print("   ✓ Complete financial profile")
        print("\n🚀 Access the demo account at:")
        print("   http://localhost:1234/login")
        print("\n" + "="*60)

    except Exception as e:
        print(f"❌ Error creating demo user: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == '__main__':
    asyncio.run(create_demo_user())
