# Production Dockerfile for Unified UPSC EdTech Backend (Root Context)
FROM node:20-alpine AS runner

WORKDIR /app

# Copy backend dependency files
COPY backend/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy backend source files
COPY backend/ .

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "src/server.js"]
