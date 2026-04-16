"""
════════════════════════════════════════════════════════════════
VCSA Performance Monitoring Module
════════════════════════════════════════════════════════════════

Comprehensive performance monitoring for VCSA platform.

Features:
- Response time tracking
- Error rate monitoring
- Alert system
- Metrics storage
- Performance analytics

Author: VCSA DevOps Team
Created: April 2026
Status: Production Ready
════════════════════════════════════════════════════════════════
"""

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, Dict, List, Any
from datetime import datetime, timedelta
from enum import Enum
import time
import logging
import asyncio
import os
from collections import defaultdict
import json

logger = logging.getLogger(__name__)

# ═══════════════════════════════════════════════════════════════
# ALERT SEVERITY LEVELS
# ═══════════════════════════════════════════════════════════════

class AlertSeverity(str, Enum):
    """Alert severity levels"""
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"
    EMERGENCY = "emergency"


# ═══════════════════════════════════════════════════════════════
# ALERT THRESHOLDS CONFIGURATION
# ═══════════════════════════════════════════════════════════════

ALERT_THRESHOLDS = {
    "response_time_p95": {
        "warning": 500,      # ms
        "critical": 1000,
        "emergency": 2000,
    },
    "response_time_p99": {
        "warning": 1000,     # ms
        "critical": 2000,
        "emergency": 5000,
    },
    "error_rate": {
        "warning": 1,        # %
        "critical": 5,
        "emergency": 10,
    },
    "slow_query_rate": {
        "warning": 10,       # count/hour
        "critical": 50,
        "emergency": 100,
    },
    "memory_usage": {
        "warning": 70,       # %
        "critical": 85,
        "emergency": 95,
    },
    "cpu_usage": {
        "warning": 70,       # %
        "critical": 85,
        "emergency": 95,
    },
}


# ═══════════════════════════════════════════════════════════════
# PERFORMANCE METRICS CLASS
# ═══════════════════════════════════════════════════════════════

class PerformanceMetrics:
    """Performance metrics storage and analysis"""

    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.metrics_collection = db.metrics
        self.alerts_collection = db.alerts

    async def store_metric(self, metric_name: str, value: Any, tags: Dict[str, Any] = None):
        """
        Store a performance metric

        Args:
            metric_name: Name of the metric
            value: Metric value
            tags: Optional tags for filtering
        """
        metric = {
            "metric_name": metric_name,
            "value": value,
            "tags": tags or {},
            "timestamp": datetime.utcnow(),
        }

        try:
            await self.metrics_collection.insert_one(metric)
        except Exception as e:
            logger.error(f"Failed to store metric: {e}")

    async def get_metrics(
        self,
        metric_name: str,
        hours: int = 24,
        tags: Dict[str, Any] = None
    ) -> List[Dict]:
        """
        Retrieve metrics for a given time period

        Args:
            metric_name: Name of the metric
            hours: Number of hours to look back
            tags: Optional tags for filtering

        Returns:
            List of metrics
        """
        query = {
            "metric_name": metric_name,
            "timestamp": {"$gte": datetime.utcnow() - timedelta(hours=hours)}
        }

        if tags:
            query["tags"] = tags

        try:
            cursor = self.metrics_collection.find(query).sort("timestamp", -1)
            return await cursor.to_list(length=None)
        except Exception as e:
            logger.error(f"Failed to retrieve metrics: {e}")
            return []

    async def calculate_percentiles(
        self,
        metric_name: str,
        hours: int = 24,
        percentile: float = 95
    ) -> Optional[float]:
        """
        Calculate percentile for a metric

        Args:
            metric_name: Name of the metric
            hours: Number of hours to look back
            percentile: Percentile to calculate (50, 95, 99)

        Returns:
            Percentile value or None
        """
        pipeline = [
            {
                "$match": {
                    "metric_name": metric_name,
                    "timestamp": {"$gte": datetime.utcnow() - timedelta(hours=hours)}
                }
            },
            {
                "$group": {
                    "_id": None,
                    "values": {"$push": "$value.duration_ms"}
                }
            }
        ]

        try:
            result = await self.metrics_collection.aggregate(pipeline).to_list(None)

            if not result or not result[0]["values"]:
                return None

            values = sorted(result[0]["values"])
            index = int(len(values) * percentile / 100)

            return values[index] if index < len(values) else values[-1]

        except Exception as e:
            logger.error(f"Failed to calculate percentile: {e}")
            return None


# ═══════════════════════════════════════════════════════════════
# RESPONSE TIME TRACKING MIDDLEWARE
# ═══════════════════════════════════════════════════════════════

class ResponseTimeMiddleware(BaseHTTPMiddleware):
    """Track response times for all requests"""

    def __init__(self, app, metrics: PerformanceMetrics):
        super().__init__(app)
        self.metrics = metrics

    async def dispatch(self, request: Request, call_next):
        """Process request and track response time"""
        start_time = time.time()

        # Process request
        response = await call_next(request)

        # Calculate duration
        duration_ms = (time.time() - start_time) * 1000

        # Log response time
        logger.info(f"{request.method} {request.url.path} - {duration_ms:.2f}ms - {response.status_code}")

        # Add header
        response.headers["X-Response-Time"] = f"{duration_ms:.2f}ms"

        # Store metric (skip health checks to reduce noise)
        if request.url.path not in ["/health", "/api/health"]:
            await self.metrics.store_metric(
                "response_time",
                {"duration_ms": duration_ms, "status_code": response.status_code},
                tags={
                    "path": request.url.path,
                    "method": request.method,
                }
            )

        return response


# ═══════════════════════════════════════════════════════════════
# ERROR TRACKING MIDDLEWARE
# ═══════════════════════════════════════════════════════════════

class ErrorTrackingMiddleware(BaseHTTPMiddleware):
    """Track error rates and exceptions"""

    def __init__(self, app, metrics: PerformanceMetrics):
        super().__init__(app)
        self.metrics = metrics

    async def dispatch(self, request: Request, call_next):
        """Process request and track errors"""
        try:
            response = await call_next(request)

            # Track 4xx and 5xx errors
            if response.status_code >= 400:
                await self.metrics.store_metric(
                    "error",
                    {"status_code": response.status_code},
                    tags={
                        "path": request.url.path,
                        "method": request.method,
                        "severity": "critical" if response.status_code >= 500 else "warning"
                    }
                )

            return response

        except Exception as e:
            # Log unhandled exceptions
            logger.exception(f"Unhandled exception: {e}")

            await self.metrics.store_metric(
                "exception",
                {
                    "exception_type": type(e).__name__,
                    "message": str(e),
                },
                tags={
                    "path": request.url.path,
                    "method": request.method,
                }
            )

            raise


# ═══════════════════════════════════════════════════════════════
# ALERT SYSTEM
# ═══════════════════════════════════════════════════════════════

class AlertSystem:
    """Alert management system"""

    def __init__(self, metrics: PerformanceMetrics):
        self.metrics = metrics
        self.alert_history = defaultdict(list)
        self.alert_cooldown = 300  # 5 minutes

    async def check_thresholds(
        self,
        metric_name: str,
        value: float,
        thresholds: Dict[str, float]
    ) -> Optional[AlertSeverity]:
        """
        Check if value exceeds any threshold

        Args:
            metric_name: Name of the metric
            value: Current value
            thresholds: Threshold configuration

        Returns:
            Severity level if exceeded, None otherwise
        """
        if value >= thresholds.get("emergency", float("inf")):
            return AlertSeverity.EMERGENCY
        elif value >= thresholds.get("critical", float("inf")):
            return AlertSeverity.CRITICAL
        elif value >= thresholds.get("warning", float("inf")):
            return AlertSeverity.WARNING

        return None

    async def send_alert(
        self,
        severity: AlertSeverity,
        message: str,
        metadata: Dict[str, Any] = None
    ):
        """
        Send alert to multiple channels

        Args:
            severity: Alert severity
            message: Alert message
            metadata: Additional metadata
        """
        alert = {
            "severity": severity.value,
            "message": message,
            "metadata": metadata or {},
            "timestamp": datetime.utcnow(),
        }

        # Check cooldown to avoid alert spam
        alert_key = f"{severity.value}:{message}"
        if self._is_on_cooldown(alert_key):
            logger.debug(f"Alert on cooldown: {alert_key}")
            return

        # Store in database
        try:
            await self.metrics.alerts_collection.insert_one(alert)
        except Exception as e:
            logger.error(f"Failed to store alert: {e}")

        # Log alert
        logger.warning(f"[{severity.value.upper()}] {message}")

        # Send notifications
        if severity in [AlertSeverity.CRITICAL, AlertSeverity.EMERGENCY]:
            await self._send_critical_alert(alert)

        # Track alert history
        self.alert_history[alert_key].append(datetime.utcnow())

    def _is_on_cooldown(self, alert_key: str) -> bool:
        """Check if alert is on cooldown"""
        if alert_key not in self.alert_history:
            return False

        # Remove old alerts outside cooldown period
        cutoff = datetime.utcnow() - timedelta(seconds=self.alert_cooldown)
        self.alert_history[alert_key] = [
            ts for ts in self.alert_history[alert_key] if ts > cutoff
        ]

        return len(self.alert_history[alert_key]) > 0

    async def _send_critical_alert(self, alert: Dict):
        """Send critical alert notifications"""
        # Email alert (if configured)
        if os.environ.get("ALERT_EMAIL_ENABLED", "false").lower() == "true":
            await self._send_email_alert(alert)

        # Slack alert (if configured)
        if os.environ.get("SLACK_WEBHOOK_URL"):
            await self._send_slack_alert(alert)

    async def _send_email_alert(self, alert: Dict):
        """Send email alert (placeholder for SendGrid integration)"""
        try:
            import sendgrid
            from sendgrid.helpers.mail import Mail

            message = Mail(
                from_email="alerts@vcsa.com",
                to_emails=os.environ.get("ALERT_EMAIL_TO", "ops@vcsa.com"),
                subject=f"[{alert['severity'].upper()}] VCSA Alert",
                html_content=f"""
                <h2>{alert['severity'].upper()} Alert</h2>
                <p>{alert['message']}</p>
                <pre>{json.dumps(alert['metadata'], indent=2)}</pre>
                <p>Time: {alert['timestamp']}</p>
                """
            )

            sg = sendgrid.SendGridAPIClient(api_key=os.environ.get("SENDGRID_API_KEY"))
            await sg.send(message)

            logger.info("Email alert sent")

        except ImportError:
            logger.warning("SendGrid not installed - email alerts disabled")
        except Exception as e:
            logger.error(f"Failed to send email alert: {e}")

    async def _send_slack_alert(self, alert: Dict):
        """Send Slack webhook alert"""
        import aiohttp

        webhook_url = os.environ.get("SLACK_WEBHOOK_URL")

        colors = {
            "info": "#36a64f",
            "warning": "#ff9900",
            "critical": "#ff0000",
            "emergency": "#ff0000",
        }

        payload = {
            "attachments": [{
                "color": colors.get(alert["severity"], "#36a64f"),
                "title": f"VCSA {alert['severity'].upper()} Alert",
                "text": alert['message'],
                "fields": [
                    {"title": "Severity", "value": alert["severity"], "short": True},
                    {"title": "Time", "value": str(alert["timestamp"]), "short": True},
                ],
                "footer": "VCSA Platform",
            }]
        }

        try:
            async with aiohttp.ClientSession() as session:
                await session.post(webhook_url, json=payload)

            logger.info("Slack alert sent")

        except Exception as e:
            logger.error(f"Failed to send Slack alert: {e}")

    async def check_error_rate(self, hours: int = 1) -> float:
        """
        Calculate error rate for given time period

        Args:
            hours: Number of hours to look back

        Returns:
            Error rate as percentage
        """
        try:
            # Count total requests
            total_requests = await self.metrics.metrics_collection.count_documents({
                "metric_name": "response_time",
                "timestamp": {"$gte": datetime.utcnow() - timedelta(hours=hours)}
            })

            # Count errors
            error_requests = await self.metrics.metrics_collection.count_documents({
                "metric_name": "error",
                "timestamp": {"$gte": datetime.utcnow() - timedelta(hours=hours)}
            })

            if total_requests == 0:
                return 0.0

            error_rate = (error_requests / total_requests) * 100
            return error_rate

        except Exception as e:
            logger.error(f"Failed to calculate error rate: {e}")
            return 0.0

    async def check_response_time(self, percentile: int = 95, hours: int = 1) -> Optional[float]:
        """
        Check response time percentile

        Args:
            percentile: Percentile to check (50, 95, 99)
            hours: Number of hours to look back

        Returns:
            Response time in ms or None
        """
        return await self.metrics.calculate_percentile("response_time", hours, percentile)

    async def run_health_checks(self):
        """Run all health checks and send alerts if needed"""
        # Check error rate
        error_rate = await self.check_error_rate()
        severity = await self.check_thresholds(
            "error_rate",
            error_rate,
            ALERT_THRESHOLDS["error_rate"]
        )

        if severity:
            await self.send_alert(
                severity,
                f"High error rate detected: {error_rate:.2f}%",
                {"error_rate": error_rate, "threshold": ALERT_THRESHOLDS["error_rate"]}
            )

        # Check response time
        p95_response_time = await self.check_response_time(95)
        if p95_response_time:
            severity = await self.check_thresholds(
                "response_time_p95",
                p95_response_time,
                ALERT_THRESHOLDS["response_time_p95"]
            )

            if severity:
                await self.send_alert(
                    severity,
                    f"High response time detected (p95): {p95_response_time:.2f}ms",
                    {"response_time_p95": p95_response_time, "threshold": ALERT_THRESHOLDS["response_time_p95"]}
                )


# ═══════════════════════════════════════════════════════════════
# PERFORMANCE ANALYZER
# ═══════════════════════════════════════════════════════════════

class PerformanceAnalyzer:
    """Performance analytics and reporting"""

    def __init__(self, metrics: PerformanceMetrics):
        self.metrics = metrics

    async def get_performance_summary(self, hours: int = 24) -> Dict[str, Any]:
        """
        Get comprehensive performance summary

        Args:
            hours: Number of hours to analyze

        Returns:
            Performance summary dictionary
        """
        summary = {
            "period_hours": hours,
            "timestamp": datetime.utcnow().isoformat(),
        }

        # Response times
        summary["response_times"] = {
            "p50": await self.metrics.calculate_percentile("response_time", hours, 50),
            "p95": await self.metrics.calculate_percentile("response_time", hours, 95),
            "p99": await self.metrics.calculate_percentile("response_time", hours, 99),
        }

        # Request count
        try:
            summary["request_count"] = await self.metrics.metrics_collection.count_documents({
                "metric_name": "response_time",
                "timestamp": {"$gte": datetime.utcnow() - timedelta(hours=hours)}
            })
        except Exception:
            summary["request_count"] = 0

        # Error count
        try:
            summary["error_count"] = await self.metrics.metrics_collection.count_documents({
                "metric_name": "error",
                "timestamp": {"$gte": datetime.utcnow() - timedelta(hours=hours)}
            })
        except Exception:
            summary["error_count"] = 0

        # Calculate error rate
        if summary["request_count"] > 0:
            summary["error_rate"] = (summary["error_count"] / summary["request_count"]) * 100
        else:
            summary["error_rate"] = 0.0

        # Top endpoints by request count
        try:
            pipeline = [
                {
                    "$match": {
                        "metric_name": "response_time",
                        "timestamp": {"$gte": datetime.utcnow() - timedelta(hours=hours)}
                    }
                },
                {
                    "$group": {
                        "_id": "$tags.path",
                        "count": {"$sum": 1},
                        "avg_duration": {"$avg": "$value.duration_ms"}
                    }
                },
                {"$sort": {"count": -1}},
                {"$limit": 10}
            ]

            top_endpoints = await self.metrics.metrics_collection.aggregate(pipeline).to_list(None)
            summary["top_endpoints"] = [
                {
                    "path": ep["_id"],
                    "request_count": ep["count"],
                    "avg_duration_ms": ep["avg_duration"]
                }
                for ep in top_endpoints
            ]
        except Exception as e:
            logger.error(f"Failed to get top endpoints: {e}")
            summary["top_endpoints"] = []

        return summary

    async def get_slowest_endpoints(self, hours: int = 24, limit: int = 10) -> List[Dict]:
        """
        Get slowest endpoints by average response time

        Args:
            hours: Number of hours to analyze
            limit: Number of endpoints to return

        Returns:
            List of slowest endpoints
        """
        try:
            pipeline = [
                {
                    "$match": {
                        "metric_name": "response_time",
                        "timestamp": {"$gte": datetime.utcnow() - timedelta(hours=hours)}
                    }
                },
                {
                    "$group": {
                        "_id": "$tags.path",
                        "avg_duration": {"$avg": "$value.duration_ms"},
                        "max_duration": {"$max": "$value.duration_ms"},
                        "count": {"$sum": 1}
                    }
                },
                {"$sort": {"avg_duration": -1}},
                {"$limit": limit}
            ]

            results = await self.metrics.metrics_collection.aggregate(pipeline).to_list(None)

            return [
                {
                    "path": ep["_id"],
                    "avg_duration_ms": ep["avg_duration"],
                    "max_duration_ms": ep["max_duration"],
                    "request_count": ep["count"]
                }
                for ep in results
            ]

        except Exception as e:
            logger.error(f"Failed to get slowest endpoints: {e}")
            return []


# ═══════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════

__all__ = [
    "PerformanceMetrics",
    "ResponseTimeMiddleware",
    "ErrorTrackingMiddleware",
    "AlertSystem",
    "PerformanceAnalyzer",
    "AlertSeverity",
    "ALERT_THRESHOLDS",
]
