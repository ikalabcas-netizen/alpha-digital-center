# Alpha Digital Center - Marketing System

## Project Overview
Hệ thống web marketing + automation cho Alpha Digital Center (labo nha khoa gia công bán thành phẩm).
Target: Tất cả labo và labo inhouse tại Việt Nam biết đến thương hiệu Alpha Digital Center.

## Tech Stack
- **Framework:** Next.js 14 (App Router) + TypeScript
- **UI:** ADC Design System (inline styles, KHÔNG dùng Tailwind) — xem `skill/skill.md`
- **Database:** Supabase self-hosted (PostgreSQL + Auth + Storage) trên Coolify
- **ORM:** Prisma
- **API:** tRPC (admin ↔ backend)
- **AI:** Multi-provider — Claude API, Gemini, DeepSeek (xem `src/lib/ai/`)
- **Facebook:** Graph API (Page) + Marketing API (Ads)
- **Deploy:** Coolify trên VPS (Docker)

## Critical Rules

### UI/Styling
- **KHÔNG dùng Tailwind CSS** — dùng inline `style={{}}` props theo ADC Design System
- Fonts: Inter (body), Montserrat (headers)
- Primary color: #06b6d4 (Cyan 500)
- Page background: #eef2f5
- Sidebar: linear-gradient(180deg, #0B1929 0%, #0F2847 100%)
- Tham khảo chi tiết: `skill/skill.md`

### Coding Standards
- TypeScript strict mode
- Vietnamese cho tất cả UI text (labels, messages, placeholders)
- English cho code (variable names, function names, comments nếu cần)
- Inline styles theo ADC Design — KHÔNG tạo CSS files riêng cho components
- Tất cả pages dùng `ResponsiveShell` layout component

### AI Content Generation
- Interface chung: `AIProvider` trong `src/lib/ai/providers.ts`
- 3 providers: Claude (`claude.ts`), Gemini (`gemini.ts`), DeepSeek (`deepseek.ts`)
- Luôn có human review trước khi publish AI-generated content
- Track cost per generation trong `ai_generations` table

## Project Structure
```
src/app/(public)/     → Public marketing website (SSR, SEO)
src/app/admin/        → Admin dashboard (protected by Supabase Auth)
src/app/api/          → API routes (tRPC, AI, Facebook, webhooks)
src/components/       → Shared UI components (ResponsiveShell, buttons, cards, etc.)
src/lib/              → Business logic (ai/, supabase/, facebook/, styles.ts)
prisma/               → Database schema
docker/               → Dockerfile, docker-compose.yml
contex/               → Product data, pricing (bạn bổ sung)
skill/skill.md        → ADC Design System reference
```

## Key Files
- `skill/skill.md` — ADC Design System (fonts, colors, components)
- `src/lib/styles.ts` — Design tokens & shared style objects
- `src/lib/ai/providers.ts` — AI provider interface
- `src/components/layout/ResponsiveShell.tsx` — Main layout component
- `prisma/schema.prisma` — Database schema
- `docker/Dockerfile` — Production Docker image
- `docker/docker-compose.yml` — Supabase self-hosted stack

## Deploy
- Coolify trên VPS
- Git push → auto-deploy
- Domain: alphacenter.vn
- SSL: Let's Encrypt (Coolify/Traefik)
- Supabase Studio: sub-domain hoặc sub-path

## Data Sources
- Excel files trong `D:\aLPHA\` (product pricing, categories)
- `contex/` directory (bổ sung thêm bởi team)
- Migration scripts trong `scripts/`
