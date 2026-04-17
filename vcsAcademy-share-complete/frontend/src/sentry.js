/**
 * Sentry Configuration for VCSA Frontend
 * Error tracking and performance monitoring
 *
 * Note: Sentry is optional. If not configured, the app will work without it.
 */

// Sentry DSN from environment variable
const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.REACT_APP_SENTRY_ENVIRONMENT || 'development';
const SENTRY_TRACES_SAMPLE_RATE = parseFloat(process.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE || '0.1');

// Lazy load Sentry to avoid build errors
let Sentry = null;
let BrowserTracing = null;

/**
 * Initialize Sentry SDK
 * @returns {Promise<boolean>} True if Sentry was initialized
 */
export const initSentry = async () => {
  // Skip initialization if DSN is not configured
  if (!SENTRY_DSN || SENTRY_DSN === 'https://your-sentry-dsn@sentry.io/project-id') {
    console.info('Sentry DSN not configured - Running without error tracking');
    return false;
  }

  try {
    // Dynamic import to avoid build errors
    const sentryModule = await import('@sentry/react');
    Sentry = sentryModule.default || sentryModule;

    // Try to load tracing module
    try {
      const tracingModule = await import('@sentry/tracing');
      BrowserTracing = tracingModule.BrowserTracing;
    } catch (e) {
      console.warn('Sentry tracing not available:', e.message);
    }

    // Basic Sentry initialization
    const initConfig = {
      dsn: SENTRY_DSN,
      environment: SENTRY_ENVIRONMENT,
      tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
      beforeSend: eventFilter,
      attachStacktrace: true,
      stacktraceLimit: 50,
      debug: SENTRY_ENVIRONMENT === 'development',
      sendDefaultPii: false,
      normalizeDepth: 10,
      maxBreadcrumbs: 100,
      initialScope: {
        tags: {
          app: 'vcsa-frontend',
          service: 'web-app',
        },
      },
    };

    // Add integrations if available
    if (BrowserTracing) {
      initConfig.integrations = [new BrowserTracing()];
    }

    Sentry.init(initConfig);

    console.info(`Sentry initialized (environment: ${SENTRY_ENVIRONMENT})`);
    return true;

  } catch (error) {
    console.error('Failed to initialize Sentry:', error.message);
    // Don't throw - app should work without Sentry
    return false;
  }
};

/**
 * Filter events before sending to Sentry
 */
const eventFilter = (event) => {
  // Filter out specific error types
  if (event.exception?.values) {
    for (const exception of event.exception.values) {
      if (exception.value) {
        const message = exception.value;

        // Filter out 404 errors
        if (message.includes('404')) return null;

        // Filter out CORS errors
        if (message.includes('CORS')) return null;

        // Filter out chunk loading errors
        if (message.includes('Loading chunk')) return null;
      }
    }
  }

  // Remove sensitive data from request
  if (event.request?.headers) {
    const sensitiveHeaders = ['authorization', 'cookie', 'set-cookie', 'x-api-key'];
    event.request.headers = Object.fromEntries(
      Object.entries(event.request.headers)
        .filter(([key]) => !sensitiveHeaders.includes(key.toLowerCase()))
    );
  }

  // Add custom tags
  event.tags = {
    ...event.tags,
    app: 'vcsa-frontend',
    service: 'web-app',
  };

  return event;
};

/**
 * Capture an exception (safe version)
 */
export const captureException = (exception, context = {}) => {
  try {
    if (Sentry && Sentry.captureException) {
      Sentry.captureException(exception, { captureContext: context });
    } else {
      console.error('Exception:', exception);
    }
  } catch (error) {
    console.error('Failed to capture exception:', error);
  }
};

/**
 * Capture a message (safe version)
 */
export const captureMessage = (message, level = 'info', context = {}) => {
  try {
    if (Sentry && Sentry.captureMessage) {
      Sentry.captureMessage(message, { level, captureContext: context });
    } else {
      console.log(`[${level}]`, message);
    }
  } catch (error) {
    console.error('Failed to capture message:', error);
  }
};

/**
 * Set user context (safe version)
 */
export const setSentryUser = (user) => {
  try {
    if (Sentry && Sentry.setUser) {
      Sentry.setUser(user);
    }
  } catch (error) {
    console.error('Failed to set user in Sentry:', error);
  }
};

/**
 * Clear user context (safe version)
 */
export const clearSentryUser = () => {
  try {
    if (Sentry && Sentry.setUser) {
      Sentry.setUser(null);
    }
  } catch (error) {
    console.error('Failed to clear user in Sentry:', error);
  }
};

/**
 * Add breadcrumb (safe version)
 */
export const addBreadcrumb = ({ message, category = 'default', level = 'info', data = {} }) => {
  try {
    if (Sentry && Sentry.addBreadcrumb) {
      Sentry.addBreadcrumb({ message, category, level, data });
    }
  } catch (error) {
    console.error('Failed to add breadcrumb in Sentry:', error);
  }
};

/**
 * Get Sentry status (safe version)
 */
export const getSentryStatus = () => {
  try {
    if (!Sentry) {
      return {
        initialized: false,
        message: 'Sentry not available',
      };
    }

    const client = Sentry.Hub?.current?.getClient?.();

    if (!client) {
      return {
        initialized: false,
        message: 'Sentry client not initialized',
      };
    }

    return {
      initialized: true,
      dsn: client.getDsn(),
      environment: client.getOptions().environment,
      tracesSampleRate: client.getOptions().tracesSampleRate,
    };
  } catch (error) {
    return {
      initialized: false,
      message: 'Unable to get Sentry status',
    };
  }
};

// Export empty components if Sentry is not available
export const SentryErrorBoundary = Sentry?.withErrorBoundary || (({ children }) => children);
export const withSentryProfiling = Sentry?.withProfiler || ((Component) => Component);
export const withSentryRouting = Sentry?.withSentryReactRouterV6Routing || ((Component) => Component);
