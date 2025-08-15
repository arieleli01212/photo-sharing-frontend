# ---------- build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Set build arguments for environment variables
ARG REACT_APP_API_URL=http://localhost/api
ARG REACT_APP_WS_URL=localhost
ARG REACT_APP_GOOGLE_CLIENT_ID
ARG REACT_APP_ENV=docker

# Set environment variables from build args
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_WS_URL=$REACT_APP_WS_URL
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_ENV=$REACT_APP_ENV

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . ./

# Build the application with environment variables
RUN npm run build

# ---------- runtime stage ----------
FROM nginx:1.25-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built application
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
    