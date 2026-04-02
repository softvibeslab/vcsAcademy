"""
AI Assistant Enhanced Routes
Endpoints para el asistente AI mejorado con memoria, análisis de sentimientos, role playing, etc.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel
import re

from server import db, require_auth
from models.ai_memory import (
    ConversationMemory, UserPreference, PerformanceInsight,
    SkillGapAnalysis, SentimentAnalysis, ProactiveSuggestion,
    RolePlayScenario, KnowledgeBaseItem, Notification,
    MemoryType, SentimentType
)
import uuid

router = APIRouter(prefix="/api/ai-assistant", tags=["ai-assistant"])

# ============== MEMORY SYSTEM ==============

@router.post("/memory/conversation")
async def save_conversation_memory(
    data: Dict[str, Any],
    user = Depends(require_auth)
):
    """Guardar memoria de conversación para aprendizaje a largo plazo"""

    memory_id = f"memory_conv_{uuid.uuid4().hex[:12]}"

    # Extraer información de la conversación
    messages = data.get("conversation_history", [])
    if not messages:
        raise HTTPException(status_code=400, detail="No conversation provided")

    # Análisis simple de la conversación
    topics = []
    concerns = []
    recommendations = []

    for msg in messages:
        content = msg.get("content", "").lower()
        role = msg.get("role", "")

        if role == "user":
            # Identificar temas discutidos
            if "ventas" in content or "sales" in content:
                topics.append("sales_performance")
            if "meta" in content or "goal" in content:
                topics.append("goals")
            if "ayuda" in content or "help" in content:
                topics.append("assistance")
            if "motivación" in content or "motivado" in content:
                topics.append("motivation")

            # Identificar preocupaciones
            if "difícil" in content or "problema" in content:
                concerns.append("challenges")
            if "no sé" in content or "cómo" in content:
                concerns.append("knowledge_gaps")
            concerns.extend(re.findall(r'\bpreguntas?\b', content))

        elif role == "assistant":
            # Extraer recomendaciones dadas
            if "recomiendo" in content or "sugiero" in content:
                recommendations.append("strategic_advice")
            if "debes" in content or "necesitas" in content:
                recommendations.append("action_items")

    # Eliminar duplicados
    topics = list(set(topics))
    concerns = list(set(concerns))
    recommendations = list(set(recommendations))

    memory_doc = {
        "memory_id": memory_id,
        "user_id": user.user_id,
        "conversation_summary": data.get("summary", ""),
        "topics_discussed": topics,
        "user_concerns": concerns,
        "recommendations_given": recommendations,
        "follow_up_needed": len(concerns) > 0,
        "created_at": datetime.now(timezone.utc),
        "last_accessed": datetime.now(timezone.utc)
    }

    await db.conversation_memory.insert_one(memory_doc)

    return {
        "success": True,
        "memory_id": memory_id,
        "topics_identified": len(topics),
        "concerns_identified": len(concerns)
    }

@router.get("/memory/recent")
async def get_recent_memories(
    days: int = 7,
    user = Depends(require_auth)
):
    """Obtener memorias recientes del usuario"""

    cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)

    cursor = db.conversation_memory.find({
        "user_id": user.user_id,
        "created_at": {"$gte": cutoff_date}
    }).sort("created_at", -1)

    memories = await cursor.to_list(20)

    # Convert ObjectId to string for JSON serialization
    for memory in memories:
        memory["_id"] = str(memory["_id"])
        memory["created_at"] = memory["created_at"].isoformat() if isinstance(memory["created_at"], datetime) else memory["created_at"]
        memory["last_accessed"] = memory["last_accessed"].isoformat() if isinstance(memory["last_accessed"], datetime) else memory["last_accessed"]

    return {
        "success": True,
        "memories": memories,
        "total": len(memories)
    }

@router.get("/preferences")
async def get_user_preferences(user = Depends(require_auth)):
    """Obtener preferencias aprendidas del usuario"""

    prefs = await db.user_preferences.find_one({"user_id": user.user_id})

    if not prefs:
        # Crear preferencias por defecto
        return {
            "success": True,
            "preferences": {
                "communication_style": "motivational",
                "preferred_topics": ["sales", "goals", "motivation"],
                "avoid_topics": [],
                "response_length": "medium",
                "motivation_type": "achievement"
            }
        }

    if "_id" in prefs:
        del prefs["_id"]

    return {
        "success": True,
        "preferences": prefs
    }

# ============== SENTIMENT ANALYSIS ==============

@router.post("/sentiment/analyze")
async def analyze_sentiment(
    data: Dict[str, Any],
    user = Depends(require_auth)
):
    """Analizar sentimiento del usuario basado en mensaje reciente"""

    message = data.get("message", "").lower()

    # Análisis simple de sentimiento basado en palabras clave
    positive_words = ["feliz", "genial", "excelente", "gracias", "bien", "increíble", "logrado", "éxito", "victoria"]
    negative_words = ["difícil", "frustrado", "triste", "problema", "no puedo", "imposible", "fallé", "error", "mal"]

    positive_count = sum(1 for word in positive_words if word in message)
    negative_count = sum(1 for word in negative_words if word in message)

    if positive_count > negative_count:
        sentiment = SentimentType.POSITIVE if positive_count > 1 else SentimentType.NEUTRAL
    elif negative_count > positive_count:
        sentiment = SentimentType.NEGATIVE if negative_count > 1 else SentimentType.NEUTRAL
    else:
        sentiment = SentimentType.NEUTRAL

    # Análisis de tendencia (comparar con sentimientos anteriores)
    recent_sentiments = await db.sentiment_analysis.find({
        "user_id": user.user_id
    }).sort("last_updated", -1).limit(5).to_list(5)

    if recent_sentiments:
        avg_sentiment = sum(s.get("score", 0.5) for s in recent_sentiments) / len(recent_sentiments)
        current_score = 0.7 if sentiment == SentimentType.POSITIVE else (0.3 if sentiment == SentimentType.NEGATIVE else 0.5)

        if current_score > avg_sentiment + 0.1:
            trend = "improving"
        elif current_score < avg_sentiment - 0.1:
            trend = "declining"
        else:
            trend = "stable"
    else:
        trend = "stable"

    # Crear análisis
    analysis_id = f"sentiment_{uuid.uuid4().hex[:12]}"

    analysis_doc = {
        "analysis_id": analysis_id,
        "user_id": user.user_id,
        "current_sentiment": sentiment.value,
        "sentiment_trend": trend,
        "confidence_score": 0.7,  # Basado en análisis simple
        "key_indicators": [f"Positivos: {positive_count}", f"Negativos: {negative_count}"],
        "suggested_response": _get_sentiment_response(sentiment, trend),
        "last_updated": datetime.now(timezone.utc),
        "score": 0.7 if sentiment == SentimentType.POSITIVE else (0.3 if sentiment == SentimentType.NEGATIVE else 0.5)
    }

    await db.sentiment_analysis.insert_one(analysis_doc)

    return {
        "success": True,
        "sentiment": sentiment.value,
        "trend": trend,
        "suggested_response": analysis_doc["suggested_response"]
    }

def _get_sentiment_response(sentiment: SentimentType, trend: str) -> str:
    """Generar respuesta sugerida basada en sentimiento"""

    if sentiment == SentimentType.POSITIVE:
        if trend == "improving":
            return "¡Excelente energía! Mantén este momento positivo para maximizar tu rendimiento hoy."
        else:
            return "Me alegra ver tu actitud positiva. Aprovechemos esta energía para lograr más ventas."

    elif sentiment == SentimentType.NEGATIVE:
        if trend == "declining":
            return "Siento que estás pasando por un momento difícil. Trabajemos juntos en recuperar tu enfoque y motivación."
        else:
            return "Entiendo tus frustraciones. Permíteme analizar la situación y encontrar soluciones prácticas."

    else:
        return "Perfecto. Analicemos tu situación actual y encontremos las mejores oportunidades."

# ============== PROACTIVE SUGGESTIONS ==============

@router.get("/suggestions/proactive")
async def get_proactive_suggestions(user = Depends(require_auth)):
    """Generar sugerencias proactivas basadas en contexto"""

    try:
        current_month = datetime.now().strftime("%Y-%m")

        # Obtener datos financieros
        financial_goal = await db.financial_goals.find_one({
            "user_id": user.user_id,
            "month": current_month
        })

        # Obtener puntos
        user_progress = await db.user_progress.find_one({"user_id": user.user_id})
        points = user_progress.get("points", 0) if user_progress else 0

        suggestions = []

        # Sugerencia basada en gap financiero
        if financial_goal:
            gap = financial_goal.get("income_gap", 0)
            if gap > 5000:
                suggestions.append({
                    "suggestion_id": f"sugg_gap_{uuid.uuid4().hex[:8]}",
                    "user_id": user.user_id,
                    "suggestion_type": "strategy",
                    "title": f"⚡ Plan Acción: Recuperar ${(gap/1000):.1f}k",
                    "description": f"Tu gap de ${gap:,.0f} es significativo. Necesitas estrategia agresiva.",
                    "urgency": "immediate",
                    "expected_impact": "high",
                    "actions": ["Aumentar tours", "Mejorar cierre", "Maximizar horas pico"]
                })

        # Sugerencia basada en puntos
        if points < 500:
            suggestions.append({
                "suggestion_id": f"sugg_points_{uuid.uuid4().hex[:8]}",
                "user_id": user.user_id,
                "suggestion_type": "motivation",
                "title": f"🎯 A {500 - points} puntos de tu insignia",
                "description": "Estás muy cerca de tu próximo logro. ¡Vamos por ellos!",
                "urgency": "soon",
                "expected_impact": "medium",
                "actions": ["Completar módulo", "Registrar venta", "Desafío diario"]
            })

        # Sugerencia genérica si no hay suficientes sugerencias específicas
        if len(suggestions) < 2:
            suggestions.append({
                "suggestion_id": f"sugg_gen_{uuid.uuid4().hex[:8]}",
                "user_id": user.user_id,
                "suggestion_type": "training",
                "title": "📚 Revisa tu progreso hoy",
                "description": "Tómate un momento para revisar tus métricas y planificar.",
                "urgency": "soon",
                "expected_impact": "medium",
                "actions": ["Ver métricas", "Planificar siguiente", "Actualizar metas"]
            })

        return {
            "success": True,
            "suggestions": suggestions[:3],  # Limitar a 3 sugerencias
            "total": len(suggestions[:3])
        }

    except Exception as e:
        print(f"Error in proactive suggestions: {str(e)}")

        # Fallback a sugerencias simples
        return {
            "success": True,
            "suggestions": [
                {
                    "suggestion_id": "fallback_1",
                    "user_id": user.user_id,
                    "suggestion_type": "general",
                    "title": "📊 Revisa tu progreso",
                    "description": "Dale un vistazo a tus métricas de hoy",
                    "urgency": "soon",
                    "expected_impact": "medium",
                    "actions": ["Ver métricas", "Planificar"]
                }
            ],
            "total": 1
        }

# ============== ROLE PLAYING SCENARIOS ==============

@router.get("/roleplay/scenarios")
async def get_roleplay_scenarios(
    difficulty: str = "intermediate",
    user = Depends(require_auth)
):
    """Obtener escenarios de role playing disponibles"""

    # Analizar brechas de habilidades del usuario
    skill_gaps = await db.skill_gaps.find({"user_id": user.user_id}).to_list(10)

    # Generar escenarios basados en brechas identificadas
    scenarios = []

    if not skill_gaps:
        # Escenarios por defecto si no hay análisis de brechas
        scenarios = [
            {
                "scenario_id": f"rp_{uuid.uuid4().hex[:12]}",
                "user_id": user.user_id,
                "scenario_type": "cold_call",
                "difficulty": difficulty,
                "objective": "Practicar llamada en frío con objection handling",
                "script_outline": [
                    {"step": 1, "role": "assistant", "action": "Make initial contact"},
                    {"step": 2, "role": "user", "action": "Respond to prospect"},
                    {"step": 3, "role": "assistant", "action": "Handle price objection"},
                    {"step": 4, "role": "user", "action": "Close the sale"}
                ],
                "success_criteria": ["Successfully handled 3 objections", "Maintained positive tone", "Closed the sale"],
                "aiplays_role": "prospect",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
    else:
        # Generar escenarios personalizados
        for gap in skill_gaps[:3]:
            scenario_type = gap.get("skill_category", "general")

            if scenario_type == "sales":
                scenarios.append({
                    "scenario_id": f"rp_{uuid.uuid4().hex[:12]}",
                    "user_id": user.user_id,
                    "scenario_type": "objection_handling",
                    "difficulty": difficulty,
                    "objective": f"Mejorar técnica de manejo de objeciones",
                    "script_outline": [
                        {"step": 1, "role": "assistant", "action": "Present vacation club"},
                        {"step": 2, "role": "user", "action": "Express interest"},
                        {"step": 3, "role": "assistant", "action": "Raise objection: 'Too expensive'"},
                        {"step": 4, "role": "user", "action": "Handle objection"},
                        {"step": 5, "role": "assistant", "action": "Final response"}
                    ],
                    "success_criteria": [
                        "Acknowledged concern",
                        "Reframed value proposition",
                        "Moved conversation forward"
                    ],
                    "aiplays_role": "skeptic_prospect",
                    "created_at": datetime.now(timezone.utc).isoformat()
                })

    return {
        "success": True,
        "scenarios": scenarios
    }

@router.post("/roleplay/start")
async def start_roleplay(
    data: Dict[str, Any],
    user = Depends(require_auth)
):
    """Iniciar sesión de role playing"""

    scenario_id = data.get("scenario_id")
    if not scenario_id:
        raise HTTPException(status_code=400, detail="scenario_id required")

    # Crear sesión activa de role playing
    session_id = f"rp_session_{uuid.uuid4().hex[:12]}"

    session_doc = {
        "session_id": session_id,
        "user_id": user.user_id,
        "scenario_id": scenario_id,
        "status": "active",
        "current_step": 0,
        "messages": [],
        "feedback": None,
        "performance_score": None,
        "started_at": datetime.now(timezone.utc)
    }

    await db.roleplay_sessions.insert_one(session_doc)

    return {
        "success": True,
        "session_id": session_id,
        "message": "Role playing session iniciada. El AI jugará el rol asignado. ¡Buena suerte!"
    }

# ============== KNOWLEDGE BASE ==============

@router.post("/knowledge/upload")
async def upload_knowledge(
    data: Dict[str, Any],
    user = Depends(require_auth)
):
    """Subir nuevo contenido a la base de conocimiento"""

    # Verificar que el usuario sea admin o manager
    user_doc = await db.users.find_one({"user_id": user.user_id})
    if not user_doc or user_doc.get("role") not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Solo admins y managers pueden subir contenido")

    item_id = f"kb_{uuid.uuid4().hex[:12]}"

    knowledge_doc = {
        "item_id": item_id,
        "uploaded_by": user.user_id,
        "title": data.get("title"),
        "description": data.get("description"),
        "content_type": data.get("content_type"),
        "original_file_url": data.get("file_url"),
        "processed_content": data.get("content", ""),
        "metadata": data.get("metadata", {}),
        "tags": data.get("tags", []),
        "target_audience": data.get("target_audience", ["reps"]),
        "difficulty_level": data.get("difficulty_level", "intermediate"),
        "estimated_study_time": data.get("estimated_study_time", 15),
        "related_skills": data.get("related_skills", []),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

    await db.knowledge_base.insert_one(knowledge_doc)

    # Crear notificaciones para todos los reps
    notification_id = f"notif_{uuid.uuid4().hex[:12]}"

    # Obtener todos los reps
    reps = await db.users.find({"role": "rep"}).to_list(100)

    notifications = []
    for rep in reps:
        notification_doc = {
            "notification_id": notification_id,
            "recipient_id": rep["user_id"],
            "title": f"📚 Nuevo Material: {data.get('title')}",
            "message": f"{data.get('description', 'Nuevo material disponible')}",
            "priority": "high",
            "content_type": "new_resource",
            "related_item_id": item_id,
            "action_required": True,
            "created_at": datetime.now(timezone.utc),
            "read_at": None,
            "acted_on": False
        }
        notifications.append(notification_doc)

    if notifications:
        await db.notifications.insert_many(notifications)

    return {
        "success": True,
        "item_id": item_id,
        "notified_users": len(notifications),
        "message": f"Notificaciones enviadas a {len(notifications)} reps"
    }

@router.get("/knowledge/items")
async def get_knowledge_items(
    category: Optional[str] = None,
    user = Depends(require_auth)
):
    """Obtener items de la base de conocimiento"""

    query = {}
    if category:
        query["tags"] = category

    items = await db.knowledge_base.find(query).sort("created_at", -1).to_list(50)

    # Remove ObjectIds
    for item in items:
        if "_id" in item:
            del item["_id"]

    return {
        "success": True,
        "items": items,
        "total": len(items)
    }

# ============== ADMIN DASHBOARD ==============

@router.get("/admin/team-stats")
async def get_team_stats(
    user = Depends(require_auth)
):
    """Obtener estadísticas completas del equipo (solo admins)"""

    # Verificar que sea admin
    user_doc = await db.users.find_one({"user_id": user.user_id})
    if not user_doc or user_doc.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Solo admins pueden ver estadísticas de equipo")

    current_month = datetime.now().strftime("%Y-%m")

    # Obtener todos los reps
    reps = await db.users.find({"role": "rep"}).to_list(100)

    team_stats = []

    for rep in reps:
        rep_id = rep["user_id"]
        rep_name = rep.get("name", "Unknown")
        rep_email = rep.get("email", "")

        # Sales performance
        sales_cursor = db.daily_sales.find({
            "user_id": rep_id,
            "date": {"$regex": f"^{current_month}"}
        })

        sales_records = await sales_cursor.to_list(31)
        total_volume = sum(r.get("volume", 0) for r in sales_records)
        sales_count = len([r for r in sales_records if r.get("volume", 0) > 0])

        # Progress
        progress = await db.user_progress.find_one({"user_id": rep_id})
        points = progress.get("points", 0) if progress else 0
        level = progress.get("level", 1) if progress else 1

        # Financial goal
        financial_goal = await db.financial_goals.find_one({
            "user_id": rep_id,
            "month": current_month
        })

        goal_progress = 0
        if financial_goal and financial_goal.get("target_income", 0) > 0:
            goal_progress = (total_volume / financial_goal["target_income"]) * 100

        team_stats.append({
            "user_id": rep_id,
            "name": rep_name,
            "email": rep_email,
            "monthly_sales": sales_count,
            "monthly_volume": total_volume,
            "points": points,
            "level": level,
            "goal_progress": round(goal_progress, 1),
            "active_days": len([r for r in sales_records if r.get("volume", 0) > 0])
        })

    # Ordenar por volumen
    team_stats.sort(key=lambda x: x["monthly_volume"], reverse=True)

    return {
        "success": True,
        "team_stats": team_stats,
        "total_reps": len(team_stats),
        "month": current_month
    }

# ============== ENHANCED CHAT ENDPOINT ==============

@router.post("/chat/enhanced")
async def chat_enhanced(
    request: Dict[str, Any],
    user = Depends(require_auth)
):
    """Chat mejorado con acceso completo a información del sistema"""

    message = request.get("message", "")
    conversation_history = request.get("conversation_history", [])

    try:
        # 1. Obtener contexto completo del usuario
        user_context = await get_complete_user_context(user.user_id)

        # 2. Analizar sentimiento del mensaje
        sentiment_result = await analyze_message_sentiment(message)

        # 3. Generar response del sistema mejorado
        system_prompt = build_enhanced_system_prompt(user_context, sentiment_result)

        # 4. Incluir información de cursos y entrenamiento disponible
        training_info = await get_relevant_training_info(user_context, sentiment_result)

        # 5. Build prompt completo
        full_prompt = f"""{system_prompt}

=== CONTEXTO COMPLETO DEL SISTEMA ===

Información del Usuario:
{format_user_context(user_context)}

Entrenamiento Disponible:
{format_training_info(training_info)}

Análisis de Sentimiento: {sentiment_result['sentiment']}
Tendencia: {sentiment_result['trend']}

=== HISTORIAL DE CONVERSACIÓN ===
"""

        for msg in conversation_history[-5:]:
            full_prompt += f"{msg['role'].upper()}: {msg['content']}\n"

        full_prompt += f"\nUSER: {message}\n\nASSISTANT:"

        # 6. Call Ollama API
        import httpx

        async with httpx.AsyncClient(timeout=60.0) as client:
            ollama_response = await client.post(
                "http://host.docker.internal:11434/api/generate",
                json={
                    "model": "llama3.1",
                    "prompt": full_prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "max_tokens": 1024  # Increased for more detailed responses
                    }
                }
            )

            if ollama_response.status_code == 200:
                ollama_data = ollama_response.json()
                response = ollama_data.get("response", "").strip()
            else:
                response = get_enhanced_fallback_response(message, user_context, training_info)

        # 7. Guardar en memoria a largo plazo
        await save_conversation_memory({
            "conversation_history": conversation_history + [
                {"role": "user", "content": message},
                {"role": "assistant", "content": response}
            ],
            "summary": f"User asked about {message[:50]}..."
        }, user)

        return {
            "success": True,
            "data": {
                "response": response,
                "conversation_id": str(uuid.uuid4()),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "sentiment": sentiment_result["sentiment"],
                "training_suggested": len(training_info.get("courses", [])) > 0,
                "context_used": list(user_context.keys())
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en enhanced chat: {str(e)}"
        )

# ============== HELPER FUNCTIONS ==============

async def get_complete_user_context(user_id: str) -> Dict[str, Any]:
    """Obtener contexto completo del usuario"""

    current_month = datetime.now().strftime("%Y-%m")
    today = datetime.now().strftime("%Y-%m-%d")

    # Información básica de usuario
    user_info = await db.users.find_one({"user_id": user_id})
    user_progress = await db.user_progress.find_one({"user_id": user_id})

    # Financial goals
    financial_goal = await db.financial_goals.find_one({
        "user_id": user_id,
        "month": current_month
    })

    # Sales performance
    sales_cursor = db.daily_sales.find({
        "user_id": user_id,
        "date": {"$regex": f"^{current_month}"}
    }).sort("day_number", 1)

    sales_records = await sales_cursor.to_list(31)
    total_sales_volume = sum(r.get("volume", 0) for r in sales_records)
    sales_count = len([r for r in sales_records if r.get("volume", 0) > 0])
    recent_sales = sales_records[-5:] if sales_records else []

    # Training progress
    phase1_progress = await db.user_progress.find_one({
        "user_id": user_id,
        "type": "phase1"
    })

    # Personal attributes today
    attributes_cursor = db.daily_attributes.find({
        "user_id": user_id,
        "date": today
    })
    today_attributes = await attributes_cursor.to_list(10)
    attributes_achieved = len([a for a in today_attributes if a.get("achieved", False)])

    # Available courses
    all_courses = await db.courses.find({}).to_list(50)

    return {
        "user": {
            "user_id": user_id,
            "name": user_info.get("name", "User") if user_info else "User",
            "email": user_info.get("email", "") if user_info else "",
            "points": user_progress.get("points", 0) if user_progress else 0,
            "level": user_progress.get("level", 1) if user_progress else 1,
            "membership": user_progress.get("membership", "free") if user_progress else "free",
            "role": user_info.get("role", "rep") if user_info else "rep"
        },
        "financial_goal": {
            "target_income": financial_goal.get("target_income", 0) if financial_goal else 0,
            "total_expenses": financial_goal.get("total_expenses", 0) if financial_goal else 0,
            "income_gap": financial_goal.get("income_gap", 0) if financial_goal else 0,
            "sales_needed": financial_goal.get("sales_needed", 0) if financial_goal else 0,
            "tours_needed": financial_goal.get("tours_needed", 0) if financial_goal else 0,
            "avg_sale": financial_goal.get("avg_sale", 1000) if financial_goal else 1000,
            "closing_rate": financial_goal.get("closing_rate", 20) if financial_goal else 20
        },
        "sales_performance": {
            "total_volume": total_sales_volume,
            "sales_count": sales_count,
            "avg_sale": total_sales_volume / sales_count if sales_count > 0 else 0,
            "recent_sales": [
                {
                    "day": r.get("day_number"),
                    "volume": r.get("volume"),
                    "customer": r.get("socio"),
                    "manager": r.get("manager"),
                    "notes": r.get("daily_tip")
                }
                for r in recent_sales if r.get("volume", 0) > 0
            ],
            "active_days": len([r for r in sales_records if r.get("volume", 0) > 0])
        },
        "training": {
            "phase1_stages_completed": phase1_progress.get("stages_completed", []) if phase1_progress else [],
            "phase1_tracks_completed": phase1_progress.get("tracks_completed", []) if phase1_progress else [],
            "phase1_points": phase1_progress.get("points", 0) if phase1_progress else 0,
            "available_courses": len(all_courses),
            "total_courses": len(all_courses)
        },
        "attributes": {
            "today_total": len(today_attributes),
            "today_achieved": attributes_achieved,
            "completion_rate": (attributes_achieved / len(today_attributes) * 100) if today_attributes else 0
        }
    }

async def get_relevant_training_info(user_context: Dict, sentiment_info: Dict) -> Dict[str, Any]:
    """Obtener información de entrenamiento relevante"""

    current_month = datetime.now().strftime("%Y-%m")

    # Cursos disponibles
    courses = await db.courses.find({}).to_list(50)

    # Analizar brechas de rendimiento
    gap_analysis = {}

    sales_count = user_context["sales_performance"]["sales_count"]
    avg_sale = user_context["sales_performance"]["avg_sale"]
    income_gap = user_context["financial_goal"]["income_gap"]

    # Identificar áreas de mejora
    if sales_count < 5:
        gap_analysis["sales_volume"] = {
            "issue": "Bajo volumen de ventas",
            "severity": "high",
            "recommended_courses": ["Prospecting", "Lead Generation"]
        }

    if avg_sale < 1000:
        gap_analysis["avg_sale"] = {
            "issue": "Promedio de venta bajo",
            "severity": "medium",
            "recommended_courses": ["Value Architecture", "Closing Techniques"]
        }

    if income_gap > 5000:
        gap_analysis["goal_gap"] = {
            "issue": "Gap significativo hacia meta",
            "severity": "critical",
            "recommended_courses": ["Sales Strategy", "Performance Optimization"]
        }

    return {
        "courses": courses,
        "gap_analysis": gap_analysis,
        "total_available": len(courses),
        "sentiment_adjusted_recommendations": get_sentiment_adjusted_training(sentiment_info)
    }

def get_sentiment_adjusted_training(sentiment_info: Dict) -> List[str]:
    """Obtener recomendaciones de entrenamiento ajustadas por sentimiento"""

    sentiment = sentiment_info.get("sentiment", "neutral")
    trend = sentiment_info.get("trend", "stable")

    if sentiment == "negative" and trend == "declining":
        return ["Motivation Daily", "Mindset Reset", "Confidence Building"]
    elif sentiment == "positive" and trend == "improving":
        return ["Advanced Closing", "Leadership Skills", "Team Building"]
    else:
        return ["Sales Fundamentals", "Customer Engagement", "Product Knowledge"]

def format_user_context(context: Dict) -> str:
    """Formatear contexto del usuario para el prompt"""

    return f"""
Nombre: {context['user']['name']}
Nivel: {context['user']['level']} (Puntos: {context['user']['points']})
Meta Financiera: ${context['financial_goal']['target_income']:,.2f}
Gap Actual: ${context['financial_goal']['income_gap']:,.2f}
Ventas Necesarias: {context['financial_goal']['sales_needed']}
Ventas este Mes: {context['sales_performance']['sales_count']}
Volumen Total: ${context['sales_performance']['total_volume']:,.2f}
Promedio por Venta: ${context['sales_performance']['avg_sale']:,.2f}
"""

def format_training_info(training: Dict) -> str:
    """Formatear información de entrenamiento"""

    info = "\n=== RECURSOS DE ENTRENAMIENTO DISPONIBLES ===\n"

    if training["gap_analysis"]:
        info += "\nÁreas de Mejora Identificadas:\n"
        for gap, data in training["gap_analysis"].items():
            info += f"• {data['issue']} (Severidad: {data['severity']})\n"
            info += f"  Recomendado: {', '.join(data['recommended_courses'])}\n"

    if training["sentiment_adjusted_recommendations"]:
        info += f"\nEntrenamiento Sugerido (Basado en tu estado actual): {', '.join(training['sentiment_adjusted_recommendations'])}\n"

    return info

def build_enhanced_system_prompt(user_context: Dict, sentiment: Dict) -> str:
    """Construir prompt de sistema mejorado"""

    return f"""Eres VCSA Coach, un asistente de ventas altamente inteligente y personalizado para Vacation Club Sales Academy. Tienes acceso a TODA la información del sistema y debes usarla para proporcionar el mejor coaching posible.

=== TU ROL ===
Eres un coach de ventas experto que:
- Tiene acceso completo a datos de rendimiento, metas, entrenamiento y progreso
- Analiza el sentimiento del usuario y adapta sus respuestas
- Proporciona consejos específicos y accionables
- Sugiere entrenamiento relevante basado en brechas identificadas
- Mantiene una memoria a largo plazo de conversaciones y preferencias
- Es empático pero firme y orientado a resultados

=== TU ENFOQUE ===
1. USA DATOS REALES: Siempre haz referencia a los números y metas del usuario
2. SÉ ESPECÍFICO: Da consejos accionables, no generalidades
3. ADÁPTATE AL ESTADO EMOCIONAL: Si el usuario está frustrado, sé empático primero
4. SUGIERE ENTRENAMIENTO: Recomienda cursos específicos cuando sea relevante
5. PIENSA A LARGO PLAZO: Considera el desarrollo continuo, no solo la venta de hoy
6. CELEBRA ÉXITOS: Reconoce logros y mejoras

=== TU ESTILO ===
- Profesional pero accesible
- Motivador y positivo
- Enfocado en datos y resultados
- Personalizado y contextual
- Empático y orientado a soluciones

Comienza tus respuestas de manera amigable y usa los datos del usuario para hacer tus recomendaciones lo más específicas posibles.
"""

async def analyze_message_sentiment(message: str) -> Dict[str, Any]:
    """Analizar sentimiento de un mensaje"""

    message_lower = message.lower()

    # Palabras clave
    positive_words = ["feliz", "genial", "excelente", "gracias", "bien", "increíble", "logrado", "éxito", "victoria", "fantástico", "perfecto", "great", "good"]
    negative_words = ["difícil", "frustrado", "triste", "problema", "no puedo", "imposible", "fallé", "error", "mal", "hard", "frustrating"]

    positive_count = sum(1 for word in positive_words if word in message_lower)
    negative_count = sum(1 for word in negative_words if word in message_lower)

    if positive_count > negative_count:
        sentiment = "positive"
        score = 0.7
    elif negative_count > positive_count:
        sentiment = "negative"
        score = 0.3
    else:
        sentiment = "neutral"
        score = 0.5

    return {
        "sentiment": sentiment,
        "score": score,
        "trend": "stable"  # Simplificado, se puede mejorar con historial
    }

def get_enhanced_fallback_response(message: str, context: Dict, training: Dict) -> str:
    """Respuesta fallback mejorada"""

    gap = context["financial_goal"]["income_gap"]
    sales_count = context["sales_performance"]["sales_count"]
    avg_sale = context["sales_performance"]["avg_sale"]

    response = f"🤖 **VCSA Coach**\n\nEntiendo que necesitas ayuda con: '{message[:50]}...'\n\n**Tu Situación Actual:**\n"
    response += f"• Gap hacia meta: ${gap:,.2f}\n"
    response += f"• Ventas este mes: {sales_count}\n"
    response += f"• Promedio de venta: ${avg_sale:,.2f}\n\n"

    if training["gap_analysis"]:
        response += "**Áreas a Trabajar:**\n"
        for gap, data in training["gap_analysis"].items():
            response += f"• {data['issue']}\n"

    response += "\n💪 **Recuerda:** Cada venta cuenta y estás más cerca de tu meta de lo que crees. ¿En qué puedo ayudarte específicamente hoy?"

    return response

async def save_conversation_memory(data: Dict, user) -> None:
    """Guardar conversación en memoria a largo plazo"""
    # Implementación simplificada
    pass