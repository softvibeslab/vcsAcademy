"""
Financial Goals Routes
API endpoints para el sistema de metas financieras gamificadas
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field

from server import db, require_auth
from models.financial_goal import (
    FinancialGoal, FinancialGoalCreate, FinancialGoalUpdate,
    MonthlyExpense, PersonalAttribute, DailyAttributeProgress,
    DailySalesRecord, DailySalesRecordCreate, DailyChallenge,
    FinancialGoalSummary, ChallengeType
)
import uuid

router = APIRouter(prefix="/api/financial", tags=["financial"])

# ============== HELPERS ==============

def calculate_financial_metrics(target_income: float, expenses: List[MonthlyExpense],
                                 avg_sale: float = 1000, closing_rate: float = 20) -> dict:
    """Calcula métricas financieras y sales targets"""

    total_expenses = sum(exp.amount for exp in expenses)
    income_gap = max(0, target_income - total_expenses)

    # Si hay gap de ingresos, calcular qué se necesita
    if income_gap > 0:
        # Fórmula: Sales_needed = income_gap / avg_sale
        # Tours_needed = Sales_needed / (closing_rate / 100)
        sales_needed = max(1, int(income_gap / avg_sale))
        tours_needed = max(1, int(sales_needed / (closing_rate / 100)))
    else:
        sales_needed = 0
        tours_needed = 0

    return {
        "total_expenses": total_expenses,
        "income_gap": income_gap,
        "sales_needed": sales_needed,
        "tours_needed": tours_needed
    }

def get_days_remaining_in_month(year: int, month: int) -> int:
    """Calcula días restantes en el mes"""
    today = datetime.now()
    if today.month != month or today.year != year:
        return 0  # Month not current

    # Last day of target month
    if month == 12:
        last_day = datetime(year + 1, 1, 1) - timedelta(days=1)
    else:
        last_day = datetime(year, month + 1, 1) - timedelta(days=1)

    return (last_day - today).days + 1

# ============== ENDPOINTS ==============

@router.post("/goals/setup")
async def setup_financial_goal(
    data: FinancialGoalCreate,
    user = Depends(require_auth)
):
    """Crear o actualizar meta financiera mensual"""
    today = datetime.now()
    current_month = today.strftime("%Y-%m")

    # Check if goal exists for this month
    existing = await db.financial_goals.find_one({
        "user_id": user.user_id,
        "month": current_month
    })

    # Calculate metrics
    metrics = calculate_financial_metrics(
        data.target_income,
        data.expenses,
        data.avg_sale or 1000,
        data.closing_rate or 20
    )

    goal_data = {
        "user_id": user.user_id,
        "month": current_month,
        "target_income": data.target_income,
        "expenses": [exp.model_dump() for exp in data.expenses],
        "total_expenses": metrics["total_expenses"],
        "income_gap": metrics["income_gap"],
        "avg_sale": data.avg_sale or 1000,
        "closing_rate": data.closing_rate or 20,
        "tours_needed": metrics["tours_needed"],
        "sales_needed": metrics["sales_needed"],
        "updated_at": datetime.now(timezone.utc)
    }

    if existing:
        # Update
        goal_id = existing["goal_id"]
        await db.financial_goals.update_one(
            {"goal_id": goal_id},
            {"$set": goal_data}
        )
        goal_data["goal_id"] = goal_id
        goal_data["created_at"] = existing["created_at"]
    else:
        # Create
        goal_id = f"fg_{uuid.uuid4().hex[:12]}"
        goal_data["goal_id"] = goal_id
        goal_data["created_at"] = datetime.now(timezone.utc)

        # Give points for setting financial goal
        await db.user_progress.update_one(
            {"user_id": user.user_id},
            {"$inc": {"points": 25}}  # +25 points por establecer meta
        )

        await db.financial_goals.insert_one(goal_data)

    # Get current revenue for progress
    current_revenue = 0  # TODO: Calculate from daily sales records

    days_remaining = get_days_remaining_in_month(
        int(current_month.split("-")[0]),
        int(current_month.split("-")[1])
    )

    progress_percentage = min(100, (current_revenue / data.target_income) * 100) if data.target_income > 0 else 0

    return {
        "success": True,
        "data": {
            **goal_data,
            "current_revenue": current_revenue,
            "progress_percentage": progress_percentage,
            "days_remaining": days_remaining
        }
    }

@router.get("/goals/current")
async def get_current_financial_goal(user = Depends(require_auth)):
    """Obtener meta financiera del mes actual"""
    current_month = datetime.now().strftime("%Y-%m")

    goal = await db.financial_goals.find_one({
        "user_id": user.user_id,
        "month": current_month
    })

    if not goal:
        return {
            "success": True,
            "data": None,
            "message": "No financial goal set for this month"
        }

    # Remove ObjectId
    if "_id" in goal:
        del goal["_id"]

    return {"success": True, "data": goal}

@router.get("/goals/summary")
async def get_financial_goal_summary(user = Depends(require_auth)):
    """Obtener resumen ejecutivo de meta financiera"""
    current_month = datetime.now().strftime("%Y-%m")

    goal = await db.financial_goals.find_one({
        "user_id": user.user_id,
        "month": current_month
    })

    if not goal:
        return {
            "success": True,
            "data": None
        }

    # Calculate current revenue from sales records
    current_revenue = 0
    sales_records = await db.daily_sales.find({
        "user_id": user.user_id,
        "date": {"$regex": f"^{current_month}"}
    }).to_list(length=31)

    for record in sales_records:
        current_revenue += record.get("volume", 0)

    days_remaining = get_days_remaining_in_month(
        int(current_month.split("-")[0]),
        int(current_month.split("-")[1])
    )

    progress_percentage = min(100, (current_revenue / goal["target_income"]) * 100) if goal["target_income"] > 0 else 0

    summary = {
        "month": current_month,
        "target_income": goal["target_income"],
        "total_expenses": goal["total_expenses"],
        "income_gap": goal["income_gap"],
        "current_revenue": current_revenue,
        "progress_percentage": progress_percentage,
        "tours_needed": goal["tours_needed"],
        "sales_needed": goal["sales_needed"],
        "days_remaining": days_remaining,
        "avg_sale": goal.get("avg_sale", 1000),
        "closing_rate": goal.get("closing_rate", 20)
    }

    return {"success": True, "data": summary}

@router.post("/sales/daily")
async def log_daily_sale(
    data: DailySalesRecordCreate,
    user = Depends(require_auth)
):
    """Registrar venta diaria (Ventas del Mes)"""
    today = datetime.now().strftime("%Y-%m-%d")

    # Check if record exists
    existing = await db.daily_sales.find_one({
        "user_id": user.user_id,
        "date": today,
        "day_number": data.day_number
    })

    sales_data = {
        "user_id": user.user_id,
        "date": today,
        "day_number": data.day_number,
        "socio": data.socio,
        "manager": data.manager,
        "volume": data.volume,
        "enganche_pct": data.enganche_pct,
        "commission_pct": data.commission_pct,
        "milesingreso": data.milesingreso,
        "daily_tip": data.daily_tip,
        "updated_at": datetime.now(timezone.utc)
    }

    points_earned = 10  # +10 points por registrar venta

    if existing:
        # Update
        record_id = existing["record_id"]
        await db.daily_sales.update_one(
            {"record_id": record_id},
            {"$set": sales_data}
        )
        sales_data["record_id"] = record_id
        sales_data["created_at"] = existing["created_at"]
        points_earned = 0  # No points for updates
    else:
        # Create
        record_id = f"ds_{uuid.uuid4().hex[:12]}"
        sales_data["record_id"] = record_id
        sales_data["created_at"] = datetime.now(timezone.utc)

        # Award points
        await db.user_progress.update_one(
            {"user_id": user.user_id},
            {"$inc": {"points": points_earned}}
        )

        await db.daily_sales.insert_one(sales_data)

    return {
        "success": True,
        "data": {
            **sales_data,
            "points_earned": points_earned
        }
    }

@router.get("/sales/monthly")
async def get_monthly_sales_records(user = Depends(require_auth)):
    """Obtener registros de ventas del mes"""
    current_month = datetime.now().strftime("%Y-%m")

    cursor = db.daily_sales.find({
        "user_id": user.user_id,
        "date": {"$regex": f"^{current_month}"}
    }).sort("day_number", 1)

    records = await cursor.to_list(length=31)

    # Remove ObjectIds
    for record in records:
        if "_id" in record:
            del record["_id"]

    total_volume = sum(r.get("volume", 0) for r in records)

    return {
        "success": True,
        "data": {
            "records": records,
            "total": len(records),
            "total_volume": total_volume
        }
    }

@router.post("/attributes/daily")
async def log_daily_attribute(
    attribute_type: PersonalAttribute,
    achieved: bool = True,
    notes: Optional[str] = None,
    user = Depends(require_auth)
):
    """Registrar progreso en atributo personal"""
    today = datetime.now().strftime("%Y-%m-%d")

    # Check if exists
    existing = await db.daily_attributes.find_one({
        "user_id": user.user_id,
        "date": today,
        "attribute_type": attribute_type.value
    })

    # Points per attribute
    attribute_points = {
        PersonalAttribute.ATTITUDE: 10,
        PersonalAttribute.COURAGE: 10,
        PersonalAttribute.FOCUS: 10,
        PersonalAttribute.TRAINING: 15,
        PersonalAttribute.DISCIPLINE: 20,
        PersonalAttribute.PERSISTENCE: 15,
        PersonalAttribute.COMMITMENT: 25,
    }

    points = attribute_points.get(attribute_type, 10)

    attribute_data = {
        "user_id": user.user_id,
        "date": today,
        "attribute_type": attribute_type.value,
        "achieved": achieved,
        "notes": notes,
        "points_earned": points if achieved else 0,
        "updated_at": datetime.now(timezone.utc)
    }

    if existing:
        # Update
        attribute_id = existing["attribute_id"]
        await db.daily_attributes.update_one(
            {"attribute_id": attribute_id},
            {"$set": attribute_data}
        )
        attribute_data["attribute_id"] = attribute_id
    else:
        # Create
        attribute_id = f"attr_{uuid.uuid4().hex[:12]}"
        attribute_data["attribute_id"] = attribute_id
        attribute_data["created_at"] = datetime.now(timezone.utc)

        # Award points
        if achieved:
            await db.user_progress.update_one(
                {"user_id": user.user_id},
                {"$inc": {"points": points}}
            )

        await db.daily_attributes.insert_one(attribute_data)

    return {
        "success": True,
        "data": attribute_data
    }

@router.get("/attributes/today")
async def get_today_attributes(user = Depends(require_auth)):
    """Obtener atributos del día de hoy"""
    today = datetime.now().strftime("%Y-%m-%d")

    cursor = db.daily_attributes.find({
        "user_id": user.user_id,
        "date": today
    })

    attributes = await cursor.to_list(length=10)

    # Remove ObjectIds
    for attr in attributes:
        if "_id" in attr:
            del attr["_id"]

    # Calculate daily combo bonus
    achieved_count = sum(1 for attr in attributes if attr.get("achieved", False))
    total_possible = 7  # 7 personal attributes
    daily_combo_achieved = achieved_count == total_possible
    daily_bonus_points = 100 if daily_combo_achieved else 0

    return {
        "success": True,
        "data": {
            "attributes": attributes,
            "achieved_count": achieved_count,
            "total_possible": total_possible,
            "daily_combo_achieved": daily_combo_achieved,
            "daily_bonus_points": daily_bonus_points
        }
    }

@router.post("/challenges/complete")
async def complete_daily_challenge(
    challenge_type: ChallengeType,
    target_tasks: int,
    completed_tasks: int,
    notes: Optional[str] = None,
    user = Depends(require_auth)
):
    """Completar desafío diario gamificado"""
    today = datetime.now().strftime("%Y-%m-%d")

    # Points per challenge type
    challenge_points = {
        ChallengeType.MONDAY_FOCUS: 25,
        ChallengeType.TUESDAY_COURAGE: 25,
        ChallengeType.WEDNESDAY_TRAINING: 25,
        ChallengeType.THURSDAY_DISCIPLINE: 25,
        ChallengeType.FRIDAY_PERSISTENCE: 25,
        ChallengeType.WEEKLY_COMMITMENT: 50,
    }

    points = challenge_points.get(challenge_type, 25)

    challenge_descriptions = {
        ChallengeType.MONDAY_FOCUS: "Completa 3 tareas sin distracciones",
        ChallengeType.TUESDAY_COURAGE: "Llama a 5 leads cold",
        ChallengeType.WEDNESDAY_TRAINING: "Completa 1 módulo de training",
        ChallengeType.THURSDAY_DISCIPLINE: "Sigue tu schedule perfectamente",
        ChallengeType.FRIDAY_PERSISTENCE: "No te rindas hasta lograr tu meta",
        ChallengeType.WEEKLY_COMMITMENT: "Cumple todos tus compromisos semanales"
    }

    description = challenge_descriptions.get(challenge_type, "Complete the challenge")

    challenge_data = {
        "user_id": user.user_id,
        "date": today,
        "challenge_type": challenge_type.value,
        "description": description,
        "target_tasks": target_tasks,
        "completed_tasks": completed_tasks,
        "points_awarded": points if completed_tasks >= target_tasks else 0,
        "completed": completed_tasks >= target_tasks,
        "notes": notes,
        "updated_at": datetime.now(timezone.utc)
    }

    # Check if exists
    existing = await db.daily_challenges.find_one({
        "user_id": user.user_id,
        "date": today,
        "challenge_type": challenge_type.value
    })

    if existing:
        challenge_id = existing["challenge_id"]
        challenge_data["challenge_id"] = challenge_id
        await db.daily_challenges.update_one(
            {"challenge_id": challenge_id},
            {"$set": challenge_data}
        )
    else:
        challenge_id = f"chal_{uuid.uuid4().hex[:12]}"
        challenge_data["challenge_id"] = challenge_id
        challenge_data["created_at"] = datetime.now(timezone.utc)

        # Award points if completed
        if challenge_data["completed"]:
            await db.user_progress.update_one(
                {"user_id": user.user_id},
                {"$inc": {"points": points}}
            )

        await db.daily_challenges.insert_one(challenge_data)

    return {
        "success": True,
        "data": challenge_data
    }

@router.get("/challenges/active")
async def get_active_challenges(user = Depends(require_auth)):
    """Obtener desafíos activos de hoy"""
    today = datetime.now().strftime("%Y-%m-%d")
    weekday = today.weekday()  # 0=Monday, 6=Sunday

    # Determine challenge based on weekday
    challenge_mapping = {
        0: ChallengeType.MONDAY_FOCUS,
        1: ChallengeType.TUESDAY_COURAGE,
        2: ChallengeType.WEDNESDAY_TRAINING,
        3: ChallengeType.THURSDAY_DISCIPLINE,
        4: ChallengeType.FRIDAY_PERSISTENCE,
    }

    active_challenges = []

    # Daily challenge (if weekday)
    if weekday in challenge_mapping:
        daily_challenge = await db.daily_challenges.find_one({
            "user_id": user.user_id,
            "date": today,
            "challenge_type": challenge_mapping[weekday].value
        })

        if daily_challenge:
            if "_id" in daily_challenge:
                del daily_challenge["_id"]
            active_challenges.append(daily_challenge)

    return {
        "success": True,
        "data": active_challenges
    }
