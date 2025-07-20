# ProxaPeople Production Dockerfile
# Multi-stage build for optimized image size and security

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev deps for build)
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application
ENV NODE_ENV=production
RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy necessary files from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/shared ./shared
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Install only production dependencies
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev && \
    npm cache clean --force

# Set environment
ENV NODE_ENV=production \
    PORT=8080 \
    NODE_OPTIONS="--enable-source-maps --max-old-space-size=1024"

# Security: Drop all capabilities
USER nodejs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]

# Build arguments for versioning
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

# Labels for metadata
LABEL org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.url="https://github.com/proxapeople/proxapeople" \
      org.opencontainers.image.source="https://github.com/proxapeople/proxapeople" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.vendor="ProxaPeople" \
      org.opencontainers.image.title="ProxaPeople HR Platform" \
      org.opencontainers.image.description="Enterprise HR management platform" \
      org.opencontainers.image.licenses="MIT"