"""
Claude AI Assistant Routes
API endpoints for the intelligent sales assistant powered by Claude
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict, Any
import httpx
import os
from datetime import datetime, timezone
from pydantic import BaseModel

from server import db, require_auth
import uuid

router = APIRouter(prefix="/api/assistant", tags=["assistant"])

# Claude API Configuration
CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY", "")
CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Message]] = []

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    timestamp: str

@router.post("/chat")
async def chat_with_assistant(
    request: ChatRequest,
    user = Depends(require_auth)
):
    """Chat with AI assistant - has full context of user data and platform"""

    try:
        # Fetch user's complete context
        user_context = await get_user_context(user.user_id)

        # Build system prompt with user context
        system_prompt = build_system_prompt(user_context)

        # Build messages array
        messages = [
            {"role": "system", "content": system_prompt}
        ]

        # Add conversation history
        for msg in request.conversation_history[-10:]:  # Last 10 messages for context
            messages.append({
                "role": msg.role,
                "content": msg.content
            })

        # Add current message
        messages.append({
            "role": "user",
            "content": request.message
        })

        # Call Claude API
        if not CLAUDE_API_KEY:
            # Fallback to rule-based responses if no API key
            response = get_fallback_response(request.message, user_context)
        else:
            async with httpx.AsyncClient(timeout=30.0) as client:
                claude_response = await client.post(
                    CLAUDE_API_URL,
                    headers={
                        "x-api-key": CLAUDE_API_KEY,
                        "anthropic-version": "2023-06-01",
                        "content-type": "application/json"
                    },
                    json={
                        "model": "claude-sonnet-4-20250514",
                        "max_tokens": 1024,
                        "messages": messages
                    }
                )

                if claude_response.status_code != 200:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Claude API error: {claude_response.text}"
                    )

                claude_data = claude_response.json()
                response = claude_data["content"][0]["text"]

        return {
            "success": True,
            "data": {
                "response": response,
                "conversation_id": str(uuid.uuid4()),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat request: {str(e)}"
        )

async def get_user_context(user_id: str) -> Dict[str, Any]:
    """Fetch complete user context for the AI assistant"""

    current_month = datetime.now().strftime("%Y-%m")

    # Get user info
    user_info = await db.users.find_one({"user_id": user_id})
    user_progress = await db.user_progress.find_one({"user_id": user_id})

    # Get financial goal
    financial_goal = await db.financial_goals.find_one({
        "user_id": user_id,
        "month": current_month
    })

    # Get sales data
    sales_cursor = db.daily_sales.find({
        "user_id": user_id,
        "date": {"$regex": f"^{current_month}"}
    }).sort("day_number", 1)

    sales_records = await sales_cursor.to_list(length=31)
    total_sales_volume = sum(r.get("volume", 0) for r in sales_records)
    sales_count = len([r for r in sales_records if r.get("volume", 0) > 0])

    # Get attributes progress
    today = datetime.now().strftime("%Y-%m-%d")
    attributes_cursor = db.daily_attributes.find({
        "user_id": user_id,
        "date": today
    })
    today_attributes = await attributes_cursor.to_list(length=10)
    attributes_achieved = len([a for a in today_attributes if a.get("achieved", False)])

    # Get active challenges
    challenges_cursor = db.daily_challenges.find({
        "user_id": user_id,
        "date": today
    })
    today_challenges = await challenges_cursor.to_list(length=5)

    # Build context
    context = {
        "user": {
            "user_id": user_id,
            "name": user_info.get("name", "User") if user_info else "User",
            "email": user_info.get("email", "") if user_info else "",
            "points": user_progress.get("points", 0) if user_progress else 0,
            "level": user_progress.get("level", 1) if user_progress else 1,
            "membership": user_progress.get("membership", "free") if user_progress else "free"
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
                    "notes": r.get("daily_tip")
                }
                for r in sales_records[-5:] if r.get("volume", 0) > 0
            ]
        },
        "today_progress": {
            "attributes_achieved": attributes_achieved,
            "attributes_total": 7,
            "challenges_completed": len([c for c in today_challenges if c.get("completed", False)]),
            "challenges_total": len(today_challenges)
        },
        "current_date": {
            "today": today,
            "current_month": current_month,
            "days_remaining": get_days_remaining_in_month()
        }
    }

    return context

def get_days_remaining_in_month() -> int:
    """Calculate days remaining in current month"""
    from datetime import timedelta
    today = datetime.now()
    if today.month == 12:
        last_day = datetime(today.year + 1, 1, 1) - timedelta(days=1)
    else:
        last_day = datetime(today.year, today.month + 1, 1) - timedelta(days=1)
    return (last_day - today).days + 1

def build_system_prompt(user_context: Dict[str, Any]) -> str:
    """Build comprehensive system prompt with user context"""

    user = user_context["user"]
    financial = user_context["financial_goal"]
    sales = user_context["sales_performance"]
    today = user_context["today_progress"]
    dates = user_context["current_date"]

    prompt = f"""You are VCSA Coach, an intelligent sales assistant for vacation club sales professionals. You have complete access to the user's performance data and the entire VCSA training platform.

USER PROFILE:
- Name: {user['name']}
- Level: {user['level']}
- Points: {user['points']}
- Membership: {user['membership']}

FINANCIAL GOALS (This Month: {dates['current_month']}):
- Target Income: ${financial['target_income']:,.2f}
- Total Expenses: ${financial['total_expenses']:,.2f}
- Income Gap: ${financial['income_gap']:,.2f}
- Sales Needed: {financial['sales_needed']}
- Tours Needed: {financial['tours_needed']}
- Average Sale: ${financial['avg_sale']:,.2f}
- Closing Rate: {financial['closing_rate']}%

SALES PERFORMANCE:
- Total Volume This Month: ${sales['total_volume']:,.2f}
- Sales Count: {sales['sales_count']}
- Average Sale: ${sales['avg_sale']:,.2f}

TODAY'S PROGRESS ({dates['today']}):
- Personal Attributes: {today['attributes_achieved']}/7 completed
- Daily Challenges: {today['challenges_completed']}/{today['challenges_total']} completed
- Days Remaining in Month: {dates['days_remaining']}

RECENT SALES ACTIVITY:
"""

    # Add recent sales context
    if sales['recent_sales']:
        for sale in sales['recent_sales']:
            prompt += f"\n- Day {sale['day']}: ${sale['volume']:,.2f} - {sale.get('customer', 'No customer')}"
            if sale.get('notes'):
                prompt += f" (Note: {sale['notes']})"
    else:
        prompt += "\n- No sales recorded yet this month"

    prompt += """

YOUR CAPABILITIES:
1. **Sales Coaching**: Provide tips on closing, objection handling, and sales techniques
2. **Goal Tracking**: Help users understand their progress toward income goals
3. **Motivation**: Encourage users when they're behind, celebrate when they're ahead
4. **Training Recommendations**: Suggest relevant training modules based on performance
5. **Habit Building**: Remind users about personal attributes and daily challenges
6. **Strategic Planning**: Help users plan their day, week, and month

YOUR PERSONALITY:
- Professional yet friendly and encouraging
- Data-driven but empathetic
- Action-oriented with specific recommendations
- Knowledgeable about vacation club sales industry
- Concise but thorough

KEY INSIGHTS TO PROVIDE:
- If behind goal: Calculate exactly what's needed to catch up
- If ahead goal: Celebrate and encourage to maintain momentum
- Sales tips: Specific techniques for vacation club sales
- Mindset: Remind about 7 personal attributes and Daily Combo
- Training: Suggest specific modules based on performance gaps
- Daily planning: Help structure their day for success

FORMATTING:
- Use emojis for engagement (✨, 💪, 🎯, 📊, etc.)
- Keep responses concise (2-3 paragraphs max)
- Use bullet points for lists
- Be conversational but professional
- Always end with an encouraging note or specific action item

Remember: You're not just an AI - you're their personal sales coach who truly cares about their success!"""

    return prompt

def get_fallback_response(message: str, context: Dict[str, Any]) -> str:
    """Fallback responses when Claude API is not available"""

    msg_lower = message.lower()

    # Goal-related queries
    if "goal" in msg_lower or "meta" in msg_lower:
        financial = context["financial_goal"]
        sales = context["sales_performance"]
        days_left = context["current_date"]["days_remaining"]

        if sales["sales_count"] < financial["sales_needed"]:
            needed = financial["sales_needed"] - sales["sales_count"]
            daily_target = needed / days_left
            return f"""🎯 **Goal Progress Update**

You're making progress! Here's where you stand:

✅ **Current Progress**: ${sales['total_volume']:,.2f} of ${financial['target_income']:,.2f}
📊 **Sales**: {sales['sales_count']}/{financial['sales_needed']} sales
⏰ **Days Left**: {days_left} days

**To Hit Your Goal**: You need {needed} more sales ({daily_target:.1f} per day)

**Quick Tip**: Focus on your top prospects today and complete all 7 personal attributes for the Daily Combo bonus! 💪"""

    # Sales tips queries
    elif "tip" in msg_lower or "consejo" in msg_lower or "ayuda" in msg_lower:
        return """💡 **Sales Tip of the Moment**

Here are 3 proven techniques for vacation club sales:

1. **Build Value First** - Focus on benefits, not features
   - "Imagine creating memories that last a lifetime..."

2. **Handle Objections Early** - Address money concerns upfront
   - "I understand investment is important. Let me show you the value..."

3. **Create Urgency** - Limited availability creates action
   - "This pricing is only available through the end of the month..."

**Remember**: Your attitude determines your altitude! Complete the ATTITUDE attribute today for +10 points! 🌟"""

    # Motivation queries
    elif "motivat" in msg_lower or "ánimo" in msg_lower:
        today = context["today_progress"]
        return """🔥 **You've Got This!**

Remember why you started:
- Every no brings you closer to a yes
- Your consistency will pay off
- Top producers weren't built in a day

**Today's Challenge**: Complete all 7 personal attributes and unlock the +100 Daily Combo bonus!

You're {today['attributes_achieved']}/7 attributes today. Keep pushing! 💪"""

    # Personal attributes queries
    elif "attribute" in msg_lower or "atributo" in msg_lower:
        today = context["today_progress"]
        return """**🎯 7 Personal Attributes for Success**

Today's Progress: {today['attributes_achieved']}/7 completed

**The 7 Attributes**:
1. 😊 ATTITUDE (+10 pts) - Positive mindset
2. 🦁 COURAGE (+10 pts) - Step out of comfort zone
3. 🎯 FOCUS (+10 pts) - Stay focused
4. 📚 TRAINING (+15 pts) - Learn something new
5. ⚡ DISCIPLINE (+20 pts) - Follow your schedule
6. 💪 PERSISTENCE (+15 pts) - Never give up
7. 🔥 COMMITMENT (+25 pts) - Go all-in

**Pro Tip**: Complete all 7 for the +100 Daily Combo bonus!"""

    # Default response
    else:
        return """👋 **Hi! I'm VCSA Coach**

I can help you with:
- 📊 Tracking your sales goals
- 💪 Building daily habits
- 🎓 Finding training resources
- 📈 Improving your performance
- 🔥 Daily motivation and tips

Try asking:
- "How am I doing on my goals?"
- "Give me a sales tip"
- "What should I focus on today?"
- "Help me stay motivated"

I'm here to help you succeed! 🌟"""

@router.get("/context")
async def get_assistant_context(user = Depends(require_auth)):
    """Get current user context for the assistant"""
    context = await get_user_context(user.user_id)
    return {
        "success": True,
        "data": context
    }
