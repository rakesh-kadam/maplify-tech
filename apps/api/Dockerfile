# Build stage
FROM node:25-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./

# Copy package.json files for all workspaces
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies for all workspaces
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared
COPY turbo.json ./

# Build shared package first
WORKDIR /app/packages/shared
RUN pnpm run build

# Generate Prisma client and build API
WORKDIR /app/apps/api
RUN pnpm run prisma:generate
RUN pnpm run build

# Production stage
FROM node:25-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Copy package files for api and shared
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/shared/package.json ./packages/shared/

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy shared package dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

# Copy Prisma schema
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

WORKDIR /app/apps/api

# Generate Prisma client in production
RUN npx --yes prisma@5.22.0 generate

# Copy built files
COPY --from=builder /app/apps/api/dist ./dist

# Copy entrypoint script
COPY apps/api/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8787/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

EXPOSE 8787

ENTRYPOINT ["./docker-entrypoint.sh"]
