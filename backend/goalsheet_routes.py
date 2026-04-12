"""
Goal Sheet API Routes for VCSA
Implements goal tracking, achievements, and performance metrics for sales representatives
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime, timedelta
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(prefix="/goalsheet", tags=["goalsheet"])

# Database dependency
async def get_db():
    """Get database connection"""
    # This should be imported from your main server.py
    from server import mongo_client
    return mongo_client.vcsa

# Pydantic Models
class Goal(BaseModel):
    category: Literal["sales", "revenue", "personal"]
    title: str
    target: float
    current: float = 0
    unit: str
    deadline: Optional[datetime] = None
    description: Optional[str] = None
    status: Literal["active", "completed", "archived"] = "active"

class GoalUpdate(BaseModel):
    current: float
    status: Optional[Literal["active", "completed", "archived"]] = None

class Achievement(BaseModel):
    id: str
    title: str
    icon: Literal["trophy", "flame", "crown", "star", "shield", "zap"]
    unlocked: bool = False
    unlocked_at: Optional[datetime] = None
    description: str

class Milestone(BaseModel):
    id: str
    title: str
    target: float
    current: float = 0
    deadline: datetime
    status: Literal["on-track", "ahead", "behind", "completed"]

class GoalSheetResponse(BaseModel):
    sales: dict
    revenue: dict
    personal: dict
    achievements: List[Achievement]
    milestones: List[Milestone]

class StatsResponse(BaseModel):
    today: dict
    week: dict
    streak: dict
    rank: dict

# Helper Functions
def calculate_progress(current: float, target: float) -> float:
    """Calculate progress percentage"""
    if target == 0:
        return 0
    return min((current / target) * 100, 100)

def determine_status(current: float, target: float, deadline: datetime) -> str:
    """Determine if goal is on-track, ahead, or behind"""
    progress = calculate_progress(current, target)
    days_remaining = (deadline - datetime.now()).days
    total_days = (deadline - datetime.now().replace(day=1, month=1)).days

    if progress >= 100:
        return "completed"
    elif days_remaining > 0:
        expected_progress = ((total_days - days_remaining) / total_days) * 100
        if progress >= expected_progress + 10:
            return "ahead"
        elif progress >= expected_progress - 10:
            return "on-track"
        else:
            return "behind"
    return "behind"

async def check_achievements(db, user_id: str, goals: dict) -> List[Achievement]:
    """
    Check and unlock achievements based on goal progress
    This is called whenever goals are updated
    """
    achievements = []

    # Define achievement criteria
    achievement_criteria = {
        "top_10_percent": {
            "title": "Top 10%",
            "icon": "trophy",
            "description": "Top 10% performer this month",
            "check": lambda g: g.get("sales", {}).get("volume", {}).get("current", 0) > 100000
        },
        "hot_streak": {
            "title": "Hot Streak",
            "icon": "flame",
            "description": "5 sales in a row",
            "check": lambda g: g.get("streak", {}).get("current", 0) >= 5
        },
        "club_elite": {
            "title": "Club Elite",
            "icon": "crown",
            "description": "100K+ in monthly volume",
            "check": lambda g: g.get("revenue", {}).get("gross", {}).get("current", 0) >= 100000
        },
        "perfect_week": {
            "title": "Perfect Week",
            "icon": "star",
            "description": "100% closing rate for a week",
            "check": lambda g: g.get("sales", {}).get("closing_rate", {}).get("current", 0) >= 100
        }
    }

    # Get user's unlocked achievements
    user_doc = await db.users.find_one({"_id": ObjectId(user_id)})
    unlocked = user_doc.get("unlocked_achievements", [])

    for achievement_id, criteria in achievement_criteria.items():
        is_unlocked = achievement_id in unlocked
        should_unlock = criteria["check"](goals)

        achievement = Achievement(
            id=achievement_id,
            title=criteria["title"],
            icon=criteria["icon"],
            description=criteria["description"],
            unlocked=is_unlocked or should_unlock,
            unlocked_at=datetime.now() if (should_unlock and not is_unlocked) else None
        )

        # Update database if newly unlocked
        if should_unlock and not is_unlocked:
            await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$push": {"unlocked_achievements": achievement_id}}
            )

        achievements.append(achievement)

    return achievements

# API Endpoints

@router.get("", response_model=GoalSheetResponse)
async def get_goal_sheet(
    period: Literal["daily", "weekly", "monthly", "quarterly", "yearly"] = "monthly",
    user_id: str = Depends(lambda: "demo-user")  # Replace with actual auth
):
    """
    Get goal sheet data for a specific time period

    Args:
        period: Time period for goals (daily, weekly, monthly, quarterly, yearly)
        user_id: User ID (from auth)

    Returns:
        GoalSheetResponse with goals, achievements, and milestones
    """
    db = await get_db()

    # Get user document
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_404=404, detail="User not found")

    # Get user's goals for the period
    goals = await db.user_goals.find_one({
        "user_id": user_id,
        "period": period
    })

    if not goals:
        # Create default goals for new users
        goals = {
            "user_id": user_id,
            "period": period,
            "sales": {
                "volume": {"current": 0, "target": 150000, "unit": "VP"},
                "tours": {"current": 0, "target": 60, "unit": "tours"},
                "sales": {"current": 0, "target": 20, "unit": "sales"},
                "closing_rate": {"current": 0, "target": 35, "unit": "%"}
            },
            "revenue": {
                "gross": {"current": 0, "target": 250000, "unit": "USD"},
                "commission": {"current": 0, "target": 37500, "unit": "USD"},
                "bonuses": {"current": 0, "target": 5000, "unit": "USD"},
                "avg_deal": {"current": 0, "target": 12500, "unit": "USD"}
            },
            "personal": {
                "training_hours": {"current": 0, "target": 40, "unit": "hrs"},
                "modules_completed": {"current": 0, "target": 30, "unit": "modules"},
                "coaching_calls": {"current": 0, "target": 12, "unit": "calls"},
                "readiness_score": {"current": 0, "target": 85, "unit": "score"}
            }
        }
        await db.user_goals.insert_one(goals)

    # Get achievements
    achievements = await check_achievements(db, user_id, goals)

    # Get milestones
    milestones_cursor = db.user_milestones.find({"user_id": user_id})
    milestones = []
    async for milestone in milestones_cursor:
        milestones.append(Milestone(
            id=str(milestone["_id"]),
            title=milestone["title"],
            target=milestone["target"],
            current=milestone.get("current", 0),
            deadline=milestone["deadline"],
            status=determine_status(
                milestone.get("current", 0),
                milestone["target"],
                milestone["deadline"]
            )
        ))

    return GoalSheetResponse(
        sales=goals["sales"],
        revenue=goals["revenue"],
        personal=goals["personal"],
        achievements=achievements,
        milestones=milestones
    )

@router.get("/stats", response_model=StatsResponse)
async def get_stats(user_id: str = Depends(lambda: "demo-user")):
    """
    Get current stats (today, week, streak, rank)

    Args:
        user_id: User ID (from auth)

    Returns:
        StatsResponse with today's performance, weekly stats, streak info, and rank
    """
    db = await get_db()

    # Get today's activity
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_activity = await db.user_activity.find_one({
        "user_id": user_id,
        "timestamp": {"$gte": today}
    })

    # Get week's activity
    week_start = today - timedelta(days=today.weekday())
    week_activities = db.user_activity.find({
        "user_id": user_id,
        "timestamp": {"$gte": week_start}
    })

    today_stats = {
        "tours": today_activity.get("tours", 0) if today_activity else 0,
        "presentations": today_activity.get("presentations", 0) if today_activity else 0,
        "sales": today_activity.get("sales", 0) if today_activity else 0,
        "volume": today_activity.get("volume", 0) if today_activity else 0
    }

    week_stats = {"tours": 0, "presentations": 0, "sales": 0, "volume": 0}
    async for activity in week_activities:
        for key in week_stats.keys():
            week_stats[key] += activity.get(key, 0)

    # Get streak info
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    streak = {
        "current": user.get("current_streak", 0),
        "best": user.get("best_streak", 0)
    }

    # Get rank (would require leaderboard query)
    rank = {
        "current": user.get("rank", 1),
        "total": 42,  # Would be dynamic
        "movement": user.get("rank_change", "+0")
    }

    return StatsResponse(
        today=today_stats,
        week=week_stats,
        streak=streak,
        rank=rank
    )

@router.post("/goals")
async def create_goal(
    goal: Goal,
    user_id: str = Depends(lambda: "demo-user")
):
    """
    Create a new goal

    Args:
        goal: Goal data
        user_id: User ID (from auth)

    Returns:
        Created goal
    """
    db = await get_db()

    # Check if goal with same title exists
    existing = await db.user_goals.find_one({
        "user_id": user_id,
        "goals.title": goal.title
    })

    if existing:
        raise HTTPException(status_code=400, detail="Goal with this title already exists")

    # Add goal to user's goals
    result = await db.user_goals.update_one(
        {"user_id": user_id, "period": "monthly"},
        {"$push": {"goals": goal.dict()}}
    )

    if result.matched_count == 0:
        # Create new goals document
        await db.user_goals.insert_one({
            "user_id": user_id,
            "period": "monthly",
            "goals": [goal.dict()],
            "sales": {},
            "revenue": {},
            "personal": {}
        })

    return {"message": "Goal created successfully", "goal": goal.dict()}

@router.put("/goals/{goal_id}")
async def update_goal(
    goal_id: str,
    update: GoalUpdate,
    user_id: str = Depends(lambda: "demo-user")
):
    """
    Update goal progress

    Args:
        goal_id: Goal ID
        update: Updated goal data
        user_id: User ID (from auth)

    Returns:
        Updated goal
    """
    db = await get_db()

    # Update goal
    result = await db.user_goals.update_one(
        {"user_id": user_id, "goals._id": goal_id},
        {"$set": {"goals.$.current": update.current}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Goal not found")

    return {"message": "Goal updated successfully"}

@router.post("/achievements/{achievement_id}/unlock")
async def unlock_achievement(
    achievement_id: str,
    user_id: str = Depends(lambda: "demo-user")
):
    """
    Manually unlock an achievement (admin function)

    Args:
        achievement_id: Achievement ID
        user_id: User ID (from auth)

    Returns:
        Unlocked achievement
    """
    db = await get_db()

    # Check if already unlocked
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if achievement_id in user.get("unlocked_achievements", []):
        raise HTTPException(status_code=400, detail="Achievement already unlocked")

    # Unlock achievement
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"unlocked_achievements": achievement_id}}
    )

    return {"message": "Achievement unlocked successfully"}

@router.post("/milestones")
async def create_milestone(
    milestone: Milestone,
    user_id: str = Depends(lambda: "demo-user")
):
    """
    Create a new milestone

    Args:
        milestone: Milestone data
        user_id: User ID (from auth)

    Returns:
        Created milestone
    """
    db = await get_db()

    milestone_data = milestone.dict()
    milestone_data["user_id"] = user_id
    milestone_data["created_at"] = datetime.now()

    result = await db.user_milestones.insert_one(milestone_data)

    return {
        "message": "Milestone created successfully",
        "id": str(result.inserted_id)
    }
