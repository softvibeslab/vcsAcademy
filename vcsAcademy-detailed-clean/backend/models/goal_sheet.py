"""
Goal Sheet Pydantic Models

Models para el sistema de tracking de métricas diarias
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime
from enum import Enum

class EventType(str, Enum):
    """Tipos de eventos diarios"""
    SALE = "sale"
    UPGRADE = "upgrade"
    NO_SALE = "no_sale"
    PENDING = "pending"
    NO_TOUR = "no_tour"
    OVERFLOW = "overflow"
    DAY_OFF = "day_off"
    SICK = "sick"

class DailyMetrics(BaseModel):
    """Métricas diarias de un rep"""
    tours_given: int = Field(ge=0, description="Tours completados")
    calls_made: int = Field(ge=0, description="Llamadas realizadas")
    new_leads: int = Field(ge=0, description="Nuevos leads obtenidos")
    closes: int = Field(ge=0, description="Ventas cerradas")
    referrals: int = Field(ge=0, description="Referidos obtenidos")
    demos_booked: int = Field(default=0, ge=0, description="Demos agendados")
    presentations: int = Field(default=0, ge=0, description="Presentaciones dadas")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class WeeklyGoals(BaseModel):
    """Metas semanales de un rep"""
    tours_given: Optional[int] = Field(default=None, ge=0, description="Meta de tours semanales")
    calls_made: Optional[int] = Field(default=None, ge=0, description="Meta de llamadas semanales")
    new_leads: Optional[int] = Field(default=None, ge=0, description="Meta de leads semanales")
    closes: Optional[int] = Field(default=None, ge=0, description="Meta de cierres semanales")
    referrals: Optional[int] = Field(default=None, ge=0, description="Meta de referidos semanales")
    demos_booked: Optional[int] = Field(default=None, ge=0, description="Meta de demos semanales")
    presentations: Optional[int] = Field(default=None, ge=0, description="Meta de presentaciones semanales")

class ContractDetails(BaseModel):
    """Detalles de contrato para ventas"""
    contract_number: Optional[str] = Field(default=None, description="Número de contrato")
    manager: Optional[str] = Field(default=None, description="Gerente a cargo")
    legal_officer: Optional[str] = Field(default=None, description="Oficial legal de verificación")
    hostess: Optional[str] = Field(default=None, description="Anfitrión/a del tour")
    notes: Optional[str] = Field(default=None, description="Notas adicionales")
    start_follow_up: bool = Field(default=False, description="Iniciar archivo de seguimiento")
    is_pending: bool = Field(default=False, description="Venta está pendiente")
    cancel_contract: bool = Field(default=False, description="Cancelar contrato")

class PurchaseInfo(BaseModel):
    """Información de compra/vacation club"""
    purchase_price: Optional[float] = Field(default=None, ge=0, description="Precio de compra")
    category: Optional[str] = Field(default=None, description="Categoría de membresía")
    membership_type: Optional[str] = Field(default=None, description="Tipo de membresía")
    initial_investment: Optional[float] = Field(default=None, ge=0, description="Inversión inicial")
    percentage: Optional[float] = Field(default=None, ge=0, description="Porcentaje")
    nights: Optional[int] = Field(default=None, ge=0, description="Número de noches")
    interest_rate: Optional[float] = Field(default=None, ge=0, description="Tasa de interés")
    adjustment: Optional[float] = Field(default=None, description="Ajuste")
    balance: Optional[float] = Field(default=None, ge=0, description="Saldo restante")

class PaymentPlan(BaseModel):
    """Plan de pago"""
    payment_plan_months: Optional[int] = Field(default=None, ge=0, description="Plazo en meses")
    monthly_payment: Optional[float] = Field(default=None, ge=0, description="Pago mensual")

class EventLog(BaseModel):
    """Registro de evento diario"""
    event_type: EventType = Field(description="Tipo de evento")
    timestamp: datetime = Field(default_factory=datetime.now, description="Fecha/hora del evento")
    notes: Optional[str] = Field(default=None, description="Notas del evento")
    associated_data: Optional[Dict] = Field(default=None, description="Datos adicionales del evento")

class GoalSheet(BaseModel):
    """Goal sheet completo"""
    sheet_id: Optional[str] = None
    user_id: str
    date: str  # YYYY-MM-DD
    metrics: DailyMetrics
    goals: Optional[WeeklyGoals] = None
    notes: Optional[str] = None
    event_logs: Optional[List[EventLog]] = Field(default_factory=list)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class GoalSheetCreate(BaseModel):
    """Para crear goal sheet"""
    metrics: DailyMetrics
    goals: Optional[WeeklyGoals] = None
    notes: Optional[str] = None
    event_type: Optional[EventType] = None
    contract_details: Optional[ContractDetails] = None
    purchase_info: Optional[PurchaseInfo] = None
    payment_plan: Optional[PaymentPlan] = None

class GoalSheetUpdate(BaseModel):
    """Para actualizar goal sheet"""
    metrics: Optional[DailyMetrics] = None
    goals: Optional[WeeklyGoals] = None
    notes: Optional[str] = None
    contract_details: Optional[ContractDetails] = None
    purchase_info: Optional[PurchaseInfo] = None
    payment_plan: Optional[PaymentPlan] = None

class GoalSheetSummary(BaseModel):
    """Resumen de goal sheet para dashboard"""
    date: str
    tours_given: int
    closes: int
    progress_percentage: Optional[float] = None  # Progreso vs metas
    event_type: Optional[EventType] = None
    total_revenue: Optional[float] = None  # Nuevo campo para revenue
