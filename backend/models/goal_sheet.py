"""
Goal Sheet Pydantic Models

Models para el sistema de tracking de métricas diarias
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime

class DailyMetrics(BaseModel):
    """Métricas diarias de un rep"""
    tours_given: int = Field(ge=0, description="Tours completados")
    calls_made: int = Field(ge=0, description="Llamadas realizadas")
    new_leads: int = Field(ge=0, description="Nuevos leads obtenidos")
    closes: int = Field(ge=0, description="Ventas cerradas")
    referrals: int = Field(ge=0, description="Referidos obtenidos")
    demos_booked: int = Field(ge=0, description="Demos agendados")
    presentations: int = Field(default=0, ge=0, description="Presentaciones dadas")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class WeeklyGoals(BaseModel):
    """Metas semanales de un rep"""
    tours_given: int = Field(ge=0, description="Meta de tours semanales")
    calls_made: int = Field(ge=0, description="Meta de llamadas semanales")
    new_leads: int = Field(ge=0, description="Meta de leads semanales")
    closes: int = Field(ge=0, description="Meta de cierres semanales")
    referrals: int = Field(ge=0, description="Meta de referidos semanales")
    demos_booked: int = Field(default=0, ge=0, description="Meta de demos semanales")
    presentations: int = Field(default=0, ge=0, description="Meta de presentaciones semanales")

class GoalSheet(BaseModel):
    """Goal sheet completo"""
    sheet_id: Optional[str] = None
    user_id: str
    date: str  # YYYY-MM-DD
    metrics: DailyMetrics
    goals: Optional[WeeklyGoals] = None
    notes: Optional[str] = None
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

class GoalSheetUpdate(BaseModel):
    """Para actualizar goal sheet"""
    metrics: Optional[DailyMetrics] = None
    goals: Optional[WeeklyGoals] = None
    notes: Optional[str] = None

class GoalSheetSummary(BaseModel):
    """Resumen de goal sheet para dashboard"""
    date: str
    tours_given: int
    closes: int
    progress_percentage: Optional[float] = None  # Progreso vs metas
