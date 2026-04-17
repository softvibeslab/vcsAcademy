# Frontend Monitoring

## Sentry Integration

The VCSA frontend uses Sentry for error tracking and performance monitoring.

## Status

✅ **Sentry SDK** - Configured in `src/sentry.js`
✅ **React Integration** - Automatic error capturing
✅ **Environment Variables** - Configured in `.env.example`
✅ **Error Filtering** - Sensitive data filtered out

## Configuration

```bash
# .env
REACT_APP_SENTRY_DSN=https://your-dsn@sentry.io/project-id
REACT_APP_SENTRY_ENVIRONMENT=development
REACT_APP_SENTRY_TRACES_SAMPLE_RATE=0.1
```

## Usage

### Initialize Sentry

```javascript
import { initSentry } from './sentry';

// On app load
initSentry();
```

### Capture Exceptions

```javascript
import { captureException } from './sentry';

try {
  riskyOperation();
} catch (error) {
  captureException(error);
}
```

### Set User Context

```javascript
import { setSentryUser } from './sentry';

// After login
setSentryUser({
  id: user.user_id,
  email: user.email,
  username: user.name
});
```

### Clear User Context

```javascript
import { clearSentryUser } from './sentry';

// After logout
clearSentryUser();
```

### Add Breadcrumbs

```javascript
import { addBreadcrumb } from './sentry';

addBreadcrumb({
  message: 'User clicked purchase',
  category: 'user',
  level: 'info'
});
```

## Features

- ✅ Automatic error capturing
- ✅ Performance monitoring (tracing)
- ✅ Session replay (on error)
- ✅ User context tracking
- ✅ Breadcrumb trails
- ✅ Error filtering (404s, CORS, chunk loading)
- ✅ Sensitive data masking
- ✅ React error boundary

## React Error Boundary

Wrap components to capture React errors:

```javascript
import { SentryErrorBoundary } from './sentry';

<SentryErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</SentryErrorBoundary>
```

## Performance Monitoring

Sentry automatically tracks:

- Page load times
- Route transitions
- Component render times
- API call durations
- User interactions

View in Sentry > Performance

## Session Replay

- **Normal sessions**: 10% sampled
- **Error sessions**: 100% recorded
- **Privacy**: All text masked, media blocked

## Environment-Specific Settings

### Development
- Debug mode enabled
- All events sent
- Full replay

### Staging
- Debug mode disabled
- Sampling rate: 10%
- Replay enabled

### Production
- Debug mode disabled
- Sampling rate: 1-5%
- Replay on error only

## Troubleshooting

### Events Not Appearing

1. Check DSN is correct
2. Check browser console for errors
3. Verify environment variables
4. Check network connectivity

### Too Many Events

1. Reduce sampling rate
2. Add more filters in `eventFilter`
3. Use event frequency limits

### Performance Issues

1. Disable tracing
2. Reduce sampling rate
3. Disable session replay

---

**Last Updated**: March 16, 2026
