"""
VCSA Phase 1: Top Producer Development System
Sales Operating System Architecture

Content Layer → Track Layer → Engagement Layer → Gamification Layer
"""

from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
import uuid

# Import from main server
from server import db, require_auth, User

phase1_router = APIRouter(prefix="/api/development", tags=["development"])

# ============== CONTENT LAYER MODELS ==============

class Content(BaseModel):
    """Universal content model - videos, breakdowns, quick wins, simulations"""
    content_id: str
    title: str
    description: str
    type: str  # video, quick_win, deal_breakdown, simulation, tactical
    vertical: str = "vacation_club"
    difficulty: str = "beginner"  # beginner, intermediate, advanced
    duration: int  # minutes
    video_url: Optional[str] = None
    key_move: Optional[str] = None  # The one actionable takeaway
    tags: List[str] = []
    created_at: datetime

class TrackContent(BaseModel):
    """Links content to tracks with ordering"""
    track_id: str
    content_id: str
    order_index: int
    module_number: str  # e.g., "1.1", "2.3"

# ============== CORE MODELS ==============

class Stage(BaseModel):
    stage_id: str
    stage_number: int
    name: str
    title: str
    objective: str
    key_skills: List[str]
    required_tracks: List[str]
    points_required: int
    typical_duration: str
    exit_criteria: str

class Track(BaseModel):
    track_id: str
    track_number: int
    name: str
    purpose: str
    outcome: str
    required_for_stages: List[int] = []
    total_duration: int = 0

class Badge(BaseModel):
    badge_id: str
    name: str
    description: str
    criteria: str
    criteria_type: str  # track_complete, score_threshold, streak, content_count
    criteria_value: str  # track_1, 80, 14, breakdowns:10
    icon: str
    order: int

# ============== ENGAGEMENT MODELS ==============

class UserActivity(BaseModel):
    """Track all user interactions for analytics"""
    activity_id: str
    user_id: str
    content_id: str
    activity_type: str  # started, completed, bookmarked, replayed, quick_review
    timestamp: datetime
    duration_spent: Optional[int] = None  # seconds

class Bookmark(BaseModel):
    """Smart bookmarks with tags for Pre-Tour Mode"""
    bookmark_id: str
    user_id: str
    content_id: str
    tag: str  # before_tour, closing_help, objections, mindset, general
    notes: Optional[str] = None
    created_at: datetime

class UserProgress(BaseModel):
    user_id: str
    current_stage: int = 1
    stage_started_at: datetime
    tracks_progress: Dict[str, float] = {}
    content_completed: List[str] = []
    badges_earned: List[str] = []
    training_streak: int = 0
    streak_last_date: Optional[str] = None
    last_activity: datetime
    readiness_score: int = 0
    total_training_time: int = 0  # minutes

# ============== STAGE DEFINITIONS ==============

STAGES = [
    {
        "stage_id": "stage_1",
        "stage_number": 1,
        "name": "new_rep",
        "title": "New Rep",
        "objective": "Build foundation. Understand the structure of a winning presentation.",
        "key_skills": ["Tour flow", "Rapport basics", "Product knowledge", "Presentation structure"],
        "required_tracks": ["track_1", "track_2"],
        "points_required": 150,
        "typical_duration": "1-2 weeks",
        "exit_criteria": "Rep understands the framework. Ready to execute on the floor with structure."
    },
    {
        "stage_id": "stage_2",
        "stage_number": 2,
        "name": "developing_rep",
        "title": "Developing Rep",
        "objective": "Execute with consistency. Handle common objections. Control presentation flow.",
        "key_skills": ["Objection responses", "Presentation pacing", "Value delivery", "Basic decision control"],
        "required_tracks": ["track_3", "track_5"],
        "points_required": 300,
        "typical_duration": "2-4 weeks",
        "exit_criteria": "Rep can run a full presentation without losing control. Handles standard resistance."
    },
    {
        "stage_id": "stage_3",
        "stage_number": 3,
        "name": "performing_rep",
        "title": "Performing Rep",
        "objective": "Close consistently. Manage complex objections. Control decision moments.",
        "key_skills": ["Advanced objection handling", "Decision architecture", "Deal strategy", "Post-resistance recovery"],
        "required_tracks": ["track_4", "track_6"],
        "points_required": 500,
        "typical_duration": "4-8 weeks",
        "exit_criteria": "Rep closes regularly. Can recover from difficult moments. Trusted with premium tours."
    },
    {
        "stage_id": "stage_4",
        "stage_number": 4,
        "name": "top_producer",
        "title": "Consistent Top Producer",
        "objective": "Perform with consistency, control high-stakes decision moments, and model top producer standards.",
        "key_skills": ["Mastery of all tracks", "Deal architecture", "Leadership presence", "High-stakes closing"],
        "required_tracks": ["all"],
        "points_required": 750,
        "typical_duration": "8-12 weeks",
        "exit_criteria": "Rep is a consistent closer. Industry-level performer. Models excellence."
    }
]

# ============== TRACK DEFINITIONS ==============

TRACKS = [
    {
        "track_id": "track_1",
        "track_number": 1,
        "name": "Pro Mindset",
        "purpose": "Build the mental framework of a top producer.",
        "outcome": "Rep thinks like a professional, not a hopeful.",
        "required_for_stages": [1],
        "total_duration": 48
    },
    {
        "track_id": "track_2",
        "track_number": 2,
        "name": "Discovery & Control",
        "purpose": "Control the conversation from the first moment.",
        "outcome": "Rep owns the tour from start to finish.",
        "required_for_stages": [1],
        "total_duration": 54
    },
    {
        "track_id": "track_3",
        "track_number": 3,
        "name": "Value Architecture",
        "purpose": "Present value so compelling that price becomes secondary.",
        "outcome": "Rep builds value that makes closing natural.",
        "required_for_stages": [2],
        "total_duration": 54
    },
    {
        "track_id": "track_4",
        "track_number": 4,
        "name": "Decision Management",
        "purpose": "Guide buyers toward commitment without pressure.",
        "outcome": "Rep can guide any buyer to a clear decision point.",
        "required_for_stages": [3],
        "total_duration": 60
    },
    {
        "track_id": "track_5",
        "track_number": 5,
        "name": "Objection Mastery",
        "purpose": "Turn resistance into closing opportunities.",
        "outcome": "Rep handles any objection with confidence and structure.",
        "required_for_stages": [2],
        "total_duration": 54
    },
    {
        "track_id": "track_6",
        "track_number": 6,
        "name": "Post-Decision Integrity",
        "purpose": "Protect the sale and build lasting client relationships.",
        "outcome": "Rep protects deals and builds referral relationships.",
        "required_for_stages": [3],
        "total_duration": 48
    }
]

# ============== CONTENT LIBRARY ==============
# All content with key_move for each lesson

PLACEHOLDER_VIDEO = "https://www.youtube.com/watch?v=placeholder"

CONTENT = [
    # ========== TRACK 1: PRO MINDSET (6 modules) ==========
    {
        "content_id": "mod_1_1",
        "title": "Introduction: The Pro Mindset",
        "description": "Who you need to become to succeed in vacation club sales.",
        "type": "video",
        "difficulty": "beginner",
        "duration": 8,
        "video_url": "https://youtu.be/wDjfOy5aks8",
        "key_move": "Before every tour, tell yourself: 'I am a professional. I help families create memories. Today I will perform at my best.'",
        "tags": ["mindset", "foundation", "before_tour"]
    },
    {
        "content_id": "mod_1_2",
        "title": "The Performance Mindset",
        "description": "Daily mental preparation that separates top producers from average reps.",
        "type": "video",
        "difficulty": "beginner",
        "duration": 8,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Create a pre-tour ritual: 3 deep breaths, review your discovery questions, visualize a successful close.",
        "tags": ["mindset", "preparation", "before_tour"]
    },
    {
        "content_id": "mod_1_3",
        "title": "Handling Rejection Like a Pro",
        "description": "Why 'no' is part of the process and how to use it.",
        "type": "video",
        "difficulty": "beginner",
        "duration": 10,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "After every 'no', ask yourself: 'What did I learn? What will I do differently next time?'",
        "tags": ["mindset", "recovery", "objections"]
    },
    {
        "content_id": "mod_1_4",
        "title": "Consistency Over Talent",
        "description": "Systems beat motivation. How to show up every day.",
        "type": "video",
        "difficulty": "beginner",
        "duration": 8,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Track your numbers daily: tours given, closes attempted, deals made. Consistent tracking creates consistent results.",
        "tags": ["mindset", "systems", "discipline"]
    },
    {
        "content_id": "mod_1_5",
        "title": "Ownership Mentality",
        "description": "Taking 100% responsibility for your results.",
        "type": "video",
        "difficulty": "beginner",
        "duration": 7,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Never blame the tour, the market, or the client. Ask: 'What could I have done better?'",
        "tags": ["mindset", "accountability"]
    },
    {
        "content_id": "mod_1_6",
        "title": "The Energy Management System",
        "description": "Maintaining peak performance across multiple tours.",
        "type": "video",
        "difficulty": "beginner",
        "duration": 7,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Between tours: hydrate, move your body for 2 minutes, reset your energy. Never carry one tour into the next.",
        "tags": ["mindset", "energy", "performance"]
    },

    # ========== TRACK 2: DISCOVERY & CONTROL (6 modules) ==========
    {
        "content_id": "mod_2_1",
        "title": "The Power Opening",
        "description": "Capture attention and establish authority in the first 60 seconds.",
        "type": "video",
        "difficulty": "beginner",
        "duration": 10,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Open with: 'Before we start, I want to understand what brought you here today. What does the perfect vacation look like for your family?'",
        "tags": ["discovery", "opening", "control", "before_tour"]
    },
    {
        "content_id": "mod_2_2",
        "title": "Building Rapport That Converts",
        "description": "Connection with purpose - not just small talk.",
        "type": "video",
        "difficulty": "beginner",
        "duration": 8,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Find one thing you genuinely have in common. Use it to bridge to their vacation dreams.",
        "tags": ["discovery", "rapport", "connection"]
    },
    {
        "content_id": "mod_2_3",
        "title": "Discovery Questions That Reveal Motivation",
        "description": "The questions that uncover what clients really want.",
        "type": "video",
        "difficulty": "beginner",
        "duration": 10,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Ask: 'If time and money weren't factors, what would your dream vacation look like?' Then listen for emotional triggers.",
        "tags": ["discovery", "questions", "motivation", "before_tour"]
    },
    {
        "content_id": "mod_2_4",
        "title": "Identifying Buying Signals",
        "description": "Reading the signs that tell you when to advance.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 9,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "When they start asking 'how' questions (How does this work? How much is it?), they're ready to move forward.",
        "tags": ["discovery", "signals", "closing"]
    },
    {
        "content_id": "mod_2_5",
        "title": "Controlling Presentation Flow",
        "description": "Never lose the frame. Keep the tour moving toward decision.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 9,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "When they try to take control, acknowledge then redirect: 'Great question. Let me show you something that answers that.'",
        "tags": ["control", "presentation", "flow"]
    },
    {
        "content_id": "mod_2_6",
        "title": "The Transition Technique",
        "description": "Moving smoothly between tour phases without losing momentum.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 8,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Use 'bridge statements': 'Now that you've seen X, let me show you how it connects to what you told me about Y.'",
        "tags": ["control", "transitions", "flow"]
    },

    # ========== TRACK 3: VALUE ARCHITECTURE (6 modules) ==========
    {
        "content_id": "mod_3_1",
        "title": "Painting the Dream",
        "description": "Visualization techniques that create emotional connection.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 10,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Paint the picture: 'Imagine your family waking up here, the kids running to the pool, you and your spouse enjoying coffee on the balcony...'",
        "tags": ["value", "visualization", "emotion"]
    },
    {
        "content_id": "mod_3_2",
        "title": "Lifestyle Over Product",
        "description": "Sell the outcome, not the membership.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 8,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Never say 'timeshare' or 'membership'. Say 'your family's vacation home' or 'your guaranteed getaway every year'.",
        "tags": ["value", "positioning", "language"]
    },
    {
        "content_id": "mod_3_3",
        "title": "Value Stacking",
        "description": "Building undeniable worth through layered benefits.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 10,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Stack benefits verbally: 'So you get X, plus Y, plus Z. When you add all that up...' Let them feel the accumulation.",
        "tags": ["value", "stacking", "closing"]
    },
    {
        "content_id": "mod_3_4",
        "title": "Emotional Anchoring",
        "description": "Creating memorable moments that stick after the tour.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 9,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Create an anchor moment: 'Take a photo here. This is where your family's vacation memories will begin.'",
        "tags": ["value", "emotion", "anchoring", "before_tour"]
    },
    {
        "content_id": "mod_3_5",
        "title": "Price Positioning",
        "description": "When and how to present numbers for maximum impact.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 9,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Before revealing price: 'Based on everything you've told me, I think I have something perfect. Before I show you the investment, is this the experience you want?'",
        "tags": ["value", "price", "closing"]
    },
    {
        "content_id": "mod_3_6",
        "title": "The Cost of Not Buying",
        "description": "Helping clients see what they lose by waiting.",
        "type": "video",
        "difficulty": "advanced",
        "duration": 8,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Ask: 'How many vacations have you missed in the last 5 years because you didn't have a plan? What's that worth to your family?'",
        "tags": ["value", "urgency", "closing"]
    },

    # ========== TRACK 4: DECISION MANAGEMENT (6 modules) ==========
    {
        "content_id": "mod_4_1",
        "title": "The Decision Framework",
        "description": "Understanding how buyers actually make decisions.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 10,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Decisions are emotional, justified logically. Build emotion first, then provide the logical justification.",
        "tags": ["decision", "psychology", "closing"]
    },
    {
        "content_id": "mod_4_2",
        "title": "Creating Urgency Ethically",
        "description": "Real reasons to act today without manipulation.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 10,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Use real scarcity: 'Today's pricing is based on current inventory. I can't guarantee the same options tomorrow.'",
        "tags": ["decision", "urgency", "closing"]
    },
    {
        "content_id": "mod_4_3",
        "title": "Managing Indecision",
        "description": "What to do when buyers stall without saying no.",
        "type": "video",
        "difficulty": "advanced",
        "duration": 12,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "When they stall: 'Help me understand - is it the investment, the timing, or something about the membership itself?'",
        "tags": ["decision", "objections", "recovery"]
    },
    {
        "content_id": "mod_4_4",
        "title": "The Commitment Sequence",
        "description": "Moving buyers through micro-commitments to the close.",
        "type": "video",
        "difficulty": "advanced",
        "duration": 10,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Get small yeses: 'You love the location, right?' 'This would work for your family?' 'The numbers make sense?' Then close.",
        "tags": ["decision", "commitment", "closing"]
    },
    {
        "content_id": "mod_4_5",
        "title": "Decision Recovery",
        "description": "What to do when commitment wavers.",
        "type": "video",
        "difficulty": "advanced",
        "duration": 10,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "When they waver: 'What changed? A minute ago you were excited. What's the concern?' Address it directly.",
        "tags": ["decision", "recovery", "objections"]
    },
    {
        "content_id": "mod_4_6",
        "title": "The Final Push",
        "description": "Closing techniques that feel natural, not pushy.",
        "type": "video",
        "difficulty": "advanced",
        "duration": 8,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "The assumptive close: 'Let's get started on the paperwork so you can lock this in. Do you prefer the gold or platinum package?'",
        "tags": ["decision", "closing", "technique"]
    },

    # ========== TRACK 5: OBJECTION MASTERY (6 modules) ==========
    {
        "content_id": "mod_5_1",
        "title": "The Objection Mindset",
        "description": "Why objections are buying signals in disguise.",
        "type": "video",
        "difficulty": "beginner",
        "duration": 8,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Welcome objections: 'I'm glad you brought that up. Let me address it directly.'",
        "tags": ["objections", "mindset"]
    },
    {
        "content_id": "mod_5_2",
        "title": "The Price Objection",
        "description": "Mastering 'It's too expensive' - the most common objection.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 12,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "'Too expensive compared to what? Are we talking about monthly budget or total investment? Let's find what works.'",
        "tags": ["objections", "price", "closing"]
    },
    {
        "content_id": "mod_5_3",
        "title": "The Spouse Objection",
        "description": "Handling 'I need to talk to my partner' with confidence.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 10,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "'I understand. If your spouse were here and said yes, would you want to move forward today?' Then solve for the real objection.",
        "tags": ["objections", "spouse", "closing"]
    },
    {
        "content_id": "mod_5_4",
        "title": "The Think About It Objection",
        "description": "Breaking through 'We need to sleep on it.'",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 10,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "'Absolutely. What specifically do you need to think about? Is it the investment, the timing, or something else?'",
        "tags": ["objections", "stall", "closing"]
    },
    {
        "content_id": "mod_5_5",
        "title": "The Comparison Objection",
        "description": "When they want to 'look at other options.'",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 8,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "'What specifically are you hoping to find elsewhere? Let me make sure I've shown you everything that matters.'",
        "tags": ["objections", "comparison", "closing"]
    },
    {
        "content_id": "mod_5_6",
        "title": "Stacked Objections",
        "description": "When they throw multiple objections at once.",
        "type": "video",
        "difficulty": "advanced",
        "duration": 6,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "'Let me address those one at a time. Which is the biggest concern?' Isolate and solve sequentially.",
        "tags": ["objections", "advanced", "recovery"]
    },

    # ========== TRACK 6: POST-DECISION INTEGRITY (6 modules) ==========
    {
        "content_id": "mod_6_1",
        "title": "The Confirmation Moment",
        "description": "Locking in commitment immediately after the yes.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 8,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Immediately after yes: 'Congratulations! Let's get started right now.' Don't pause. Move to paperwork.",
        "tags": ["post-decision", "confirmation", "closing"]
    },
    {
        "content_id": "mod_6_2",
        "title": "Preventing Buyer's Remorse",
        "description": "Actions in the first 10 minutes that protect the sale.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 10,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Reinforce immediately: 'You made a great decision. Here's why this is perfect for your family...'",
        "tags": ["post-decision", "remorse", "protection"]
    },
    {
        "content_id": "mod_6_3",
        "title": "The Paperwork Experience",
        "description": "Making the signing process feel positive, not procedural.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 8,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "During paperwork: 'While we complete this, let's talk about your first trip. Where are you thinking?'",
        "tags": ["post-decision", "paperwork", "experience"]
    },
    {
        "content_id": "mod_6_4",
        "title": "First 48 Hours Communication",
        "description": "Post-sale touchpoints that eliminate cancellations.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 8,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Text within 24 hours: 'Just thinking about your family - so excited for your first trip! Let me know if you have any questions.'",
        "tags": ["post-decision", "follow-up", "retention"]
    },
    {
        "content_id": "mod_6_5",
        "title": "Referral Positioning",
        "description": "Turning new buyers into referral sources.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 7,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Plant the seed: 'When your friends see your vacation photos, they're going to ask how you did it. I'd love to help them too.'",
        "tags": ["post-decision", "referral", "growth"]
    },
    {
        "content_id": "mod_6_6",
        "title": "Building Long-Term Relationships",
        "description": "Creating clients for life, not just one sale.",
        "type": "video",
        "difficulty": "intermediate",
        "duration": 7,
        "video_url": PLACEHOLDER_VIDEO,
        "key_move": "Set a reminder to check in after their first trip. 'How was the vacation? I'd love to hear about it.'",
        "tags": ["post-decision", "relationship", "retention"]
    }
]

# Track-Content mappings
TRACK_CONTENT = [
    # Track 1
    {"track_id": "track_1", "content_id": "mod_1_1", "order_index": 1, "module_number": "1.1"},
    {"track_id": "track_1", "content_id": "mod_1_2", "order_index": 2, "module_number": "1.2"},
    {"track_id": "track_1", "content_id": "mod_1_3", "order_index": 3, "module_number": "1.3"},
    {"track_id": "track_1", "content_id": "mod_1_4", "order_index": 4, "module_number": "1.4"},
    {"track_id": "track_1", "content_id": "mod_1_5", "order_index": 5, "module_number": "1.5"},
    {"track_id": "track_1", "content_id": "mod_1_6", "order_index": 6, "module_number": "1.6"},
    # Track 2
    {"track_id": "track_2", "content_id": "mod_2_1", "order_index": 1, "module_number": "2.1"},
    {"track_id": "track_2", "content_id": "mod_2_2", "order_index": 2, "module_number": "2.2"},
    {"track_id": "track_2", "content_id": "mod_2_3", "order_index": 3, "module_number": "2.3"},
    {"track_id": "track_2", "content_id": "mod_2_4", "order_index": 4, "module_number": "2.4"},
    {"track_id": "track_2", "content_id": "mod_2_5", "order_index": 5, "module_number": "2.5"},
    {"track_id": "track_2", "content_id": "mod_2_6", "order_index": 6, "module_number": "2.6"},
    # Track 3
    {"track_id": "track_3", "content_id": "mod_3_1", "order_index": 1, "module_number": "3.1"},
    {"track_id": "track_3", "content_id": "mod_3_2", "order_index": 2, "module_number": "3.2"},
    {"track_id": "track_3", "content_id": "mod_3_3", "order_index": 3, "module_number": "3.3"},
    {"track_id": "track_3", "content_id": "mod_3_4", "order_index": 4, "module_number": "3.4"},
    {"track_id": "track_3", "content_id": "mod_3_5", "order_index": 5, "module_number": "3.5"},
    {"track_id": "track_3", "content_id": "mod_3_6", "order_index": 6, "module_number": "3.6"},
    # Track 4
    {"track_id": "track_4", "content_id": "mod_4_1", "order_index": 1, "module_number": "4.1"},
    {"track_id": "track_4", "content_id": "mod_4_2", "order_index": 2, "module_number": "4.2"},
    {"track_id": "track_4", "content_id": "mod_4_3", "order_index": 3, "module_number": "4.3"},
    {"track_id": "track_4", "content_id": "mod_4_4", "order_index": 4, "module_number": "4.4"},
    {"track_id": "track_4", "content_id": "mod_4_5", "order_index": 5, "module_number": "4.5"},
    {"track_id": "track_4", "content_id": "mod_4_6", "order_index": 6, "module_number": "4.6"},
    # Track 5
    {"track_id": "track_5", "content_id": "mod_5_1", "order_index": 1, "module_number": "5.1"},
    {"track_id": "track_5", "content_id": "mod_5_2", "order_index": 2, "module_number": "5.2"},
    {"track_id": "track_5", "content_id": "mod_5_3", "order_index": 3, "module_number": "5.3"},
    {"track_id": "track_5", "content_id": "mod_5_4", "order_index": 4, "module_number": "5.4"},
    {"track_id": "track_5", "content_id": "mod_5_5", "order_index": 5, "module_number": "5.5"},
    {"track_id": "track_5", "content_id": "mod_5_6", "order_index": 6, "module_number": "5.6"},
    # Track 6
    {"track_id": "track_6", "content_id": "mod_6_1", "order_index": 1, "module_number": "6.1"},
    {"track_id": "track_6", "content_id": "mod_6_2", "order_index": 2, "module_number": "6.2"},
    {"track_id": "track_6", "content_id": "mod_6_3", "order_index": 3, "module_number": "6.3"},
    {"track_id": "track_6", "content_id": "mod_6_4", "order_index": 4, "module_number": "6.4"},
    {"track_id": "track_6", "content_id": "mod_6_5", "order_index": 5, "module_number": "6.5"},
    {"track_id": "track_6", "content_id": "mod_6_6", "order_index": 6, "module_number": "6.6"},
]

# ============== DEAL BREAKDOWNS (15 total) ==============

DEAL_BREAKDOWNS = [
    {
        "content_id": "breakdown_1",
        "title": "Lost Control After Price Reveal",
        "description": "Mid-tour with engaged couple. Strong rapport built. Value presentation went well. Upon price reveal, buyer's energy completely shifted.",
        "type": "deal_breakdown",
        "difficulty": "intermediate",
        "duration": 5,
        "scenario": "Mid-tour with engaged couple. Strong rapport built. Value presentation went well. Upon price reveal, buyer's energy completely shifted. Started asking rapid-fire questions about competitors.",
        "what_happened": "Rep revealed price without proper setup. No urgency framework established. Buyer took control of conversation with comparison questions.",
        "control_analysis": "Control was lost at the price transition. Rep didn't anchor value strongly enough before numbers. No 'before I show you the investment' bridge.",
        "better_move": "Before price reveal: 'Based on everything we've discussed about your family's vacation goals, I want to make sure this makes sense for you. Before I show you the investment, let me ask - if the numbers work, is this something you'd want to move forward with today?'",
        "key_move": "Always get a conditional commitment before revealing price. This pre-frames the decision and maintains control.",
        "practice_prompt": "Next time you're about to reveal price, pause and ask for a conditional commitment first.",
        "tags": ["price", "control", "closing"]
    },
    {
        "content_id": "breakdown_2",
        "title": "The Missing Spouse Objection",
        "description": "Wife on tour alone. Husband 'back at the hotel.' She loved everything but couldn't decide alone.",
        "type": "deal_breakdown",
        "difficulty": "intermediate",
        "duration": 5,
        "scenario": "Wife on tour alone. Husband 'back at the hotel.' She loved everything, emotionally connected to the product. When it came to close: 'I can't make this decision without my husband.'",
        "what_happened": "Rep didn't qualify decision-making authority early. Spent 90 minutes building value with someone who couldn't say yes alone.",
        "control_analysis": "Control was lost in the first 10 minutes by not identifying the decision-making dynamic. The close was dead before it started.",
        "better_move": "Early in tour: 'I want to make sure I give you the best experience today. When it comes to big family decisions like vacations, how do you and your husband typically decide together? Is he the type who trusts your judgment, or does he need to see everything himself?'",
        "key_move": "Qualify decision-making authority in the first 15 minutes. Adjust your approach based on the answer.",
        "practice_prompt": "Add a decision-authority question to your opening discovery sequence.",
        "tags": ["objection", "spouse", "qualification", "before_tour"]
    },
    {
        "content_id": "breakdown_3",
        "title": "The 'Think About It' Collapse",
        "description": "Both decision-makers present. Good energy throughout. At the close, they asked for numbers, then stalled.",
        "type": "deal_breakdown",
        "difficulty": "intermediate",
        "duration": 5,
        "scenario": "Both decision-makers present. Good energy throughout. At the close, they asked for numbers, seemed comfortable, then: 'This is a big decision. We need to think about it.'",
        "what_happened": "Rep accepted the objection at face value. Said 'I understand' and started packing up materials. Couple left. Never returned.",
        "control_analysis": "Control was surrendered, not lost. The rep gave up at the first sign of resistance instead of exploring what 'think about it' actually meant.",
        "better_move": "'I completely understand - this is a significant decision. Help me understand: when you say you need to think about it, is it the investment, the timing, or something about the membership itself that you want to consider?'",
        "key_move": "'Think about it' is not a final answer. It's an invitation to discover the real objection.",
        "practice_prompt": "Never accept 'think about it' without asking what specifically they need to think about.",
        "tags": ["objection", "closing", "recovery"]
    },
    {
        "content_id": "breakdown_4",
        "title": "Momentum Lost Mid-Presentation",
        "description": "Strong opening. Good discovery. Halfway through, buyer started checking phone repeatedly.",
        "type": "deal_breakdown",
        "difficulty": "beginner",
        "duration": 5,
        "scenario": "Strong opening. Good discovery. Halfway through the property tour, buyer started checking phone repeatedly. Energy dropped. Questions stopped.",
        "what_happened": "Rep kept presenting without acknowledging the shift. Pushed through the script while buyer mentally checked out.",
        "control_analysis": "Control was lost when the rep ignored obvious disengagement signals. Continued talking instead of re-engaging.",
        "better_move": "Stop and reset: 'I notice you might have something on your mind. Is everything okay? I want to make sure we're covering what matters most to you, not just going through a standard tour.'",
        "key_move": "When you sense disengagement, stop presenting and start a conversation. Acknowledge the shift.",
        "practice_prompt": "Practice recognizing disengagement signals and have a reset phrase ready.",
        "tags": ["control", "engagement", "recovery"]
    },
    {
        "content_id": "breakdown_5",
        "title": "Price Objection After Strong Value Build",
        "description": "Everything clicked. Family was excited about the property. Price reveal: 'That's way more than we expected.'",
        "type": "deal_breakdown",
        "difficulty": "intermediate",
        "duration": 5,
        "scenario": "Everything clicked. Family was excited, kids loved the pool, parents talked about 'finally having a vacation home.' Price reveal: 'That's way more than we expected.'",
        "what_happened": "Rep panicked. Immediately started offering discounts and payment plans without understanding the objection.",
        "control_analysis": "Control was lost by reacting defensively. The rep treated 'more than expected' as a rejection rather than a negotiation opening.",
        "better_move": "'I appreciate you being direct. Help me understand - when you say more than expected, are we talking about the total investment, or the monthly commitment? Because there might be a way to structure this that works better for your situation.'",
        "key_move": "Price objections are often structure objections in disguise. Clarify before you adjust.",
        "practice_prompt": "When you hear a price objection, ask whether it's about total cost or monthly payment.",
        "tags": ["price", "objection", "negotiation"]
    },
    {
        "content_id": "breakdown_6",
        "title": "The Couple Disagreement",
        "description": "Wife loved it. Husband skeptical from the start. Rep focused only on the excited buyer.",
        "type": "deal_breakdown",
        "difficulty": "advanced",
        "duration": 6,
        "scenario": "Wife was enthusiastic from minute one. Husband had arms crossed, asking pointed questions. Rep naturally gravitated toward the wife, thinking she was the ally.",
        "what_happened": "By focusing on the wife, the rep alienated the husband. When it came to close, the husband said no and the wife deferred to him.",
        "control_analysis": "Control was lost by not engaging the skeptic early. The harder buyer should get more attention, not less.",
        "better_move": "Address the husband directly: 'I can see you're being thoughtful about this. What would you need to see to feel confident this is right for your family?'",
        "key_move": "Win the skeptic. The easy buyer is already sold. The skeptic decides the deal.",
        "practice_prompt": "Next tour with a couple, identify the skeptic early and focus your energy there.",
        "tags": ["couple", "objection", "engagement"]
    },
    {
        "content_id": "breakdown_7",
        "title": "The Budget Excuse",
        "description": "After full presentation: 'We just don't have the budget for this right now.'",
        "type": "deal_breakdown",
        "difficulty": "intermediate",
        "duration": 5,
        "scenario": "Great tour, emotional connection built. At the close: 'We love it, but we just don't have the budget for this right now.'",
        "what_happened": "Rep took the budget objection literally and offered lower-tier options, which the client also rejected.",
        "control_analysis": "'Budget' is often code for 'I don't see the value yet' or 'I'm scared to commit.' The rep solved for the wrong problem.",
        "better_move": "'I appreciate that. Help me understand - if budget wasn't a factor at all, would this be something you'd want? [If yes] Then let's talk about how we can make the budget work.'",
        "key_move": "Separate 'can't afford' from 'won't prioritize.' Most budget objections are priority objections.",
        "practice_prompt": "When you hear 'budget,' ask: 'If budget wasn't a factor, would you want this?'",
        "tags": ["budget", "objection", "closing"]
    },
    {
        "content_id": "breakdown_8",
        "title": "The Timing Trap",
        "description": "'This isn't the right time. Maybe next year when things settle down.'",
        "type": "deal_breakdown",
        "difficulty": "intermediate",
        "duration": 5,
        "scenario": "Engaged couple, clearly interested. At close: 'This isn't the right time. We have a lot going on. Maybe next year when things settle down.'",
        "what_happened": "Rep accepted timing as a valid objection and offered to follow up in six months. Client never responded.",
        "control_analysis": "'Next year' is almost always a polite no. The rep missed the opportunity to uncover the real concern.",
        "better_move": "'I hear you. Let me ask - a year from now, what will be different that makes this easier? [Pause] Because usually, life doesn't get simpler. It just gets busier.'",
        "key_move": "Challenge the timing excuse gently. 'Next year' is rarely better than today.",
        "practice_prompt": "When someone says 'not now,' ask what will be different later.",
        "tags": ["timing", "objection", "closing"]
    },
    {
        "content_id": "breakdown_9",
        "title": "The Research Request",
        "description": "'We want to go home and do some research before we decide.'",
        "type": "deal_breakdown",
        "difficulty": "intermediate",
        "duration": 5,
        "scenario": "Solid presentation, client seemed convinced. At close: 'We want to go home and do some research. Read reviews. Compare options.'",
        "what_happened": "Rep handed them a brochure and said 'Take your time.' Client found negative reviews online and never came back.",
        "control_analysis": "Allowing unsupervised 'research' usually kills deals. The internet has every negative review ever written.",
        "better_move": "'I totally get that. What specifically are you hoping to find out? Let me pull that information right now so you have everything you need to make a confident decision today.'",
        "key_move": "Don't let them research alone. Answer their questions now, with you guiding the narrative.",
        "practice_prompt": "When they say 'research,' ask: 'What do you want to know? Let's find out together.'",
        "tags": ["research", "objection", "closing"]
    },
    {
        "content_id": "breakdown_10",
        "title": "The Too Good To Be True",
        "description": "'This sounds amazing. What's the catch?'",
        "type": "deal_breakdown",
        "difficulty": "beginner",
        "duration": 4,
        "scenario": "Enthusiastic presentation. Client is nodding along. Then: 'This sounds too good to be true. What's the catch?'",
        "what_happened": "Rep got defensive and started over-explaining the offer, which made the client more suspicious.",
        "control_analysis": "The 'catch' question is a buying signal. They want to believe it's real. The rep treated it as an attack.",
        "better_move": "'Great question. Here's the only catch: you have to actually use it. Most people who buy vacation ownership don't use it enough. If you're the type of family that will actually take vacations, there's no catch. Is that you?'",
        "key_move": "Turn the 'catch' into a qualifying question. Make them sell themselves.",
        "practice_prompt": "When they ask 'what's the catch,' reframe it as a commitment question.",
        "tags": ["trust", "objection", "closing"]
    },
    {
        "content_id": "breakdown_11",
        "title": "The Friend's Bad Experience",
        "description": "'Our friends bought a timeshare and said it was a nightmare.'",
        "type": "deal_breakdown",
        "difficulty": "intermediate",
        "duration": 5,
        "scenario": "Early in the tour, client mentions: 'Our friends bought a timeshare years ago. They said it was a nightmare. We're very skeptical.'",
        "what_happened": "Rep dismissed the concern: 'Oh, we're different from those old companies.' Client remained skeptical the entire tour.",
        "control_analysis": "Dismissing their friends' experience invalidated their concerns and broke trust.",
        "better_move": "'I appreciate you sharing that. Do you know what specifically made it a bad experience for them? [Listen] That's exactly why we do things differently. Let me show you how we've addressed those exact issues.'",
        "key_move": "Validate the concern, then differentiate. Don't dismiss - address.",
        "practice_prompt": "When they mention a friend's bad experience, ask specifically what went wrong.",
        "tags": ["trust", "objection", "reputation"]
    },
    {
        "content_id": "breakdown_12",
        "title": "The Silent Partner Problem",
        "description": "One spouse barely spoke during the entire presentation, then vetoed at the close.",
        "type": "deal_breakdown",
        "difficulty": "advanced",
        "duration": 5,
        "scenario": "Two-hour tour. One spouse engaged enthusiastically. The other barely said a word. At close, the quiet one said 'I don't think this is for us' and they left.",
        "what_happened": "Rep assumed silence meant agreement. Never engaged the quiet buyer or surfaced their concerns.",
        "control_analysis": "Silence isn't agreement - it's often brewing objection. The quiet buyer was building a case against the purchase the entire time.",
        "better_move": "Early intervention: '[Quiet spouse], I want to make sure I'm covering what matters to you too. What questions do you have?' Create space for them to voice concerns.",
        "key_move": "Engage the silent partner early and often. Silence is a warning sign, not approval.",
        "practice_prompt": "If one partner is quiet for more than 10 minutes, stop and engage them directly.",
        "tags": ["couple", "engagement", "objection"]
    },
    {
        "content_id": "breakdown_13",
        "title": "The Price Anchor Mistake",
        "description": "Client guessed a price before reveal. Rep confirmed it was close. Deal died.",
        "type": "deal_breakdown",
        "difficulty": "intermediate",
        "duration": 5,
        "scenario": "Mid-tour, client asked: 'So this is probably like $50,000, right?' Rep responded: 'Actually, it's around $45,000.' Client mentally anchored to 'expensive' for the rest of the tour.",
        "what_happened": "Rep answered a price question before building enough value. The number became the focus instead of the lifestyle.",
        "control_analysis": "Premature price discussion shifts the conversation from value to cost. The rep lost control of the narrative.",
        "better_move": "'I want to make sure I show you the right options before we talk numbers. What matters more to you - having the most flexibility or getting the best value for a specific destination?'",
        "key_move": "Defer price questions until you've built full value. 'Let me show you what's possible first.'",
        "practice_prompt": "Practice deflecting early price questions smoothly without being evasive.",
        "tags": ["price", "control", "value"]
    },
    {
        "content_id": "breakdown_14",
        "title": "The Overwhelmed Buyer",
        "description": "Rep showed too many options. Client got confused and couldn't decide.",
        "type": "deal_breakdown",
        "difficulty": "intermediate",
        "duration": 5,
        "scenario": "Rep showed five different ownership levels, three destination options, and multiple payment plans. Client said: 'This is a lot. We need to go home and sort through all this.'",
        "what_happened": "Too many choices created decision paralysis. The client couldn't process it all and defaulted to 'no decision.'",
        "control_analysis": "Control was lost through over-presentation. The rep thought more options meant better service. It meant more confusion.",
        "better_move": "'Based on what you've told me about your family, I think there's really only one option that makes sense. Let me show you why.'",
        "key_move": "Recommend one clear option. Guide them to a decision, don't give them a menu.",
        "practice_prompt": "After discovery, mentally choose ONE option before presenting anything.",
        "tags": ["control", "presentation", "closing"]
    },
    {
        "content_id": "breakdown_15",
        "title": "The Last-Minute Cancellation",
        "description": "Deal was signed. Client called the next day to cancel.",
        "type": "deal_breakdown",
        "difficulty": "advanced",
        "duration": 6,
        "scenario": "Successful close. Paperwork completed. Client seemed happy. 24 hours later, they called to cancel within the rescission period.",
        "what_happened": "Rep rushed the paperwork and didn't reinforce the decision. Client went home, had doubts, and no one was there to address them.",
        "control_analysis": "The sale was completed but not protected. Post-decision reinforcement is as important as the close itself.",
        "better_move": "Before they leave: 'You made a great decision today. The first thing that might happen when you get home is you'll second-guess yourself. That's normal. When that happens, call me directly. Don't cancel - call me first.'",
        "key_move": "Inoculate against buyer's remorse before it happens. Name it, normalize it, and give them an action.",
        "practice_prompt": "Add a 'remorse inoculation' statement to your post-close process.",
        "tags": ["post-decision", "cancellation", "retention"]
    }
]

# ============== QUICK WINS (20 total) ==============

QUICK_WINS = [
    {
        "content_id": "qw_1",
        "title": "Recover Control in 10 Seconds",
        "description": "What to do when the buyer has taken over the conversation.",
        "type": "quick_win",
        "difficulty": "beginner",
        "duration": 3,
        "situation": "Buyer has taken over the conversation. You're answering rapid questions. They're steering.",
        "the_move": "Pause, then redirect with a question that re-establishes your authority.",
        "example": "'Those are great questions, and I want to make sure I answer all of them. Before I do - what's the most important thing you're trying to figure out right now? Let me focus there first.'",
        "key_move": "Pause. Acknowledge. Redirect with YOUR question.",
        "tags": ["control", "recovery", "before_tour"]
    },
    {
        "content_id": "qw_2",
        "title": "Break the 'Think About It' Stall",
        "description": "When they hit you with the classic stall at closing time.",
        "type": "quick_win",
        "difficulty": "intermediate",
        "duration": 3,
        "situation": "At the close. They seem interested but hit you with the classic stall.",
        "the_move": "Don't accept it. Clarify what 'think about it' actually means.",
        "example": "'Absolutely, I want you to feel great about this. When you say think about it - is it the investment, the timing, or something specific about the membership? I want to make sure I've addressed everything.'",
        "key_move": "Ask: 'What specifically do you need to think about?'",
        "tags": ["objection", "closing", "before_tour"]
    },
    {
        "content_id": "qw_3",
        "title": "Create Urgency Without Pressure",
        "description": "When the buyer is interested but not feeling the need to decide today.",
        "type": "quick_win",
        "difficulty": "intermediate",
        "duration": 3,
        "situation": "Buyer is interested but not feeling the need to decide today.",
        "the_move": "Use legitimate scarcity - availability, pricing windows, or their own timeline.",
        "example": "'I don't want to create artificial pressure. What I do know is that the pricing we discussed today is based on current availability. I can't guarantee the same options will be here if you come back next week. Let's see if we can find a way to make this work today.'",
        "key_move": "Use real scarcity, not manufactured pressure.",
        "tags": ["closing", "urgency"]
    },
    {
        "content_id": "qw_4",
        "title": "Reset After Price Shock",
        "description": "When you reveal the price and their face changes.",
        "type": "quick_win",
        "difficulty": "intermediate",
        "duration": 3,
        "situation": "You've revealed the price. Their face changed. Energy dropped.",
        "the_move": "Acknowledge the reaction. Don't pretend it didn't happen.",
        "example": "'I can see that number hit differently than you expected. Let's talk about that. Is it the total that concerns you, or are we talking about making it fit your monthly budget? Because those are two different conversations.'",
        "key_move": "Acknowledge the reaction, then clarify: total or monthly?",
        "tags": ["price", "recovery", "before_tour"]
    },
    {
        "content_id": "qw_5",
        "title": "Handle 'We're Just Looking'",
        "description": "When they try to set low expectations early in the tour.",
        "type": "quick_win",
        "difficulty": "beginner",
        "duration": 2,
        "situation": "Early in the tour. They're trying to set low expectations.",
        "the_move": "Accept it gracefully, then reframe the purpose of the tour.",
        "example": "'Perfect - that's exactly what today is for. My only goal is to show you what's possible and let you decide if it fits your family. No pressure. But I do have one request: keep an open mind and tell me honestly what you like and what you don't. Deal?'",
        "key_move": "Accept it, then ask for an open mind.",
        "tags": ["objection", "opening", "before_tour"]
    },
    {
        "content_id": "qw_6",
        "title": "Re-engage the Quiet Buyer",
        "description": "When one partner is engaged and the other has gone silent.",
        "type": "quick_win",
        "difficulty": "intermediate",
        "duration": 3,
        "situation": "One partner is engaged, the other has gone silent.",
        "the_move": "Directly but softly bring them back into the conversation.",
        "example": "'[Name], I want to make sure I'm not missing what's important to you. What matters most to you when it comes to family vacations? I've been hearing a lot from [partner] but I want to know your perspective.'",
        "key_move": "Call them by name. Ask for their specific perspective.",
        "tags": ["engagement", "control", "couple"]
    },
    {
        "content_id": "qw_7",
        "title": "Answer 'That's Too Expensive'",
        "description": "When they give you the direct price objection.",
        "type": "quick_win",
        "difficulty": "intermediate",
        "duration": 3,
        "situation": "Direct price objection. They've said the number is too high.",
        "the_move": "Don't defend. Explore. Find out what 'too expensive' means to them.",
        "example": "'I hear you. Help me understand: too expensive compared to what? Are we talking about what you budgeted for today, or too expensive for the value you're seeing? Because those need different solutions.'",
        "key_move": "Ask: 'Too expensive compared to what?'",
        "tags": ["price", "objection", "before_tour"]
    },
    {
        "content_id": "qw_8",
        "title": "Handle the Missing Spouse",
        "description": "When one partner loves it but 'can't decide alone.'",
        "type": "quick_win",
        "difficulty": "intermediate",
        "duration": 3,
        "situation": "One partner present. They love it but 'can't decide alone.'",
        "the_move": "Get them to sell their partner for you. Arm them with ammunition.",
        "example": "'I totally respect that. Here's what I'm wondering: if you could show your husband everything you saw today, what would be the three things that would get him excited? Let's make sure those are crystal clear so you can share them confidently.'",
        "key_move": "Make them your advocate. Arm them with talking points.",
        "tags": ["objection", "spouse", "before_tour"]
    },
    {
        "content_id": "qw_9",
        "title": "Deflect Early Price Questions",
        "description": "When they ask 'how much?' five minutes into the tour.",
        "type": "quick_win",
        "difficulty": "beginner",
        "duration": 2,
        "situation": "Five minutes in, they ask 'how much is this going to cost?'",
        "the_move": "Defer without being evasive. Promise to get there.",
        "example": "'Great question - I promise we'll get there. Here's why I want to wait: the investment depends on what fits your family best. Once I understand what you're looking for, I can show you options that actually make sense. Fair?'",
        "key_move": "Promise you'll cover it. Ask for patience.",
        "tags": ["price", "control", "before_tour"]
    },
    {
        "content_id": "qw_10",
        "title": "Stack Value Before Numbers",
        "description": "How to maximize impact right before the price reveal.",
        "type": "quick_win",
        "difficulty": "intermediate",
        "duration": 3,
        "situation": "You're approaching the price reveal and want to maximize impact.",
        "the_move": "Stack the value verbally before showing any numbers.",
        "example": "'Before I show you the investment, let me recap what you're getting: [list benefits they specifically responded to]. When you add all of that up, we're talking about completely changing how your family vacations for years to come. Now let me show you what that investment looks like.'",
        "key_move": "Recap their specific benefits before the number.",
        "tags": ["value", "closing", "before_tour"]
    },
    {
        "content_id": "qw_11",
        "title": "The Discovery Power Question",
        "description": "One question that reveals their deepest vacation motivation.",
        "type": "quick_win",
        "difficulty": "beginner",
        "duration": 2,
        "situation": "You need to uncover what they really want from vacations.",
        "the_move": "Ask the question that goes beyond logistics to emotion.",
        "example": "'If time and money weren't factors at all, and you could design the perfect vacation experience for your family - what would it look like?'",
        "key_move": "Remove constraints. Let them dream. Listen for emotions.",
        "tags": ["discovery", "questions", "before_tour"]
    },
    {
        "content_id": "qw_12",
        "title": "The Anchor Moment Technique",
        "description": "Create a memorable moment they'll think about after they leave.",
        "type": "quick_win",
        "difficulty": "intermediate",
        "duration": 3,
        "situation": "Mid-tour, you want to create emotional anchoring.",
        "the_move": "Create a physical or visual memory tied to the experience.",
        "example": "'Take a photo right here. This view is where your kids will come running every morning on vacation. I want you to have this to show them tonight.'",
        "key_move": "Create a tangible memory they take with them.",
        "tags": ["value", "emotion", "anchoring"]
    },
    {
        "content_id": "qw_13",
        "title": "The Commitment Ladder",
        "description": "Get small yeses that lead to the big yes.",
        "type": "quick_win",
        "difficulty": "intermediate",
        "duration": 3,
        "situation": "You need to build toward the close throughout the presentation.",
        "the_move": "Ask for small commitments that stack toward the decision.",
        "example": "'You love the location, right?' [Yes] 'And this would work for your family's schedule?' [Yes] 'The amenities check all your boxes?' [Yes] 'Then let's talk about making this happen.'",
        "key_move": "Collect small yeses throughout. Reference them at close.",
        "tags": ["closing", "commitment", "technique"]
    },
    {
        "content_id": "qw_14",
        "title": "Break Decision Paralysis",
        "description": "When they can't decide between options.",
        "type": "quick_win",
        "difficulty": "intermediate",
        "duration": 3,
        "situation": "They're stuck between two options and can't decide.",
        "the_move": "Make a clear recommendation based on what they told you.",
        "example": "'Based on everything you've shared about your family - the kids' ages, how often you travel, where you like to go - I would go with Option A. Here's why: [specific reasons]. Does that feel right to you?'",
        "key_move": "Don't give a menu. Give a recommendation.",
        "tags": ["closing", "decision", "control"]
    },
    {
        "content_id": "qw_15",
        "title": "The 'What Changed?' Recovery",
        "description": "When their energy drops suddenly and you don't know why.",
        "type": "quick_win",
        "difficulty": "intermediate",
        "duration": 2,
        "situation": "They were excited, then suddenly they're not. Something shifted.",
        "the_move": "Call it out directly but non-confrontationally.",
        "example": "'I noticed something just changed. A minute ago you seemed excited, and now I'm sensing some hesitation. What's on your mind? I'd rather address it now than have it come up later.'",
        "key_move": "Name the shift. Ask what changed.",
        "tags": ["recovery", "control", "engagement"]
    },
    {
        "content_id": "qw_16",
        "title": "Handle the Friend's Warning",
        "description": "When they mention someone told them not to buy.",
        "type": "quick_win",
        "difficulty": "intermediate",
        "duration": 3,
        "situation": "They mention a friend or family member warned them about timeshares.",
        "the_move": "Don't dismiss it. Explore it. Then differentiate.",
        "example": "'I appreciate you mentioning that. Do you know specifically what went wrong for them? [Listen] That's actually a great example of why we do things differently. Let me show you exactly how we've addressed those concerns.'",
        "key_move": "Ask what specifically went wrong. Then differentiate.",
        "tags": ["objection", "trust", "before_tour"]
    },
    {
        "content_id": "qw_17",
        "title": "The Assumptive Close",
        "description": "Moving to paperwork without asking 'do you want to buy?'",
        "type": "quick_win",
        "difficulty": "advanced",
        "duration": 2,
        "situation": "They've given buying signals. Time to close.",
        "the_move": "Assume the sale and move to logistics.",
        "example": "'Let me get the paperwork started so we can lock this in for you. Do you want to use the same card you put down for the deposit, or a different one?'",
        "key_move": "Don't ask 'do you want to buy?' Ask 'how do you want to pay?'",
        "tags": ["closing", "technique", "advanced"]
    },
    {
        "content_id": "qw_18",
        "title": "The Remorse Inoculation",
        "description": "Preventing cancellation before they leave.",
        "type": "quick_win",
        "difficulty": "intermediate",
        "duration": 3,
        "situation": "They've said yes. Paperwork is done. They're about to leave.",
        "the_move": "Name the doubt they'll feel and give them a response.",
        "example": "'You made a great decision today. Here's what might happen: when you get home, you might second-guess yourself. That's completely normal. When that happens, don't panic - call me directly. I'll walk you through it. Deal?'",
        "key_move": "Name the doubt. Normalize it. Give them an action.",
        "tags": ["post-decision", "retention", "closing"]
    },
    {
        "content_id": "qw_19",
        "title": "The Cost of Waiting",
        "description": "Helping them see what they lose by not deciding.",
        "type": "quick_win",
        "difficulty": "intermediate",
        "duration": 3,
        "situation": "They want to 'wait and see' or 'think about it.'",
        "the_move": "Calculate the cost of inaction.",
        "example": "'How many family vacations have you missed in the last 3 years because you didn't have a plan? What's that worth? That's the real cost of waiting - it's not money, it's the memories you won't make.'",
        "key_move": "Make inaction expensive. Count the lost memories.",
        "tags": ["urgency", "closing", "value"]
    },
    {
        "content_id": "qw_20",
        "title": "The Bridge Statement",
        "description": "Moving smoothly between tour phases.",
        "type": "quick_win",
        "difficulty": "beginner",
        "duration": 2,
        "situation": "You need to transition from one part of the tour to another.",
        "the_move": "Connect what they just saw to what they told you they wanted.",
        "example": "'Now that you've seen the resort and the amenities, let me show you how this connects to what you mentioned earlier about wanting [their specific goal]. This is where it all comes together.'",
        "key_move": "Bridge: 'Now that you've seen X, let me show you how it connects to Y.'",
        "tags": ["control", "transitions", "before_tour"]
    }
]

# ============== BADGE DEFINITIONS ==============

BADGES = [
    {"badge_id": "badge_foundation", "name": "Foundation Builder", "description": "Completed Track 1: Pro Mindset", "criteria": "Complete all modules in Track 1", "criteria_type": "track_complete", "criteria_value": "track_1", "icon": "foundation", "order": 1},
    {"badge_id": "badge_discovery", "name": "Discovery Master", "description": "Completed Track 2: Discovery & Control", "criteria": "Complete all modules in Track 2", "criteria_type": "track_complete", "criteria_value": "track_2", "icon": "search", "order": 2},
    {"badge_id": "badge_value", "name": "Value Architect", "description": "Completed Track 3: Value Architecture", "criteria": "Complete all modules in Track 3", "criteria_type": "track_complete", "criteria_value": "track_3", "icon": "diamond", "order": 3},
    {"badge_id": "badge_decision", "name": "Decision Controller", "description": "Completed Track 4: Decision Management", "criteria": "Complete all modules in Track 4", "criteria_type": "track_complete", "criteria_value": "track_4", "icon": "target", "order": 4},
    {"badge_id": "badge_objection", "name": "Objection Handler", "description": "Completed Track 5: Objection Mastery", "criteria": "Complete all modules in Track 5", "criteria_type": "track_complete", "criteria_value": "track_5", "icon": "shield", "order": 5},
    {"badge_id": "badge_integrity", "name": "Integrity Closer", "description": "Completed Track 6: Post-Decision Integrity", "criteria": "Complete all modules in Track 6", "criteria_type": "track_complete", "criteria_value": "track_6", "icon": "lock", "order": 6},
    {"badge_id": "badge_analyst", "name": "Deal Analyst", "description": "Reviewed 10 Deal Breakdowns", "criteria": "Review 10 deal breakdowns", "criteria_type": "content_count", "criteria_value": "deal_breakdown:10", "icon": "magnifier", "order": 7},
    {"badge_id": "badge_tactician", "name": "Sales Tactician", "description": "Applied 15 Quick Wins", "criteria": "Apply 15 Quick Wins", "criteria_type": "content_count", "criteria_value": "quick_win:15", "icon": "zap", "order": 8},
    {"badge_id": "badge_consistent", "name": "Consistent Learner", "description": "14-day training streak", "criteria": "Maintain a 14-day training streak", "criteria_type": "streak", "criteria_value": "14", "icon": "flame", "order": 9},
    {"badge_id": "badge_ready", "name": "Top Producer Ready", "description": "Achieved 80+ Readiness Score", "criteria": "Reach 80+ Readiness Score", "criteria_type": "score_threshold", "criteria_value": "80", "icon": "chart", "order": 10},
    {"badge_id": "badge_topproducer", "name": "Top Producer", "description": "Completed all tracks and reached elite status", "criteria": "Complete all 6 tracks", "criteria_type": "stage", "criteria_value": "4", "icon": "trophy", "order": 11}
]

# ============== HELPER FUNCTIONS ==============

def get_content_by_id(content_id: str) -> Optional[Dict]:
    """Get content item by ID from any content type"""
    for item in CONTENT:
        if item["content_id"] == content_id:
            return item
    for item in DEAL_BREAKDOWNS:
        if item["content_id"] == content_id:
            return item
    for item in QUICK_WINS:
        if item["content_id"] == content_id:
            return item
    return None

def get_track_modules(track_id: str) -> List[Dict]:
    """Get all modules for a track with content details"""
    track_content = [tc for tc in TRACK_CONTENT if tc["track_id"] == track_id]
    modules = []
    for tc in sorted(track_content, key=lambda x: x["order_index"]):
        content = get_content_by_id(tc["content_id"])
        if content:
            modules.append({
                **content,
                "module_number": tc["module_number"],
                "order": tc["order_index"]
            })
    return modules

def calculate_readiness_score(progress: Dict) -> int:
    """
    Calculate Readiness Score based on:
    - Video Completion (40%)
    - Track Progress (30%)
    - Quick Wins Applied (10%)
    - Deal Breakdowns Reviewed (10%)
    - Training Streak (10%)
    """
    total_modules = len(CONTENT)
    completed = len(progress.get("content_completed", []))
    module_completion = (completed / total_modules) if total_modules > 0 else 0
    
    # Track progress average
    tracks_progress = progress.get("tracks_progress", {})
    track_avg = sum(tracks_progress.values()) / len(TRACKS) if tracks_progress else 0
    
    # Quick wins (out of 20)
    qw_completed = len([c for c in progress.get("content_completed", []) if c.startswith("qw_")])
    qw_score = min(qw_completed / 20, 1)
    
    # Deal breakdowns (out of 15)
    bd_completed = len([c for c in progress.get("content_completed", []) if c.startswith("breakdown_")])
    bd_score = min(bd_completed / 15, 1)
    
    # Streak (max 14 days)
    streak = progress.get("training_streak", 0)
    streak_score = min(streak / 14, 1)
    
    readiness = int(
        (module_completion * 40) +
        (track_avg / 100 * 30) +
        (qw_score * 10) +
        (bd_score * 10) +
        (streak_score * 10)
    )
    
    return min(readiness, 100)

def check_badge_earned(badge: Dict, progress: Dict) -> bool:
    """Check if user has earned a specific badge"""
    criteria_type = badge["criteria_type"]
    criteria_value = badge["criteria_value"]
    
    if criteria_type == "track_complete":
        return progress.get("tracks_progress", {}).get(criteria_value, 0) >= 100
    
    elif criteria_type == "content_count":
        content_type, count = criteria_value.split(":")
        count = int(count)
        if content_type == "deal_breakdown":
            completed = len([c for c in progress.get("content_completed", []) if c.startswith("breakdown_")])
        elif content_type == "quick_win":
            completed = len([c for c in progress.get("content_completed", []) if c.startswith("qw_")])
        else:
            completed = 0
        return completed >= count
    
    elif criteria_type == "streak":
        return progress.get("training_streak", 0) >= int(criteria_value)
    
    elif criteria_type == "score_threshold":
        return calculate_readiness_score(progress) >= int(criteria_value)
    
    elif criteria_type == "stage":
        return progress.get("current_stage", 1) >= int(criteria_value)
    
    return False

def update_training_streak(progress: Dict) -> Dict:
    """Update training streak based on activity"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    last_date = progress.get("streak_last_date")
    
    if last_date == today:
        # Already trained today
        return progress
    
    if last_date:
        last = datetime.strptime(last_date, "%Y-%m-%d")
        today_dt = datetime.strptime(today, "%Y-%m-%d")
        diff = (today_dt - last).days
        
        if diff == 1:
            # Consecutive day - increment streak
            progress["training_streak"] = progress.get("training_streak", 0) + 1
        elif diff > 1:
            # Streak broken - reset
            progress["training_streak"] = 1
    else:
        # First training day
        progress["training_streak"] = 1
    
    progress["streak_last_date"] = today
    return progress

# ============== API ROUTES ==============

@phase1_router.get("/stages")
async def get_stages():
    """Get all stage definitions"""
    return STAGES

@phase1_router.get("/tracks")
async def get_tracks():
    """Get all tracks with module summaries"""
    tracks_with_modules = []
    for track in TRACKS:
        modules = get_track_modules(track["track_id"])
        tracks_with_modules.append({
            **track,
            "modules": modules,
            "module_count": len(modules)
        })
    return tracks_with_modules

@phase1_router.get("/tracks/{track_id}")
async def get_track(track_id: str):
    """Get single track with all module details"""
    track = next((t for t in TRACKS if t["track_id"] == track_id), None)
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    
    modules = get_track_modules(track_id)
    return {
        **track,
        "modules": modules,
        "module_count": len(modules)
    }

@phase1_router.get("/content/{content_id}")
async def get_content(content_id: str, user: User = Depends(require_auth)):
    """Get single content item with full details"""
    content = get_content_by_id(content_id)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content

@phase1_router.get("/badges")
async def get_badges():
    """Get all badge definitions"""
    return sorted(BADGES, key=lambda x: x["order"])

@phase1_router.get("/breakdowns")
async def get_breakdowns(user: User = Depends(require_auth)):
    """Get all deal breakdowns"""
    return sorted(DEAL_BREAKDOWNS, key=lambda x: x["content_id"])

@phase1_router.get("/breakdowns/{breakdown_id}")
async def get_breakdown(breakdown_id: str, user: User = Depends(require_auth)):
    """Get single deal breakdown"""
    breakdown = next((b for b in DEAL_BREAKDOWNS if b["content_id"] == breakdown_id), None)
    if not breakdown:
        raise HTTPException(status_code=404, detail="Breakdown not found")
    return breakdown

@phase1_router.get("/quickwins")
async def get_quickwins(tag: Optional[str] = None, user: User = Depends(require_auth)):
    """Get quick wins, optionally filtered by tag"""
    wins = QUICK_WINS
    if tag:
        wins = [w for w in wins if tag in w.get("tags", [])]
    return sorted(wins, key=lambda x: x["content_id"])

@phase1_router.get("/quickwins/{quickwin_id}")
async def get_quickwin(quickwin_id: str, user: User = Depends(require_auth)):
    """Get single quick win"""
    win = next((w for w in QUICK_WINS if w["content_id"] == quickwin_id), None)
    if not win:
        raise HTTPException(status_code=404, detail="Quick win not found")
    return win

@phase1_router.get("/progress")
async def get_user_progress(user: User = Depends(require_auth)):
    """Get comprehensive user progress"""
    progress = await db.user_progress.find_one({"user_id": user.user_id}, {"_id": 0})
    
    if not progress:
        progress = {
            "user_id": user.user_id,
            "current_stage": 1,
            "stage_started_at": datetime.now(timezone.utc).isoformat(),
            "tracks_progress": {t["track_id"]: 0 for t in TRACKS},
            "content_completed": [],
            "badges_earned": [],
            "training_streak": 0,
            "streak_last_date": None,
            "last_activity": datetime.now(timezone.utc).isoformat(),
            "readiness_score": 0,
            "total_training_time": 0
        }
        await db.user_progress.insert_one(progress)
    
    # Calculate current readiness score
    readiness_score = calculate_readiness_score(progress)
    progress["readiness_score"] = readiness_score
    
    # Check for new badges
    earned_badges = []
    for badge in BADGES:
        if badge["badge_id"] not in progress.get("badges_earned", []):
            if check_badge_earned(badge, progress):
                earned_badges.append(badge["badge_id"])
    
    if earned_badges:
        progress["badges_earned"] = progress.get("badges_earned", []) + earned_badges
        await db.user_progress.update_one(
            {"user_id": user.user_id},
            {"$set": {"badges_earned": progress["badges_earned"], "readiness_score": readiness_score}}
        )
    
    # Get current and next stage
    current_stage = next((s for s in STAGES if s["stage_number"] == progress.get("current_stage", 1)), STAGES[0])
    next_stage = next((s for s in STAGES if s["stage_number"] == progress.get("current_stage", 1) + 1), None)
    
    # Determine next assignment
    next_assignment = None
    for track in TRACKS:
        if progress.get("tracks_progress", {}).get(track["track_id"], 0) < 100:
            modules = get_track_modules(track["track_id"])
            for mod in modules:
                if mod["content_id"] not in progress.get("content_completed", []):
                    next_assignment = {
                        "type": "module",
                        "track": track["name"],
                        "track_id": track["track_id"],
                        "content": mod
                    }
                    break
            if next_assignment:
                break
    
    # Stats
    total_modules = len(CONTENT)
    completed_modules = len([c for c in progress.get("content_completed", []) if c.startswith("mod_")])
    completed_breakdowns = len([c for c in progress.get("content_completed", []) if c.startswith("breakdown_")])
    completed_quickwins = len([c for c in progress.get("content_completed", []) if c.startswith("qw_")])
    
    return {
        "progress": progress,
        "current_stage": current_stage,
        "next_stage": next_stage,
        "readiness_score": readiness_score,
        "next_assignment": next_assignment,
        "newly_earned_badges": earned_badges,
        "stats": {
            "modules_completed": completed_modules,
            "total_modules": total_modules,
            "breakdowns_reviewed": completed_breakdowns,
            "total_breakdowns": len(DEAL_BREAKDOWNS),
            "quickwins_applied": completed_quickwins,
            "total_quickwins": len(QUICK_WINS),
            "badges_earned": len(progress.get("badges_earned", [])),
            "total_badges": len(BADGES),
            "training_streak": progress.get("training_streak", 0)
        }
    }

@phase1_router.post("/content/{content_id}/complete")
async def complete_content(content_id: str, user: User = Depends(require_auth)):
    """Mark any content as complete (module, breakdown, quick win)"""
    content = get_content_by_id(content_id)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    progress = await db.user_progress.find_one({"user_id": user.user_id}, {"_id": 0})
    if not progress:
        progress = {
            "user_id": user.user_id,
            "current_stage": 1,
            "stage_started_at": datetime.now(timezone.utc).isoformat(),
            "tracks_progress": {t["track_id"]: 0 for t in TRACKS},
            "content_completed": [],
            "badges_earned": [],
            "training_streak": 0,
            "streak_last_date": None,
            "last_activity": datetime.now(timezone.utc).isoformat()
        }
    
    points_earned = 0
    
    if content_id not in progress.get("content_completed", []):
        progress["content_completed"] = progress.get("content_completed", []) + [content_id]
        
        # Update track progress if it's a module
        if content_id.startswith("mod_"):
            # Find which track this module belongs to
            track_mapping = next((tc for tc in TRACK_CONTENT if tc["content_id"] == content_id), None)
            if track_mapping:
                track_id = track_mapping["track_id"]
                track_modules = get_track_modules(track_id)
                completed_in_track = len([m for m in track_modules if m["content_id"] in progress["content_completed"]])
                track_progress = (completed_in_track / len(track_modules)) * 100 if track_modules else 0
                progress["tracks_progress"][track_id] = track_progress
            points_earned = 10
        elif content_id.startswith("breakdown_"):
            points_earned = 5
        elif content_id.startswith("qw_"):
            points_earned = 3
        
        # Update streak
        progress = update_training_streak(progress)
        
        # Update last activity
        progress["last_activity"] = datetime.now(timezone.utc).isoformat()
        
        # Add training time
        progress["total_training_time"] = progress.get("total_training_time", 0) + content.get("duration", 0)
        
        # Award points
        if points_earned > 0:
            await db.users.update_one(
                {"user_id": user.user_id},
                {"$inc": {"points": points_earned}}
            )
        
        # Save progress
        await db.user_progress.update_one(
            {"user_id": user.user_id},
            {"$set": progress},
            upsert=True
        )
        
        # Log activity
        activity = {
            "activity_id": f"act_{uuid.uuid4().hex[:12]}",
            "user_id": user.user_id,
            "content_id": content_id,
            "activity_type": "completed",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.user_activity.insert_one(activity)
    
    # Check for stage advancement
    stage_advanced = False
    current_stage = progress.get("current_stage", 1)
    if current_stage < 4:
        next_stage_def = STAGES[current_stage]  # 0-indexed, so current_stage gets the next one
        required_tracks = next_stage_def.get("required_tracks", [])
        
        if required_tracks != ["all"]:
            all_complete = all(
                progress.get("tracks_progress", {}).get(tid, 0) >= 100 
                for tid in required_tracks
            )
            if all_complete:
                progress["current_stage"] = current_stage + 1
                progress["stage_started_at"] = datetime.now(timezone.utc).isoformat()
                stage_advanced = True
                await db.user_progress.update_one(
                    {"user_id": user.user_id},
                    {"$set": {"current_stage": progress["current_stage"], "stage_started_at": progress["stage_started_at"]}}
                )
    
    return {
        "success": True,
        "points_earned": points_earned,
        "streak": progress.get("training_streak", 0),
        "stage_advanced": stage_advanced,
        "new_stage": progress.get("current_stage") if stage_advanced else None
    }

# ============== BOOKMARKS API ==============

@phase1_router.get("/bookmarks")
async def get_bookmarks(tag: Optional[str] = None, user: User = Depends(require_auth)):
    """Get user's bookmarks, optionally filtered by tag"""
    query = {"user_id": user.user_id}
    if tag:
        query["tag"] = tag
    
    bookmarks = await db.bookmarks.find(query, {"_id": 0}).to_list(100)
    
    # Enrich with content details
    enriched = []
    for bm in bookmarks:
        content = get_content_by_id(bm["content_id"])
        if content:
            enriched.append({
                **bm,
                "content": content
            })
    
    return enriched

@phase1_router.post("/bookmarks")
async def create_bookmark(request: Request, user: User = Depends(require_auth)):
    """Create a bookmark (Watch Later)"""
    body = await request.json()
    content_id = body.get("content_id")
    tag = body.get("tag", "general")
    notes = body.get("notes")
    
    content = get_content_by_id(content_id)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    # Check if already bookmarked
    existing = await db.bookmarks.find_one(
        {"user_id": user.user_id, "content_id": content_id},
        {"_id": 0}
    )
    if existing:
        # Update tag if different
        if existing.get("tag") != tag:
            await db.bookmarks.update_one(
                {"user_id": user.user_id, "content_id": content_id},
                {"$set": {"tag": tag, "notes": notes}}
            )
        return {"success": True, "message": "Bookmark updated"}
    
    bookmark = {
        "bookmark_id": f"bm_{uuid.uuid4().hex[:12]}",
        "user_id": user.user_id,
        "content_id": content_id,
        "tag": tag,
        "notes": notes,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.bookmarks.insert_one(bookmark)
    
    return {"success": True, "bookmark_id": bookmark["bookmark_id"]}

@phase1_router.delete("/bookmarks/{content_id}")
async def delete_bookmark(content_id: str, user: User = Depends(require_auth)):
    """Remove a bookmark"""
    result = await db.bookmarks.delete_one({"user_id": user.user_id, "content_id": content_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    return {"success": True}

# ============== PRE-TOUR TACTICAL MODE ==============

@phase1_router.get("/tactical/before-tour")
async def get_before_tour_content(user: User = Depends(require_auth)):
    """Get curated content for pre-tour preparation"""
    # Get user's bookmarked before_tour content
    bookmarks = await db.bookmarks.find(
        {"user_id": user.user_id, "tag": "before_tour"},
        {"_id": 0}
    ).to_list(20)
    
    bookmarked_content = []
    for bm in bookmarks:
        content = get_content_by_id(bm["content_id"])
        if content:
            bookmarked_content.append(content)
    
    # Get before_tour tagged content from library
    suggested_modules = [c for c in CONTENT if "before_tour" in c.get("tags", [])][:5]
    suggested_quickwins = [q for q in QUICK_WINS if "before_tour" in q.get("tags", [])][:5]
    suggested_breakdowns = [b for b in DEAL_BREAKDOWNS if "before_tour" in b.get("tags", [])][:3]
    
    return {
        "bookmarked": bookmarked_content,
        "suggested_modules": suggested_modules,
        "suggested_quickwins": suggested_quickwins,
        "suggested_breakdowns": suggested_breakdowns,
        "total_duration": sum(c.get("duration", 0) for c in suggested_modules + suggested_quickwins)
    }

# ============== ACTIVITY TRACKING ==============

@phase1_router.post("/activity/log")
async def log_activity(request: Request, user: User = Depends(require_auth)):
    """Log user activity for analytics"""
    body = await request.json()
    content_id = body.get("content_id")
    activity_type = body.get("activity_type", "started")
    duration_spent = body.get("duration_spent")
    
    activity = {
        "activity_id": f"act_{uuid.uuid4().hex[:12]}",
        "user_id": user.user_id,
        "content_id": content_id,
        "activity_type": activity_type,
        "duration_spent": duration_spent,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.user_activity.insert_one(activity)
    
    return {"success": True}

# Legacy endpoint support - redirect old module endpoints
@phase1_router.post("/modules/{module_id}/complete")
async def complete_module_legacy(module_id: str, user: User = Depends(require_auth)):
    """Legacy endpoint - redirects to new content completion"""
    return await complete_content(module_id, user)

@phase1_router.post("/breakdowns/{breakdown_id}/review")
async def review_breakdown_legacy(breakdown_id: str, user: User = Depends(require_auth)):
    """Legacy endpoint - redirects to new content completion"""
    return await complete_content(breakdown_id, user)

@phase1_router.post("/quickwins/{quickwin_id}/apply")
async def apply_quickwin_legacy(quickwin_id: str, user: User = Depends(require_auth)):
    """Legacy endpoint - redirects to new content completion"""
    return await complete_content(quickwin_id, user)

# ============== EXPORT ==============

def get_phase1_router():
    return phase1_router
