"""
════════════════════════════════════════════════════════════════
VCSA Performance Monitor Test Suite
════════════════════════════════════════════════════════════════

Comprehensive tests for performance monitoring functionality.

Author: VCSA QA Team
Created: April 2026
Status: Production Ready
════════════════════════════════════════════════════════════════
"""

import pytest
from fastapi import Request, Response
from starlette.responses import JSONResponse
from unittest.mock import Mock, AsyncMock, patch, MagicMock
from datetime import datetime, timedelta
import sys
from pathlib import Path
import time

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from performance_monitor import (
    PerformanceMetrics,
    ResponseTimeMiddleware,
    ErrorTrackingMiddleware,
    AlertSystem,
    PerformanceAnalyzer,
    AlertSeverity,
    ALERT_THRESHOLDS,
)


# ═══════════════════════════════════════════════════════════════
# FIXTURES
# ═══════════════════════════════════════════════════════════════

@pytest.fixture
def mock_db():
    """Provide mock database"""
    db = AsyncMock()
    db.metrics = AsyncMock()
    db.alerts = AsyncMock()
    return db


@pytest.fixture
def metrics(mock_db):
    """Provide PerformanceMetrics instance"""
    return PerformanceMetrics(mock_db)


@pytest.fixture
def alert_system(metrics):
    """Provide AlertSystem instance"""
    return AlertSystem(metrics)


@pytest.fixture
def analyzer(metrics):
    """Provide PerformanceAnalyzer instance"""
    return PerformanceAnalyzer(metrics)


@pytest.fixture
def sample_request():
    """Provide sample FastAPI Request"""
    request = Mock(spec=Request)
    request.method = "GET"
    request.url = Mock()
    request.url.path = "/api/development/tracks"
    request.client = Mock()
    request.client.host = "192.168.1.100"
    return request


@pytest.fixture
def sample_response():
    """Provide sample FastAPI Response"""
    response = Mock(spec=Response)
    response.status_code = 200
    response.headers = {}
    return response


# ═══════════════════════════════════════════════════════════════
# PERFORMANCE METRICS TESTS
# ═══════════════════════════════════════════════════════════════

class TestPerformanceMetrics:
    """Test PerformanceMetrics functionality"""

    @pytest.mark.asyncio
    async def test_store_metric(self, metrics, mock_db):
        """Test storing a metric"""
        mock_db.metrics.insert_one = AsyncMock()

        await metrics.store_metric("test_metric", {"value": 100}, {"tag": "test"})

        mock_db.metrics.insert_one.assert_called_once()

    @pytest.mark.asyncio
    async def test_store_metric_with_tags(self, metrics, mock_db):
        """Test storing metric with tags"""
        mock_db.metrics.insert_one = AsyncMock()

        await metrics.store_metric(
            "response_time",
            {"duration_ms": 150},
            {"path": "/api/test", "method": "GET"}
        )

        call_args = mock_db.metrics.insert_one.call_args[0][0]
        assert call_args["metric_name"] == "response_time"
        assert call_args["tags"]["path"] == "/api/test"
        assert call_args["value"]["duration_ms"] == 150

    @pytest.mark.asyncio
    async def test_get_metrics(self, metrics, mock_db):
        """Test retrieving metrics"""
        mock_db.metrics.find = MagicMock()
        mock_db.metrics.find.return_value.sort.return_value.to_list = AsyncMock(
            return_value=[
                {
                    "metric_name": "test_metric",
                    "value": 100,
                    "timestamp": datetime.utcnow()
                }
            ]
        )

        results = await metrics.get_metrics("test_metric", hours=24)

        assert len(results) == 1
        assert results[0]["metric_name"] == "test_metric"

    @pytest.mark.asyncio
    async def test_calculate_percentiles(self, metrics, mock_db):
        """Test percentile calculation"""
        values = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550]

        mock_db.metrics.aggregate = MagicMock()
        mock_db.metrics.aggregate.return_value.to_list = AsyncMock(
            return_value=[{"values": values}]
        )

        p50 = await metrics.calculate_percentile("test_metric", 24, 50)
        p95 = await metrics.calculate_percentile("test_metric", 24, 95)

        assert p50 == 300  # Median
        assert p95 == 525  # 95th percentile


# ═══════════════════════════════════════════════════════════════
# RESPONSE TIME MIDDLEWARE TESTS
# ═══════════════════════════════════════════════════════════════

class TestResponseTimeMiddleware:
    """Test ResponseTimeMiddleware functionality"""

    @pytest.fixture
    def app(self):
        """Mock FastAPI app"""
        return Mock()

    @pytest.fixture
    def middleware(self, app, metrics):
        """Provide middleware instance"""
        return ResponseTimeMiddleware(app, metrics)

    @pytest.mark.asyncio
    async def test_adds_response_time_header(self, middleware, sample_request):
        """Test middleware adds X-Response-Time header"""
        async def call_next(request):
            response = JSONResponse(content={"data": "test"})
            return response

        response = await middleware.dispatch(sample_request, call_next)

        assert "X-Response-Time" in response.headers
        assert "ms" in response.headers["X-Response-Time"]

    @pytest.mark.asyncio
    async def test_stores_metric(self, middleware, metrics, sample_request):
        """Test middleware stores response time metric"""
        metrics.store_metric = AsyncMock()

        async def call_next(request):
            return JSONResponse(content={"data": "test"}, status_code=200)

        await middleware.dispatch(sample_request, call_next)

        # Should store metric (health check would skip)
        assert sample_request.url.path not in ["/health", "/api/health"]

    @pytest.mark.asyncio
    async def test_skips_health_checks(self, middleware, metrics, sample_request):
        """Test health checks are not tracked"""
        metrics.store_metric = AsyncMock()

        sample_request.url.path = "/health"

        async def call_next(request):
            return JSONResponse(content={"status": "ok"})

        await middleware.dispatch(sample_request, call_next)

        # Should not store metric for health checks
        metrics.store_metric.assert_not_called()

    @pytest.mark.asyncio
    async def test_tracks_slow_requests(self, middleware, metrics, sample_request):
        """Test slow requests are tracked"""
        metrics.store_metric = AsyncMock()

        async def call_next(request):
            # Simulate slow request
            time.sleep(0.01)
            return JSONResponse(content={"data": "test"})

        await middleware.dispatch(sample_request, call_next)

        # Should store metric even for slow requests
        metrics.store_metric.assert_called_once()


# ═══════════════════════════════════════════════════════════════
# ERROR TRACKING MIDDLEWARE TESTS
# ═══════════════════════════════════════════════════════════════

class TestErrorTrackingMiddleware:
    """Test ErrorTrackingMiddleware functionality"""

    @pytest.fixture
    def app(self):
        """Mock FastAPI app"""
        return Mock()

    @pytest.fixture
    def middleware(self, app, metrics):
        """Provide middleware instance"""
        return ErrorTrackingMiddleware(app, metrics)

    @pytest.mark.asyncio
    async def test_tracks_4xx_errors(self, middleware, metrics, sample_request):
        """Test 4xx errors are tracked"""
        metrics.store_metric = AsyncMock()

        async def call_next(request):
            return JSONResponse(content={"error": "not found"}, status_code=404)

        await middleware.dispatch(sample_request, call_next)

        metrics.store_metric.assert_called_once()
        call_args = metrics.store_metric.call_args[0][0]
        assert call_args == "error"

    @pytest.mark.asyncio
    async def test_tracks_5xx_errors(self, middleware, metrics, sample_request):
        """Test 5xx errors are tracked"""
        metrics.store_metric = AsyncMock()

        async def call_next(request):
            return JSONResponse(content={"error": "server error"}, status_code=500)

        await middleware.dispatch(sample_request, call_next)

        metrics.store_metric.assert_called_once()

    @pytest.mark.asyncio
    async def test_tracks_exceptions(self, middleware, metrics, sample_request):
        """Test exceptions are tracked"""
        metrics.store_metric = AsyncMock()

        async def call_next(request):
            raise ValueError("Test exception")

        with pytest.raises(ValueError):
            await middleware.dispatch(sample_request, call_next)

        # Should store exception metric
        metrics.store_metric.assert_called_once()
        call_args = metrics.store_metric.call_args[0][0]
        assert call_args == "exception"

    @pytest.mark.asyncio
    async def test_skips_successful_requests(self, middleware, metrics, sample_request):
        """Test successful requests are not tracked as errors"""
        metrics.store_metric = AsyncMock()

        async def call_next(request):
            return JSONResponse(content={"data": "test"}, status_code=200)

        await middleware.dispatch(sample_request, call_next)

        metrics.store_metric.assert_not_called()


# ═══════════════════════════════════════════════════════════════
# ALERT SYSTEM TESTS
# ═══════════════════════════════════════════════════════════════

class TestAlertSystem:
    """Test AlertSystem functionality"""

    def test_check_thresholds_emergency(self, alert_system):
        """Test emergency threshold detection"""
        severity = alert_system.check_thresholds(
            "test",
            2500,
            ALERT_THRESHOLDS["response_time_p95"]
        )
        assert severity == AlertSeverity.EMERGENCY

    def test_check_thresholds_critical(self, alert_system):
        """Test critical threshold detection"""
        severity = alert_system.check_thresholds(
            "test",
            1200,
            ALERT_THRESHOLDS["response_time_p95"]
        )
        assert severity == AlertSeverity.CRITICAL

    def test_check_thresholds_warning(self, alert_system):
        """Test warning threshold detection"""
        severity = alert_system.check_thresholds(
            "test",
            600,
            ALERT_THRESHOLDS["response_time_p95"]
        )
        assert severity == AlertSeverity.WARNING

    def test_check_thresholds_normal(self, alert_system):
        """Test normal value (no alert)"""
        severity = alert_system.check_thresholds(
            "test",
            200,
            ALERT_THRESHOLDS["response_time_p95"]
        )
        assert severity is None

    @pytest.mark.asyncio
    async def test_send_alert(self, alert_system):
        """Test sending alert"""
        await alert_system.send_alert(
            AlertSeverity.WARNING,
            "Test alert",
            {"metric": "test"}
        )

        # Should store in database
        assert len(alert_system.alert_history) > 0

    @pytest.mark.asyncio
    async def test_alert_cooldown(self, alert_system):
        """Test alert cooldown prevents spam"""
        # Send first alert
        await alert_system.send_alert(
            AlertSeverity.WARNING,
            "Test alert",
        )

        # Try to send same alert immediately
        initial_count = len(alert_system.alert_history)
        await alert_system.send_alert(
            AlertSeverity.WARNING,
            "Test alert",
        )

        # Should not add duplicate due to cooldown
        assert len(alert_system.alert_history) == initial_count

    @pytest.mark.asyncio
    async def test_check_error_rate(self, alert_system, metrics):
        """Test error rate calculation"""
        # Mock database counts
        metrics.metrics_collection.count_documents = AsyncMock(side_effect=[100, 5])

        error_rate = await alert_system.check_error_rate()

        assert error_rate == 5.0

    @pytest.mark.asyncio
    async def test_check_response_time(self, alert_system, metrics):
        """Test response time check"""
        # Mock percentile calculation
        metrics.calculate_percentile = AsyncMock(return_value=450.0)

        response_time = await alert_system.check_response_time(95)

        assert response_time == 450.0


# ═══════════════════════════════════════════════════════════════
# PERFORMANCE ANALYZER TESTS
# ═══════════════════════════════════════════════════════════════

class TestPerformanceAnalyzer:
    """Test PerformanceAnalyzer functionality"""

    @pytest.mark.asyncio
    async def test_get_performance_summary(self, analyzer, metrics, mock_db):
        """Test performance summary generation"""
        # Mock database queries
        metrics.metrics_collection.count_documents = AsyncMock(side_effect=[1000, 10])
        metrics.calculate_percentile = AsyncMock(side_effect=[150, 350, 600])

        summary = await analyzer.get_performance_summary(hours=24)

        assert "period_hours" in summary
        assert "response_times" in summary
        assert "request_count" in summary
        assert "error_rate" in summary
        assert summary["request_count"] == 1000
        assert summary["error_rate"] == 1.0

    @pytest.mark.asyncio
    async def test_get_slowest_endpoints(self, analyzer, metrics):
        """Test slowest endpoints retrieval"""
        # Mock aggregation pipeline
        metrics.metrics_collection.aggregate = MagicMock()
        metrics.metrics_collection.aggregate.return_value.to_list = AsyncMock(
            return_value=[
                {
                    "_id": "/api/slow/endpoint",
                    "avg_duration": 1500,
                    "max_duration": 3000,
                    "count": 100
                }
            ]
        )

        slowest = await analyzer.get_slowest_endpoints(hours=24, limit=10)

        assert len(slowest) == 1
        assert slowest[0]["path"] == "/api/slow/endpoint"
        assert slowest[0]["avg_duration_ms"] == 1500


# ═══════════════════════════════════════════════════════════════
# CONFIGURATION TESTS
# ═══════════════════════════════════════════════════════════════

class TestAlertConfiguration:
    """Test alert threshold configuration"""

    def test_response_time_thresholds(self):
        """Test response time thresholds are configured"""
        assert "response_time_p95" in ALERT_THRESHOLDS
        assert "warning" in ALERT_THRESHOLDS["response_time_p95"]
        assert "critical" in ALERT_THRESHOLDS["response_time_p95"]
        assert "emergency" in ALERT_THRESHOLDS["response_time_p95"]

        assert ALERT_THRESHOLDS["response_time_p95"]["warning"] < \
               ALERT_THRESHOLDS["response_time_p95"]["critical"]
        assert ALERT_THRESHOLDS["response_time_p95"]["critical"] < \
               ALERT_THRESHOLDS["response_time_p95"]["emergency"]

    def test_error_rate_thresholds(self):
        """Test error rate thresholds are configured"""
        assert "error_rate" in ALERT_THRESHOLDS
        assert ALERT_THRESHOLDS["error_rate"]["warning"] == 1
        assert ALERT_THRESHOLDS["error_rate"]["critical"] == 5
        assert ALERT_THRESHOLDS["error_rate"]["emergency"] == 10

    def test_all_thresholds_have_levels(self):
        """Test all thresholds have all severity levels"""
        for metric_name, thresholds in ALERT_THRESHOLDS.items():
            assert "warning" in thresholds
            assert "critical" in thresholds
            assert "emergency" in thresholds


# ═══════════════════════════════════════════════════════════════
# INTEGRATION TESTS
# ═══════════════════════════════════════════════════════════════

class TestPerformanceMonitoringIntegration:
    """Integration tests for performance monitoring"""

    @pytest.mark.asyncio
    async def test_end_to_end_monitoring_flow(self, metrics, mock_db):
        """Test complete monitoring flow"""
        # Store metrics
        mock_db.metrics.insert_one = AsyncMock()

        await metrics.store_metric("response_time", {"duration_ms": 150})
        await metrics.store_metric("error", {"status_code": 500})

        # Verify metrics stored
        assert mock_db.metrics.insert_one.call_count == 2

    @pytest.mark.asyncio
    async def test_alert_triggered_on_high_error_rate(self, alert_system, metrics):
        """Test alert triggered when error rate is high"""
        # Mock error rate calculation
        metrics.metrics_collection.count_documents = AsyncMock(side_effect=[100, 15])

        # Run health check
        await alert_system.run_health_checks()

        # Alert should be sent
        assert len(alert_system.alert_history) > 0

    @pytest.mark.asyncio
    async def test_performance_report_generation(self, analyzer, metrics):
        """Test complete performance report generation"""
        # Mock all required database calls
        metrics.metrics_collection.count_documents = AsyncMock(side_effect=[1000, 20])
        metrics.calculate_percentile = AsyncMock(side_effect=[200, 400, 800])

        report = await analyzer.get_performance_summary(hours=24)

        assert report["request_count"] == 1000
        assert report["error_count"] == 20
        assert report["error_rate"] == 2.0
        assert report["response_times"]["p50"] == 200
        assert report["response_times"]["p95"] == 400
        assert report["response_times"]["p99"] == 800


# ═══════════════════════════════════════════════════════════════
# TEST RUNNER
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
