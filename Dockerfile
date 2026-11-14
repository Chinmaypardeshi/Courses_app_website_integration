# Multi-stage Dockerfile: Builds Web Frontend and runs Unified Backend
FROM node:20-alpine AS web-builder

WORKDIR /app/web

# Install web dependencies and build
COPY web/package*.json ./
RUN npm install
COPY web/ .
RUN npm run build

# Runner stage: Node.js Express backend + static web files
FROM node:20-alpine AS runner

WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy backend source
COPY backend/ .

# Copy built React frontend to public/
COPY --from=web-builder /app/web/dist ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "src/server.js"]
