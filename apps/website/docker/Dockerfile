# syntax=docker/dockerfile:1.7
# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: deps — pnpm workspace install
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /repo

# Chỉ copy manifest để cache layer install
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./
COPY apps/website/package.json ./apps/website/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/auth/package.json ./packages/auth/package.json

RUN pnpm install --frozen-lockfile --ignore-scripts

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: builder — copy source, generate Prisma, build Next
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /repo

COPY --from=deps /repo ./
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Prisma client phải generate sau khi copy schema
RUN pnpm --filter @adc/database exec prisma generate

# Build qua turbo để chạy đúng deps topo (database → auth → website)
RUN pnpm --filter website build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3: runner — slim image
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# psql client để chạy migrations-manual/*.sql ở startup (idempotent)
RUN apk add --no-cache postgresql-client

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Next.js standalone output (đã bundle deps + workspace packages nhờ outputFileTracingRoot)
COPY --from=builder --chown=nextjs:nodejs /repo/apps/website/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/website/.next/static ./apps/website/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/website/public ./apps/website/public

# Prisma schema + init.sql + init-db.js + boot.sh (cho startup migration idempotent).
# Standalone output đã bundle Prisma client engine trong node_modules/.pnpm — chỉ cần copy schema + scripts.
COPY --from=builder --chown=nextjs:nodejs /repo/packages/database/prisma ./packages/database/prisma
COPY --from=builder --chown=nextjs:nodejs /repo/packages/database/migrations-manual ./packages/database/migrations-manual
COPY --from=builder --chown=nextjs:nodejs /repo/apps/website/scripts ./apps/website/scripts

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Startup: chạy migrations → init baseline → start server (xem boot.sh)
CMD ["sh", "apps/website/scripts/boot.sh"]
