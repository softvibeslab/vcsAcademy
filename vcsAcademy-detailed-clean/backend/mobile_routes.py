"""
Mobile API Routes for VCSA Pocket MVP

These endpoints support the mobile app functionality:
- Authentication with device info
- AI Coach service
- Quick Wins library
- Performance tracking
- Offline content sync
"""

from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId
import uuid
import httpx
import os

from server import db, require_auth
from phase1_routes import get_user_progress

# Configuration
OLLAMA_URL = os.environ.get('OLLAMA_URL', 'http://localhost:11434/api/generate')

# Pydantic models
class MobileLoginRequest(BaseModel):
    email: str
    password: str
    device_info: Optional[dict] = None

class DeviceInfo(BaseModel):
    platform: str  # 'ios' or 'android'
    device_id: str
    push_token: Optional[str] = None

class AICoachRequest(BaseModel):
    input_type: str  # 'text' or 'voice'
    content: str
    context: dict
    preference: Optional[dict] = None

class TourResultRequest(BaseModel):
    outcome: str  # 'sale' or 'no_sale' or 'follow_up'
    duration_minutes: int
    objections_handled: int
    ai_coach_used: bool
    confidence_before: int
    confidence_after: int
    notes: Optional[str] = None
    client_profile: Optional[dict] = None

class QuickWinFilters(BaseModel):
    category: Optional[str] = None
    limit: Optional[int] = 10
    random: Optional[bool] = False

# Create mobile router
mobile_router = APIRouter(prefix="/mobile", tags=["mobile"])

# ============== HELPER FUNCTIONS ==============

async def get_user_id_from_token():
    """Get user_id from session token (simplified)"""
    # In production, this would decode JWT token
    # For MVP, return demo user_id
    return "demo_user_id"

async def calculate_training_score(progress: list) -> float:
    """Calculate training completion score"""
    if not progress:
        return 0.5

    completed = len([p for p in progress if p.get("completed", False)])
    total = max(len(progress), 1)
    return (completed / total) * 100

async def calculate_performance_score(user_id: str) -> float:
    """Calculate recent performance score"""
    # Get tour results from last 30 days
    thirty_days_ago = datetime.now() - timedelta(days=30)
    tours = await db.tour_results.find({
        "user_id": user_id,
        "created_at": {"$gte": thirty_days_ago}
    }).to_list(100)

    if not tours:
        return 0.5

    total_tours = len(tours)
    closed_deals = sum(1 for t in tours if t.get("outcome") == "sale")
    conversion_rate = closed_deals / total_tours if total_tours > 0 else 0

    # Score based on conversion rate
    if conversion_rate >= 0.30:
        return 1.0
    elif conversion_rate >= 0.25:
        return 0.85
    elif conversion_rate >= 0.20:
        return 0.70
    elif conversion_rate >= 0.15:
        return 0.55
    else:
        return 0.40

async def calculate_streak_score(progress: list) -> float:
    """Calculate activity streak score"""
    # Get activity from last 7 days
    seven_days_ago = datetime.now() - timedelta(days=7)
    activity = await db.user_activity.find({
        "created_at": {"$gte": seven_days_ago}
    }).to_list(100)

    if not activity:
        return 0.5

    # Count unique days with activity
    unique_days = len(set(a["created_at"].strftime("%Y-%m-%d") for a in activity))

    # Score based on days active
    if unique_days >= 7:
        return 1.0
    elif unique_days >= 5:
        return 0.85
    elif unique_days >= 3:
        return 0.70
    elif unique_days >= 1:
        return 0.55
    else:
        return 0.40

async def calculate_ai_usage_score(progress: list) -> float:
    """Calculate AI coach usage score"""
    # Count AI coach interactions in last 7 days
    seven_days_ago = datetime.now() - timedelta(days=7)
    ai_usage = await db.user_activity.find({
        "activity_type": "ai_coach_used",
        "created_at": {"$gte": seven_days_ago}
    }).to_list(100)

    usage_count = len(ai_usage)

    # Score based on usage
    if usage_count >= 10:
        return 1.0
    elif usage_count >= 7:
        return 0.85
    elif usage_count >= 5:
        return 0.70
    elif usage_count >= 3:
        return 0.55
    else:
        return 0.40

async def calculate_quick_wins_score(progress: list) -> float:
    """Calculate quick wins application score"""
    # Count quick wins applied in last 7 days
    seven_days_ago = datetime.now() - timedelta(days=7)
    quick_wins = await db.user_progress.find({
        "content_type": "quick_win",
        "completed": True,
        "created_at": {"$gte": seven_days_ago}
    }).to_list(100)

    applied_count = len(quick_wins)

    # Score based on application
    if applied_count >= 7:
        return 1.0
    elif applied_count >= 5:
        return 0.85
    elif applied_count >= 3:
        return 0.70
    elif applied_count >= 1:
        return 0.55
    else:
        return 0.40

async def calculate_mental_game_score(user_id: str) -> float:
    """Calculate mental game indicators"""
    # For MVP, return baseline score
    # In production, would use more sophisticated metrics
    return 0.7

def calculate_trend(user_id: str) -> str:
    """Calculate performance trend"""
    # For MVP, return stable
    # In production, would calculate based on historical data
    return "stable"

def get_recommendations(readiness_score: float) -> list:
    """Get improvement recommendations based on readiness score"""
    if readiness_score >= 80:
        return [
            "You're doing great! Keep pushing yourself.",
            "Help a teammate who might be struggling.",
            "Try advanced training modules."
        ]
    elif readiness_score >= 60:
        return [
            "Focus on completing more training modules.",
            "Use AI Coach for tough objections.",
            "Build your activity streak."
        ]
    else:
        return [
            "Start with basic training modules.",
            "Use Pre-Tour Mode before each tour.",
            "Ask AI Coach for help with common objections.",
            "Set achievable daily goals."
        ]

async def get_historical_performance(user_id: str) -> dict:
    """Get historical performance data for daily goal generation"""
    # Get tour results from last 30 days
    thirty_days_ago = datetime.now() - timedelta(days=30)
    tours = await db.tour_results.find({
        "user_id": user_id,
        "created_at": {"$gte": thirty_days_ago}
    }).to_list(100)

    if not tours:
        return {"avg_daily_tours": 3, "avg_daily_sales": 0.5}

    total_tours = len(tours)
    closed_deals = sum(1 for t in tours if t.get("outcome") == "sale")

    return {
        "avg_daily_tours": total_tours / 30,
        "avg_daily_sales": closed_deals / 30
    }

async def calculate_readiness_for_user(user_id: str) -> dict:
    """Quick readiness calculation"""
    # For MVP, simplified calculation
    return {
        "score": 65.0,
        "trend": "stable",
        "components": {
            "training": 70.0,
            "performance": 60.0,
            "streak": 65.0,
            "ai_usage": 50.0,
            "quick_wins": 75.0,
            "mental_game": 70.0
        }
    }

def generate_tour_insights(tour_data: TourResultRequest) -> dict:
    """Generate insights based on tour result"""
    insights = []

    if tour_data.outcome == "sale":
        insights.append({
            "type": "success",
            "title": "Congratulations!",
            "message": f"Great job closing! Your confidence improved from {tour_data.confidence_before} to {tour_data.confidence_after}."
        })
    elif tour_data.outcome == "no_sale":
        insights.append({
            "type": "learning",
            "title": "Learning Opportunity",
            "message": f"You handled {tour_data.objections_handled} objection(s). Review AI Coach suggestions for next time."
        })
    else:  # follow_up
        insights.append({
            "type": "opportunity",
            "title": "Follow Up Strategy",
            "message": f"Set clear follow-up expectations and create urgency with time-sensitive offers."
        })

    if tour_data.ai_coach_used:
        insights.append({
            "type": "usage",
            "title": "AI Coach Used",
            "message": "Great job using available resources. Continue leveraging AI Coach for complex objections."
        })

    return insights

async def build_ai_coach_prompt(user_input: str, context: dict) -> str:
    """Build AI Coach prompt with context"""
    system_prompt = """You are an expert vacation club sales coach. Your role is to help sales representatives handle objections and close more deals.

When responding to objections:
1. Acknowledge the concern empathetically
2. Provide 3 different approaches (emotional, logical, story-based)
3. Keep responses concise and actionable
4. Include specific scripts the rep can use
5. Highlight the 'key move' - the most important tactic

Format your response as JSON:
{
    "approaches": [
        {"type": "emotional", "response": "...", "key_move": "..."},
        {"type": "logical", "response": "...", "key_move": "..."},
        {"type": "story", "response": "...", "key_move": "..."}
    ],
    "confidence_score": 0.85,
    "estimated_impact": "high"
}"""

    user_context = f"""
Sales Rep Context:
- Objection: {user_input}
- Tour Stage: {context.get('stage', 'discovery')}
- Client Type: {context.get('client_type', 'unknown')}
- Previous Attempts: {context.get('attempts', 0)}

Provide coaching to help handle this objection effectively."""

    return f"{system_prompt}\n{user_context}"

# ============== MOBILE AUTH ==============

@mobile_router.post("/auth/login")
async def mobile_login(request: MobileLoginRequest):
    """Mobile login with device info"""
    try:
        # Find user
        user = await db.users.find_one({"email": request.email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Verify password (handle both 'password' and 'password_hash' fields)
        import bcrypt
        password_hash = user.get("password", user.get("password_hash", ""))
        if not bcrypt.checkpw(request.password.encode(), password_hash.encode()):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Create session token
        session_token = f"session_{uuid.uuid4().hex}"
        session_doc = {
            "session_token": session_token,
            "user_id": user["user_id"],
            "device_info": request.device_info,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
        }
        await db.user_sessions.insert_one(session_doc)

        # Get user progress - wrap in try/except in case it fails
        try:
            progress = await get_user_progress(user["user_id"])
        except Exception as progress_error:
            print(f"Progress lookup error: {str(progress_error)}")
            progress = None

        # Build response with name field
        first_name = user.get("first_name", "")
        last_name = user.get("last_name", "")
        name = f"{first_name} {last_name}".strip() or user.get("name", user["email"].split("@")[0])

        user_response = {
            "user_id": user["user_id"],
            "email": user["email"],
            "name": name,
            "picture": user.get("picture"),
            "level": user.get("level", 1),
            "points": user.get("points", 0),
            "membership": user.get("membership", "free"),
            "role": user.get("role", "member"),
            "team_id": user.get("team_id"),
            "manager_id": user.get("manager_id"),
            "created_at": user.get("created_at"),
            "session_token": session_token,
            "requires_onboarding": False,
            "progress": progress
        }

        return user_response

    except Exception as e:
        print(f"Mobile login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")

# ============== AI COACH ==============

@mobile_router.post("/ai/coach")
async def generate_coaching_response(request: AICoachRequest):
    """Generate AI coaching response for objection handling"""
    try:
        # Build prompt
        prompt = await build_ai_coach_prompt(request.content, request.context)

        # Call Ollama API
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                OLLAMA_URL,
                json={
                    "model": "llama3.1",
                    "prompt": prompt,
                    "stream": False,
                    "format": "json"
                }
            )

            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="AI service unavailable")

            ai_response = response.json()
            content = ai_response.get("response", "{}")

            # Parse AI response
            import json
            try:
                coaching_data = json.loads(content)
            except json.JSONDecodeError:
                # Fallback if AI returns invalid JSON
                coaching_data = {
                    "approaches": [
                        {
                            "type": "emotional",
                            "response": "I understand your concern. Many of our happiest members felt the same way initially.",
                            "key_move": "Acknowledge and relate"
                        }
                    ],
                    "confidence_score": 0.7,
                    "estimated_impact": "medium"
                }

            return {
                "approaches": coaching_data.get("approaches", []),
                "confidence_score": coaching_data.get("confidence_score", 0.7),
                "estimated_impact": coaching_data.get("estimated_impact", "medium"),
                "timestamp": datetime.now().isoformat()
            }

    except httpx.RequestError as e:
        print(f"Ollama connection error: {str(e)}")
        # Return fallback response
        return {
            "approaches": [
                {
                    "type": "emotional",
                    "response": "I completely understand how you feel. That's a common concern we hear from new members.",
                    "key_move": "Empathize and normalize"
                }
            ],
            "confidence_score": 0.5,
            "estimated_impact": "low",
            "timestamp": datetime.now().isoformat(),
            "fallback": True
        }
    except Exception as e:
        print(f"AI Coach error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate coaching response")

# ============== QUICK WINS ==============

@mobile_router.get("/quick-wins")
async def get_quick_wins(filters: QuickWinFilters = Depends()):
    """Get quick wins library with optional filters"""
    try:
        # Build query
        query = {}
        if filters.category:
            query["category"] = filters.category

        # Get quick wins from Phase 1 collection
        cursor = db.phase1_quick_wins.find(query, {"_id": 0})

        if filters.random:
            # Get random quick wins
            import random
            all_wins = await cursor.to_list(100)
            quick_wins = random.sample(all_wins, min(filters.limit, len(all_wins)))
        else:
            # Limit results
            quick_wins = await cursor.limit(filters.limit).to_list(filters.limit)

        return {
            "quick_wins": quick_wins,
            "total": len(quick_wins),
            "filters_applied": {
                "category": filters.category,
                "limit": filters.limit,
                "random": filters.random
            }
        }

    except Exception as e:
        print(f"Quick wins error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch quick wins")

@mobile_router.post("/quick-wins/{quick_win_id}/favorite")
async def toggle_quick_win_favorite(quick_win_id: str):
    """Toggle quick win as favorite"""
    try:
        # Check if already favorited
        existing = await db.user_favorites.find_one({
            "user_id": "demo_user_id",
            "content_id": quick_win_id
        })

        if existing:
            # Remove favorite
            await db.user_favorites.delete_one({"_id": existing["_id"]})
            return {
                "id": quick_win_id,
                "is_favorite": False,
                "favorite_count": 0
            }
        else:
            # Add favorite
            await db.user_favorites.insert_one({
                "user_id": "demo_user_id",
                "content_id": quick_win_id,
                "content_type": "quick_win",
                "created_at": datetime.now(timezone.utc)
            })
            return {
                "id": quick_win_id,
                "is_favorite": True,
                "favorite_count": 1
            }
    except Exception as e:
        print(f"Favorite toggle error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to toggle favorite")

# ============== PERFORMANCE TRACKING ==============

@mobile_router.get("/performance/readiness")
async def get_readiness_score(user_id: str = Depends(get_user_id_from_token)):
    """Calculate and return readiness score"""
    try:
        # Get user data
        user = await db.users.find_one({"user_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get progress data
        progress = await db.user_progress.find({"user_id": user_id}).to_list(100)

        # Calculate components
        training_score = await calculate_training_score(progress)
        performance_score = await calculate_performance_score(user_id)
        streak_score = await calculate_streak_score(progress)
        ai_usage_score = await calculate_ai_usage_score(progress)
        quick_wins_score = await calculate_quick_wins_score(progress)
        mental_game_score = await calculate_mental_game_score(user_id)

        # Calculate weighted readiness score
        readiness_score = (
            training_score * 0.30 +
            performance_score * 0.25 +
            streak_score * 0.15 +
            ai_usage_score * 0.10 +
            quick_wins_score * 0.10 +
            mental_game_score * 0.10
        )

        return {
            "readiness_score": round(readiness_score, 1),
            "trend": calculate_trend(user_id),
            "components": {
                "training": round(training_score, 1),
                "performance": round(performance_score, 1),
                "streak": round(streak_score, 1),
                "ai_usage": round(ai_usage_score, 1),
                "quick_wins": round(quick_wins_score, 1),
                "mental_game": round(mental_game_score, 1)
            },
            "recommended_actions": get_recommendations(readiness_score),
            "updated_at": datetime.now().isoformat()
        }

    except Exception as e:
        print(f"Readiness score error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to calculate readiness score")

@mobile_router.get("/performance/daily-goal")
async def get_daily_goal(user_id: str = Depends(get_user_id_from_token)):
    """Get or generate daily goals"""
    try:
        # Check if goal exists for today
        today = datetime.now().strftime("%Y-%m-%d")
        existing_goal = await db.daily_goals.find_one({
            "user_id": user_id,
            "date": today
        })

        if existing_goal:
            return {
                "goal_id": str(existing_goal["_id"]),
                "date": existing_goal["date"],
                "targets": existing_goal["targets"],
                "progress": existing_goal.get("progress", {}),
                "status": existing_goal.get("status", "in_progress")
            }

        # Generate new daily goal
        historical = await get_historical_performance(user_id)

        targets = {
            "tours": max(3, int(historical["avg_daily_tours"] * 1.1)),
            "sales": max(1, int(historical["avg_daily_sales"] * 1.1)),
            "ai_coach_uses": 3,
            "quick_wins_applied": 2
        }

        # Create goal document
        goal_doc = {
            "user_id": user_id,
            "date": today,
            "targets": targets,
            "progress": {},
            "status": "in_progress",
            "created_at": datetime.now(timezone.utc)
        }
        result = await db.daily_goals.insert_one(goal_doc)

        return {
            "goal_id": str(result.inserted_id),
            "date": today,
            "targets": targets,
            "progress": {},
            "status": "in_progress"
        }

    except Exception as e:
        print(f"Daily goal error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate daily goal")

@mobile_router.post("/performance/tour")
async def record_tour_result(tour_data: TourResultRequest, user_id: str = Depends(get_user_id_from_token)):
    """Record tour result and update performance metrics"""
    try:
        # Create tour result document
        tour_doc = {
            "user_id": user_id,
            "outcome": tour_data.outcome,
            "duration_minutes": tour_data.duration_minutes,
            "objections_handled": tour_data.objections_handled,
            "ai_coach_used": tour_data.ai_coach_used,
            "confidence_before": tour_data.confidence_before,
            "confidence_after": tour_data.confidence_after,
            "notes": tour_data.notes,
            "client_profile": tour_data.client_profile,
            "created_at": datetime.now(timezone.utc)
        }

        result = await db.tour_results.insert_one(tour_doc)

        # Update daily goal progress
        today = datetime.now().strftime("%Y-%m-%d")
        await db.daily_goals.update_one(
            {
                "user_id": user_id,
                "date": today
            },
            {
                "$inc": {"progress.tours_completed": 1},
                "$set": {"updated_at": datetime.now(timezone.utc)}
            }
        )

        # Generate insights
        insights = generate_tour_insights(tour_data)

        return {
            "tour_id": str(result.inserted_id),
            "outcome": tour_data.outcome,
            "insights": insights,
            "daily_goal_updated": True
        }

    except Exception as e:
        print(f"Tour result error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to record tour result")

# ============== OFFLINE SYNC ==============

@mobile_router.get("/sync/content")
async def sync_offline_content(user_id: str = Depends(get_user_id_from_token)):
    """Sync content for offline mode"""
    try:
        # Get top 20 quick wins for offline cache
        quick_wins = await db.phase1_quick_wins.find(
            {},
            {"_id": 0}
        ).limit(20).to_list(20)

        # Get user favorites
        favorites = await db.user_favorites.find({
            "user_id": user_id,
            "content_type": "quick_win"
        }, {"_id": 0}).to_list(50)

        favorite_ids = [f["content_id"] for f in favorites]

        # Get favorite quick wins details
        favorite_wins = []
        for fav_id in favorite_ids:
            win = await db.phase1_quick_wins.find_one(
                {"id": fav_id},
                {"_id": 0}
            )
            if win:
                favorite_wins.append(win)

        return {
            "quick_wins": quick_wins,
            "favorites": favorite_wins,
            "last_sync": datetime.now().isoformat(),
            "next_sync": (datetime.now() + timedelta(hours=1)).isoformat(),
            "content": {
                "added_content": quick_wins,
                "updated_content": [],
                "deleted_content": [],
                "server_time": datetime.now().isoformat(),
                "next_sync": (datetime.now() + timedelta(hours=1)).isoformat()
            }
        }

    except Exception as e:
        print(f"Sync error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to sync content")
