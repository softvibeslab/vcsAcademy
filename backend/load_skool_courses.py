#!/usr/bin/env python3
"""
Load Skool Courses from CSV into MongoDB
Imports course and lesson data from Skool export CSV file
"""

import csv
import re
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from bson.objectid import ObjectId
import uuid

# Database configuration
MONGO_URL = "mongodb://admin:vcsa_local_dev_2024@localhost:27019"
DB_NAME = "vcsa"

# CSV file path
CSV_FILE = "wiki/skool/_Vacation Club Sales Academy _ Skool - Hoja 1.csv"

def convert_youtube_to_embed(url):
    """Convert YouTube watch URL to embed format"""
    if not url:
        return ""

    # Handle different YouTube URL formats
    patterns = [
        r'(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)',
        r'(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^/?]+)',
        r'(?:https?:\/\/)?youtu\.be\/([^/?]+)',
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            video_id = match.group(1)
            return f"https://www.youtube.com/embed/{video_id}"

    # If URL doesn't match known patterns, return as-is
    return url

def estimate_duration_from_url(url):
    """Estimate video duration in minutes (default for now)"""
    # In production, you could use YouTube API to get actual duration
    return 15  # Default 15 minutes per video

async def load_skool_courses():
    """Load courses and lessons from CSV into MongoDB"""

    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    print("📚 Loading Skool Courses from CSV...")
    print(f"📁 CSV File: {CSV_FILE}")
    print(f"🗄️  Database: {DB_NAME}")
    print("")

    # Read CSV and organize by module
    courses_data = {}

    with open(CSV_FILE, 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)

        for row in csv_reader:
            module = row['Modulo'].strip()
            title = row['Titulo'].strip()
            copy = row['Copy'].strip() if row['Copy'] else ""
            video_url = row['Link'].strip()

            if not module or not title:
                continue

            # Initialize module if not exists
            if module not in courses_data:
                courses_data[module] = {
                    'title': module,
                    'description': f"Training content from Skool: {module}",
                    'lessons': []
                }

            # Add lesson to module
            courses_data[module]['lessons'].append({
                'title': title,
                'description': copy or f"Learn about {title}",
                'video_url': video_url,
                'order': len(courses_data[module]['lessons']) + 1
            })

    print(f"📊 Found {len(courses_data)} courses with {sum(len(c['lessons']) for c in courses_data.values())} total lessons")
    print("")

    # Load courses into database
    admin_user = await db.users.find_one({"role": "admin"})
    if not admin_user:
        admin_user = await db.users.find_one({})  # Use first user if no admin

    created_by = admin_user['user_id'] if admin_user else 'system'

    for module_name, course_data in courses_data.items():
        print(f"📖 Processing Course: {module_name}")

        # Check if course already exists
        existing_course = await db.courses.find_one({"title": module_name})

        if existing_course:
            print(f"   ✅ Course already exists: {existing_course['course_id']}")
            course_id = existing_course['course_id']

            # Delete existing lessons for this course to avoid duplicates
            await db.lessons.delete_many({"course_id": course_id})
            print(f"   🗑️  Deleted {len(course_data['lessons'])} old lessons")
        else:
            # Create new course
            course_id = f"course_{uuid.uuid4().hex[:12]}"

            course_doc = {
                "course_id": course_id,
                "title": course_data['title'],
                "description": course_data['description'],
                "thumbnail": "https://img.youtube.com/vi/default/maxresdefault.jpg",  # Generic thumbnail
                "category": "masterclass",  # Skool content as masterclasses
                "min_level": 1,
                "vip_only": False,
                "lessons": [],
                "created_at": datetime.now(),
                "created_by": created_by
            }

            await db.courses.insert_one(course_doc)
            print(f"   ✅ Created course: {course_id}")

        # Create lessons
        lesson_count = 0
        for lesson_data in course_data['lessons']:
            lesson_id = f"lesson_{uuid.uuid4().hex[:12]}"

            # Convert YouTube URL to embed format
            embed_url = convert_youtube_to_embed(lesson_data['video_url'])
            duration = estimate_duration_from_url(lesson_data['video_url'])

            lesson_doc = {
                "lesson_id": lesson_id,
                "course_id": course_id,
                "title": lesson_data['title'],
                "description": lesson_data['description'],
                "video_url": embed_url,
                "duration": duration,
                "order": lesson_data['order'],
                "created_at": datetime.now()
            }

            await db.lessons.insert_one(lesson_doc)
            lesson_count += 1

            print(f"   📹 Lesson {lesson_count}: {lesson_data['title']}")
            print(f"      URL: {embed_url}")

        # Update course with lesson IDs
        lesson_ids = [f"lesson_{uuid.uuid4().hex[:12]}" for _ in range(lesson_count)]
        await db.courses.update_one(
            {"course_id": course_id},
            {"$set": {"lessons": lesson_ids}}
        )

        print(f"   ✅ Created {lesson_count} lessons")
        print("")

    # Summary
    total_courses = len(courses_data)
    total_lessons = sum(len(c['lessons']) for c in courses_data.values())

    print("=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    print(f"✅ Courses processed: {total_courses}")
    print(f"✅ Lessons created: {total_lessons}")
    print(f"✅ Database: {DB_NAME}")
    print("")

    # Verify data
    print("🔍 VERIFICATION")
    print("=" * 60)

    courses_count = await db.courses.count_documents({})
    lessons_count = await db.lessons.count_documents({})

    print(f"📚 Total courses in database: {courses_count}")
    print(f"📹 Total lessons in database: {lessons_count}")
    print("")

    # List all courses
    print("📋 COURSES LIST:")
    print("-" * 60)

    courses = await db.courses.find({}, {"_id": 0}).to_list(50)
    for course in courses:
        lesson_count = await db.lessons.count_documents({"course_id": course['course_id']})
        print(f"📖 {course['title']}")
        print(f"   ID: {course['course_id']}")
        print(f"   Category: {course.get('category', 'N/A')}")
        print(f"   Lessons: {lesson_count}")
        print(f"   VIP Only: {course.get('vip_only', False)}")
        print("")

    client.close()
    print("✅ Skool courses loaded successfully!")

if __name__ == "__main__":
    asyncio.run(load_skool_courses())
