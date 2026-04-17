# Backend Development

Guía completa de desarrollo backend para VCSA.

## 🐍 Stack Tecnológico

- **FastAPI** - Modern web framework for building APIs
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation using Python type annotations
- **python-jose** - JWT authentication
- **passlib[bcrypt]** - Password hashing
- **python-multipart** - Form data parsing
- **uvicorn** - ASGI server

---

## 📁 Estructura de Directorios

```
backend/
├── server.py                    # Main FastAPI app
├── phase1_routes.py             # Phase 1 Development System routes
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables
└── tests/                       # Backend tests
    ├── test_auth.py
    ├── test_development.py
    └── conftest.py              # Pytest fixtures
```

---

## 🚀 Arquitectura

### Main Application (server.py)

```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import jwt
from datetime import datetime, timedelta

app = FastAPI(title="VCSA API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.vcsa
```

### API Router Structure

```python
# Main router: /api prefix
# Phase 1 router: /api/development prefix

from fastapi import APIRouter

# Main router
api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(courses_router)
api_router.include_router(community_router)
api_router.include_router(events_router)
api_router.include_router(resources_router)
api_router.include_router(admin_router)

app.include_router(api_router)

# Phase 1 router
development_router = APIRouter(prefix="/api/development")
development_router.include_router(stages_router)
development_router.include_router(tracks_router)
development_router.include_router(modules_router)
development_router.include_router(progress_router)
development_router.include_router(badges_router)
development_router.include_router(bookmarks_router)

app.include_router(development_router)
```

---

## 🔐 Autenticación

### JWT Setup

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Dependency Injection

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    email = verify_token(token)
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
```

### Auth Routes

```python
from fastapi import APIRouter, HTTPException, Depends, Response
from passlib.context import CryptContext

router = APIRouter(prefix="/api/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register")
async def register(user: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_password = pwd_context.hash(user.password)

    # Create user
    new_user = {
        "email": user.email,
        "password_hash": hashed_password,
        "name": user.name,
        "role": "member",
        "membership_tier": "free",
        "created_at": datetime.utcnow()
    }
    result = await db.users.insert_one(new_user)
    created_user = await db.users.find_one({"_id": result.inserted_id})

    # Create progress record
    await db.user_progress.insert_one({
        "user_id": created_user["_id"],
        "current_stage": 1,
        "readiness_score": 0,
        "points": 0,
        "training_streak": 0,
        "completed_modules": [],
        "completed_breakdowns": [],
        "applied_quickwins": [],
        "badges_awarded": [],
        "last_training_date": None
    })

    # Create token
    token = create_access_token({"sub": user.email})

    # Set httpOnly cookie
    response = Response()
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  # True in production with HTTPS
        samesite="lax"
    )

    return {"email": created_user["email"], "name": created_user["name"]}

@router.post("/login")
async def login(credentials: UserLogin, response: Response):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not pwd_context.verify(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user["email"]})
    response.set_cookie(key="access_token", value=token, httponly=True)

    return {"email": user["email"], "name": user["name"]}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}

@router.get("/me")
async def get_current_user_info(user: dict = Depends(get_current_user)):
    return {
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "membership_tier": user.get("membership_tier", "free")
    }
```

---

## 📊 Phase 1 Development System

### Data Models

```python
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Stage(BaseModel):
    id: int
    name: str
    description: str
    points_required: int
    duration_weeks: str
    icon: str
    color: str

class Module(BaseModel):
    id: str
    track_id: int
    title: str
    description: str
    video_url: str
    key_move: str
    order: int

class Track(BaseModel):
    id: int
    stage_id: int
    title: str
    description: str
    icon: str
    modules: List[Module]

class DealBreakdown(BaseModel):
    id: str
    title: str
    scenario: str
    mistake: str
    fix: str
    key_takeaway: str

class QuickWin(BaseModel):
    id: str
    title: str
    category: str
    script: str
    when_to_use: str
```

### Progress Tracking

```python
@router.get("/progress")
async def get_progress(user: dict = Depends(get_current_user)):
    progress = await db.user_progress.find_one({"user_id": user["_id"]})
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")

    # Calculate readiness score
    readiness_score = calculate_readiness_score(progress)

    return {
        "current_stage": progress["current_stage"],
        "readiness_score": readiness_score,
        "points": progress["points"],
        "training_streak": progress["training_streak"],
        "completed_modules": len(progress["completed_modules"]),
        "completed_breakdowns": len(progress["completed_breakdowns"]),
        "applied_quickwins": len(progress["applied_quickwins"]),
        "badges_awarded": progress["badges_awarded"]
    }

def calculate_readiness_score(progress: dict) -> int:
    # Readiness Score = (Video Completion × 40%) +
    #                   (Track Progress × 30%) +
    #                   (Quick Wins Applied × 10%) +
    #                   (Breakdowns Reviewed × 10%) +
    #                   (Training Streak × 10%)

    total_modules = 36
    total_breakdowns = 15
    total_quickwins = 20

    video_score = (len(progress["completed_modules"]) / total_modules) * 40
    track_score = (len(progress["completed_modules"]) / total_modules) * 30
    quickwin_score = (len(progress["applied_quickwins"]) / total_quickwins) * 10
    breakdown_score = (len(progress["completed_breakdowns"]) / total_breakdowns) * 10
    streak_score = min(progress["training_streak"] * 2, 10)

    return int(video_score + track_score + quickwin_score + breakdown_score + streak_score)
```

### Module Completion

```python
@router.post("/modules/{module_id}/complete")
async def complete_module(
    module_id: str,
    user: dict = Depends(get_current_user)
):
    # Update progress
    progress = await db.user_progress.find_one({"user_id": user["_id"]})

    if module_id in progress["completed_modules"]:
        return {"message": "Module already completed"}

    progress["completed_modules"].append(module_id)
    progress["points"] += 10

    # Check stage completion
    if len(progress["completed_modules"]) % 9 == 0:  # 9 modules per stage
        progress["current_stage"] = min(progress["current_stage"] + 1, 4)

    # Update training streak
    if progress["last_training_date"]:
        last_date = progress["last_training_date"]
        days_since = (datetime.utcnow() - last_date).days
        if days_since <= 1:
            progress["training_streak"] += 1
        else:
            progress["training_streak"] = 1
    else:
        progress["training_streak"] = 1

    progress["last_training_date"] = datetime.utcnow()

    # Check badges
    new_badges = check_badges(progress)
    progress["badges_awarded"].extend(new_badges)

    # Update in database
    await db.user_progress.update_one(
        {"user_id": user["_id"]},
        {"$set": progress}
    )

    # Log activity
    await db.user_activity.insert_one({
        "user_id": user["_id"],
        "action": "module_complete",
        "content_id": module_id,
        "content_type": "module",
        "timestamp": datetime.utcnow()
    })

    return {
        "message": "Module completed",
        "points_earned": 10,
        "new_badges": new_badges
    }
```

### Badge System

```python
BADGES = {
    "first_module": {"name": "First Steps", "description": "Complete your first module"},
    "stage_1_complete": {"name": "Foundation Builder", "description": "Complete Stage 1"},
    "stage_2_complete": {"name": "Developing Pro", "description": "Complete Stage 2"},
    "stage_3_complete": {"name": "Consistent Closer", "description": "Complete Stage 3"},
    "stage_4_complete": {"name": "Top Producer", "description": "Complete Stage 4"},
    "streak_7": {"name": "Week Warrior", "description": "7-day training streak"},
    "streak_30": {"name": "Monthly Master", "description": "30-day training streak"},
    "first_breakdown": {"name": "Deal Analyst", "description": "Review first breakdown"},
    "first_quickwin": {"name": "Quick Learner", "description": "Apply first quick win"},
    "all_tracks": {"name": "Track Master", "description": "Complete all 6 tracks"},
    "readiness_100": {"name": "Ready for Anything", "description": "100% readiness score"}
}

def check_badges(progress: dict) -> List[str]:
    new_badges = []
    current_badges = set(progress["badges_awarded"])

    # Check each badge
    if len(progress["completed_modules"]) >= 1 and "first_module" not in current_badges:
        new_badges.append("first_module")

    if len(progress["completed_modules"]) >= 9 and "stage_1_complete" not in current_badges:
        new_badges.append("stage_1_complete")

    if len(progress["completed_modules"]) >= 18 and "stage_2_complete" not in current_badges:
        new_badges.append("stage_2_complete")

    if len(progress["completed_modules"]) >= 27 and "stage_3_complete" not in current_badges:
        new_badges.append("stage_3_complete")

    if len(progress["completed_modules"]) >= 36 and "stage_4_complete" not in current_badges:
        new_badges.append("stage_4_complete")

    if progress["training_streak"] >= 7 and "streak_7" not in current_badges:
        new_badges.append("streak_7")

    if progress["training_streak"] >= 30 and "streak_30" not in current_badges:
        new_badges.append("streak_30")

    if len(progress["completed_breakdowns"]) >= 1 and "first_breakdown" not in current_badges:
        new_badges.append("first_breakdown")

    if len(progress["applied_quickwins"]) >= 1 and "first_quickwin" not in current_badges:
        new_badges.append("first_quickwin")

    return new_badges
```

### Bookmarks with Tags

```python
@router.post("/bookmarks")
async def create_bookmark(
    bookmark: BookmarkCreate,
    user: dict = Depends(get_current_user)
):
    new_bookmark = {
        "user_id": user["_id"],
        "content_id": bookmark.content_id,
        "content_type": bookmark.content_type,  # module, breakdown, quickwin
        "tags": bookmark.tags,  # ["before_tour", "closing_help", "objections"]
        "notes": bookmark.notes,
        "created_at": datetime.utcnow()
    }

    result = await db.bookmarks.insert_one(new_bookmark)
    created_bookmark = await db.bookmarks.find_one({"_id": result.inserted_id})

    return created_bookmark

@router.get("/bookmarks")
async def get_bookmarks(
    tag: Optional[str] = None,
    user: dict = Depends(get_current_user)
):
    query = {"user_id": user["_id"]}
    if tag:
        query["tags"] = tag

    bookmarks = await db.bookmarks.find(query).to_list(length=100)
    return bookmarks
```

---

## 🗄️ Database Operations

### MongoDB Queries

```python
# Find one
user = await db.users.find_one({"email": email})

# Find many
modules = await db.modules.find({"track_id": track_id}).to_list(length=100)

# Insert one
result = await db.users.insert_one(new_user)
user_id = result.inserted_id

# Update one
await db.users.update_one(
    {"_id": user_id},
    {"$set": {"name": "New Name"}}
)

# Update with array operations
await db.user_progress.update_one(
    {"user_id": user_id},
    {"$push": {"completed_modules": module_id}}
)

# Aggregate pipeline
pipeline = [
    {"$match": {"user_id": user_id}},
    {"$group": {"_id": "$action", "count": {"$sum": 1}}}
]
results = await db.user_activity.aggregate(pipeline).to_list(length=100)
```

---

## 🧪 Testing

### Pytest Setup

```python
# tests/conftest.py
import pytest
from httpx import AsyncClient
from server import app

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def test_user(client):
    response = await client.post(
        "/api/auth/register",
        json={"email": "test@test.com", "password": "test123", "name": "Test"}
    )
    return response.json()
```

### Example Tests

```python
# tests/test_auth.py
@pytest.mark.asyncio
async def test_register_success(client):
    response = await client.post(
        "/api/auth/register",
        json={"email": "new@test.com", "password": "test123", "name": "New User"}
    )
    assert response.status_code == 200
    assert "email" in response.json()

@pytest.mark.asyncio
async def test_login_success(client, test_user):
    response = await client.post(
        "/api/auth/login",
        json={"email": "test@test.com", "password": "test123"}
    )
    assert response.status_code == 200

# tests/test_development.py
@pytest.mark.asyncio
async def test_get_stages(client):
    response = await client.get("/api/development/stages")
    assert response.status_code == 200
    assert len(response.json()) == 4

@pytest.mark.asyncio
async def test_complete_module(client, test_user):
    response = await client.post(
        "/api/development/modules/module_1_1/complete"
    )
    assert response.status_code == 200
    assert response.json()["points_earned"] == 10
```

---

## 🔥 Hot Tips

1. **Use async/await**: Motor es async - siempre usar `await` para operaciones de BD
2. **Pydantic para validación**: Define Pydantic models para request/response
3. **Dependency injection**: Usa `Depends()` para auth y lógica compartida
4. **httpOnly cookies**: Nunca retornar JWT en response body - usar cookies
5. **Error handling**: Usa HTTPException para errores
6. **Type hints**: Siempre usar type hints en funciones
7. **Environment variables**: Usa python-dotenv para config
8. **Logging**: Agrega logging para debugging
9. **Pagination**: Para listas largas, usar skip/limit
10. **Transactions**: Para operaciones complejas, usar sesiones de MongoDB

---

## 📚 Recursos

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Motor Documentation](https://motor.readthedocs.io/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
