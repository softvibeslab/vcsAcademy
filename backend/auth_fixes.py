"""
VCSA Authentication Flow Fixes
Critical bug fixes for authentication system

Bugs Fixed:
1. Cookie settings causing issues in development (secure=True, samesite="none")
2. Missing error handling for database operations
3. No email format validation
4. No password strength validation
5. Missing rate limiting
6. Inconsistent error messages
7. No proper logging for authentication events
8. Session cleanup issues
"""

from fastapi import HTTPException, Request, Response
from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional
import bcrypt
import uuid
import re
import logging
from datetime import datetime, timezone, timedelta
import os

logger = logging.getLogger(__name__)

# ============== IMPROVED MODELS ==============

class UserCreate(BaseModel):
    """Enhanced user registration with validation"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    name: str = Field(..., min_length=2, max_length=100)

    @validator('password')
    def validate_password_strength(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        return v

    @validator('name')
    def validate_name(cls, v):
        """Validate name doesn't contain special characters"""
        if not re.match(r'^[a-zA-Z\s\-\.]+$', v):
            raise ValueError('Name can only contain letters, spaces, hyphens, and periods')
        return v.strip()

class UserLogin(BaseModel):
    """Enhanced user login with validation"""
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=100)

# ============== AUTHENTICATION FIXES ==============

class AuthFixes:
    """Critical authentication bug fixes"""

    def __init__(self, db, is_development: bool = None):
        self.db = db
        # Auto-detect development mode
        self.is_development = is_development if is_development is not None else (
            os.environ.get('NODE_ENV', 'development') == 'development'
        )

    def get_cookie_settings(self):
        """
        FIX: Proper cookie settings based on environment
        - Development: Allow HTTP cookies
        - Production: Require secure cookies
        """
        if self.is_development:
            return {
                "httponly": True,
                "secure": False,  # FIX: Allow HTTP in development
                "samesite": "lax",  # FIX: Use lax instead of none for better compatibility
                "path": "/",
                "max_age": 7 * 24 * 60 * 60
            }
        else:
            return {
                "httponly": True,
                "secure": True,  # Require HTTPS in production
                "samesite": "strict",  # Better security in production
                "path": "/",
                "max_age": 7 * 24 * 60 * 60
            }

    async def register_with_fixes(self, data: UserCreate, response: Response):
        """
        FIX: Enhanced registration with proper error handling
        """
        try:
            # Check existing user
            existing = await self.db.users.find_one({"email": data.email}, {"_id": 0})
            if existing:
                logger.warning(f"Registration attempt with existing email: {data.email}")
                raise HTTPException(
                    status_code=400,
                    detail="Email already registered. Please login or reset your password."
                )

            # Create user
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
                "created_at": datetime.now(timezone.utc).isoformat(),
                "failed_login_attempts": 0,  # FIX: Track failed attempts
                "last_login": None,
                "is_active": True  # FIX: Add account status
            }

            # FIX: Proper error handling for database operations
            try:
                await self.db.users.insert_one(user_doc)
                logger.info(f"New user registered: {user_id}")
            except Exception as e:
                logger.error(f"Database error during registration: {e}")
                raise HTTPException(
                    status_code=500,
                    detail="Registration failed. Please try again later."
                )

            # Create session
            session_token = f"session_{uuid.uuid4().hex}"
            session_doc = {
                "user_id": user_id,
                "session_token": session_token,
                "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "ip_address": None,  # Will be set from request
                "user_agent": None  # Will be set from request
            }

            try:
                await self.db.user_sessions.insert_one(session_doc)
            except Exception as e:
                logger.error(f"Session creation failed: {e}")
                # Continue anyway - user is created

            # FIX: Set cookie with proper settings
            cookie_settings = self.get_cookie_settings()
            response.set_cookie(
                key="session_token",
                value=session_token,
                **cookie_settings
            )

            # Return user data (excluding password)
            del user_doc["password_hash"]
            user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])

            return user_doc

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error during registration: {e}")
            raise HTTPException(
                status_code=500,
                detail="An unexpected error occurred. Please try again."
            )

    async def login_with_fixes(self, data: UserLogin, response: Response, request: Request):
        """
        FIX: Enhanced login with proper error handling and security
        """
        try:
            # Find user
            user_doc = await self.db.users.find_one({"email": data.email}, {"_id": 0})

            if not user_doc:
                logger.warning(f"Login attempt with non-existent email: {data.email}")
                # FIX: Don't reveal whether email exists
                raise HTTPException(
                    status_code=401,
                    detail="Invalid email or password"
                )

            # FIX: Check if account is active
            if not user_doc.get("is_active", True):
                logger.warning(f"Login attempt for inactive account: {data.email}")
                raise HTTPException(
                    status_code=403,
                    detail="Account is deactivated. Please contact support."
                )

            # FIX: Check for too many failed attempts
            failed_attempts = user_doc.get("failed_login_attempts", 0)
            if failed_attempts >= 5:
                logger.warning(f"Account locked due to too many failed attempts: {data.email}")
                raise HTTPException(
                    status_code=429,
                    detail="Account temporarily locked due to too many failed attempts. Please reset your password."
                )

            # Verify password
            if not bcrypt.checkpw(data.password.encode(), user_doc.get("password_hash", "").encode()):
                # FIX: Increment failed attempts
                await self.db.users.update_one(
                    {"user_id": user_doc["user_id"]},
                    {"$inc": {"failed_login_attempts": 1}}
                )
                logger.warning(f"Failed login attempt for: {data.email}")

                # FIX: Don't reveal whether password is wrong
                raise HTTPException(
                    status_code=401,
                    detail="Invalid email or password"
                )

            # FIX: Reset failed attempts on successful login
            await self.db.users.update_one(
                {"user_id": user_doc["user_id"]},
                {
                    "$set": {
                        "failed_login_attempts": 0,
                        "last_login": datetime.now(timezone.utc).isoformat()
                    }
                }
            )

            # Create session
            session_token = f"session_{uuid.uuid4().hex}"

            # FIX: Store session metadata
            session_doc = {
                "user_id": user_doc["user_id"],
                "session_token": session_token,
                "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "ip_address": request.client.host if request.client else None,
                "user_agent": request.headers.get("user-agent"),
                "last_activity": datetime.now(timezone.utc).isoformat()
            }

            try:
                await self.db.user_sessions.insert_one(session_doc)
                logger.info(f"User logged in: {user_doc['user_id']}")
            except Exception as e:
                logger.error(f"Session creation failed: {e}")
                # Continue anyway - authentication was successful

            # FIX: Set cookie with proper settings
            cookie_settings = self.get_cookie_settings()
            response.set_cookie(
                key="session_token",
                value=session_token,
                **cookie_settings
            )

            # Return user data (excluding password)
            del user_doc["password_hash"]
            if isinstance(user_doc.get("created_at"), str):
                user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])

            return user_doc

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error during login: {e}")
            raise HTTPException(
                status_code=500,
                detail="An unexpected error occurred. Please try again."
            )

    async def cleanup_expired_sessions(self):
        """
        FIX: Clean up expired sessions periodically
        This should be called periodically (e.g., via cron job)
        """
        try:
            result = await self.db.user_sessions.delete_many({
                "expires_at": {"$lt": datetime.now(timezone.utc).isoformat()}
            })
            logger.info(f"Cleaned up {result.deleted_count} expired sessions")
            return result.deleted_count
        except Exception as e:
            logger.error(f"Error cleaning up sessions: {e}")
            return 0


# ============== USAGE EXAMPLE ==============

"""
# In server.py, replace the auth routes with:

from auth_fixes import AuthFixes, UserCreate, UserLogin

auth_fixes = AuthFixes(db)

@api_router.post("/auth/register")
async def register(data: UserCreate, response: Response):
    return await auth_fixes.register_with_fixes(data, response)

@api_router.post("/auth/login")
async def login(data: UserLogin, response: Response, request: Request):
    return await auth_fixes.login_with_fixes(data, response, request)

# Add cleanup endpoint (admin only)
@api_router.post("/auth/cleanup-sessions")
async def cleanup_sessions(user: User = Depends(require_admin)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    deleted = await auth_fixes.cleanup_expired_sessions()
    return {"deleted_sessions": deleted}
"""