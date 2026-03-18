from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, Response
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', 'sk_test_your_stripe_key')

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============== SENTRY MONITORING ==============
try:
    from sentry_config import init_sentry, capture_exception, set_user, add_breadcrumb

    sentry_enabled = init_sentry(
        dsn=os.environ.get('SENTRY_DSN'),
        environment=os.environ.get('SENTRY_ENVIRONMENT', 'development'),
        traces_sample_rate=float(os.environ.get('SENTRY_TRACES_SAMPLE_RATE', '0.1')),
        profiles_sample_rate=float(os.environ.get('SENTRY_PROFILES_SAMPLE_RATE', '0.1')),
        debug=os.environ.get('SENTRY_ENVIRONMENT', 'development') == 'development',
    )

    if sentry_enabled:
        logger.info("Sentry error tracking enabled")
    else:
        logger.info("Sentry not configured - Running without error tracking")

except ImportError:
    logger.warning("sentry-sdk not installed - Run: pip install sentry-sdk[fastapi]")
    sentry_enabled = False
except Exception as e:
    logger.error(f"Failed to initialize Sentry: {e}")
    sentry_enabled = False

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============== MODELS ==============

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    level: int = 1
    points: int = 0
    membership: str = "free"  # free or vip
    role: str = "member"  # member or admin
    created_at: datetime

class UserPublic(BaseModel):
    user_id: str
    name: str
    picture: Optional[str] = None
    level: int = 1
    membership: str = "free"

class Course(BaseModel):
    model_config = ConfigDict(extra="ignore")
    course_id: str
    title: str
    description: str
    thumbnail: str
    category: str  # course, masterclass, workshop, interview
    min_level: int = 1
    vip_only: bool = False
    lessons: List[str] = []
    created_at: datetime
    created_by: str

class CourseCreate(BaseModel):
    title: str
    description: str
    thumbnail: str
    category: str
    min_level: int = 1
    vip_only: bool = False

class Lesson(BaseModel):
    model_config = ConfigDict(extra="ignore")
    lesson_id: str
    course_id: str
    title: str
    description: str
    video_url: str
    duration: int  # minutes
    order: int
    created_at: datetime

class LessonCreate(BaseModel):
    course_id: str
    title: str
    description: str
    video_url: str
    duration: int
    order: int

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    event_id: str
    title: str
    description: str
    speaker: str
    speaker_image: Optional[str] = None
    event_type: str  # masterclass, workshop, interview
    start_time: datetime
    join_link: Optional[str] = None
    recording_url: Optional[str] = None
    vip_only: bool = False
    created_at: datetime

class EventCreate(BaseModel):
    title: str
    description: str
    speaker: str
    speaker_image: Optional[str] = None
    event_type: str
    start_time: datetime
    join_link: Optional[str] = None
    vip_only: bool = False

class Post(BaseModel):
    model_config = ConfigDict(extra="ignore")
    post_id: str
    user_id: str
    user_name: str
    user_picture: Optional[str] = None
    content: str
    likes: List[str] = []
    comments_count: int = 0
    pinned: bool = False
    created_at: datetime

class PostCreate(BaseModel):
    content: str

class Comment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    comment_id: str
    post_id: str
    user_id: str
    user_name: str
    user_picture: Optional[str] = None
    content: str
    created_at: datetime

class CommentCreate(BaseModel):
    post_id: str
    content: str

class Resource(BaseModel):
    model_config = ConfigDict(extra="ignore")
    resource_id: str
    title: str
    description: str
    resource_type: str  # framework, script, case_study, tool, template
    category: str  # discovery, closing, objections, etc
    content: Optional[str] = None  # Text content OR
    file_url: Optional[str] = None  # URL to PDF/downloadable
    file_type: Optional[str] = None  # pdf, docx, xlsx, etc
    tags: List[str] = []
    related_content: List[str] = []  # Links to modules/breakdowns
    difficulty: str = "beginner"  # beginner, intermediate, advanced
    usage_count: int = 0  # Popularity tracking
    created_by: Optional[str] = None  # User ID (admin)
    created_at: datetime

class ResourceCreate(BaseModel):
    title: str
    description: str
    resource_type: str
    category: str
    content: Optional[str] = None
    file_url: Optional[str] = None
    file_type: Optional[str] = None
    tags: List[str] = []
    related_content: List[str] = []
    difficulty: str = "beginner"
    vip_only: bool = False

class UserProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    progress_id: str
    user_id: str
    lesson_id: str
    course_id: str
    completed: bool = False
    completed_at: Optional[datetime] = None

# ============== COACHING MODELS ==============

class CoachingHost(BaseModel):
    name: str
    bio: str
    avatar_url: Optional[str] = None

class CoachingSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: str
    title: str
    description: str
    session_type: str  # group, q&a, strategy_review
    scheduled_date: datetime
    duration_minutes: int
    host: CoachingHost
    meeting_link: str
    meeting_password: Optional[str] = None
    max_attendees: Optional[int] = None
    attendees: List[str] = []
    recording_url: Optional[str] = None
    slides_url: Optional[str] = None
    topics: List[str] = []
    status: str  # scheduled, live, completed, cancelled
    created_at: datetime
    updated_at: Optional[datetime] = None

class CoachingSessionCreate(BaseModel):
    title: str
    description: str
    session_type: str
    scheduled_date: datetime
    duration_minutes: int = 60
    host: CoachingHost
    meeting_link: str
    meeting_password: Optional[str] = None
    max_attendees: Optional[int] = None
    slides_url: Optional[str] = None
    topics: List[str] = []

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    transaction_id: str
    user_id: str
    session_id: str
    amount: float
    currency: str
    package_type: str
    payment_status: str
    created_at: datetime
    updated_at: datetime

# ============== AUTH HELPERS ==============

async def get_current_user(request: Request) -> Optional[User]:
    """Get current user from session token cookie or Authorization header"""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        return None
    
    session_doc = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session_doc:
        return None
    
    expires_at = session_doc.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None
    
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        return None
    
    if isinstance(user_doc.get("created_at"), str):
        user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])
    
    return User(**user_doc)

async def require_auth(request: Request) -> User:
    """Require authentication"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

async def require_admin(request: Request) -> User:
    """Require admin role"""
    user = await require_auth(request)
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ============== AUTH ROUTES ==============

@api_router.post("/auth/register")
async def register(data: UserCreate, response: Response):
    """Register with email/password"""
    existing = await db.users.find_one({"email": data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    hashed_password = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    
    user_doc = {
        "user_id": user_id,
        "email": data.email,
        "name": data.name,
        "picture": None,
        "password_hash": hashed_password,
        "level": 1,
        "points": 0,
        "membership": "free",
        "role": "member",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    session_token = f"session_{uuid.uuid4().hex}"
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_doc)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    del user_doc["password_hash"]
    user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])
    return User(**user_doc)

@api_router.post("/auth/login")
async def login(data: UserLogin, response: Response):
    """Login with email/password"""
    user_doc = await db.users.find_one({"email": data.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.checkpw(data.password.encode(), user_doc.get("password_hash", "").encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    session_token = f"session_{uuid.uuid4().hex}"
    session_doc = {
        "user_id": user_doc["user_id"],
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_doc)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    del user_doc["password_hash"]
    if isinstance(user_doc.get("created_at"), str):
        user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])
    return User(**user_doc)

@api_router.post("/auth/session")
async def process_google_session(request: Request, response: Response):
    """Process Google OAuth session"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    async with httpx.AsyncClient() as client:
        # OAuth session data endpoint - To be configured with your OAuth provider
        resp = await client.get(
            f"{os.environ.get('OAUTH_BACKEND_URL', 'http://localhost:8000')}/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        google_data = resp.json()
    
    user_doc = await db.users.find_one({"email": google_data["email"]}, {"_id": 0})
    
    if user_doc:
        await db.users.update_one(
            {"email": google_data["email"]},
            {"$set": {"name": google_data["name"], "picture": google_data.get("picture")}}
        )
        user_id = user_doc["user_id"]
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_doc = {
            "user_id": user_id,
            "email": google_data["email"],
            "name": google_data["name"],
            "picture": google_data.get("picture"),
            "level": 1,
            "points": 0,
            "membership": "free",
            "role": "member",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user_doc)
    
    session_token = f"session_{uuid.uuid4().hex}"
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_doc)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    if isinstance(user_doc.get("created_at"), str):
        user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])
    return User(**user_doc)

@api_router.get("/auth/me")
async def get_me(user: User = Depends(require_auth)):
    """Get current user"""
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out"}

# ============== COURSES ROUTES ==============

@api_router.get("/courses", response_model=List[Course])
async def get_courses(category: Optional[str] = None, user: User = Depends(require_auth)):
    """Get all courses user has access to"""
    query = {}
    if category:
        query["category"] = category
    
    courses = await db.courses.find(query, {"_id": 0}).to_list(100)
    
    # Filter by access level
    accessible = []
    for course in courses:
        if isinstance(course.get("created_at"), str):
            course["created_at"] = datetime.fromisoformat(course["created_at"])
        if course.get("vip_only") and user.membership != "vip":
            continue
        if course.get("min_level", 1) > user.level:
            continue
        accessible.append(Course(**course))
    
    return accessible

@api_router.get("/courses/{course_id}")
async def get_course(course_id: str, user: User = Depends(require_auth)):
    """Get course with lessons"""
    course = await db.courses.find_one({"course_id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if course.get("vip_only") and user.membership != "vip":
        raise HTTPException(status_code=403, detail="VIP membership required")
    if course.get("min_level", 1) > user.level:
        raise HTTPException(status_code=403, detail=f"Level {course['min_level']} required")
    
    lessons = await db.lessons.find({"course_id": course_id}, {"_id": 0}).sort("order", 1).to_list(50)
    for lesson in lessons:
        if isinstance(lesson.get("created_at"), str):
            lesson["created_at"] = datetime.fromisoformat(lesson["created_at"])
    
    if isinstance(course.get("created_at"), str):
        course["created_at"] = datetime.fromisoformat(course["created_at"])
    
    # Get user progress
    progress = await db.user_progress.find(
        {"user_id": user.user_id, "course_id": course_id},
        {"_id": 0}
    ).to_list(100)
    completed_lessons = [p["lesson_id"] for p in progress if p.get("completed")]
    
    return {
        "course": Course(**course),
        "lessons": [Lesson(**l) for l in lessons],
        "completed_lessons": completed_lessons
    }

@api_router.post("/courses", response_model=Course)
async def create_course(data: CourseCreate, user: User = Depends(require_admin)):
    """Create course (admin only)"""
    course_id = f"course_{uuid.uuid4().hex[:12]}"
    course_doc = {
        "course_id": course_id,
        **data.model_dump(),
        "lessons": [],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_by": user.user_id
    }
    await db.courses.insert_one(course_doc)
    course_doc["created_at"] = datetime.fromisoformat(course_doc["created_at"])
    return Course(**course_doc)

@api_router.post("/lessons", response_model=Lesson)
async def create_lesson(data: LessonCreate, user: User = Depends(require_admin)):
    """Create lesson (admin only)"""
    lesson_id = f"lesson_{uuid.uuid4().hex[:12]}"
    lesson_doc = {
        "lesson_id": lesson_id,
        **data.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.lessons.insert_one(lesson_doc)
    
    await db.courses.update_one(
        {"course_id": data.course_id},
        {"$push": {"lessons": lesson_id}}
    )
    
    lesson_doc["created_at"] = datetime.fromisoformat(lesson_doc["created_at"])
    return Lesson(**lesson_doc)

@api_router.post("/lessons/{lesson_id}/complete")
async def complete_lesson(lesson_id: str, user: User = Depends(require_auth)):
    """Mark lesson as completed"""
    lesson = await db.lessons.find_one({"lesson_id": lesson_id}, {"_id": 0})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    existing = await db.user_progress.find_one(
        {"user_id": user.user_id, "lesson_id": lesson_id},
        {"_id": 0}
    )
    
    if not existing:
        progress_doc = {
            "progress_id": f"progress_{uuid.uuid4().hex[:12]}",
            "user_id": user.user_id,
            "lesson_id": lesson_id,
            "course_id": lesson["course_id"],
            "completed": True,
            "completed_at": datetime.now(timezone.utc).isoformat()
        }
        await db.user_progress.insert_one(progress_doc)
        
        # Award points
        await db.users.update_one(
            {"user_id": user.user_id},
            {"$inc": {"points": 10}}
        )
        
        # Check for level up
        updated_user = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
        new_level = 1 + (updated_user.get("points", 0) // 100)
        if new_level > updated_user.get("level", 1):
            await db.users.update_one(
                {"user_id": user.user_id},
                {"$set": {"level": min(new_level, 5)}}
            )
    
    return {"message": "Lesson completed", "points_earned": 10}

# ============== EVENTS ROUTES ==============

@api_router.get("/events", response_model=List[Event])
async def get_events(user: User = Depends(require_auth)):
    """Get upcoming events"""
    events = await db.events.find({}, {"_id": 0}).sort("start_time", 1).to_list(50)
    
    accessible = []
    for event in events:
        if isinstance(event.get("start_time"), str):
            event["start_time"] = datetime.fromisoformat(event["start_time"])
        if isinstance(event.get("created_at"), str):
            event["created_at"] = datetime.fromisoformat(event["created_at"])
        if event.get("vip_only") and user.membership != "vip":
            event["join_link"] = None  # Hide link for non-VIP
        accessible.append(Event(**event))
    
    return accessible

@api_router.get("/events/{event_id}")
async def get_event(event_id: str, user: User = Depends(require_auth)):
    """Get event details"""
    event = await db.events.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if isinstance(event.get("start_time"), str):
        event["start_time"] = datetime.fromisoformat(event["start_time"])
    if isinstance(event.get("created_at"), str):
        event["created_at"] = datetime.fromisoformat(event["created_at"])
    
    if event.get("vip_only") and user.membership != "vip":
        event["join_link"] = None
    
    return Event(**event)

@api_router.post("/events", response_model=Event)
async def create_event(data: EventCreate, user: User = Depends(require_admin)):
    """Create event (admin only)"""
    event_id = f"event_{uuid.uuid4().hex[:12]}"
    event_doc = {
        "event_id": event_id,
        **data.model_dump(),
        "start_time": data.start_time.isoformat(),
        "recording_url": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.events.insert_one(event_doc)
    event_doc["start_time"] = datetime.fromisoformat(event_doc["start_time"])
    event_doc["created_at"] = datetime.fromisoformat(event_doc["created_at"])
    return Event(**event_doc)

# ============== COMMUNITY ROUTES ==============

@api_router.get("/posts", response_model=List[Post])
async def get_posts(user: User = Depends(require_auth)):
    """Get community posts"""
    posts = await db.posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    
    result = []
    for post in posts:
        if isinstance(post.get("created_at"), str):
            post["created_at"] = datetime.fromisoformat(post["created_at"])
        result.append(Post(**post))
    
    return result

@api_router.post("/posts", response_model=Post)
async def create_post(data: PostCreate, user: User = Depends(require_auth)):
    """Create post"""
    post_id = f"post_{uuid.uuid4().hex[:12]}"
    post_doc = {
        "post_id": post_id,
        "user_id": user.user_id,
        "user_name": user.name,
        "user_picture": user.picture,
        "content": data.content,
        "likes": [],
        "comments_count": 0,
        "pinned": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.posts.insert_one(post_doc)
    
    # Award points for posting
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$inc": {"points": 5}}
    )
    
    post_doc["created_at"] = datetime.fromisoformat(post_doc["created_at"])
    return Post(**post_doc)

@api_router.post("/posts/{post_id}/like")
async def toggle_like(post_id: str, user: User = Depends(require_auth)):
    """Toggle like on post"""
    post = await db.posts.find_one({"post_id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    likes = post.get("likes", [])
    if user.user_id in likes:
        likes.remove(user.user_id)
        liked = False
    else:
        likes.append(user.user_id)
        liked = True
    
    await db.posts.update_one({"post_id": post_id}, {"$set": {"likes": likes}})
    return {"liked": liked, "likes_count": len(likes)}

@api_router.get("/posts/{post_id}/comments", response_model=List[Comment])
async def get_comments(post_id: str, user: User = Depends(require_auth)):
    """Get comments for post"""
    comments = await db.comments.find({"post_id": post_id}, {"_id": 0}).sort("created_at", 1).to_list(100)
    
    result = []
    for comment in comments:
        if isinstance(comment.get("created_at"), str):
            comment["created_at"] = datetime.fromisoformat(comment["created_at"])
        result.append(Comment(**comment))
    
    return result

@api_router.post("/comments", response_model=Comment)
async def create_comment(data: CommentCreate, user: User = Depends(require_auth)):
    """Create comment"""
    comment_id = f"comment_{uuid.uuid4().hex[:12]}"
    comment_doc = {
        "comment_id": comment_id,
        "post_id": data.post_id,
        "user_id": user.user_id,
        "user_name": user.name,
        "user_picture": user.picture,
        "content": data.content,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.comments.insert_one(comment_doc)
    
    await db.posts.update_one(
        {"post_id": data.post_id},
        {"$inc": {"comments_count": 1}}
    )
    
    # Award points
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$inc": {"points": 3}}
    )
    
    comment_doc["created_at"] = datetime.fromisoformat(comment_doc["created_at"])
    return Comment(**comment_doc)

# ============== RESOURCES ROUTES ==============

@api_router.get("/resources", response_model=List[Resource])
async def get_resources(
    type: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = "newest",
    user: User = Depends(require_auth)
):
    """
    Get resources with enhanced filtering and search

    Filters:
    - type: framework, script, case_study, tool, template
    - category: discovery, closing, objections, etc
    - search: Full-text search in title and description
    - sort: newest, popular, a_z
    """
    query = {}

    if type:
        query["resource_type"] = type
    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$in": [search]}}
        ]

    # Determine sort order
    sort_field = "created_at"
    sort_direction = -1  # descending (newest first)
    if sort == "popular":
        sort_field = "usage_count"
        sort_direction = -1
    elif sort == "a_z":
        sort_field = "title"
        sort_direction = 1

    resources = await db.resources.find(query, {"_id": 0}).sort(sort_field, sort_direction).to_list(100)

    accessible = []
    for resource in resources:
        if isinstance(resource.get("created_at"), str):
            resource["created_at"] = datetime.fromisoformat(resource["created_at"])
        accessible.append(Resource(**resource))

    return accessible

@api_router.get("/resources/{resource_id}", response_model=Resource)
async def get_resource(resource_id: str, user: User = Depends(require_auth)):
    """Get single resource with details"""
    resource = await db.resources.find_one({"resource_id": resource_id}, {"_id": 0})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    if isinstance(resource.get("created_at"), str):
        resource["created_at"] = datetime.fromisoformat(resource["created_at"])

    # Increment usage count
    await db.resources.update_one(
        {"resource_id": resource_id},
        {"$inc": {"usage_count": 1}}
    )

    return Resource(**resource)

@api_router.get("/resources/{resource_id}/related", response_model=List[Resource])
async def get_related_resources(resource_id: str, user: User = Depends(require_auth)):
    """Get related resources based on tags and category"""
    resource = await db.resources.find_one({"resource_id": resource_id}, {"_id": 0})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    # Find related resources by category or tags
    query = {
        "resource_id": {"$ne": resource_id},
        "$or": [
            {"category": resource.get("category")},
            {"tags": {"$in": resource.get("tags", [])}}
        ]
    }

    related = await db.resources.find(query, {"_id": 0}).limit(6).to_list(6)

    result = []
    for r in related:
        if isinstance(r.get("created_at"), str):
            r["created_at"] = datetime.fromisoformat(r["created_at"])
        result.append(Resource(**r))

    return result

@api_router.post("/resources/{resource_id}/download")
async def download_resource(resource_id: str, user: User = Depends(require_auth)):
    """Log resource download"""
    resource = await db.resources.find_one({"resource_id": resource_id}, {"_id": 0})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    # Return file URL or content
    if resource.get("file_url"):
        return {"file_url": resource["file_url"], "type": "file"}
    elif resource.get("content"):
        return {"content": resource["content"], "type": "content"}
    else:
        raise HTTPException(status_code=404, detail="No downloadable content")

@api_router.post("/resources", response_model=Resource)
async def create_resource(data: ResourceCreate, user: User = Depends(require_admin)):
    """Create resource (admin only)"""
    resource_id = f"resource_{uuid.uuid4().hex[:12]}"
    resource_doc = {
        "resource_id": resource_id,
        **data.model_dump(exclude_unset=True),
        "usage_count": 0,
        "created_by": user.user_id,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.resources.insert_one(resource_doc)
    resource_doc["created_at"] = datetime.fromisoformat(resource_doc["created_at"])
    return Resource(**resource_doc)

# ============== COACHING SESSIONS ROUTES ==============

@api_router.get("/coaching/sessions", response_model=List[CoachingSession])
async def get_coaching_sessions(
    status: Optional[str] = None,
    session_type: Optional[str] = None,
    user: User = Depends(require_auth)
):
    """Get all coaching sessions, optionally filtered by status or type"""
    query = {}
    if status:
        query["status"] = status
    if session_type:
        query["session_type"] = session_type

    sessions = await db.coaching_sessions.find(query, {"_id": 0}).sort("scheduled_date", 1).to_list(50)

    for session in sessions:
        if isinstance(session.get("scheduled_date"), str):
            session["scheduled_date"] = datetime.fromisoformat(session["scheduled_date"])
        if isinstance(session.get("created_at"), str):
            session["created_at"] = datetime.fromisoformat(session["created_at"])
        if isinstance(session.get("updated_at"), str):
            session["updated_at"] = datetime.fromisoformat(session["updated_at"])

    return [CoachingSession(**session) for session in sessions]

@api_router.get("/coaching/sessions/{session_id}", response_model=CoachingSession)
async def get_coaching_session(session_id: str, user: User = Depends(require_auth)):
    """Get a specific coaching session"""
    session = await db.coaching_sessions.find_one({"session_id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Coaching session not found")

    if isinstance(session.get("scheduled_date"), str):
        session["scheduled_date"] = datetime.fromisoformat(session["scheduled_date"])
    if isinstance(session.get("created_at"), str):
        session["created_at"] = datetime.fromisoformat(session["created_at"])
    if isinstance(session.get("updated_at"), str):
        session["updated_at"] = datetime.fromisoformat(session["updated_at"])

    return CoachingSession(**session)

@api_router.post("/coaching/sessions", response_model=CoachingSession)
async def create_coaching_session(data: CoachingSessionCreate, user: User = Depends(require_admin)):
    """Create a coaching session (admin only)"""
    session_id = f"coaching_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc)
    session_doc = {
        "session_id": session_id,
        **data.model_dump(),
        "attendees": [],
        "recording_url": None,
        "status": "scheduled",
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    }
    await db.coaching_sessions.insert_one(session_doc)
    session_doc["created_at"] = now
    session_doc["updated_at"] = now
    session_doc["scheduled_date"] = data.scheduled_date
    return CoachingSession(**session_doc)

@api_router.put("/coaching/sessions/{session_id}", response_model=CoachingSession)
async def update_coaching_session(
    session_id: str,
    data: CoachingSessionCreate,
    user: User = Depends(require_admin)
):
    """Update a coaching session (admin only)"""
    existing = await db.coaching_sessions.find_one({"session_id": session_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Coaching session not found")

    update_data = data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    await db.coaching_sessions.update_one(
        {"session_id": session_id},
        {"$set": update_data}
    )

    updated = await db.coaching_sessions.find_one({"session_id": session_id}, {"_id": 0})

    if isinstance(updated.get("scheduled_date"), str):
        updated["scheduled_date"] = datetime.fromisoformat(updated["scheduled_date"])
    if isinstance(updated.get("created_at"), str):
        updated["created_at"] = datetime.fromisoformat(updated["created_at"])
    if isinstance(updated.get("updated_at"), str):
        updated["updated_at"] = datetime.fromisoformat(updated["updated_at"])

    return CoachingSession(**updated)

@api_router.post("/coaching/sessions/{session_id}/rsvp")
async def rsvp_coaching_session(session_id: str, user: User = Depends(require_auth)):
    """RSVP to a coaching session"""
    session = await db.coaching_sessions.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Coaching session not found")

    if session.get("status") != "scheduled":
        raise HTTPException(status_code=400, detail="Cannot RSVP to this session")

    if session.get("max_attendees"):
        attendee_count = len(session.get("attendees", []))
        if attendee_count >= session["max_attendees"]:
            raise HTTPException(status_code=400, detail="Session is full")

    if user.user_id in session.get("attendees", []):
        raise HTTPException(status_code=400, detail="Already RSVP'd")

    await db.coaching_sessions.update_one(
        {"session_id": session_id},
        {
            "$addToSet": {"attendees": user.user_id},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )

    return {"message": "RSVP successful"}

@api_router.delete("/coaching/sessions/{session_id}/rsvp")
async def cancel_rsvp_coaching_session(session_id: str, user: User = Depends(require_auth)):
    """Cancel RSVP to a coaching session"""
    session = await db.coaching_sessions.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Coaching session not found")

    if user.user_id not in session.get("attendees", []):
        raise HTTPException(status_code=400, detail="Not RSVP'd to this session")

    await db.coaching_sessions.update_one(
        {"session_id": session_id},
        {
            "$pull": {"attendees": user.user_id},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )

    return {"message": "RSVP cancelled"}

# ============== PAYMENT ROUTES ==============

# Payment integration using Stripe
# To implement your own payment integration, uncomment and configure the following:
# from stripe_integration import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

MEMBERSHIP_PACKAGES = {
    "vip_monthly": {"amount": 97.00, "name": "VIP Monthly", "period": "month"},
    "vip_annual": {"amount": 970.00, "name": "VIP Annual", "period": "year"}
}

@api_router.post("/payments/checkout")
async def create_checkout(request: Request, user: User = Depends(require_auth)):
    """Create Stripe checkout session"""
    body = await request.json()
    package_id = body.get("package_id")
    origin_url = body.get("origin_url")
    
    if package_id not in MEMBERSHIP_PACKAGES:
        raise HTTPException(status_code=400, detail="Invalid package")
    
    package = MEMBERSHIP_PACKAGES[package_id]
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    success_url = f"{origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin_url}/membership"
    
    checkout_request = CheckoutSessionRequest(
        amount=package["amount"],
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": user.user_id,
            "package_id": package_id,
            "package_name": package["name"]
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    transaction_doc = {
        "transaction_id": f"txn_{uuid.uuid4().hex[:12]}",
        "user_id": user.user_id,
        "session_id": session.session_id,
        "amount": package["amount"],
        "currency": "usd",
        "package_type": package_id,
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.payment_transactions.insert_one(transaction_doc)
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, request: Request, user: User = Depends(require_auth)):
    """Get payment status and update membership if paid"""
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    status = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction
    transaction = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    
    if transaction and transaction.get("payment_status") != "paid" and status.payment_status == "paid":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": "paid", "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        # Upgrade user membership
        await db.users.update_one(
            {"user_id": transaction["user_id"]},
            {"$set": {"membership": "vip"}}
        )
    
    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount": status.amount_total / 100,
        "currency": status.currency
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            user_id = webhook_response.metadata.get("user_id")
            if user_id:
                await db.users.update_one(
                    {"user_id": user_id},
                    {"$set": {"membership": "vip"}}
                )
                
                await db.payment_transactions.update_one(
                    {"session_id": webhook_response.session_id},
                    {"$set": {"payment_status": "paid", "updated_at": datetime.now(timezone.utc).isoformat()}}
                )
        
        return {"received": True}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"received": True}

# ============== DASHBOARD / STATS ==============

@api_router.get("/dashboard")
async def get_dashboard(user: User = Depends(require_auth)):
    """Get dashboard data"""
    # Get recent courses
    courses = await db.courses.find({}, {"_id": 0}).sort("created_at", -1).limit(4).to_list(4)
    for course in courses:
        if isinstance(course.get("created_at"), str):
            course["created_at"] = datetime.fromisoformat(course["created_at"])
    
    # Get upcoming events
    now = datetime.now(timezone.utc).isoformat()
    events = await db.events.find({"start_time": {"$gte": now}}, {"_id": 0}).sort("start_time", 1).limit(3).to_list(3)
    for event in events:
        if isinstance(event.get("start_time"), str):
            event["start_time"] = datetime.fromisoformat(event["start_time"])
        if isinstance(event.get("created_at"), str):
            event["created_at"] = datetime.fromisoformat(event["created_at"])
    
    # Get recent posts
    posts = await db.posts.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    for post in posts:
        if isinstance(post.get("created_at"), str):
            post["created_at"] = datetime.fromisoformat(post["created_at"])
    
    # Get user progress
    completed_count = await db.user_progress.count_documents({"user_id": user.user_id, "completed": True})
    total_lessons = await db.lessons.count_documents({})
    
    # Points to next level
    current_level = user.level
    points_for_next = (current_level * 100) - user.points
    
    return {
        "user": user,
        "recent_courses": [Course(**c) for c in courses if not c.get("vip_only") or user.membership == "vip"],
        "upcoming_events": [Event(**e) for e in events],
        "recent_posts": [Post(**p) for p in posts],
        "progress": {
            "completed_lessons": completed_count,
            "total_lessons": total_lessons,
            "points_to_next_level": max(0, points_for_next)
        }
    }

# ============== ADMIN ROUTES ==============

@api_router.get("/admin/stats")
async def get_admin_stats(user: User = Depends(require_admin)):
    """Get admin statistics"""
    total_users = await db.users.count_documents({})
    vip_users = await db.users.count_documents({"membership": "vip"})
    total_courses = await db.courses.count_documents({})
    total_events = await db.events.count_documents({})
    total_posts = await db.posts.count_documents({})
    total_resources = await db.resources.count_documents({})
    
    recent_users = await db.users.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", -1).limit(10).to_list(10)
    
    return {
        "stats": {
            "total_users": total_users,
            "vip_users": vip_users,
            "total_courses": total_courses,
            "total_events": total_events,
            "total_posts": total_posts,
            "total_resources": total_resources
        },
        "recent_users": recent_users
    }

@api_router.get("/admin/users")
async def get_all_users(user: User = Depends(require_admin)):
    """Get all users (admin only)"""
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    for u in users:
        if isinstance(u.get("created_at"), str):
            u["created_at"] = datetime.fromisoformat(u["created_at"])
    return users

@api_router.put("/admin/users/{user_id}/role")
async def update_user_role(user_id: str, request: Request, user: User = Depends(require_admin)):
    """Update user role (admin only)"""
    body = await request.json()
    new_role = body.get("role")
    
    if new_role not in ["member", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    await db.users.update_one({"user_id": user_id}, {"$set": {"role": new_role}})
    return {"message": "Role updated"}

@api_router.put("/admin/users/{user_id}/membership")
async def update_user_membership(user_id: str, request: Request, user: User = Depends(require_admin)):
    """Update user membership (admin only)"""
    body = await request.json()
    new_membership = body.get("membership")
    
    if new_membership not in ["free", "vip"]:
        raise HTTPException(status_code=400, detail="Invalid membership")
    
    await db.users.update_one({"user_id": user_id}, {"$set": {"membership": new_membership}})
    return {"message": "Membership updated"}

# ============== ROOT ==============

@api_router.get("/health")
async def health_check():
    """Health check endpoint for monitoring and load balancers"""
    try:
        # Check MongoDB connection
        await db.command("ping")
        mongo_status = "healthy"
    except Exception as e:
        mongo_status = f"unhealthy: {str(e)}"
        logger.error(f"MongoDB health check failed: {e}")

    return {
        "status": "healthy" if mongo_status == "healthy" else "unhealthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
        "services": {
            "mongodb": mongo_status,
            "api": "healthy"
        }
    }

@api_router.get("/")
async def root():
    return {"message": "VCSA API", "version": "1.0.0"}

# Include router
app.include_router(api_router)

# Include Phase 1 development routes

# Include Organization routes (White-Label Platform)
from organization_routes import router as organization_router
app.include_router(organization_router)

# Include School creation routes
try:
    from school_routes import router as school_router
    app.include_router(school_router)
except ImportError:
    print("Warning: school_routes not available")

# Add multi-tenancy middleware
from middleware import inject_organization_context
app.middleware("http")(inject_organization_context)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Phase 1 Routes
try:
    from phase1_routes import phase1_router
    app.include_router(phase1_router)
except ImportError:
    print("Warning: phase1_routes not available")

