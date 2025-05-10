# ---------- build stage ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    COPY frontend/package*.json ./
    RUN npm ci
    COPY frontend ./
    RUN npm run build       # creates /app/build
    
    # ---------- runtime stage ----------
    FROM nginx:1.25-alpine
    COPY --from=builder /app/build /usr/share/nginx/html
    # Remove default conf & drop in minimal gzip/open_file_cache etc. if you like
    CMD ["nginx", "-g", "daemon off;"]
    