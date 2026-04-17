"""
Sentry Configuration for VCSA Backend
Error tracking and performance monitoring
"""

import logging
from typing import Optional
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.mongodb import MongoDBIntegration
from sentry_sdk.integrations.logging import LoggingIntegration

# Logger setup
logger = logging.getLogger(__name__)


def init_sentry(
    dsn: Optional[str] = None,
    environment: str = "development",
    traces_sample_rate: float = 0.1,
    profiles_sample_rate: float = 0.1,
    debug: bool = False,
) -> bool:
    """
    Initialize Sentry SDK for error tracking and performance monitoring

    Args:
        dsn: Sentry DSN (Data Source Name)
        environment: Environment name (development, staging, production)
        traces_sample_rate: Percentage of transactions to sample (0.0 to 1.0)
        profiles_sample_rate: Percentage of profiles to sample (0.0 to 1.0)
        debug: Enable Sentry debug mode

    Returns:
        bool: True if Sentry was initialized, False otherwise
    """
    if not dsn or dsn == "https://your-sentry-dsn@sentry.io/project-id":
        logger.info("Sentry DSN not configured - Skipping Sentry initialization")
        return False

    try:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        from sentry_sdk.integrations.mongodb import MongoDBIntegration
        from sentry_sdk.integrations.logging import LoggingIntegration

        # Configure Sentry SDK
        sentry_sdk.init(
            dsn=dsn,
            environment=environment,
            traces_sample_rate=traces_sample_rate,
            profiles_sample_rate=profiles_sample_rate,

            # Integrations
            integrations=[
                FastApiIntegration(),
                MongoDBIntegration(),
                LoggingIntegration(
                    level=logging.INFO,
                    event_level=logging.ERROR,
                ),
            ],

            # Performance monitoring
            enable_tracing=True,
            enable_profiling=True,

            # Before send callback (filter sensitive data)
            before_send=event_filter,

            # Stack traces
            attach_stacktrace=True,
            stacktrace_style="pretty",

            # Debug mode (only in development)
            debug=debug,

            # Release tracking (optional)
            # release=get_version(),

            # Server name
            server_name="vcsa-backend",

            # Max request body size
            max_request_body_size="medium",

            # Send default PII (personally identifiable information)
            send_default_pii=False,
        )

        logger.info(f"Sentry initialized successfully (environment: {environment})")
        return True

    except ImportError:
        logger.warning("sentry-sdk not installed - Run: pip install sentry-sdk[fastapi]")
        return False
    except Exception as e:
        logger.error(f"Failed to initialize Sentry: {e}")
        return False


def event_filter(event, hint):
    """
    Filter events before sending to Sentry
    - Remove sensitive data
    - Filter specific exceptions
    - Add custom context

    Args:
        event: Sentry event dictionary
        hint: Sentry hint dictionary

    Returns:
        Modified event or None to drop the event
    """
    # Drop events for specific exception types
    exc_info = hint.get("exc_info")
    if exc_info:
        exc_type, exc_value, exc_tb = exc_info

        # Filter out 404 errors (not useful in Sentry)
        if exc_type and "404" in str(exc_type):
            return None

        # Filter out CORS errors
        if exc_type and "CORS" in str(exc_type):
            return None

    # Remove sensitive data from request
    request = event.get("request", {})
    if "headers" in request:
        # Filter sensitive headers
        sensitive_headers = ["authorization", "cookie", "set-cookie", "x-api-key"]
        request["headers"] = {
            k: v for k, v in request["headers"].items()
            if k.lower() not in sensitive_headers
        }

    # Remove sensitive data from user
    user = event.get("user", {})
    if user:
        # Mask email addresses
        if "email" in user:
            email = user["email"]
            if "@" in email:
                local, domain = email.split("@")
                user["email"] = f"{local[0]}***@{domain}"

    # Add custom tags
    event.setdefault("tags", {})
    event["tags"]["app"] = "vcsa-backend"
    event["tags"]["service"] = "api"

    # Add custom context
    event.setdefault("contexts", {})
    event["contexts"]["app"] = {
        "name": "VCSA",
        "component": "Backend API",
    }

    return event


def capture_exception(exception: Exception, **kwargs):
    """
    Capture an exception and send to Sentry

    Args:
        exception: Exception to capture
        **kwargs: Additional context (tags, user, extra)
    """
    try:
        import sentry_sdk
        sentry_sdk.capture_exception(exception, **kwargs)
    except Exception as e:
        logger.error(f"Failed to capture exception in Sentry: {e}")


def capture_message(message: str, level: str = "info", **kwargs):
    """
    Capture a message and send to Sentry

    Args:
        message: Message to capture
        level: Log level (info, warning, error)
        **kwargs: Additional context (tags, user, extra)
    """
    try:
        import sentry_sdk
        sentry_sdk.capture_message(message, level=level, **kwargs)
    except Exception as e:
        logger.error(f"Failed to capture message in Sentry: {e}")


def set_user(user_id: str, email: str, username: str = None, **kwargs):
    """
    Set user context for Sentry events

    Args:
        user_id: User ID
        email: User email (will be masked)
        username: Username
        **kwargs: Additional user data
    """
    try:
        import sentry_sdk
        sentry_sdk.set_user({
            "id": user_id,
            "email": email,
            "username": username,
            **kwargs
        })
    except Exception as e:
        logger.error(f"Failed to set user in Sentry: {e}")


def add_breadcrumb(message: str, category: str = "default", level: str = "info", **kwargs):
    """
    Add a breadcrumb for debugging

    Args:
        message: Breadcrumb message
        category: Category (http, user, query, etc.)
        level: Log level
        **kwargs: Additional data
    """
    try:
        import sentry_sdk
        sentry_sdk.add_breadcrumb(
            message=message,
            category=category,
            level=level,
            data=kwargs
        )
    except Exception as e:
        logger.error(f"Failed to add breadcrumb in Sentry: {e}")


def get_sentry_status() -> dict:
    """
    Get Sentry initialization status

    Returns:
        dict with status information
    """
    try:
        import sentry_sdk
        client = sentry_sdk.Hub.current.client

        if client is None:
            return {
                "initialized": False,
                "message": "Sentry client not initialized"
            }

        return {
            "initialized": True,
            "dsn": client.dsn,
            "environment": client.options.get("environment"),
            "traces_sample_rate": client.options.get("traces_sample_rate"),
        }
    except Exception:
        return {
            "initialized": False,
            "message": "Unable to get Sentry status"
        }
