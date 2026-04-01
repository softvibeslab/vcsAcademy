"""
Goal Sheet Routes
API endpoints para el sistema de tracking de métricas diarias
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field

from server import db, require_auth
from models.goal_sheet import (
    GoalSheet, GoalSheetCreate, GoalSheetUpdate,
    DailyMetrics, WeeklyGoals, GoalSheetSummary,
    EventType, ContractDetails, PurchaseInfo, PaymentPlan, EventLog
)
import uuid

router = APIRouter(prefix="/api/goalsheet", tags=["goalsheet"])

# ============== MODELS FOR REQUESTS ==============

class DailyMetricsInput(BaseModel):
    tours_given: int = Field(ge=0)
    calls_made: int = Field(ge=0)
    new_leads: int = Field(ge=0)
    closes: int = Field(ge=0)
    referrals: int = Field(ge=0)
    demos_booked: int = Field(default=0, ge=0)
    presentations: int = Field(default=0, ge=0)

class WeeklyGoalsInput(BaseModel):
    tours_given: Optional[int] = Field(default=None, ge=0)
    calls_made: Optional[int] = Field(default=None, ge=0)
    new_leads: Optional[int] = Field(default=None, ge=0)
    closes: Optional[int] = Field(default=None, ge=0)
    referrals: Optional[int] = Field(default=None, ge=0)
    demos_booked: Optional[int] = Field(default=None, ge=0)
    presentations: Optional[int] = Field(default=None, ge=0)

class ContractDetailsInput(BaseModel):
    contract_number: Optional[str] = None
    manager: Optional[str] = None
    legal_officer: Optional[str] = None
    hostess: Optional[str] = None
    notes: Optional[str] = None
    start_follow_up: bool = False
    is_pending: bool = False
    cancel_contract: bool = False

class PurchaseInfoInput(BaseModel):
    purchase_price: Optional[float] = Field(default=None, ge=0)
    category: Optional[str] = None
    membership_type: Optional[str] = None
    initial_investment: Optional[float] = Field(default=None, ge=0)
    percentage: Optional[float] = Field(default=None, ge=0)
    nights: Optional[int] = Field(default=None, ge=0)
    interest_rate: Optional[float] = Field(default=None, ge=0)
    adjustment: Optional[float] = Field(default=None, ge=0)
    balance: Optional[float] = Field(default=None, ge=0)

class PaymentPlanInput(BaseModel):
    payment_plan_months: Optional[int] = Field(default=None, ge=0)
    monthly_payment: Optional[float] = Field(default=None, ge=0)

class GoalSheetCreateInput(BaseModel):
    metrics: DailyMetricsInput
    goals: Optional[WeeklyGoalsInput] = None
    notes: Optional[str] = None
    event_type: Optional[EventType] = None
    contract_details: Optional[ContractDetailsInput] = None
    purchase_info: Optional[PurchaseInfoInput] = None
    payment_plan: Optional[PaymentPlanInput] = None

class GoalSheetUpdateInput(BaseModel):
    metrics: Optional[DailyMetricsInput] = None
    goals: Optional[WeeklyGoalsInput] = None
    notes: Optional[str] = None
    contract_details: Optional[ContractDetailsInput] = None
    purchase_info: Optional[PurchaseInfoInput] = None
    payment_plan: Optional[PaymentPlanInput] = None

# ============== HELPERS ==============

def calculate_progress_percentage(metrics: dict, goals: dict) -> float:
    """Calcular porcentaje de progreso vs metas"""
    if not goals:
        return None

    total_progress = 0
    total_goals = 0
    fields = ['tours_given', 'calls_made', 'new_leads', 'closes', 'referrals', 'demos_booked', 'presentations']

    for field in fields:
        metric_value = metrics.get(field, 0)
        goal_value = goals.get(field, 0)

        if goal_value > 0:
            total_progress += min((metric_value / goal_value) * 100, 100)
            total_goals += 1

    if total_goals == 0:
        return None

    return round(total_progress / total_goals, 1)

# ============== ENDPOINTS ==============

@router.post("/daily")
async def create_or_update_goal_sheet(
    data: GoalSheetCreateInput,
    user = Depends(require_auth)
):
    """Crear o actualizar goal sheet del día"""
    today = datetime.now().strftime("%Y-%m-%d")

    # Check if already exists
    existing = await db.goal_sheets.find_one({
        "user_id": user["user_id"],
        "date": today
    })

    # Prepare metrics dict
    metrics_dict = data.metrics.model_dump()
    goals_dict = data.goals.model_dump() if data.goals else None

    goal_sheet_data = {
        "user_id": user.user_id,
        "date": today,
        "metrics": metrics_dict,
        "updated_at": datetime.now(timezone.utc)
    }

    if goals_dict:
        goal_sheet_data["goals"] = goals_dict

    if data.notes:
        goal_sheet_data["notes"] = data.notes

    # New fields: contract details, purchase info, payment plan
    if data.contract_details:
        goal_sheet_data["contract_details"] = data.contract_details.model_dump()

    if data.purchase_info:
        goal_sheet_data["purchase_info"] = data.purchase_info.model_dump()

    if data.payment_plan:
        goal_sheet_data["payment_plan"] = data.payment_plan.model_dump()

    # Event logging
    if data.event_type:
        event_log = {
            "event_type": data.event_type.value,
            "timestamp": datetime.now(timezone.utc)
        }
        if data.contract_details and data.contract_details.notes:
            event_log["notes"] = data.contract_details.notes

        # Add to event logs
        if "event_logs" not in goal_sheet_data:
            goal_sheet_data["event_logs"] = []
        goal_sheet_data["event_logs"].append(event_log)

    if existing:
        # Update
        sheet_id = existing["sheet_id"]
        await db.goal_sheets.update_one(
            {"sheet_id": sheet_id},
            {"$set": goal_sheet_data}
        )
        goal_sheet_data["sheet_id"] = sheet_id
        goal_sheet_data["created_at"] = existing["created_at"]
    else:
        # Create
        sheet_id = f"gs_{uuid.uuid4().hex[:12]}"
        goal_sheet_data["sheet_id"] = sheet_id
        goal_sheet_data["created_at"] = datetime.now(timezone.utc)

        # Give points for first goal sheet of the day
        await db.user_progress.update_one(
            {"user_id": user["user_id"]},
            {"$inc": {"points": 5}}  # +5 points por llenar goal sheet
        )

        await db.goal_sheets.insert_one(goal_sheet_data)

    # Get user progress to calculate readiness score
    progress = await db.user_progress.find_one({"user_id": user.user_id})

    # Calculate summary
    summary = {
        "sheet_id": goal_sheet_data["sheet_id"],
        "date": goal_sheet_data["date"],
        "metrics": goal_sheet_data["metrics"],
        "goals": goal_sheet_data.get("goals"),
        "notes": goal_sheet_data.get("notes"),
        "is_new": existing is None,
        "points_earned": 5 if existing is None else 0,
        "progress_percentage": calculate_progress_percentage(
            goal_sheet_data["metrics"],
            goal_sheet_data.get("goals")
        ) if goal_sheet_data.get("goals") else None
    }

    return {
        "success": True,
        "data": summary
    }


@router.get("/today")
async def get_today_goal_sheet(user = Depends(require_auth)):
    """Obtener goal sheet de hoy"""
    today = datetime.now().strftime("%Y-%m-%d")

    sheet = await db.goal_sheets.find_one({
        "user_id": user.user_id,
        "date": today
    })

    if not sheet:
        return {
            "success": True,
            "data": None,
            "message": "No goal sheet for today"
        }

    # Calculate progress percentage
    progress_pct = calculate_progress_percentage(
        sheet["metrics"],
        sheet.get("goals")
    ) if sheet.get("goals") else None

    sheet_data = {
        **sheet,
        "progress_percentage": progress_pct
    }

    del sheet_data["_id"]

    return {"success": True, "data": sheet_data}


@router.get("/my")
async def get_my_goal_sheets(
    skip: int = 0,
    limit: int = 30,
    user = Depends(require_auth)
):
    """Obtener goal sheets del usuario actual"""
    cursor = db.goal_sheets.find(
        {"user_id": user["user_id"]}
    ).sort("date", -1).skip(skip).limit(limit)

    sheets = await cursor.to_list(length=limit)

    # Remove ObjectId
    for sheet in sheets:
        del sheet["_id"]

    total = await db.goal_sheets.count_documents({"user_id": user["user_id"]})

    return {
        "success": True,
        "data": sheets,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/weekly")
async def get_weekly_stats(user = Depends(require_auth)):
    """Obtener stats de la semana actual"""
    today = datetime.now()
    week_start = today - timedelta(days=today.weekday())
    week_start_str = week_start.strftime("%Y-%m-%d")

    cursor = db.goal_sheets.find({
        "user_id": user["user_id"],
        "date": {"$gte": week_start_str}
    })

    sheets = await cursor.to_list(length=7)

    # Calculate totals
    totals = {
        "tours_given": sum(s.get("metrics", {}).get("tours_given", 0) for s in sheets),
        "calls_made": sum(s.get("metrics", {}).get("calls_made", 0) for s in sheets),
        "new_leads": sum(s.get("metrics", {}).get("new_leads", 0) for s in sheets),
        "closes": sum(s.get("metrics", {}).get("closes", 0) for s in sheets),
        "referrals": sum(s.get("metrics", {}).get("referrals", 0) for s in sheets),
        "demos_booked": sum(s.get("metrics", {}).get("demos_booked", 0) for s in sheets),
        "presentations": sum(s.get("metrics", {}).get("presentations", 0) for s in sheets),
        "days_filled": len(sheets)
    }

    return {"success": True, "data": totals}


@router.get("/streak")
async def get_goal_sheet_streak(user = Depends(require_auth)):
    """Obtener streak de días consecutivos llenando goal sheet"""
    today = datetime.now()
    streak = 0
    check_date = today

    while True:
        date_str = check_date.strftime("%Y-%m-%d")
        sheet = await db.goal_sheets.find_one({
            "user_id": user["user_id"],
            "date": date_str
        })

        if sheet:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break

    # Calculate bonus points for streak
    bonus_points = 0
    if streak >= 7:
        bonus_points += 10  # Week Warrior
    if streak >= 14:
        bonus_points += 20  # Two Week Titan
    if streak >= 30:
        bonus_points += 50  # Month Master

    return {
        "success": True,
        "data": {
            "streak_days": streak,
            "bonus_points": bonus_points,
            "next_badge": get_next_streak_badge(streak)
        }
    }


def get_next_streak_badge(streak: int) -> Optional[str]:
    """Obtener próximo badge por streak"""
    if streak < 7:
        return "Week Warrior" if streak < 7 else None
    elif streak < 14:
        return "Two Week Titan" if streak < 14 else None
    elif streak < 30:
        return "Month Master" if streak < 30 else None
    else:
        return None


@router.get("/summary/week")
async def get_weekly_summary(user = Depends(require_auth)):
    """Obtener resumen semanal con progreso"""
    weekly_stats = await get_weekly_stats.__wrapped__(user=user)
    weekly_stats_data = weekly_stats.body["data"]

    streak_info = await get_goal_sheet_streak.__wrapped__(user=user)
    streak_data = streak_info.body["data"]

    # Get today's goal sheet
    today_info = await get_today_goal_sheet.__wrapped__(user=user)
    today_data = today_info.body["data"]

    return {
        "success": True,
        "data": {
            "weekly_stats": weekly_stats_data,
            "streak": streak_data,
            "today": today_data
        }
    }


@router.get("/leaderboard/team")
async def get_team_leaderboard(user = Depends(require_auth)):
    """Obtener leaderboard del equipo (ordenado por puntos esta semana)"""
    # Get user's team
    user_data = await db.users.find_one({"user_id": user["user_id"]})
    team_id = user_data.get("team_id")

    if not team_id:
        return {
            "success": True,
            "data": [],
            "message": "User not assigned to a team"
        }

    # Get team members
    team = await db.teams.find_one({"team_id": team_id})
    if not team:
        return {"success": True, "data": []}

    member_ids = team.get("members", [])

    # Calculate weekly stats for each member
    today = datetime.now()
    week_start = today - timedelta(days=today.weekday())
    week_start_str = week_start.strftime("%Y-%m-%d")

    leaderboard = []

    for member_id in member_ids:
        member = await db.users.find_one({"user_id": member_id}, {"projection": {"user_id": 1, "name": 1, "_id": 0}})
        if not member:
            continue

        # Get goal sheets for this week
        goal_sheets = await db.goal_sheets.find({
            "user_id": member_id,
            "date": {"$gte": week_start_str}
        }).to_list(length=7)

        total_tours = sum(gs.get("metrics", {}).get("tours_given", 0) for gs in goal_sheets)
        total_closes = sum(gs.get("metrics", {}).get("closes", 0) for gs in goal_sheets)

        leaderboard.append({
            "user_id": member_id,
            "name": member["name"],
            "tours_this_week": total_tours,
            "closes_this_week": total_closes,
            "days_active": len(goal_sheets)
        })

    # Sort by closes, then tours
    leaderboard.sort(key=lambda x: (x["closes_this_week"], x["tours_this_week"]), reverse=True)

    return {
        "success": True,
        "data": leaderboard
    }


@router.put("/{sheet_id}")
async def update_goal_sheet(
    sheet_id: str,
    data: GoalSheetUpdateInput,
    user = Depends(require_auth)
):
    """Actualizar un goal sheet existente"""
    # Verify ownership
    sheet = await db.goal_sheets.find_one({"sheet_id": sheet_id})

    if not sheet:
        raise HTTPException(
            status_code=404,
            detail="Goal sheet not found"
        )

    if sheet["user_id"] != user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You can only update your own goal sheets"
        )

    # Prepare update dict
    update_dict = {}

    if data.metrics:
        update_dict["metrics"] = data.metrics.model_dump()

    if data.goals:
        update_dict["goals"] = data.goals.model_dump()

    if data.notes is not None:
        update_dict["notes"] = data.notes

    if update_dict:
        update_dict["updated_at"] = datetime.now(timezone.utc)

        await db.goal_sheets.update_one(
            {"sheet_id": sheet_id},
            {"$set": update_dict}
        )

    # Get updated sheet
    updated_sheet = await db.goal_sheets.find_one({"sheet_id": sheet_id})
    del updated_sheet["_id"]

    return {
        "success": True,
        "data": updated_sheet
    }


@router.delete("/{sheet_id}")
async def delete_goal_sheet(
    sheet_id: str,
    user = Depends(require_auth)
):
    """Eliminar un goal sheet (solo si es del usuario y de hoy)"""
    sheet = await db.goal_sheets.find_one({"sheet_id": sheet_id})

    if not sheet:
        raise HTTPException(
            status_code=404,
            detail="Goal sheet not found"
        )

    if sheet["user_id"] != user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own goal sheets"
        )

    # Only allow deleting today's goal sheet
    today = datetime.now().strftime("%Y-%m-%d")
    if sheet["date"] != today:
        raise HTTPException(
            status_code=400,
            detail="Can only delete today's goal sheet"
        )

    await db.goal_sheets.delete_one({"sheet_id": sheet_id})

    return {
        "success": True,
        "message": "Goal sheet deleted successfully"
    }
