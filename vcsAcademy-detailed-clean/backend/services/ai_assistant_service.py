"""
AI Assistant Service for VCSA White-Label Platform

This service integrates with Anthropic's Claude API to provide intelligent
content customization and organization management assistance.
"""

import os
import json
import re
from typing import List, Dict, Any, Optional
from datetime import datetime
import secrets

try:
    from anthropic import Anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False
    print("Warning: anthropic package not installed. AI Assistant will be disabled.")
    print("Install with: pip install anthropic")


from server import db
from organization_models import (
    AIChangeSuggestion,
    OrganizationBranding,
    OrganizationSettings
)


class AIAssistantService:
    """
    Service for AI-powered organization customization using Claude API.

    Provides natural language interface for updating:
    - Branding (colors, logos, fonts, text)
    - Content (tracks, modules, lessons)
    - Settings (gamification, features, integrations)
    """

    def __init__(self):
        """Initialize AI Assistant service with Anthropic client."""
        if not ANTHROPIC_AVAILABLE:
            self.client = None
            self.enabled = False
            return

        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key or api_key == "your-anthropic-api-key":
            self.enabled = False
            print("Warning: ANTHROPIC_API_KEY not set. AI Assistant disabled.")
            return

        try:
            self.client = Anthropic(api_key=api_key)
            self.enabled = True
            print("AI Assistant service initialized successfully")
        except Exception as e:
            self.enabled = False
            print(f"Error initializing Anthropic client: {e}")

    async def suggest_changes(
        self,
        organization_id: str,
        message: str,
        current_config: Dict[str, Any],
        conversation_history: Optional[List[Dict]] = None
    ) -> Dict[str, Any]:
        """
        Generate AI-suggested changes based on user's natural language request.

        Args:
            organization_id: Organization making the request
            message: User's natural language request
            current_config: Current organization configuration
            conversation_history: Previous messages in conversation (optional)

        Returns:
            Dictionary with:
                - response: AI's text response
                - changes: List of AIChangeSuggestion objects
                - conversation_id: Unique conversation identifier
        """
        if not self.enabled:
            return self._get_mock_response(message)

        try:
            # Get organization context
            org = await db.organizations.find_one({"organization_id": organization_id})
            if not org:
                raise ValueError(f"Organization {organization_id} not found")

            # Build system prompt with context
            system_prompt = self._build_system_prompt(org, current_config)

            # Build messages array
            messages = []

            # Add conversation history if provided
            if conversation_history:
                messages.extend(conversation_history)

            # Add current user message
            messages.append({
                "role": "user",
                "content": self._build_user_prompt(message, current_config)
            })

            # Call Claude API
            response = await self._call_claude(
                system_prompt=system_prompt,
                messages=messages,
                max_tokens=2048
            )

            # Extract response text
            response_text = response.content[0].text

            # Extract suggested changes from response
            changes = self._extract_changes_from_response(response_text)

            # Generate conversation ID
            conversation_id = f"conv_{secrets.token_urlsafe(16)}"

            return {
                "response": response_text,
                "changes": changes,
                "conversation_id": conversation_id
            }

        except Exception as e:
            print(f"Error in suggest_changes: {e}")
            # Return mock response on error
            return self._get_mock_response(message)

    async def apply_change(
        self,
        organization_id: str,
        change: AIChangeSuggestion,
        applied_by: str,
        conversation_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Apply an AI-suggested change to the organization.

        Validates the change and updates the database.

        Args:
            organization_id: Organization to update
            change: Change to apply
            applied_by: User ID applying the change
            conversation_id: Conversation this change belongs to

        Returns:
            Dictionary with success status
        """
        try:
            # Validate change
            validation_result = self._validate_change(change)
            if not validation_result["valid"]:
                return {
                    "success": False,
                    "error": validation_result["error"]
                }

            # Build update path based on change type
            update_path = self._get_update_path(change.type, change.field)

            # Apply update
            update_result = await db.organizations.update_one(
                {"organization_id": organization_id},
                {"$set": {
                    update_path: change.value,
                    "updated_at": datetime.utcnow()
                }}
            )

            if update_result.modified_count == 0:
                return {
                    "success": False,
                    "error": "Organization not found or no changes made"
                }

            # Log change for audit
            await db.ai_changes.insert_one({
                "change_id": change.id,
                "organization_id": organization_id,
                "change_type": change.type,
                "change_field": change.field,
                "new_value": change.value,
                "reason": change.reason,
                "confidence": change.confidence,
                "applied_by": applied_by,
                "conversation_id": conversation_id,
                "applied_at": datetime.utcnow()
            })

            return {
                "success": True,
                "change_id": change.id
            }

        except Exception as e:
            print(f"Error applying change: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    def _build_system_prompt(self, org: Dict, current_config: Dict) -> str:
        """Build system prompt with organization context."""
        return f"""You are an AI assistant helping customize a sales training academy platform.

Current Organization:
- Name: {org.get('name', 'Sales Academy')}
- Industry: {org.get('industry', 'Sales')}
- Company Size: {org.get('company_size', 'Not specified')}
- Target Audience: {org.get('target_audience', 'Sales professionals')}

Current Configuration:
{json.dumps(current_config, indent=2)}

Your Capabilities:
You can help customize:
1. **Branding**: Colors, logos, fonts, site name, tagline, hero text
2. **Content**: Enable/disable custom tracks and modules, industry focus
3. **Settings**: Gamification features, community features, notifications
4. **Integrations**: Stripe, Google OAuth, Sentry, custom domains

Guidelines:
- Be specific and actionable
- Explain WHY you're suggesting each change
- Provide confidence scores (0.0 to 1.0) for each suggestion
- Consider the organization's industry and size
- Suggest changes that align with sales training best practices

Response Format:
Provide a conversational response followed by specific change suggestions in this JSON format:

```json
[
  {{
    "type": "branding|content|settings",
    "field": "field_name",
    "value": "new_value",
    "reason": "explanation",
    "confidence": 0.85
  }}
]
```

Example user requests and your responses:
- "Make it look more professional" → Suggest navy blue colors, professional fonts
- "Focus on automotive sales" → Update industry, suggest relevant content
- "Enable gamification" → Enable badges, points, leaderboard
- "Change the name to AutoSales Academy" → Update site_name and hero_title"""

    def _build_user_prompt(self, message: str, current_config: Dict) -> str:
        """Build user prompt with message and current configuration."""
        return f"""User Request: {message}

Current Organization Configuration:
{json.dumps(current_config, indent=2)}

Please provide specific, actionable suggestions to address this request.
Format your response as conversational text followed by JSON array of changes."""

    async def _call_claude(
        self,
        system_prompt: str,
        messages: List[Dict],
        max_tokens: int = 2048
    ) -> Any:
        """Call Claude API with the given prompt and messages."""
        if not self.client:
            raise Exception("Anthropic client not initialized")

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=max_tokens,
            system=system_prompt,
            messages=messages
        )

        return response

    def _extract_changes_from_response(self, response_text: str) -> List[AIChangeSuggestion]:
        """Extract JSON array of changes from Claude's response."""
        changes = []

        try:
            # Find JSON array in response
            json_match = re.search(r'\[[\s\S]*\]', response_text)

            if json_match:
                json_str = json_match.group()
                changes_data = json.loads(json_str)

                for change_dict in changes_data:
                    change = AIChangeSuggestion(
                        id=f"change_{secrets.token_urlsafe(8)}",
                        type=change_dict.get("type", "settings"),
                        field=change_dict["field"],
                        value=change_dict["value"],
                        reason=change_dict.get("reason", "AI suggested change"),
                        confidence=change_dict.get("confidence", 0.7)
                    )
                    changes.append(change)

        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"Error extracting changes from response: {e}")

        return changes

    def _validate_change(self, change: AIChangeSuggestion) -> Dict[str, Any]:
        """Validate a change before applying it."""
        # Check change type
        valid_types = ["branding", "content", "settings"]
        if change.type not in valid_types:
            return {
                "valid": False,
                "error": f"Invalid change type: {change.type}"
            }

        # Validate specific fields based on type
        if change.type == "branding":
            if change.field in ["primary_color", "secondary_color", "background_color"]:
                # Validate hex color
                if not self._is_valid_hex_color(str(change.value)):
                    return {
                        "valid": False,
                        "error": f"Invalid hex color: {change.value}"
                    }

        elif change.type == "settings":
            # Boolean fields
            boolean_fields = [
                "enable_gamification", "enable_badges", "enable_leaderboard",
                "enable_streaks", "enable_ai_assistant", "enable_community",
                "email_notifications_enabled", "custom_tracks", "custom_modules"
            ]

            if change.field in boolean_fields:
                if not isinstance(change.value, bool):
                    return {
                        "valid": False,
                        "error": f"Field {change.field} must be boolean"
                    }

        return {"valid": True}

    def _get_update_path(self, change_type: str, field: str) -> str:
        """Get MongoDB update path for a change."""
        if change_type == "branding":
            return f"branding.{field}"
        elif change_type == "settings":
            return f"settings.{field}"
        elif change_type == "content":
            return f"settings.{field}"
        else:
            return field

    def _is_valid_hex_color(self, color: str) -> bool:
        """Check if string is a valid hex color."""
        return bool(re.match(r'^#[0-9A-Fa-f]{6}$', color))

    def _get_mock_response(self, message: str) -> Dict[str, Any]:
        """Get mock response when AI service is disabled."""
        mock_changes = [
            AIChangeSuggestion(
                id=f"change_{secrets.token_urlsafe(8)}",
                type="branding",
                field="primary_color",
                value="#3B82F6",
                reason="Blue conveys trust and professionalism",
                confidence=0.75
            )
        ]

        return {
            "response": "I've analyzed your request and suggested some changes. Note: AI Assistant is not fully configured. Please set ANTHROPIC_API_KEY to enable full functionality.",
            "changes": mock_changes,
            "conversation_id": f"conv_mock_{secrets.token_urlsafe(16)}"
        }


# Singleton instance
_ai_service_instance = None


def get_ai_service() -> AIAssistantService:
    """Get or create AI service singleton instance."""
    global _ai_service_instance

    if _ai_service_instance is None:
        _ai_service_instance = AIAssistantService()

    return _ai_service_instance
