"""
VCSA Alternate Academy Module Routes

Public endpoints:
- Rep bootstrap data for the alternate React app

Admin endpoints:
- Authenticated CRUD for Strategy, Top Producer Path, Coaching, and Resources
"""

from datetime import datetime, timezone
from typing import Dict, List, Literal, Optional
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from server import db, require_admin, User

academy_router = APIRouter(prefix="/api/academy", tags=["academy"])

MODULE_KEYS = ("strategy", "topProducerPath", "coaching", "resources")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class DashboardMetric(BaseModel):
    label: str
    value: str
    note: str


class AcademyDashboard(BaseModel):
    repName: str
    team: str
    property: str
    metrics: List[DashboardMetric]
    priorities: List[str]


class AcademyModuleItemBase(BaseModel):
    title: str
    type: str
    summary: str
    audience: Literal["rep", "admin", "all"] = "rep"
    owner: str
    status: Literal["draft", "live", "archived"] = "draft"
    cadence: str
    format: str
    tags: List[str] = Field(default_factory=list)
    published: bool = False
    downloadUrl: str = ""


class AcademyModuleItemCreate(AcademyModuleItemBase):
    pass


class AcademyModuleItemUpdate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: Optional[str] = None
    type: Optional[str] = None
    summary: Optional[str] = None
    audience: Optional[Literal["rep", "admin", "all"]] = None
    owner: Optional[str] = None
    status: Optional[Literal["draft", "live", "archived"]] = None
    cadence: Optional[str] = None
    format: Optional[str] = None
    tags: Optional[List[str]] = None
    published: Optional[bool] = None
    downloadUrl: Optional[str] = None


class AcademyModuleItem(AcademyModuleItemBase):
    model_config = ConfigDict(extra="ignore")
    id: str
    module_key: str
    created_at: str
    updated_at: str


class AcademyBootstrapResponse(BaseModel):
    dashboard: AcademyDashboard
    modules: Dict[str, List[AcademyModuleItem]]


DEFAULT_DASHBOARD = {
    "repName": "Valeria Cruz",
    "team": "Cancun Elite",
    "property": "Vacation Sales Club Academy",
    "metrics": [
        {
            "label": "Tours today",
            "value": "3 / 5",
            "note": "Two more tours to hit the floor target.",
        },
        {
            "label": "Goal sheet",
            "value": "92%",
            "note": "Submitted before lunch and ready for closeout.",
        },
        {
            "label": "Next live",
            "value": "4:30 PM",
            "note": "Role Play Live Session starts this afternoon.",
        },
        {
            "label": "Skool library",
            "value": "6 lessons",
            "note": "Fresh demo lessons are now mapped into the Top Producer Path and Resources.",
        },
    ],
    "priorities": [
        "Review Session 3 before the second tour block.",
        "Log all closes and referrals into the Goal Sheet flow.",
        "Download the closing script pack before Group Live Coaching.",
        "Open the latest Skool lesson before the afternoon tour block.",
    ],
}


DEFAULT_MODULE_ITEMS = {
    "strategy": [
        {
            "id": "strategy-1",
            "title": "Daily Performance Board",
            "type": "Dashboard",
            "summary": "Live rep board for tours, calls, demos, closes, and volume with a morning target reset.",
            "audience": "all",
            "owner": "Sales Operations",
            "status": "live",
            "cadence": "Daily",
            "format": "Operational dashboard",
            "tags": ["daily", "scoreboard", "rep"],
            "published": True,
            "downloadUrl": "/downloads/daily-performance-scorecard.csv",
        },
        {
            "id": "strategy-2",
            "title": "Goal Sheet Flow",
            "type": "Workflow",
            "summary": "Structured goal sheet for activity logging, contract notes, follow-up status, and end-of-day accountability.",
            "audience": "rep",
            "owner": "Team Leader",
            "status": "live",
            "cadence": "Daily closeout",
            "format": "Worksheet + review",
            "tags": ["goal sheet", "daily", "closeout"],
            "published": True,
            "downloadUrl": "/downloads/goal-sheet-template.csv",
        },
        {
            "id": "strategy-3",
            "title": "Financial Planner Sprint",
            "type": "Planner",
            "summary": "Translate target income into tours needed, sales needed, and the exact gap to close this month.",
            "audience": "rep",
            "owner": "Leadership",
            "status": "live",
            "cadence": "Weekly",
            "format": "Planning worksheet",
            "tags": ["financial", "planning", "income"],
            "published": True,
            "downloadUrl": "/downloads/financial-planner-template.csv",
        },
        {
            "id": "strategy-4",
            "title": "Floor Analytics Review",
            "type": "Review",
            "summary": "Manager-facing analysis of conversion, momentum breaks, objection clusters, and coaching priorities.",
            "audience": "admin",
            "owner": "Performance Director",
            "status": "draft",
            "cadence": "Weekly",
            "format": "Analytics review",
            "tags": ["analytics", "leader", "review"],
            "published": False,
            "downloadUrl": "",
        },
    ],
    "topProducerPath": [
        {
            "id": "path-1",
            "title": "Training Library Home",
            "type": "Library",
            "summary": "Central training hub that organizes every VCSA session, recap, assignment, and reinforcement asset.",
            "audience": "all",
            "owner": "Curriculum Team",
            "status": "live",
            "cadence": "On demand",
            "format": "Video library",
            "tags": ["training library", "curriculum"],
            "published": True,
            "downloadUrl": "/downloads/training-library-blueprint.txt",
        },
        {
            "id": "path-2",
            "title": "Session 1 · Pro Mindset",
            "type": "Session",
            "summary": "Reset the daily standard, rep identity, and the internal discipline expected from a top producer.",
            "audience": "rep",
            "owner": "Head Coach",
            "status": "live",
            "cadence": "Session 1",
            "format": "Video + worksheet",
            "tags": ["session 1", "mindset", "standard"],
            "published": True,
            "downloadUrl": "/downloads/top-producer-session-outline.txt",
        },
        {
            "id": "path-3",
            "title": "Session 2 · Discovery and Control",
            "type": "Session",
            "summary": "Build better tours by controlling discovery, pacing, and emotional direction before price ever appears.",
            "audience": "rep",
            "owner": "Head Coach",
            "status": "live",
            "cadence": "Session 2",
            "format": "Video + live drill",
            "tags": ["session 2", "control", "discovery"],
            "published": True,
            "downloadUrl": "",
        },
        {
            "id": "path-4",
            "title": "Session 3 · Value Architecture",
            "type": "Session",
            "summary": "Present value in a way that makes the close possible and protects the room before price resistance.",
            "audience": "rep",
            "owner": "Head Coach",
            "status": "live",
            "cadence": "Session 3",
            "format": "Video + recap",
            "tags": ["session 3", "value", "presentation"],
            "published": True,
            "downloadUrl": "",
        },
        {
            "id": "path-5",
            "title": "Session 4 · Objection Mastery",
            "type": "Session",
            "summary": "Recover the room after price shock, missing spouse stalls, and think about it collapses.",
            "audience": "rep",
            "owner": "Head Coach",
            "status": "live",
            "cadence": "Session 4",
            "format": "Video + role play prep",
            "tags": ["objection", "recovery", "session 4"],
            "published": True,
            "downloadUrl": "",
        },
        {
            "id": "path-6",
            "title": "Front to Back Challenge",
            "type": "Skool course",
            "summary": "Part 1 of the challenge focused on controlling the full tour arc from first touch through close sequence.",
            "audience": "rep",
            "owner": "Skool Library",
            "status": "live",
            "cadence": "Challenge track",
            "format": "Video lesson",
            "tags": ["skool", "challenge", "front to back"],
            "published": True,
            "downloadUrl": "https://www.youtube.com/watch?v=HmZPlXY6Dqk&t=2s",
        },
    ],
    "coaching": [
        {
            "id": "coaching-1",
            "title": "Floor Event Calendar",
            "type": "Event",
            "summary": "Weekly event schedule for coaching rooms, role play labs, and leadership-led tactical reviews.",
            "audience": "all",
            "owner": "Coaching Ops",
            "status": "live",
            "cadence": "Weekly",
            "format": "Calendar",
            "tags": ["event", "calendar", "live"],
            "published": True,
            "downloadUrl": "",
        },
        {
            "id": "coaching-2",
            "title": "Group Live Coaching",
            "type": "Live coaching",
            "summary": "Coach-led session focused on price anchoring, family alignment, and decision sequence control.",
            "audience": "rep",
            "owner": "Senior Coach",
            "status": "live",
            "cadence": "Wednesday 5 PM",
            "format": "Live room",
            "tags": ["group", "live", "coaching"],
            "published": True,
            "downloadUrl": "/downloads/coaching-qa-playbook.txt",
        },
        {
            "id": "coaching-3",
            "title": "Role Play Live Session",
            "type": "Role play",
            "summary": "Practice missing spouse, price objection, and stall patterns with structured debriefs after every round.",
            "audience": "rep",
            "owner": "Practice Lead",
            "status": "live",
            "cadence": "Thursday 4:30 PM",
            "format": "Scenario lab",
            "tags": ["role play", "practice", "objection"],
            "published": True,
            "downloadUrl": "",
        },
        {
            "id": "coaching-4",
            "title": "Q and A Session",
            "type": "Q and A",
            "summary": "Open session for blockers from the floor, deal reviews, and coaching requests from reps and managers.",
            "audience": "all",
            "owner": "Performance Director",
            "status": "live",
            "cadence": "Friday 1 PM",
            "format": "Open forum",
            "tags": ["qa", "deal review", "support"],
            "published": True,
            "downloadUrl": "",
        },
    ],
    "resources": [
        {
            "id": "resources-1",
            "title": "Pre Tour Checklist",
            "type": "PDF asset",
            "summary": "A quick-use prep checklist for emotional framing, urgency setup, and control before the tour starts.",
            "audience": "rep",
            "owner": "Enablement",
            "status": "live",
            "cadence": "Anytime",
            "format": "Checklist",
            "tags": ["pre tour", "checklist", "prep"],
            "published": True,
            "downloadUrl": "/downloads/pre-tour-checklist.txt",
        },
        {
            "id": "resources-2",
            "title": "Closing Script Pack",
            "type": "Script pack",
            "summary": "Structured language for soft commitment, value recap, urgency, and missing spouse recovery.",
            "audience": "rep",
            "owner": "Enablement",
            "status": "live",
            "cadence": "Anytime",
            "format": "Script library",
            "tags": ["closing", "scripts", "objections"],
            "published": True,
            "downloadUrl": "/downloads/closing-script-pack.txt",
        },
        {
            "id": "resources-3",
            "title": "Manager Huddle Checklist",
            "type": "Manager packet",
            "summary": "Daily huddle structure for reviewing closes, breakdowns, targets, and coaching attendance.",
            "audience": "admin",
            "owner": "Leadership",
            "status": "live",
            "cadence": "Morning huddle",
            "format": "Checklist",
            "tags": ["manager", "huddle", "leadership"],
            "published": True,
            "downloadUrl": "/downloads/manager-huddle-checklist.txt",
        },
        {
            "id": "resources-4",
            "title": "Top Producer Mini Ebook",
            "type": "Ebook",
            "summary": "A short ebook outline that reinforces the operating rhythm and mental standards of top producers.",
            "audience": "all",
            "owner": "Curriculum Team",
            "status": "live",
            "cadence": "Reference",
            "format": "Ebook",
            "tags": ["ebook", "mindset", "top producer"],
            "published": True,
            "downloadUrl": "/downloads/top-producer-mini-ebook.txt",
        },
        {
            "id": "resources-5",
            "title": "Breaking The Pact",
            "type": "Skool lesson",
            "summary": "Demo video lesson from the RoadMAP 2026 free resources track focused on breaking low-performance agreements.",
            "audience": "all",
            "owner": "Skool Library",
            "status": "live",
            "cadence": "On demand",
            "format": "Video lesson",
            "tags": ["skool", "roadmap 2026", "mindset"],
            "published": True,
            "downloadUrl": "https://youtu.be/yN3lahhU-4c",
        },
        {
            "id": "resources-6",
            "title": "First Visit Incentives",
            "type": "Skool lesson",
            "summary": "Resource lesson for first-visit incentive positioning and how to frame urgency without burning trust.",
            "audience": "rep",
            "owner": "Skool Library",
            "status": "live",
            "cadence": "On demand",
            "format": "Video lesson",
            "tags": ["skool", "incentives", "urgency"],
            "published": True,
            "downloadUrl": "https://www.youtube.com/watch?v=IZFrfqD6aBY",
        },
        {
            "id": "resources-7",
            "title": "The Residence Story",
            "type": "Skool lesson",
            "summary": "Storytelling lesson for building perceived ownership and emotional relevance before the price conversation.",
            "audience": "rep",
            "owner": "Skool Library",
            "status": "live",
            "cadence": "On demand",
            "format": "Video lesson",
            "tags": ["skool", "storytelling", "residence"],
            "published": True,
            "downloadUrl": "https://www.youtube.com/watch?v=74LcxFvsMHI",
        },
        {
            "id": "resources-8",
            "title": "The Concept Pitch",
            "type": "Skool lesson",
            "summary": "Pitch framework lesson that helps reps simplify the concept and tighten the value story early in the tour.",
            "audience": "rep",
            "owner": "Skool Library",
            "status": "live",
            "cadence": "On demand",
            "format": "Video lesson",
            "tags": ["skool", "pitch", "value"],
            "published": True,
            "downloadUrl": "https://www.youtube.com/watch?v=zkOG6Eyi9Cc&t=2s",
        },
        {
            "id": "resources-9",
            "title": "No Comes at a Price",
            "type": "Skool lesson",
            "summary": "Objection handling lesson about the cost of letting a weak no sit in the room without structured recovery.",
            "audience": "rep",
            "owner": "Skool Library",
            "status": "live",
            "cadence": "On demand",
            "format": "Video lesson",
            "tags": ["skool", "objection", "recovery"],
            "published": True,
            "downloadUrl": "https://www.youtube.com/watch?v=oOrz6H7XSvU",
        },
    ],
}


async def ensure_seed_data() -> None:
    current_count = await db.academy_module_items.count_documents({})
    if current_count > 0:
        return

    timestamp = now_iso()
    documents = []

    for module_key, items in DEFAULT_MODULE_ITEMS.items():
        for item in items:
            documents.append(
                {
                    **item,
                    "module_key": module_key,
                    "created_at": timestamp,
                    "updated_at": timestamp,
                }
            )

    if documents:
        await db.academy_module_items.insert_many(documents)


def empty_module_map() -> Dict[str, List[AcademyModuleItem]]:
    return {key: [] for key in MODULE_KEYS}


async def load_modules(include_unpublished: bool) -> Dict[str, List[AcademyModuleItem]]:
    await ensure_seed_data()
    module_map = empty_module_map()

    cursor = db.academy_module_items.find({}, {"_id": 0})
    items = await cursor.to_list(length=500)

    for item in sorted(
        items, key=lambda entry: entry.get("created_at", ""), reverse=True
    ):
        if item.get("module_key") not in module_map:
            continue
        if not include_unpublished and not item.get("published"):
            continue
        module_map[item["module_key"]].append(AcademyModuleItem(**item))

    return module_map


def validate_module_key(module_key: str) -> None:
    if module_key not in MODULE_KEYS:
        raise HTTPException(status_code=404, detail="Module not found")


@academy_router.get("/public/bootstrap", response_model=AcademyBootstrapResponse)
async def get_public_bootstrap():
    modules = await load_modules(include_unpublished=False)
    return AcademyBootstrapResponse(
        dashboard=AcademyDashboard(**DEFAULT_DASHBOARD),
        modules=modules,
    )


@academy_router.get("/admin/bootstrap", response_model=AcademyBootstrapResponse)
async def get_admin_bootstrap(user: User = Depends(require_admin)):
    modules = await load_modules(include_unpublished=True)
    return AcademyBootstrapResponse(
        dashboard=AcademyDashboard(**DEFAULT_DASHBOARD),
        modules=modules,
    )


@academy_router.post("/admin/reset")
async def reset_admin_bootstrap(user: User = Depends(require_admin)):
    await db.academy_module_items.delete_many({})
    await ensure_seed_data()
    return {"success": True, "message": "Academy module data reset to defaults"}


@academy_router.post("/admin/modules/{module_key}", response_model=AcademyModuleItem)
async def create_module_item(
    module_key: str,
    payload: AcademyModuleItemCreate,
    user: User = Depends(require_admin),
):
    validate_module_key(module_key)

    timestamp = now_iso()
    document = {
        "id": f"{module_key}-{uuid.uuid4().hex[:10]}",
        "module_key": module_key,
        "created_at": timestamp,
        "updated_at": timestamp,
        **payload.model_dump(),
    }

    await db.academy_module_items.insert_one(document)
    return AcademyModuleItem(**document)


@academy_router.put(
    "/admin/modules/{module_key}/{item_id}", response_model=AcademyModuleItem
)
async def update_module_item(
    module_key: str,
    item_id: str,
    payload: AcademyModuleItemUpdate,
    user: User = Depends(require_admin),
):
    validate_module_key(module_key)

    existing = await db.academy_module_items.find_one(
        {"module_key": module_key, "id": item_id},
        {"_id": 0},
    )

    if not existing:
        raise HTTPException(status_code=404, detail="Module item not found")

    updates = payload.model_dump(exclude_unset=True)
    updated = {
        **existing,
        **updates,
        "updated_at": now_iso(),
    }

    await db.academy_module_items.update_one(
        {"module_key": module_key, "id": item_id},
        {"$set": updated},
    )

    return AcademyModuleItem(**updated)


@academy_router.delete("/admin/modules/{module_key}/{item_id}")
async def delete_module_item(
    module_key: str,
    item_id: str,
    user: User = Depends(require_admin),
):
    validate_module_key(module_key)

    result = await db.academy_module_items.delete_one(
        {"module_key": module_key, "id": item_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Module item not found")

    return {"success": True, "message": "Module item deleted"}
