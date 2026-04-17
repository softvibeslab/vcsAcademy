#!/usr/bin/env python3
"""
Test script to debug financial endpoint
"""

import sys
sys.path.insert(0, '/Users/newproject/Documents/GitHub/vcsAcademy/backend')

from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

async def test_financial_query():
    # MongoDB connection
    mongo_url = "mongodb://admin:vcsa_local_dev_2024@mongodb:27017"
    client = AsyncIOMotorClient(mongo_url)
    db = client.vcsa

    # Test parameters
    user_id = "user_b5ad056b3a6c"
    current_month = datetime.now().strftime("%Y-%m")

    print(f"User ID: {user_id}")
    print(f"Current Month: {current_month}")
    print("-" * 50)

    # Query
    goal = await db.financial_goals.find_one({
        "user_id": user_id,
        "month": current_month
    })

    if goal:
        print("✅ GOAL FOUND!")
        print(f"Target Income: ${goal.get('target_income', 0):,.2f}")
        print(f"Total Expenses: ${goal.get('total_expenses', 0):,.2f}")
        print(f"Income Gap: ${goal.get('income_gap', 0):,.2f}")
    else:
        print("❌ GOAL NOT FOUND")

    # Count all goals for user
    count = await db.financial_goals.count_documents({"user_id": user_id})
    print(f"\nTotal goals for user: {count}")

    # List all goals for user
    cursor = db.financial_goals.find({"user_id": user_id})
    async for g in cursor:
        print(f"  - Month: {g.get('month')}, Target: ${g.get('target_income', 0):,.2f}")

    client.close()

if __name__ == "__main__":
    asyncio.run(test_financial_query())
