"""
════════════════════════════════════════════════════════════════
VCSA Benchmark Runner
════════════════════════════════════════════════════════════════

Performance benchmarking and baseline measurement tools.

Author: VCSA DevOps Team
Created: April 2026
Status: Production Ready
════════════════════════════════════════════════════════════════
"""

import asyncio
import time
import statistics
from datetime import datetime
from typing import Dict, List, Tuple, Any, Optional
import json
import logging
from pathlib import Path
import httpx

logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════════════════════
# BENCHMARK CONFIGURATION
# ═══════════════════════════════════════════════════════════════

BENCHMARK_ENDPOINTS = {
    "health": {
        "url": "/api/health",
        "method": "GET",
        "requests": 100,
        "expected_p95_ms": 20,
        "expected_p99_ms": 50,
    },
    "development_stages": {
        "url": "/api/development/stages",
        "method": "GET",
        "requests": 100,
        "expected_p95_ms": 300,
        "expected_p99_ms": 750,
    },
    "development_tracks": {
        "url": "/api/development/tracks",
        "method": "GET",
        "requests": 100,
        "expected_p95_ms": 300,
        "expected_p99_ms": 750,
    },
    "community_posts": {
        "url": "/api/community/posts",
        "method": "GET",
        "requests": 100,
        "expected_p95_ms": 250,
        "expected_p99_ms": 600,
    },
    "events": {
        "url": "/api/events",
        "method": "GET",
        "requests": 50,
        "expected_p95_ms": 200,
        "expected_p99_ms": 500,
    },
}


# ═══════════════════════════════════════════════════════════════
# BENCHMARK RESULT CLASS
# ═══════════════════════════════════════════════════════════════

class BenchmarkResult:
    """Container for benchmark results"""

    def __init__(self, endpoint_name: str):
        self.endpoint_name = endpoint_name
        self.response_times: List[float] = []
        self.status_codes: List[int] = []
        self.errors: List[str] = []
        self.start_time: Optional[datetime] = None
        self.end_time: Optional[datetime] = None

    def add_result(self, duration_ms: float, status_code: int, error: Optional[str] = None):
        """Add a request result"""
        self.response_times.append(duration_ms)
        self.status_codes.append(status_code)
        if error:
            self.errors.append(error)

    @property
    def total_requests(self) -> int:
        """Total number of requests"""
        return len(self.response_times)

    @property
    def successful_requests(self) -> int:
        """Number of successful requests"""
        return sum(1 for code in self.status_codes if 200 <= code < 300)

    @property
    def failed_requests(self) -> int:
        """Number of failed requests"""
        return self.total_requests - self.successful_requests

    @property
    def error_rate(self) -> float:
        """Error rate as percentage"""
        if self.total_requests == 0:
            return 0.0
        return (self.failed_requests / self.total_requests) * 100

    @property
    def p50(self) -> float:
        """50th percentile (median)"""
        if not self.response_times:
            return 0.0
        return statistics.median(self.response_times)

    @property
    def p95(self) -> float:
        """95th percentile"""
        if not self.response_times:
            return 0.0
        sorted_times = sorted(self.response_times)
        index = int(len(sorted_times) * 0.95)
        return sorted_times[index] if index < len(sorted_times) else sorted_times[-1]

    @property
    def p99(self) -> float:
        """99th percentile"""
        if not self.response_times:
            return 0.0
        sorted_times = sorted(self.response_times)
        index = int(len(sorted_times) * 0.99)
        return sorted_times[index] if index < len(sorted_times) else sorted_times[-1]

    @property
    def avg(self) -> float:
        """Average response time"""
        if not self.response_times:
            return 0.0
        return statistics.mean(self.response_times)

    @property
    def min(self) -> float:
        """Minimum response time"""
        if not self.response_times:
            return 0.0
        return min(self.response_times)

    @property
    def max(self) -> float:
        """Maximum response time"""
        if not self.response_times:
            return 0.0
        return max(self.response_times)

    @property
    def duration_seconds(self) -> float:
        """Total benchmark duration"""
        if self.start_time and self.end_time:
            return (self.end_time - self.start_time).total_seconds()
        return 0.0

    @property
    def requests_per_second(self) -> float:
        """Requests per second"""
        if self.duration_seconds > 0:
            return self.total_requests / self.duration_seconds
        return 0.0

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "endpoint": self.endpoint_name,
            "total_requests": self.total_requests,
            "successful_requests": self.successful_requests,
            "failed_requests": self.failed_requests,
            "error_rate": round(self.error_rate, 2),
            "response_times": {
                "min_ms": round(self.min, 2),
                "avg_ms": round(self.avg, 2),
                "p50_ms": round(self.p50, 2),
                "p95_ms": round(self.p95, 2),
                "p99_ms": round(self.p99, 2),
                "max_ms": round(self.max, 2),
            },
            "requests_per_second": round(self.requests_per_second, 2),
            "duration_seconds": round(self.duration_seconds, 2),
        }


# ═══════════════════════════════════════════════════════════════
# BENCHMARK RUNNER CLASS
# ═══════════════════════════════════════════════════════════════

class BenchmarkRunner:
    """Performance benchmark runner"""

    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.client = None
        self.results: Dict[str, BenchmarkResult] = {}

    async def __aenter__(self):
        """Async context manager entry"""
        self.client = httpx.AsyncClient(timeout=30.0)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.client:
            await self.client.aclose()

    async def warm_up(self, requests: int = 50):
        """Send warm-up requests"""
        logger.info(f"Sending {requests} warm-up requests...")

        for _ in range(requests):
            try:
                await self.client.get(f"{self.base_url}/api/health")
            except Exception:
                pass

        logger.info("Warm-up completed")

    async def benchmark_endpoint(
        self,
        endpoint_name: str,
        config: Dict[str, Any],
        concurrent: int = 1
    ) -> BenchmarkResult:
        """
        Benchmark a single endpoint

        Args:
            endpoint_name: Name of the endpoint
            config: Endpoint configuration
            concurrent: Number of concurrent requests

        Returns:
            BenchmarkResult with metrics
        """
        result = BenchmarkResult(endpoint_name)
        url = f"{self.base_url}{config['url']}"
        method = config.get('method', 'GET')
        num_requests = config.get('requests', 100)

        result.start_time = datetime.utcnow()

        if concurrent > 1:
            # Run with concurrency
            await self._run_concurrent(result, url, method, num_requests, concurrent)
        else:
            # Run sequentially
            await self._run_sequential(result, url, method, num_requests)

        result.end_time = datetime.utcnow()

        self.results[endpoint_name] = result
        return result

    async def _run_sequential(
        self,
        result: BenchmarkResult,
        url: str,
        method: str,
        num_requests: int
    ):
        """Run requests sequentially"""
        for _ in range(num_requests):
            start = time.perf_counter()

            try:
                if method == "GET":
                    response = await self.client.get(url)
                elif method == "POST":
                    response = await self.client.post(url, json={})
                else:
                    raise ValueError(f"Unsupported method: {method}")

                duration_ms = (time.perf_counter() - start) * 1000
                result.add_result(duration_ms, response.status_code)

            except Exception as e:
                duration_ms = (time.perf_counter() - start) * 1000
                result.add_result(duration_ms, 0, str(e))

    async def _run_concurrent(
        self,
        result: BenchmarkResult,
        url: str,
        method: str,
        num_requests: int,
        concurrent: int
    ):
        """Run requests concurrently"""
        semaphore = asyncio.Semaphore(concurrent)

        async def make_request():
            async with semaphore:
                start = time.perf_counter()

                try:
                    if method == "GET":
                        response = await self.client.get(url)
                    elif method == "POST":
                        response = await self.client.post(url, json={})
                    else:
                        raise ValueError(f"Unsupported method: {method}")

                    duration_ms = (time.perf_counter() - start) * 1000
                    result.add_result(duration_ms, response.status_code)

                except Exception as e:
                    duration_ms = (time.perf_counter() - start) * 1000
                    result.add_result(duration_ms, 0, str(e))

        tasks = [make_request() for _ in range(num_requests)]
        await asyncio.gather(*tasks)

    async def run_all_benchmarks(
        self,
        endpoints: Optional[Dict[str, Dict]] = None,
        concurrent: int = 1
    ) -> Dict[str, BenchmarkResult]:
        """
        Run benchmarks for all endpoints

        Args:
            endpoints: Endpoint configurations (default: BENCHMARK_ENDPOINTS)
            concurrent: Number of concurrent requests

        Returns:
            Dictionary of benchmark results
        """
        if endpoints is None:
            endpoints = BENCHMARK_ENDPOINTS

        logger.info(f"Running benchmarks for {len(endpoints)} endpoints...")

        for endpoint_name, config in endpoints.items():
            logger.info(f"Benchmarking: {endpoint_name}")
            await self.benchmark_endpoint(endpoint_name, config, concurrent)

        logger.info("All benchmarks completed")
        return self.results

    def print_summary(self):
        """Print benchmark summary"""
        print("\n" + "=" * 80)
        print("BENCHMARK RESULTS SUMMARY")
        print("=" * 80 + "\n")

        for endpoint_name, result in self.results.items():
            print(f"Endpoint: {endpoint_name}")
            print(f"  Requests: {result.total_requests} ({result.successful_requests} successful, {result.failed_requests} failed)")
            print(f"  Error Rate: {result.error_rate:.2f}%")
            print(f"  Response Times:")
            print(f"    Min:     {result.min:.2f}ms")
            print(f"    Average: {result.avg:.2f}ms")
            print(f"    Median:  {result.p50:.2f}ms")
            print(f"    P95:     {result.p95:.2f}ms")
            print(f"    P99:     {result.p99:.2f}ms")
            print(f"    Max:     {result.max:.2f}ms")
            print(f"  RPS: {result.requests_per_second:.2f}")
            print()

    def check_baseline_compliance(self) -> Dict[str, bool]:
        """
        Check if results meet baseline expectations

        Returns:
            Dictionary mapping endpoint names to compliance status
        """
        compliance = {}

        for endpoint_name, result in self.results.items():
            config = BENCHMARK_ENDPOINTS.get(endpoint_name, {})
            expected_p95 = config.get("expected_p95_ms", float("inf"))
            expected_p99 = config.get("expected_p99_ms", float("inf"))

            p95_compliant = result.p95 <= expected_p95
            p99_compliant = result.p99 <= expected_p99

            compliance[endpoint_name] = p95_compliant and p99_compliant

            if not compliance[endpoint_name]:
                logger.warning(
                    f"{endpoint_name} does not meet baseline: "
                    f"p95={result.p95:.2f}ms (expected {expected_p95}ms), "
                    f"p99={result.p99:.2f}ms (expected {expected_p99}ms)"
                )

        return compliance

    def save_results(self, output_file: str):
        """Save benchmark results to file"""
        results_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "base_url": self.base_url,
            "endpoints": {
                name: result.to_dict()
                for name, result in self.results.items()
            }
        }

        with open(output_file, 'w') as f:
            json.dump(results_data, f, indent=2)

        logger.info(f"Results saved to: {output_file}")


# ═══════════════════════════════════════════════════════════════
# BASELINE COMPARISON
# ═══════════════════════════════════════════════════════════════

def compare_to_baseline(
    current_results: Dict[str, BenchmarkResult],
    baseline_file: str,
    threshold_percent: float = 20.0
) -> Tuple[bool, List[str]]:
    """
    Compare current results to baseline

    Args:
        current_results: Current benchmark results
        baseline_file: Path to baseline JSON file
        threshold_percent: Regression threshold percentage

    Returns:
        Tuple of (regression_detected, messages)
    """
    try:
        with open(baseline_file, 'r') as f:
            baseline_data = json.load(f)
    except FileNotFoundError:
        return False, [f"Baseline file not found: {baseline_file}"]

    regression_detected = False
    messages = []

    baseline_endpoints = baseline_data.get("endpoints", {})

    for endpoint_name, current_result in current_results.items():
        if endpoint_name not in baseline_endpoints:
            messages.append(f"⚠️  {endpoint_name}: No baseline data")
            continue

        baseline_endpoint = baseline_endpoints[endpoint_name]
        baseline_p95 = baseline_endpoint["response_times"]["p95_ms"]
        current_p95 = current_result.p95

        # Calculate degradation
        if baseline_p95 > 0:
            degradation = ((current_p95 - baseline_p95) / baseline_p95) * 100
        else:
            degradation = 0

        if current_p95 > baseline_p95 * (1 + threshold_percent / 100):
            regression_detected = True
            messages.append(
                f"⚠️  REGRESSION: {endpoint_name} - "
                f"p95 degraded by {degradation:.1f}% "
                f"(baseline: {baseline_p95:.2f}ms, current: {current_p95:.2f}ms)"
            )
        else:
            messages.append(
                f"✓ {endpoint_name} - Within threshold "
                f"(baseline: {baseline_p95:.2f}ms, current: {current_p95:.2f}ms)"
            )

    return regression_detected, messages


# ═══════════════════════════════════════════════════════════════
# MAIN ENTRY POINT
# ═══════════════════════════════════════════════════════════════

async def main():
    """Main entry point for benchmarking"""
    import argparse

    parser = argparse.ArgumentParser(description="VCSA Benchmark Runner")
    parser.add_argument("--url", default="http://localhost:8000", help="Backend URL")
    parser.add_argument("--output", help="Output JSON file")
    parser.add_argument("--baseline", help="Baseline file to compare against")
    parser.add_argument("--threshold", type=float, default=20.0, help="Regression threshold %")
    parser.add_argument("--concurrent", type=int, default=1, help="Concurrent requests")
    parser.add_argument("--verbose", action="store_true", help="Verbose output")

    args = parser.parse_args()

    if args.verbose:
        logging.basicConfig(level=logging.INFO)

    async with BenchmarkRunner(args.url) as runner:
        # Warm up
        await runner.warm_up()

        # Run benchmarks
        await runner.run_all_benchmarks(concurrent=args.concurrent)

        # Print summary
        runner.print_summary()

        # Check compliance
        compliance = runner.check_baseline_compliance()
        print("\nBaseline Compliance:")
        for endpoint, compliant in compliance.items():
            status = "✓ PASS" if compliant else "✗ FAIL"
            print(f"  {endpoint}: {status}")

        # Compare to baseline if provided
        if args.baseline:
            regression, messages = compare_to_baseline(
                runner.results,
                args.baseline,
                args.threshold
            )

            print("\nBaseline Comparison:")
            for message in messages:
                print(message)

            if regression:
                print("\n⚠️  Performance regression detected!")
        else:
            print("\nNo baseline file provided for comparison")

        # Save results if output specified
        if args.output:
            runner.save_results(args.output)


if __name__ == "__main__":
    asyncio.run(main())
