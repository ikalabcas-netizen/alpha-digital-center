# syntax=docker/dockerfile:1.7
# Monorepo Dockerfile for apps/id (Alpha Digital Center Identity Provider)
# Build context MUST be the monorepo root: `docker build -f apps/id/Dockerfile .`

ARG NODE_VERSION=20-alpine

# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: deps — pnpm workspace install (only manifests, maximises cache)
# ─────────────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS deps
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /repo

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./
COPY apps/id/package.json       ./apps/id/package.json
COPY apps/website/package.json  ./apps/website/package.json
COPY packages/auth/package.json ./packages/auth/package.json
COPY packages/database/package.json ./packages/database/package.json

RUN pnpm install --frozen-lockfile --ignore-scripts

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: builder — copy source, generate Prisma, build Next
# ─────────────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS builder
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /repo

COPY --from=deps /repo ./
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build-time placeholder so `prisma generate` doesn't error on missing URL.
# Real DATABASE_URL is injected at runtime via Coolify env.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

RUN pnpm --filter @adc/database exec prisma generate
RUN pnpm --filter id build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3: runner — slim image, non-root user
# ─────────────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Next.js standalone output already bundles workspace packages via
# outputFileTracingRoot; copy the minimal runtime slice.
COPY --from=builder --chown=nextjs:nodejs /repo/apps/id/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/id/.next/static ./apps/id/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/id/public ./apps/id/public

USER nextjs
EXPOSE 4000

CMD ["node", "apps/id/server.js"]
