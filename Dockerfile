FROM node:22-alpine AS base

# ============================================
# Stage 1: Dependencies Installation Stage
# ============================================

FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
COPY prisma ./prisma

RUN npm ci --no-audit --no-fund --no-update-notifier
RUN npx --no-install prisma generate

# ============================================
# Stage 2: DB Migration Stage
# ============================================

FROM deps AS migratedb
CMD ["node", "node_modules/prisma/build/index.js", "migrate", "deploy"]

# ============================================
# Stage 3: Build Next.js application in standalone mode
# ============================================

FROM base AS builder
RUN apk add --no-cache openssl
WORKDIR /app

# Copy project dependencies from dependencies stage
COPY --from=deps /app/node_modules ./node_modules
# Copy application source code
COPY . .

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Prisma-Client generieren und App bauen
# RUN npx prisma generate --no-engine
RUN npm run build

# ============================================
# Stage 3: Run Next.js application
# ============================================

FROM base AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs 
RUN adduser  --system --uid 1001 nextjs

# Copy production assets
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# If you want to persist the fetch cache generated during the build so that
# cached responses are available immediately on startup, uncomment this line:

# COPY --from=builder --chown=node:node /app/.next/cache ./.next/cache

# Switch to non-root user for security best practices
USER nextjs

EXPOSE 3000

# Migrationen ausführen und dann die App starten
CMD ["node", "server.js"]
