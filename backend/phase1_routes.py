"""
VCSA Phase 1: Top Producer Development System
Data Models and API Routes
"""

from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid

# Import from main server
from server import db, require_auth, User

phase1_router = APIRouter(prefix="/api/development", tags=["development"])

# ============== DATA MODELS ==============

class Stage(BaseModel):
    stage_id: str
    stage_number: int  # 1-4
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
    track_number: int  # 1-6
    name: str
    purpose: str
    outcome: str
    modules: List[str] = []
    required_for_stages: List[int] = []
    total_duration: int = 0  # minutes

class Module(BaseModel):
    module_id: str
    track_id: str
    module_number: str  # e.g., "1.1", "2.3"
    title: str
    focus: str
    duration: int  # minutes
    order: int
    lesson_id: Optional[str] = None  # Links to existing lesson if available

class DealBreakdown(BaseModel):
    breakdown_id: str
    title: str
    scenario: str
    what_happened: str
    control_analysis: str
    better_move: str
    key_takeaway: str
    practice_prompt: str
    tags: List[str] = []
    order: int
    created_at: datetime

class QuickWin(BaseModel):
    quickwin_id: str
    title: str
    situation: str
    the_move: str
    example: str
    duration: int  # minutes (2-5)
    tags: List[str] = []  # objection, control, close, recovery
    order: int
    created_at: datetime

class Badge(BaseModel):
    badge_id: str
    name: str
    description: str
    criteria: str
    icon: str
    order: int

class UserStageProgress(BaseModel):
    user_id: str
    current_stage: int = 1
    stage_started_at: datetime
    tracks_progress: Dict[str, float] = {}  # track_id: completion %
    modules_completed: List[str] = []
    breakdowns_reviewed: List[str] = []
    quickwins_applied: List[str] = []
    badges_earned: List[str] = []
    training_streak: int = 0
    last_activity: datetime
    readiness_score: int = 0

# ============== STAGE DEFINITIONS ==============

STAGES = [
    {
        "stage_id": "stage_1",
        "stage_number": 1,
        "name": "new_rep",
        "title": "New Rep",
        "objective": "Build foundation. Understand the structure of a winning presentation.",
        "key_skills": ["Tour flow", "Rapport basics", "Product knowledge", "Presentation structure"],
        "required_tracks": ["track_1", "track_2_intro", "track_3_intro"],
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
        "required_tracks": ["track_5", "track_4_intro"],
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
        "total_duration": 59
    },
    {
        "track_id": "track_2",
        "track_number": 2,
        "name": "Discovery & Control",
        "purpose": "Control the conversation from the first moment.",
        "outcome": "Rep owns the tour from start to finish.",
        "required_for_stages": [1],
        "total_duration": 75
    },
    {
        "track_id": "track_3",
        "track_number": 3,
        "name": "Value Architecture",
        "purpose": "Present value so compelling that price becomes secondary.",
        "outcome": "Rep builds value that makes closing natural.",
        "required_for_stages": [1],
        "total_duration": 75
    },
    {
        "track_id": "track_4",
        "track_number": 4,
        "name": "Decision Management",
        "purpose": "Guide buyers toward commitment without pressure.",
        "outcome": "Rep can guide any buyer to a clear decision point.",
        "required_for_stages": [2, 3],
        "total_duration": 95
    },
    {
        "track_id": "track_5",
        "track_number": 5,
        "name": "Objection Handling",
        "purpose": "Turn resistance into closing opportunities.",
        "outcome": "Rep handles any objection with confidence and structure.",
        "required_for_stages": [2],
        "total_duration": 119
    },
    {
        "track_id": "track_6",
        "track_number": 6,
        "name": "Post-Decision Integrity",
        "purpose": "Protect the sale and build lasting client relationships.",
        "outcome": "Rep protects deals and builds referral relationships.",
        "required_for_stages": [3],
        "total_duration": 62
    }
]

# ============== MODULE DEFINITIONS ==============

MODULES = [
    # Track 1: Pro Mindset
    {"module_id": "mod_1_1", "track_id": "track_1", "module_number": "1.1", "title": "Identity of a Top Producer", "focus": "Who you need to become", "duration": 12, "order": 1},
    {"module_id": "mod_1_2", "track_id": "track_1", "module_number": "1.2", "title": "The Performance Mindset", "focus": "Daily mental preparation", "duration": 10, "order": 2},
    {"module_id": "mod_1_3", "track_id": "track_1", "module_number": "1.3", "title": "Handling Rejection", "focus": "Why 'no' is part of the process", "duration": 15, "order": 3},
    {"module_id": "mod_1_4", "track_id": "track_1", "module_number": "1.4", "title": "Consistency Over Talent", "focus": "Systems beat motivation", "duration": 12, "order": 4},
    {"module_id": "mod_1_5", "track_id": "track_1", "module_number": "1.5", "title": "Ownership Mentality", "focus": "Taking control of your results", "duration": 10, "order": 5},
    
    # Track 2: Discovery & Control
    {"module_id": "mod_2_1", "track_id": "track_2", "module_number": "2.1", "title": "The Power Opening", "focus": "Capture attention in 60 seconds", "duration": 15, "order": 1},
    {"module_id": "mod_2_2", "track_id": "track_2", "module_number": "2.2", "title": "Building Rapport That Converts", "focus": "Connection with purpose", "duration": 12, "order": 2},
    {"module_id": "mod_2_3", "track_id": "track_2", "module_number": "2.3", "title": "Discovery Questions", "focus": "Understanding real motivations", "duration": 18, "order": 3},
    {"module_id": "mod_2_4", "track_id": "track_2", "module_number": "2.4", "title": "Identifying Buying Signals", "focus": "What to watch for", "duration": 14, "order": 4},
    {"module_id": "mod_2_5", "track_id": "track_2", "module_number": "2.5", "title": "Controlling Presentation Flow", "focus": "Never lose the frame", "duration": 16, "order": 5},
    
    # Track 3: Value Architecture
    {"module_id": "mod_3_1", "track_id": "track_3", "module_number": "3.1", "title": "Painting the Dream", "focus": "Visualization that sells", "duration": 15, "order": 1},
    {"module_id": "mod_3_2", "track_id": "track_3", "module_number": "3.2", "title": "Lifestyle Over Product", "focus": "Sell the outcome, not the membership", "duration": 12, "order": 2},
    {"module_id": "mod_3_3", "track_id": "track_3", "module_number": "3.3", "title": "Value Stacking", "focus": "Building undeniable worth", "duration": 18, "order": 3},
    {"module_id": "mod_3_4", "track_id": "track_3", "module_number": "3.4", "title": "Emotional Anchoring", "focus": "Creating memorable moments", "duration": 14, "order": 4},
    {"module_id": "mod_3_5", "track_id": "track_3", "module_number": "3.5", "title": "Price Positioning", "focus": "When and how to present numbers", "duration": 16, "order": 5},
    
    # Track 4: Decision Management (THE CRITICAL TRACK)
    {"module_id": "mod_4_1", "track_id": "track_4", "module_number": "4.1", "title": "The Decision Framework", "focus": "How buyers decide", "duration": 14, "order": 1},
    {"module_id": "mod_4_2", "track_id": "track_4", "module_number": "4.2", "title": "Creating Urgency Ethically", "focus": "Real reasons to act today", "duration": 16, "order": 2},
    {"module_id": "mod_4_3", "track_id": "track_4", "module_number": "4.3", "title": "Managing Indecision", "focus": "When they stall", "duration": 18, "order": 3},
    {"module_id": "mod_4_4", "track_id": "track_4", "module_number": "4.4", "title": "Preventing Presentation Drift", "focus": "Keeping momentum", "duration": 12, "order": 4},
    {"module_id": "mod_4_5", "track_id": "track_4", "module_number": "4.5", "title": "The Commitment Sequence", "focus": "Moving toward yes", "duration": 20, "order": 5},
    {"module_id": "mod_4_6", "track_id": "track_4", "module_number": "4.6", "title": "Decision Recovery", "focus": "When commitment wavers", "duration": 15, "order": 6},
    
    # Track 5: Objection Handling
    {"module_id": "mod_5_1", "track_id": "track_5", "module_number": "5.1", "title": "The Objection Mindset", "focus": "Why objections are positive", "duration": 10, "order": 1},
    {"module_id": "mod_5_2", "track_id": "track_5", "module_number": "5.2", "title": "The Price Objection", "focus": "'It's too expensive'", "duration": 18, "order": 2},
    {"module_id": "mod_5_3", "track_id": "track_5", "module_number": "5.3", "title": "The Spouse Objection", "focus": "'I need to talk to my partner'", "duration": 16, "order": 3},
    {"module_id": "mod_5_4", "track_id": "track_5", "module_number": "5.4", "title": "The Think About It", "focus": "'We need to sleep on it'", "duration": 18, "order": 4},
    {"module_id": "mod_5_5", "track_id": "track_5", "module_number": "5.5", "title": "The Comparison Objection", "focus": "'We want to look at other options'", "duration": 14, "order": 5},
    {"module_id": "mod_5_6", "track_id": "track_5", "module_number": "5.6", "title": "The Timing Objection", "focus": "'Not the right time'", "duration": 12, "order": 6},
    {"module_id": "mod_5_7", "track_id": "track_5", "module_number": "5.7", "title": "The Trust Objection", "focus": "'We've heard bad things'", "duration": 15, "order": 7},
    {"module_id": "mod_5_8", "track_id": "track_5", "module_number": "5.8", "title": "Stacked Objections", "focus": "When they throw multiple", "duration": 16, "order": 8},
    
    # Track 6: Post-Decision Integrity
    {"module_id": "mod_6_1", "track_id": "track_6", "module_number": "6.1", "title": "The Confirmation Moment", "focus": "Locking commitment", "duration": 12, "order": 1},
    {"module_id": "mod_6_2", "track_id": "track_6", "module_number": "6.2", "title": "Preventing Buyer's Remorse", "focus": "Before they leave", "duration": 14, "order": 2},
    {"module_id": "mod_6_3", "track_id": "track_6", "module_number": "6.3", "title": "The Paperwork Experience", "focus": "Making signing feel good", "duration": 10, "order": 3},
    {"module_id": "mod_6_4", "track_id": "track_6", "module_number": "6.4", "title": "Post-Sale Communication", "focus": "First 48 hours", "duration": 12, "order": 4},
    {"module_id": "mod_6_5", "track_id": "track_6", "module_number": "6.5", "title": "Referral Positioning", "focus": "Turning buyers into advocates", "duration": 14, "order": 5},
]

# ============== BADGE DEFINITIONS ==============

BADGES = [
    {"badge_id": "badge_foundation", "name": "Foundation Complete", "description": "Completed Pro Mindset + Discovery & Control intro", "criteria": "Complete Track 1 + Track 2 intro modules", "icon": "foundation", "order": 1},
    {"badge_id": "badge_objection", "name": "Objection Handler", "description": "Mastered objection handling techniques", "criteria": "Complete Track 5", "icon": "shield", "order": 2},
    {"badge_id": "badge_decision", "name": "Decision Controller", "description": "Mastered decision management", "criteria": "Complete Track 4", "icon": "target", "order": 3},
    {"badge_id": "badge_analyst", "name": "Deal Analyst", "description": "Studied real sales scenarios", "criteria": "Review 10 deal breakdowns", "icon": "search", "order": 4},
    {"badge_id": "badge_quickstudy", "name": "Quick Study", "description": "Applied tactical knowledge", "criteria": "Apply 15 Quick Wins", "icon": "zap", "order": 5},
    {"badge_id": "badge_consistent", "name": "Consistent Learner", "description": "Maintained training discipline", "criteria": "14-day training streak", "icon": "flame", "order": 6},
    {"badge_id": "badge_topproducer", "name": "Top Producer", "description": "Reached elite performer status", "criteria": "Reach Stage 4", "icon": "trophy", "order": 7},
]

# ============== INITIAL DEAL BREAKDOWNS ==============

DEAL_BREAKDOWNS = [
    {
        "breakdown_id": "breakdown_1",
        "title": "Lost Control After Price Reveal",
        "scenario": "Mid-tour with engaged couple. Strong rapport built. Value presentation went well. Upon price reveal, buyer's energy completely shifted. Started asking rapid-fire questions about competitors.",
        "what_happened": "Rep revealed price without proper setup. No urgency framework established. Buyer took control of conversation with comparison questions.",
        "control_analysis": "Control was lost at the price transition. Rep didn't anchor value strongly enough before numbers. No 'before I show you the investment' bridge.",
        "better_move": "Before price reveal: 'Based on everything we've discussed about your family's vacation goals, I want to make sure this makes sense for you. Before I show you the investment, let me ask - if the numbers work, is this something you'd want to move forward with today?'",
        "key_takeaway": "Always get a conditional commitment before revealing price. This pre-frames the decision and maintains control.",
        "practice_prompt": "Next time you're about to reveal price, pause and ask for a conditional commitment first.",
        "tags": ["price", "control", "close"],
        "order": 1
    },
    {
        "breakdown_id": "breakdown_2",
        "title": "The Missing Spouse Objection",
        "scenario": "Wife on tour alone. Husband 'back at the hotel.' She loved everything, emotionally connected to the product. When it came to close: 'I can't make this decision without my husband.'",
        "what_happened": "Rep didn't qualify decision-making authority early. Spent 90 minutes building value with someone who couldn't say yes alone.",
        "control_analysis": "Control was lost in the first 10 minutes by not identifying the decision-making dynamic. The close was dead before it started.",
        "better_move": "Early in tour: 'I want to make sure I give you the best experience today. When it comes to big family decisions like vacations, how do you and your husband typically decide together? Is he the type who trusts your judgment, or does he need to see everything himself?'",
        "key_takeaway": "Qualify decision-making authority in the first 15 minutes. Adjust your approach based on the answer.",
        "practice_prompt": "Add a decision-authority question to your opening discovery sequence.",
        "tags": ["objection", "spouse", "qualification"],
        "order": 2
    },
    {
        "breakdown_id": "breakdown_3",
        "title": "The 'Think About It' Collapse",
        "scenario": "Both decision-makers present. Good energy throughout. At the close, they asked for numbers, seemed comfortable, then: 'This is a big decision. We need to think about it.'",
        "what_happened": "Rep accepted the objection at face value. Said 'I understand' and started packing up materials. Couple left. Never returned.",
        "control_analysis": "Control was surrendered, not lost. The rep gave up at the first sign of resistance instead of exploring what 'think about it' actually meant.",
        "better_move": "'I completely understand - this is a significant decision. Help me understand: when you say you need to think about it, is it the investment, the timing, or something about the membership itself that you want to consider?'",
        "key_takeaway": "'Think about it' is not a final answer. It's an invitation to discover the real objection.",
        "practice_prompt": "Never accept 'think about it' without asking what specifically they need to think about.",
        "tags": ["objection", "close", "recovery"],
        "order": 3
    },
    {
        "breakdown_id": "breakdown_4",
        "title": "Momentum Lost Mid-Presentation",
        "scenario": "Strong opening. Good discovery. Halfway through the property tour, buyer started checking phone repeatedly. Energy dropped. Questions stopped.",
        "what_happened": "Rep kept presenting without acknowledging the shift. Pushed through the script while buyer mentally checked out.",
        "control_analysis": "Control was lost when the rep ignored obvious disengagement signals. Continued talking instead of re-engaging.",
        "better_move": "Stop and reset: 'I notice you might have something on your mind. Is everything okay? I want to make sure we're covering what matters most to you, not just going through a standard tour.'",
        "key_takeaway": "When you sense disengagement, stop presenting and start a conversation. Acknowledge the shift.",
        "practice_prompt": "Practice recognizing disengagement signals and have a reset phrase ready.",
        "tags": ["control", "engagement", "recovery"],
        "order": 4
    },
    {
        "breakdown_id": "breakdown_5",
        "title": "Price Objection After Strong Value Build",
        "scenario": "Everything clicked. Family was excited, kids loved the pool, parents talked about 'finally having a vacation home.' Price reveal: 'That's way more than we expected.'",
        "what_happened": "Rep panicked. Immediately started offering discounts and payment plans without understanding the objection.",
        "control_analysis": "Control was lost by reacting defensively. The rep treated 'more than expected' as a rejection rather than a negotiation opening.",
        "better_move": "'I appreciate you being direct. Help me understand - when you say more than expected, are we talking about the total investment, or the monthly commitment? Because there might be a way to structure this that works better for your situation.'",
        "key_takeaway": "Price objections are often structure objections in disguise. Clarify before you adjust.",
        "practice_prompt": "When you hear a price objection, ask whether it's about total cost or monthly payment.",
        "tags": ["price", "objection", "negotiation"],
        "order": 5
    }
]

# ============== INITIAL QUICK WINS ==============

QUICK_WINS = [
    {
        "quickwin_id": "qw_1",
        "title": "How to Recover After Losing Control",
        "situation": "Buyer has taken over the conversation. You're answering rapid questions. They're steering.",
        "the_move": "Pause, then redirect with a question that re-establishes your authority.",
        "example": "'Those are great questions, and I want to make sure I answer all of them. Before I do - what's the most important thing you're trying to figure out right now? Let me focus there first.'",
        "duration": 3,
        "tags": ["control", "recovery"],
        "order": 1
    },
    {
        "quickwin_id": "qw_2",
        "title": "How to Answer 'We Need to Think About It'",
        "situation": "At the close. They seem interested but hit you with the classic stall.",
        "the_move": "Don't accept it. Clarify what 'think about it' actually means.",
        "example": "'Absolutely, I want you to feel great about this. When you say think about it - is it the investment, the timing, or something specific about the membership? I want to make sure I've addressed everything.'",
        "duration": 3,
        "tags": ["objection", "close"],
        "order": 2
    },
    {
        "quickwin_id": "qw_3",
        "title": "How to Create Urgency Without Pressure",
        "situation": "Buyer is interested but not feeling the need to decide today.",
        "the_move": "Use legitimate scarcity - availability, pricing windows, or their own timeline.",
        "example": "'I don't want to create artificial pressure. What I do know is that the pricing we discussed today is based on current availability. I can't guarantee the same options will be here if you come back next week. Let's see if we can find a way to make this work today.'",
        "duration": 4,
        "tags": ["close", "urgency"],
        "order": 3
    },
    {
        "quickwin_id": "qw_4",
        "title": "How to Reset After Price Resistance",
        "situation": "You've revealed the price. Their face changed. Energy dropped.",
        "the_move": "Acknowledge the reaction. Don't pretend it didn't happen.",
        "example": "'I can see that number hit differently than you expected. Let's talk about that. Is it the total that concerns you, or are we talking about making it fit your monthly budget? Because those are two different conversations.'",
        "duration": 3,
        "tags": ["price", "recovery"],
        "order": 4
    },
    {
        "quickwin_id": "qw_5",
        "title": "How to Handle 'We're Just Looking'",
        "situation": "Early in the tour. They're trying to set low expectations.",
        "the_move": "Accept it gracefully, then reframe the purpose of the tour.",
        "example": "'Perfect - that's exactly what today is for. My only goal is to show you what's possible and let you decide if it fits your family. No pressure. But I do have one request: keep an open mind and tell me honestly what you like and what you don't. Deal?'",
        "duration": 3,
        "tags": ["objection", "opening"],
        "order": 5
    },
    {
        "quickwin_id": "qw_6",
        "title": "How to Re-engage a Quiet Buyer",
        "situation": "One partner is engaged, the other has gone silent.",
        "the_move": "Directly but softly bring them back into the conversation.",
        "example": "'[Name], I want to make sure I'm not missing what's important to you. What matters most to you when it comes to family vacations? I've been hearing a lot from [partner] but I want to know your perspective.'",
        "duration": 3,
        "tags": ["engagement", "control"],
        "order": 6
    },
    {
        "quickwin_id": "qw_7",
        "title": "How to Respond to 'That's Too Expensive'",
        "situation": "Direct price objection. They've said the number is too high.",
        "the_move": "Don't defend. Explore. Find out what 'too expensive' means to them.",
        "example": "'I hear you. Help me understand: too expensive compared to what? Are we talking about what you budgeted for today, or too expensive for the value you're seeing? Because those need different solutions.'",
        "duration": 4,
        "tags": ["price", "objection"],
        "order": 7
    },
    {
        "quickwin_id": "qw_8",
        "title": "How to Handle the Missing Spouse",
        "situation": "One partner present. They love it but 'can't decide alone.'",
        "the_move": "Get them to sell their partner for you. Arm them with ammunition.",
        "example": "'I totally respect that. Here's what I'm wondering: if you could show your husband everything you saw today, what would be the three things that would get him excited? Let's make sure those are crystal clear so you can share them confidently.'",
        "duration": 4,
        "tags": ["objection", "spouse"],
        "order": 8
    },
    {
        "quickwin_id": "qw_9",
        "title": "How to Prevent Early Price Questions",
        "situation": "Five minutes in, they ask 'how much is this going to cost?'",
        "the_move": "Defer without being evasive. Promise to get there.",
        "example": "'Great question - I promise we'll get there. Here's why I want to wait: the investment depends on what fits your family best. Once I understand what you're looking for, I can show you options that actually make sense. Fair?'",
        "duration": 3,
        "tags": ["price", "control"],
        "order": 9
    },
    {
        "quickwin_id": "qw_10",
        "title": "How to Build Value Before Numbers",
        "situation": "You're approaching the price reveal and want to maximize impact.",
        "the_move": "Stack the value verbally before showing any numbers.",
        "example": "'Before I show you the investment, let me recap what you're getting: [list benefits they specifically responded to]. When you add all of that up, we're talking about completely changing how your family vacations for years to come. Now let me show you what that investment looks like.'",
        "duration": 4,
        "tags": ["value", "close"],
        "order": 10
    }
]

# ============== API ROUTES ==============

@phase1_router.get("/stages")
async def get_stages():
    """Get all stage definitions"""
    return STAGES

@phase1_router.get("/tracks")
async def get_tracks():
    """Get all track definitions with modules"""
    tracks_with_modules = []
    for track in TRACKS:
        track_modules = [m for m in MODULES if m["track_id"] == track["track_id"]]
        tracks_with_modules.append({
            **track,
            "modules": sorted(track_modules, key=lambda x: x["order"])
        })
    return tracks_with_modules

@phase1_router.get("/tracks/{track_id}")
async def get_track(track_id: str):
    """Get single track with modules"""
    track = next((t for t in TRACKS if t["track_id"] == track_id), None)
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    
    track_modules = [m for m in MODULES if m["track_id"] == track_id]
    return {
        **track,
        "modules": sorted(track_modules, key=lambda x: x["order"])
    }

@phase1_router.get("/modules")
async def get_modules():
    """Get all modules"""
    return sorted(MODULES, key=lambda x: (x["track_id"], x["order"]))

@phase1_router.get("/badges")
async def get_badges():
    """Get all badge definitions"""
    return sorted(BADGES, key=lambda x: x["order"])

@phase1_router.get("/breakdowns")
async def get_breakdowns(user: User = Depends(require_auth)):
    """Get all deal breakdowns"""
    return sorted(DEAL_BREAKDOWNS, key=lambda x: x["order"])

@phase1_router.get("/breakdowns/{breakdown_id}")
async def get_breakdown(breakdown_id: str, user: User = Depends(require_auth)):
    """Get single deal breakdown"""
    breakdown = next((b for b in DEAL_BREAKDOWNS if b["breakdown_id"] == breakdown_id), None)
    if not breakdown:
        raise HTTPException(status_code=404, detail="Breakdown not found")
    return breakdown

@phase1_router.get("/quickwins")
async def get_quickwins(tag: Optional[str] = None, user: User = Depends(require_auth)):
    """Get quick wins, optionally filtered by tag"""
    wins = QUICK_WINS
    if tag:
        wins = [w for w in wins if tag in w["tags"]]
    return sorted(wins, key=lambda x: x["order"])

@phase1_router.get("/quickwins/{quickwin_id}")
async def get_quickwin(quickwin_id: str, user: User = Depends(require_auth)):
    """Get single quick win"""
    win = next((w for w in QUICK_WINS if w["quickwin_id"] == quickwin_id), None)
    if not win:
        raise HTTPException(status_code=404, detail="Quick win not found")
    return win

@phase1_router.get("/progress")
async def get_user_progress(user: User = Depends(require_auth)):
    """Get user's development progress"""
    progress = await db.user_stage_progress.find_one({"user_id": user.user_id}, {"_id": 0})
    
    if not progress:
        # Initialize progress for new user
        progress = {
            "user_id": user.user_id,
            "current_stage": 1,
            "stage_started_at": datetime.now(timezone.utc).isoformat(),
            "tracks_progress": {t["track_id"]: 0 for t in TRACKS},
            "modules_completed": [],
            "breakdowns_reviewed": [],
            "quickwins_applied": [],
            "badges_earned": [],
            "training_streak": 0,
            "last_activity": datetime.now(timezone.utc).isoformat(),
            "readiness_score": 0
        }
        await db.user_stage_progress.insert_one(progress)
    
    # Get current stage info
    current_stage = next((s for s in STAGES if s["stage_number"] == progress["current_stage"]), STAGES[0])
    next_stage = next((s for s in STAGES if s["stage_number"] == progress["current_stage"] + 1), None)
    
    # Calculate readiness score
    track_completion = sum(progress.get("tracks_progress", {}).values()) / len(TRACKS) if TRACKS else 0
    breakdowns_count = len(progress.get("breakdowns_reviewed", []))
    quickwins_count = len(progress.get("quickwins_applied", []))
    
    readiness_score = int(
        (track_completion * 0.4) +
        (min(breakdowns_count / 15, 1) * 100 * 0.3) +
        (min(quickwins_count / 20, 1) * 100 * 0.2) +
        (min(progress.get("training_streak", 0) / 14, 1) * 100 * 0.1)
    )
    
    # Determine next assignment
    next_assignment = None
    for track in TRACKS:
        if progress.get("tracks_progress", {}).get(track["track_id"], 0) < 100:
            track_modules = [m for m in MODULES if m["track_id"] == track["track_id"]]
            for mod in sorted(track_modules, key=lambda x: x["order"]):
                if mod["module_id"] not in progress.get("modules_completed", []):
                    next_assignment = {
                        "type": "module",
                        "track": track["name"],
                        "module": mod
                    }
                    break
            if next_assignment:
                break
    
    if not next_assignment and breakdowns_count < 5:
        unreviewed = [b for b in DEAL_BREAKDOWNS if b["breakdown_id"] not in progress.get("breakdowns_reviewed", [])]
        if unreviewed:
            next_assignment = {
                "type": "breakdown",
                "breakdown": unreviewed[0]
            }
    
    return {
        "progress": progress,
        "current_stage": current_stage,
        "next_stage": next_stage,
        "readiness_score": readiness_score,
        "next_assignment": next_assignment,
        "stats": {
            "modules_completed": len(progress.get("modules_completed", [])),
            "total_modules": len(MODULES),
            "breakdowns_reviewed": breakdowns_count,
            "quickwins_applied": quickwins_count,
            "badges_earned": len(progress.get("badges_earned", []))
        }
    }

@phase1_router.post("/modules/{module_id}/complete")
async def complete_module(module_id: str, user: User = Depends(require_auth)):
    """Mark a module as complete"""
    module = next((m for m in MODULES if m["module_id"] == module_id), None)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    progress = await db.user_stage_progress.find_one({"user_id": user.user_id}, {"_id": 0})
    if not progress:
        progress = {
            "user_id": user.user_id,
            "current_stage": 1,
            "tracks_progress": {t["track_id"]: 0 for t in TRACKS},
            "modules_completed": [],
            "breakdowns_reviewed": [],
            "quickwins_applied": [],
            "badges_earned": [],
            "training_streak": 0,
            "last_activity": datetime.now(timezone.utc).isoformat()
        }
    
    if module_id not in progress.get("modules_completed", []):
        progress["modules_completed"] = progress.get("modules_completed", []) + [module_id]
        
        # Update track progress
        track_modules = [m for m in MODULES if m["track_id"] == module["track_id"]]
        completed_in_track = len([m for m in track_modules if m["module_id"] in progress["modules_completed"]])
        track_progress = (completed_in_track / len(track_modules)) * 100 if track_modules else 0
        progress["tracks_progress"][module["track_id"]] = track_progress
        
        # Update streak
        progress["last_activity"] = datetime.now(timezone.utc).isoformat()
        
        # Award points
        await db.users.update_one(
            {"user_id": user.user_id},
            {"$inc": {"points": 10}}
        )
        
        await db.user_stage_progress.update_one(
            {"user_id": user.user_id},
            {"$set": progress},
            upsert=True
        )
    
    return {"success": True, "points_earned": 10}

@phase1_router.post("/breakdowns/{breakdown_id}/review")
async def review_breakdown(breakdown_id: str, user: User = Depends(require_auth)):
    """Mark a breakdown as reviewed"""
    breakdown = next((b for b in DEAL_BREAKDOWNS if b["breakdown_id"] == breakdown_id), None)
    if not breakdown:
        raise HTTPException(status_code=404, detail="Breakdown not found")
    
    await db.user_stage_progress.update_one(
        {"user_id": user.user_id},
        {
            "$addToSet": {"breakdowns_reviewed": breakdown_id},
            "$set": {"last_activity": datetime.now(timezone.utc).isoformat()}
        },
        upsert=True
    )
    
    # Award points
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$inc": {"points": 5}}
    )
    
    return {"success": True, "points_earned": 5}

@phase1_router.post("/quickwins/{quickwin_id}/apply")
async def apply_quickwin(quickwin_id: str, user: User = Depends(require_auth)):
    """Mark a quick win as applied"""
    win = next((w for w in QUICK_WINS if w["quickwin_id"] == quickwin_id), None)
    if not win:
        raise HTTPException(status_code=404, detail="Quick win not found")
    
    await db.user_stage_progress.update_one(
        {"user_id": user.user_id},
        {
            "$addToSet": {"quickwins_applied": quickwin_id},
            "$set": {"last_activity": datetime.now(timezone.utc).isoformat()}
        },
        upsert=True
    )
    
    # Award points
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$inc": {"points": 3}}
    )
    
    return {"success": True, "points_earned": 3}

# Export for inclusion in main server
def get_phase1_router():
    return phase1_router
