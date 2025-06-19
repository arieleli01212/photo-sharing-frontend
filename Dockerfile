
### build stage ###
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build       # → /app/build

### copy-to-volume stage ###
FROM alpine:3.19
COPY --from=builder /app/build /usr/share/nginx/html