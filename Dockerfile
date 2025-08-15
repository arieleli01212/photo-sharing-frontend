# ---------- build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code and environment
COPY . ./

# Use Docker environment configuration
COPY .env.docker .env

# Build the application
RUN npm run build

# ---------- runtime stage ----------
FROM nginx:1.25-alpine
COPY --from=builder /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
    