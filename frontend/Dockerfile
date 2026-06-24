# Stage 1: Gather assets
FROM node:20-alpine AS builder
WORKDIR /app
COPY public/ ./public

# Stage 2: Nginx production runner
FROM nginx:1.25-alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=builder /app/public /usr/share/nginx/html

# Setup entrypoint script for environment substitution
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
