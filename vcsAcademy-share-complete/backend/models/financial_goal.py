"""
Financial Goals Pydantic Models

Models para el sistema de metas financieras gamificadas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime, date
from enum import Enum

class ExpenseCategory(str, Enum):
    """Categorías de gastos mensuales"""
    RENT = "rent"
    CAR_PAYMENT = "car_payment"
    ELECTRICITY = "electricity"
    FOOD = "food"
    WATER_BILL = "water_bill"
    CREDIT_CARD = "credit_card"
    GAS = "gas"
    SCHOOL = "school"
    INSURANCE = "insurance"
    DOCTOR = "doctor"
    DENTIST = "dentist"
    GYM = "gym"
    TRANSPORTATION = "transportation"
    CELL_PHONE = "cell_phone"
    PHONE = "phone"
    CABLE = "cable"
    HOUSE_CLEANING = "house_cleaning"
    CHILD_CARE = "child_care"
    CLOTHES = "clothes"
    ENTERTAINMENT = "entertainment"
    VACATION = "vacation"
    OTHER = "other"

class PersonalAttribute(str, Enum):
    """Atributos personales para gamificación"""
    ATTITUDE = "attitude"
    COURAGE = "courage"
    FOCUS = "focus"
    TRAINING = "training"
    DISCIPLINE = "discipline"
    PERSISTENCE = "persistence"
    COMMITMENT = "commitment"

class MonthlyExpense(BaseModel):
    """Gasto mensual individual"""
    category: ExpenseCategory
    amount: float = Field(ge=0, description="Monto del gasto")
    description: Optional[str] = Field(default=None, description="Descripción adicional")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class FinancialGoal(BaseModel):
    """Meta financiera del usuario"""
    goal_id: Optional[str] = None
    user_id: str
    month: str  # YYYY-MM format
    target_income: float = Field(ge=0, description="Meta de ingresos mensual")
    expenses: List[MonthlyExpense] = Field(default_factory=list)

    # Calculated fields
    total_expenses: float = Field(ge=0, description="Total de gastos mensuales")
    income_gap: float = Field(ge=0, description="Diferencia entre meta y gastos actuales")

    # Sales metrics needed
    avg_sale: Optional[float] = Field(default=None, ge=0, description="Venta promedio")
    closing_rate: Optional[float] = Field(default=None, ge=0, le=100, description="Tasa de cierre")

    # Calculated targets
    tours_needed: Optional[int] = Field(default=None, ge=0, description="Tours necesarios para meta")
    sales_needed: Optional[int] = Field(default=None, ge=0, description="Ventas necesarias para meta")

    # Timestamps
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class FinancialGoalCreate(BaseModel):
    """Para crear meta financiera"""
    target_income: float = Field(ge=0, description="Meta de ingresos mensual")
    expenses: List[MonthlyExpense]
    avg_sale: Optional[float] = Field(default=1000, ge=0)
    closing_rate: Optional[float] = Field(default=20, ge=0, le=100)

class FinancialGoalUpdate(BaseModel):
    """Para actualizar meta financiera"""
    target_income: Optional[float] = Field(default=None, ge=0)
    expenses: Optional[List[MonthlyExpense]] = None
    avg_sale: Optional[float] = Field(default=None, ge=0)
    closing_rate: Optional[float] = Field(default=None, ge=0, le=100)

class DailyAttributeProgress(BaseModel):
    """Progreso diario en atributos personales"""
    attribute_id: Optional[str] = None
    user_id: str
    date: str  # YYYY-MM-DD
    attribute_type: PersonalAttribute
    achieved: bool = Field(default=False, description="Si se logró el atributo")
    notes: Optional[str] = Field(default=None, description="Notas del día")
    points_earned: int = Field(default=0, description="Puntos ganados")

class DailySalesRecord(BaseModel):
    """Registro de venta diaria (inspirado en Ventas del Mes)"""
    record_id: Optional[str] = None
    user_id: str
    date: str  # YYYY-MM-DD
    day_number: int = Field(ge=1, le=31, description="Día del mes 1-31")

    # Sales metrics
    socio: Optional[str] = Field(default=None, description="Nombre del cliente/socio")
    manager: Optional[str] = Field(default=None, description="Manager asignado")
    volume: float = Field(ge=0, description="Volumen de venta")
    enganche_pct: Optional[float] = Field(default=None, ge=0, le=100, description="% de enganche")
    commission_pct: float = Field(ge=0, le=100, description="% de comisión")
    milesingreso: float = Field(ge=0, description="Ingresos en miles de pesos")

    # Learning
    daily_tip: Optional[str] = Field(default=None, description="Qué aprendí hoy (Notes y Tips)")

    # Timestamps
    created_at: Optional[datetime] = None

class DailySalesRecordCreate(BaseModel):
    """Para crear registro de venta diario"""
    day_number: int
    socio: Optional[str] = None
    manager: Optional[str] = None
    volume: float = Field(ge=0)
    enganche_pct: Optional[float] = None
    commission_pct: float = Field(ge=0, le=100)
    milesingreso: float = Field(ge=0)
    daily_tip: Optional[str] = None

class ChallengeType(str, Enum):
    """Tipos de desafíos diarios gamificados"""
    MONDAY_FOCUS = "monday_focus"
    TUESDAY_COURAGE = "tuesday_courage"
    WEDNESDAY_TRAINING = "wednesday_training"
    THURSDAY_DISCIPLINE = "thursday_discipline"
    FRIDAY_PERSISTENCE = "friday_persistence"
    WEEKLY_COMMITMENT = "weekly_commitment"

class DailyChallenge(BaseModel):
    """Desafío diario gamificado"""
    challenge_id: Optional[str] = None
    user_id: str
    date: str  # YYYY-MM-DD
    challenge_type: ChallengeType
    description: str
    target_tasks: int = Field(ge=1, description="Número de tareas a completar")
    completed_tasks: int = Field(default=0, ge=0, description="Tareas completadas")
    points_awarded: int = Field(default=0, description="Puntos otorgados")
    completed: bool = Field(default=False)
    notes: Optional[str] = None

class FinancialGoalSummary(BaseModel):
    """Resumen de meta financiera para dashboard"""
    month: str
    target_income: float
    total_expenses: float
    income_gap: float
    current_revenue: float = Field(default=0, description="Ingresos actuales del mes")
    progress_percentage: float = Field(default=0, description="Progreso hacia meta")
    tours_needed: int
    sales_needed: int
    days_remaining: int = Field(default=0, description="Días restantes en el mes")
