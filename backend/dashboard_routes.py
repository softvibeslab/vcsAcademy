"""
MVP Lite Dashboard Routes
Endpoints for Strategy Panel, Daily Performance, Training Sessions, and Coaching
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
import os

# Get db and User from server module (will be imported when loaded)
# We'll use a dependency to get these from the app state

dashboard_router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# Helper function to get db from app state
async def get_db(request: Request):
    return request.app.state.db

# Helper function to get user from app state
async def get_user(request: Request):
    return request.app.state.user

# ============== MODELS ==============

class MonthlyObjective(BaseModel):
    target_income: float
    current_income: float
    progress: float
    days_remaining: int

class KeyMetrics(BaseModel):
    sales_trend: str
    achievements: int
    action_items: int
    conversion_rate: int

class WeeklyHighlight(BaseModel):
    id: int
    title: str
    impact: str  # "positive" or "negative"

class UpcomingEvent(BaseModel):
    id: int
    title: str
    date: str
    type: str  # "group-coaching", "roleplay", "qa", "webinar", "live"

class StrategyResponse(BaseModel):
    monthly_objective: MonthlyObjective
    key_metrics: KeyMetrics
    weekly_highlights: List[WeeklyHighlight]
    upcoming_events: List[UpcomingEvent]

class Tour(BaseModel):
    id: int
    time: str
    outcome: str  # "Sale", "No Sale", "Follow Up"
    volume: float
    duration: int

class DailyGoal(BaseModel):
    tours_target: int
    sales_target: int
    volume_target: float

class PerformanceResponse(BaseModel):
    date: str
    tours_completed: int
    sales_count: int
    total_volume: float
    avg_deal_size: float
    conversion_rate: int
    active_hours: int
    tours: List[Tour]
    daily_goal: DailyGoal

class TourCreate(BaseModel):
    time: str
    outcome: str
    volume: float
    duration: int

class TrainingModule(BaseModel):
    id: int
    title: str
    video_url: str
    duration: str
    difficulty: str
    category: str
    description: str
    key_takeaway: str
    completed: bool

class SessionResource(BaseModel):
    id: int
    title: str
    type: str  # "pdf", "ebook", "template", "checklist"
    file_size: int
    page_count: Optional[int] = None

class RelatedSession(BaseModel):
    id: str
    title: str
    category: str

class SessionDetailResponse(BaseModel):
    id: str
    title: str
    category: str
    duration: str
    difficulty: str
    video_url: str
    key_takeaway: str
    description: str
    instructor: Optional[str] = None
    points: int
    modules_count: int
    completed_modules: int
    completed: bool
    related_sessions: List[RelatedSession]
    resources: List[SessionResource]

class CoachingSession(BaseModel):
    id: int
    title: str
    description: str
    instructor: str
    date: str
    time: str
    duration: str
    location: str
    type: str  # "group-coaching", "roleplay", "qa"
    registered: bool
    attendees: int
    max_attendees: Optional[int] = None
    recording_available: bool
    topics: Optional[List[str]] = None
    skill_focus: Optional[List[str]] = None
    format: Optional[str] = None
    level: Optional[str] = None
    upcoming_questions: Optional[List[str]] = None
    answered_count: Optional[int] = None
    rating: Optional[float] = None
    scenario: Optional[str] = None

# ============== STRATEGY ENDPOINTS ==============

@dashboard_router.get("/strategy", response_model=StrategyResponse)
async def get_strategy(
    request: Request,
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """
    Get strategy panel data including:
    - Monthly objectives (target vs current income)
    - Key metrics (sales trend, achievements, action items, conversion rate)
    - Weekly highlights
    - Upcoming events
    """
    user_id = user.user_id

    # Try to get from database first
    strategy_data = await db.dashboard_strategy.find_one({"user_id": user_id})

    if strategy_data:
        # Remove MongoDB _id
        strategy_data.pop("_id", None)
        return StrategyResponse(**strategy_data)

    # Return demo data if not in database
    today = datetime.now(timezone.utc)
    month_end = (today.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)
    days_remaining = (month_end - today).days

    return StrategyResponse(
        monthly_objective=MonthlyObjective(
            target_income=15000.0,
            current_income=9750.0,
            progress=65.0,
            days_remaining=days_remaining
        ),
        key_metrics=KeyMetrics(
            sales_trend="+15%",
            achievements=12,
            action_items=5,
            conversion_rate=22
        ),
        weekly_highlights=[
            WeeklyHighlight(id=1, title="Closed 3 deals this week", impact="positive"),
            WeeklyHighlight(id=2, title="Completed Value Architecture module", impact="positive"),
            WeeklyHighlight(id=3, title="Avg deal size increased by $200", impact="positive")
        ],
        upcoming_events=[
            UpcomingEvent(
                id=1,
                title="Group Coaching: Advanced Closing",
                date="Tomorrow, 2 PM",
                type="group-coaching"
            ),
            UpcomingEvent(
                id=2,
                title="Role Play Session",
                date="Friday, 3 PM",
                type="roleplay"
            )
        ]
    )

@dashboard_router.put("/strategy")
async def update_strategy(
    request: Request,
    data: Dict[str, Any],
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """
    Update strategy data (e.g., update monthly objective)
    """
    user_id = user.user_id

    # Update or insert strategy data
    await db.dashboard_strategy.update_one(
        {"user_id": user_id},
        {"$set": {**data, "user_id": user_id, "updated_at": datetime.now(timezone.utc)}},
        upsert=True
    )

    return {"success": True, "message": "Strategy updated"}

# ============== PERFORMANCE ENDPOINTS ==============

@dashboard_router.get("/performance", response_model=PerformanceResponse)
async def get_performance(
    request: Request,
    date: Optional[str] = None,
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """
    Get daily performance data for a specific date
    If date not provided, returns today's data
    """
    user_id = user.user_id

    # Use provided date or today
    query_date = date if date else datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # Try to get from database
    performance_data = await db.dashboard_performance.find_one({
        "user_id": user_id,
        "date": query_date
    })

    if performance_data:
        performance_data.pop("_id", None)
        return PerformanceResponse(**performance_data)

    # Return demo data
    return PerformanceResponse(
        date=query_date,
        tours_completed=3,
        sales_count=1,
        total_volume=4500.0,
        avg_deal_size=4500.0,
        conversion_rate=33,
        active_hours=6,
        tours=[
            Tour(id=1, time="10:00 AM", outcome="Sale", volume=4500.0, duration=45),
            Tour(id=2, time="11:30 AM", outcome="No Sale", volume=0.0, duration=30),
            Tour(id=3, time="2:00 PM", outcome="No Sale", volume=0.0, duration=35)
        ],
        daily_goal=DailyGoal(
            tours_target=5,
            sales_target=2,
            volume_target=8000.0
        )
    )

@dashboard_router.post("/performance/tour")
async def add_tour(
    request: Request,
    tour: TourCreate,
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """
    Log a new tour for daily performance tracking
    """
    user_id = user.user_id

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # Get existing performance data or create new
    performance_data = await db.dashboard_performance.find_one({
        "user_id": user_id,
        "date": today
    })

    if performance_data:
        # Add new tour
        tours = performance_data.get("tours", [])
        new_tour = Tour(
            id=len(tours) + 1,
            time=tour.time,
            outcome=tour.outcome,
            volume=tour.volume,
            duration=tour.duration
        )
        tours.append(new_tour.dict())

        # Recalculate stats
        tours_completed = len(tours)
        sales_count = len([t for t in tours if t["outcome"] == "Sale"])
        total_volume = sum([t["volume"] for t in tours])
        avg_deal_size = total_volume / sales_count if sales_count > 0 else 0
        conversion_rate = int((sales_count / tours_completed * 100)) if tours_completed > 0 else 0

        await db.dashboard_performance.update_one(
            {"user_id": user_id, "date": today},
            {
                "$set": {
                    "tours": tours,
                    "tours_completed": tours_completed,
                    "sales_count": sales_count,
                    "total_volume": total_volume,
                    "avg_deal_size": avg_deal_size,
                    "conversion_rate": conversion_rate,
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )
    else:
        # Create new performance record
        new_tour = Tour(
            id=1,
            time=tour.time,
            outcome=tour.outcome,
            volume=tour.volume,
            duration=tour.duration
        )

        sales_count = 1 if tour.outcome == "Sale" else 0
        conversion_rate = 100 if tour.outcome == "Sale" else 0

        await db.dashboard_performance.insert_one({
            "user_id": user_id,
            "date": today,
            "tours_completed": 1,
            "sales_count": sales_count,
            "total_volume": tour.volume,
            "avg_deal_size": tour.volume,
            "conversion_rate": conversion_rate,
            "active_hours": 0,
            "tours": [new_tour.dict()],
            "daily_goal": {
                "tours_target": 5,
                "sales_target": 2,
                "volume_target": 8000.0
            },
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        })

    return {"success": True, "message": "Tour logged successfully"}

# ============== TRAINING ENDPOINTS ==============

@dashboard_router.get("/training/session/{session_id}", response_model=SessionDetailResponse)
async def get_session_detail(
    request: Request,
    session_id: str,
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """
    Get detailed information about a training session
    """
    user_id = user.user_id

    # Try to get from database
    session_data = await db.training_sessions.find_one({"session_id": session_id})

    # Check if user completed this session
    completed = await db.user_progress.find_one({
        "user_id": user_id,
        "content_id": session_id,
        "content_type": "training_session"
    }) is not None

    if session_data:
        session_data.pop("_id", None)
        session_data["completed"] = completed
        return SessionDetailResponse(**session_data)

    # Return demo data
    return SessionDetailResponse(
        id=session_id,
        title=f"Session {session_id.split('-')[-1]}: Foundation of Sales Excellence",
        category="Mindset",
        duration="45 min",
        difficulty="beginner",
        video_url="https://www.youtube.com/embed/dQw4w9WgXcQ",
        key_takeaway="Adopt the champion mindset before every tour - visualize success",
        description="Learn the foundational principles that separate top producers from average sales representatives.",
        instructor="Maria Garcia",
        points=10,
        modules_count=6,
        completed_modules=0,
        completed=completed,
        related_sessions=[
            RelatedSession(id="session-2", title="Session 2: Discovery & Control", category="Discovery"),
            RelatedSession(id="session-3", title="Session 3: Value Architecture", category="Value")
        ],
        resources=[
            SessionResource(
                id=1,
                title="Session Workbook",
                type="pdf",
                file_size=2500000,
                page_count=15
            ),
            SessionResource(
                id=2,
                title="Goal Setting Template",
                type="template",
                file_size=500000
            )
        ]
    )

@dashboard_router.post("/training/session/{session_id}/complete")
async def mark_session_complete(
    request: Request,
    session_id: str,
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """
    Mark a training session as completed
    """
    user_id = user.user_id

    # Check if already completed
    existing = await db.user_progress.find_one({
        "user_id": user_id,
        "content_id": session_id,
        "content_type": "training_session"
    })

    if existing:
        return {"success": True, "message": "Already completed", "points": existing.get("points", 10)}

    # Mark as complete
    await db.user_progress.insert_one({
        "user_id": user_id,
        "content_id": session_id,
        "content_type": "training_session",
        "completed": True,
        "points": 10,
        "completed_at": datetime.now(timezone.utc)
    })

    # Update user points
    await db.users.update_one(
        {"user_id": user_id},
        {"$inc": {"points": 10}}
    )

    return {"success": True, "message": "Session marked as complete", "points": 10}

# ============== COACHING ENDPOINTS ==============

@dashboard_router.get("/coaching/events")
async def get_coaching_events(
    request: Request,
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """
    Get all coaching events (group, roleplay, qa)
    """
    user_id = user.user_id

    # Try to get from database
    events = await db.coaching_events.find({"user_id": user_id}).to_list(100)

    if events:
        for event in events:
            event.pop("_id", None)
        return [CoachingSession(**e) for e in events]

    # Return demo data
    return [
        CoachingSession(
            id=1,
            title="Advanced Closing Techniques Masterclass",
            description="Learn advanced closing techniques used by top producers",
            instructor="Maria Garcia",
            date="2026-04-15",
            time="2:00 PM EST",
            duration="90 min",
            location="Zoom",
            type="group-coaching",
            registered=True,
            attendees=45,
            max_attendees=100,
            recording_available=False,
            topics=["Handling objections", "Closing techniques", "Follow-up strategies"],
            rating=4.9
        ),
        CoachingSession(
            id=2,
            title="Role Play: Handling Price Objections",
            description="Practice handling price objections in real-time scenarios",
            instructor="John Smith",
            date="2026-04-16",
            time="3:00 PM EST",
            duration="60 min",
            location="Zoom",
            type="roleplay",
            registered=False,
            attendees=20,
            max_attendees=30,
            recording_available=False,
            skill_focus=["Objection handling", "Value building", "Confidence"],
            format="Small group practice",
            level="intermediate"
        ),
        CoachingSession(
            id=3,
            title="Q&A Session: Overcoming Sales Slumps",
            description="Get your questions answered about overcoming sales slumps",
            instructor="Sarah Johnson",
            date="2026-04-10",
            time="4:00 PM EST",
            duration="45 min",
            location="Zoom",
            type="qa",
            registered=True,
            attendees=60,
            recording_available=True,
            upcoming_questions=[
                "How to handle 'I need to think about it?'",
                "Best approach for follow-up calls?",
                "Dealing with competitive comparisons"
            ],
            answered_count=156
        )
    ]

async def register_for_event(
    request: Request,
    event_id: int,
    db: Any,
    user: Any
):
    """
    Register user for a coaching event (helper function)
    """
    user_id = user.user_id

    # Update event registration
    result = await db.coaching_events.update_one(
        {"id": event_id, "user_id": user_id},
        {
            "$set": {
                "registered": True,
                "registered_at": datetime.now(timezone.utc)
            }
        }
    )

    if result.matched_count == 0:
        # Event doesn't exist for this user, create it
        await db.coaching_events.insert_one({
            "id": event_id,
            "user_id": user_id,
            "registered": True,
            "registered_at": datetime.now(timezone.utc),
            "created_at": datetime.now(timezone.utc)
        })

    return {"success": True, "message": "Registered for event"}

@dashboard_router.post("/coaching/events/{event_id}/register")
async def register_for_event_endpoint(
    request: Request,
    event_id: int,
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """
    Register user for a coaching event (endpoint)
    """
    return await register_for_event(request, event_id, db, user)

@dashboard_router.get("/coaching/group")
async def get_group_coaching(
    request: Request,
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """
    Get group coaching sessions
    """
    user_id = user.user_id

    events = await db.coaching_events.find({
        "user_id": user_id,
        "type": "group-coaching"
    }).to_list(100)

    if events:
        for event in events:
            event.pop("_id", None)
        return [CoachingSession(**e) for e in events]

    # Return demo data
    return [
        CoachingSession(
            id=1,
            title="Advanced Closing Techniques",
            description="Master the art of closing with proven techniques from top producers",
            instructor="Maria Garcia",
            date="2026-04-15",
            time="2:00 PM EST",
            duration="90 min",
            location="Zoom",
            type="group-coaching",
            registered=True,
            attendees=45,
            max_attendees=100,
            recording_available=False,
            topics=["Handling objections", "Closing techniques", "Follow-up strategies"],
            rating=4.9
        )
    ]

@dashboard_router.get("/coaching/roleplay")
async def get_roleplay_sessions(
    request: Request,
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """
    Get role play sessions
    """
    user_id = user.user_id

    events = await db.coaching_events.find({
        "user_id": user_id,
        "type": "roleplay"
    }).to_list(100)

    if events:
        for event in events:
            event.pop("_id", None)
        return [CoachingSession(**e) for e in events]

    # Return demo data
    return [
        CoachingSession(
            id=1,
            title="Handling Price Objections",
            scenario="Practice responding to \"it's too expensive\" objections using value-building techniques",
            instructor="Maria Garcia",
            date="2026-04-16",
            time="3:00 PM EST",
            duration="60 min",
            location="Zoom",
            type="roleplay",
            registered=True,
            attendees=12,
            max_attendees=20,
            recording_available=False,
            skill_focus=["Objection handling", "Value building", "Confidence"],
            format="Small group practice",
            level="intermediate"
        )
    ]

@dashboard_router.get("/coaching/qa")
async def get_qa_sessions(
    request: Request,
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """
    Get Q&A sessions
    """
    user_id = user.user_id

    events = await db.coaching_events.find({
        "user_id": user_id,
        "type": "qa"
    }).to_list(100)

    if events:
        for event in events:
            event.pop("_id", None)
        return [CoachingSession(**e) for e in events]

    # Return demo data
    return [
        CoachingSession(
            id=1,
            title="Open Q&A: Ask Me Anything",
            topic="Get your questions answered about any sales challenge",
            instructor="Maria Garcia",
            date="2026-04-17",
            time="4:00 PM EST",
            duration="60 min",
            location="Zoom",
            type="qa",
            registered=True,
            attendees=32,
            recording_available=False,
            upcoming_questions=[
                "How to handle 'I need to think about it?'",
                "Best approach for follow-up calls?",
                "Dealing with competitive comparisons"
            ],
            answered_count=156
        )
    ]

@dashboard_router.post("/coaching/qa/question")
async def submit_qa_question(
    request: Request,
    data: Dict[str, str],
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """
    Submit a question for Q&A sessions
    """
    user_id = user.user_id

    question = data.get("question", "")

    if not question:
        raise HTTPException(status_code=400, detail="Question is required")

    # Store question
    await db.qa_questions.insert_one({
        "user_id": user_id,
        "question": question,
        "created_at": datetime.now(timezone.utc),
        "answered": False
    })

    return {"success": True, "message": "Question submitted"}

@dashboard_router.post("/coaching/group/{session_id}/register")
async def register_group_session(
    request: Request,
    session_id: int,
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """Register for group coaching session"""
    return await register_for_event(request, session_id, db, user)

@dashboard_router.post("/coaching/roleplay/{session_id}/register")
async def register_roleplay_session(
    request: Request,
    session_id: int,
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """Register for role play session"""
    return await register_for_event(request, session_id, db, user)

@dashboard_router.post("/coaching/qa/{session_id}/register")
async def register_qa_session(
    request: Request,
    session_id: int,
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    """Register for Q&A session"""
    return await register_for_event(request, session_id, db, user)
