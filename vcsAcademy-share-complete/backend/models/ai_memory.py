"""
AI Memory Models
Modelos de datos para memoria a largo plazo del asistente AI
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from enum import Enum

class MemoryType(str, Enum):
    """Tipos de memoria del asistente"""
    CONVERSATION = "conversation"  # Historial de conversaciones
    PREFERENCE = "preference"      # Preferencias del usuario
    PERFORMANCE = "performance"    # Datos de rendimiento
    SKILL_GAP = "skill_gap"        # Áreas de mejora identificadas
    GOAL_PROGRESS = "goal_progress"  # Progreso hacia metas
    LEARNING_STYLE = "learning_style"  # Estilo de aprendizaje
    SUCCESS_PATTERN = "success_pattern"  # Patrones de éxito

class SentimentType(str, Enum):
    """Tipos de sentimiento"""
    VERY_POSITIVE = "very_positive"
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"
    VERY_NEGATIVE = "very_negative"

class ConversationMemory(BaseModel):
    """Memoria de conversaciones pasadas"""
    memory_id: str
    user_id: str
    conversation_summary: str
    topics_discussed: List[str]
    user_concerns: List[str]
    recommendations_given: List[str]
    follow_up_needed: bool
    created_at: datetime
    last_accessed: datetime

class UserPreference(BaseModel):
    """Preferencias del usuario aprendidas"""
    preference_id: str
    user_id: str
    communication_style: str  # formal, casual, motivational
    preferred_topics: List[str]
    avoid_topics: List[str]
    best_time_to_contact: str  # morning, afternoon, evening
    response_length_preference: str  # brief, detailed, medium
    motivation_type: str  # achievement, recognition, growth

class PerformanceInsight(BaseModel):
    """Insights de rendimiento aprendidos"""
    insight_id: str
    user_id: str
    insight_type: str  # strength, weakness, opportunity
    pattern_description: str
    evidence: List[str]  # Ejemplos concretos
    first_identified: datetime
    confidence_level: float  # 0-1
    times_confirmed: int

class SkillGapAnalysis(BaseModel):
    """Análisis de brechas de habilidades"""
    gap_id: str
    user_id: str
    skill_category: str  # sales, objection_handling, closing
    current_level: float  # 0-100
    target_level: float  # 0-100
    gap_severity: str  # critical, high, medium, low
    recommended_training: List[str]  # Course IDs
    priority_score: float  # 0-100
    estimated_close_time: str  # "2 weeks"

class SentimentAnalysis(BaseModel):
    """Análisis de sentimiento del usuario"""
    analysis_id: str
    user_id: str
    current_sentiment: SentimentType
    sentiment_trend: str  # improving, stable, declining
    confidence_score: float  # 0-1
    key_indicators: List[str]
    suggested_response: str
    last_updated: datetime

class ProactiveSuggestion(BaseModel):
    """Sugerencias proactivas inteligentes"""
    suggestion_id: str
    user_id: str
    suggestion_type: str  # training, motivation, strategy
    title: str
    description: str
    urgency: str  # immediate, soon, later
    expected_impact: str  # high, medium, low
    action_items: List[Dict[str, Any]]
    created_at: datetime
    status: str  # pending, sent, acknowledged, completed

class RolePlayScenario(BaseModel):
    """Escenarios de role playing"""
    scenario_id: str
    user_id: str
    scenario_type: str  # cold_call, objection_handling, closing
    difficulty: str  # beginner, intermediate, advanced
    objective: str
    script_outline: List[Dict[str, Any]]
    success_criteria: List[str]
    aiplays_role: str  # customer, manager, prospect
    performance_score: Optional[float] = None
    feedback: Optional[str] = None
    completed_at: Optional[datetime] = None

class KnowledgeBaseItem(BaseModel):
    """Items en la base de conocimiento"""
    item_id: str
    uploaded_by: str  # user_id del admin o rep
    title: str
    description: str
    content_type: str  # pdf, image, text, video
    original_file_url: str  # URL del archivo original
    processed_content: str  # Contenido extraído y procesado
    metadata: Dict[str, Any]
    tags: List[str]
    target_audience: List[str]  # reps, managers, admins
    difficulty_level: str  # beginner, intermediate, advanced
    estimated_study_time: int  # minutes
    related_skills: List[str]  # Habilidades que practica
    created_at: datetime
    updated_at: datetime

class Notification(BaseModel):
    """Notificaciones a reps sobre nuevo material"""
    notification_id: str
    recipient_id: str  # user_id del rep
    title: str
    message: str
    priority: str  # urgent, high, normal, low
    content_type: str  # new_training, new_resource, update
    related_item_id: str  # ID del contenido
    action_required: bool
    created_at: datetime
    read_at: Optional[datetime] = None
    acted_on: bool = False