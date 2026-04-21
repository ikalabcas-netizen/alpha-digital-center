# Monorepo Dockerfile for apps/id (Ikalab Identity Provider)
# Build context MUST be the monorepo root: `docker build -f apps/id/Dockerfile .`

ARG NODE_VERSION=22-alpine

# ============================================
# Stage 1: Install all workspace dependencies
# ============================================
FROM node:${NODE_VERSION} AS deps
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /repo

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/website/package.json ./apps/website/
COPY apps/isc/package.json ./apps/isc/
COPY apps/id/package.json ./apps/id/
COPY packages/database/package.json ./packages/database/
COPY packages/auth/package.json ./packages/auth/
COPY packages/ui/package.json ./packages/ui/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ============================================
# Stage 2: Build id
# ============================================
FROM node:${NODE_VERSION} AS builder
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /repo

COPY . .

# Re-run pnpm install to rebuild workspace symlinks inside the builder stage.
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN pnpm --filter @ikasys/database generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter id build

# ============================================
# Stage 3: Runner
# ============================================
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /repo/apps/id/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/id/.next/static ./apps/id/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/id/public ./apps/id/public

USER nextjs
EXPOSE 3000

CMD ["node", "apps/id/server.js"]
