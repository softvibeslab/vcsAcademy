# Multi-stage build for VCSA Frontend (React)
# Stage 1: Builder
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with fallback for missing packages
RUN npm install --legacy-peer-deps --ignore-scripts || \
    npm install --legacy-peer-deps --ignore-scripts --force

# Fix ajv dependency issues
RUN npm install ajv@^8.0.0 ajv-keywords@^5.0.0 --legacy-peer-deps

# Install correct Sentry packages
RUN npm install @sentry/react @sentry/tracing --legacy-peer-deps

# Copy source code
COPY . .

# Build arguments for environment variables
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}

# Build the application with fallback
RUN npm run build || \
    (npm install --legacy-peer-deps --force && npm run build)

# Stage 2: Runtime with nginx
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 1001 -S nginx-app && \
    adduser -S -D -H -u 1001 -h /usr/share/nginx/html -s /sbin/nologin -G nginx-app -g nginx-app nginx-app && \
    chown -R nginx-app:nginx-app /usr/share/nginx/html && \
    chown -R nginx-app:nginx-app /var/cache/nginx && \
    chown -R nginx-app:nginx-app /var/log/nginx && \
    chown -R nginx-app:nginx-app /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx-app:nginx-app /var/run/nginx.pid

# Switch to non-root user
USER nginx-app

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Start nginx (nginx will run as background due to daemon off; in nginx.conf)
CMD ["nginx", "-g", "daemon off;"]
