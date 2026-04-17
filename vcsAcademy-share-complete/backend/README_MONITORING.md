# Backend Monitoring

## Sentry Integration

The VCSA backend uses Sentry for error tracking and performance monitoring.

## Status

✅ **Sentry SDK** - Configured in `sentry_config.py`
✅ **FastAPI Integration** - Automatic error capturing
✅ **Environment Variables** - Configured in `.env.example`
✅ **Error Filtering** - Sensitive data filtered out

## Configuration

```bash
# .env
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1
```

## Usage

### Initialize Sentry

```python
from sentry_config import init_sentry

init_sentry(
    dsn=os.environ.get('SENTRY_DSN'),
    environment='development',
    traces_sample_rate=0.1
)
```

### Capture Exceptions

```python
from sentry_config import capture_exception

try:
    risky_operation()
except Exception as e:
    capture_exception(e)
    raise
```

### Set User Context

```python
from sentry_config import set_user

# After login
set_user(user_id=str(user.id), email=user.email, username=user.name)
```

### Add Breadcrumbs

```python
from sentry_config import add_breadcrumb

add_breadcrumb(
    message="User completed purchase",
    category="user",
    level="info"
)
```

## Features

- ✅ Automatic error capturing
- ✅ Performance monitoring (tracing)
- ✅ Request/response logging
- ✅ User context tracking
- ✅ Breadcrumb trails
- ✅ Error filtering (404s, CORS)
- ✅ Sensitive data masking

## Environment-Specific Settings

### Development
- Debug mode enabled
- Full stack traces
- All events sent

### Staging
- Debug mode disabled
- Sampling rate: 10%
- Performance monitoring enabled

### Production
- Debug mode disabled
- Sampling rate: 1-5%
- Performance monitoring enabled
- Session replay disabled

## Troubleshooting

### Events Not Appearing

1. Check DSN is correct
2. Check network connectivity
3. Enable debug mode
4. Check Sentry dashboard

### Too Many Events

1. Reduce sampling rate
2. Add more filters
3. Use event frequency limits

### Performance Issues

1. Disable tracing
2. Reduce sampling rate
3. Disable profiling

---

**Last Updated**: March 16, 2026
