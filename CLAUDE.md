# Alpha Digital Center - Marketing System

## Project Overview
Hệ thống web marketing + automation cho Alpha Digital Center (labo nha khoa gia công bán thành phẩm).
Target: Tất cả labo và labo inhouse tại Việt Nam biết đến thương hiệu Alpha Digital Center.

## Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **UI:** ADC Design System (inline styles, KHÔNG dùng Tailwind) — xem `skill/skill.md`
- **Database:** PostgreSQL (standalone) trên Coolify
- **ORM:** Prisma 6
- **Auth:** NextAuth v5 (Google OAuth + Prisma Adapter)
- **API:** tRPC (admin ↔ backend)
- **AI:** Multi-provider — Claude API, Gemini, DeepSeek (xem `src/lib/ai/`)
- **Facebook:** Graph API (Page) + Marketing API (Ads)
- **Deploy:** Coolify trên VPS (Docker, single Next.js container + Postgres)

## Critical Rules

### UI/Styling
- **KHÔNG dùng Tailwind CSS** — dùng inline `style={{}}` props theo ADC Design System
- Brand: **Navy + Gold + Cyan accent** (premium dental lab aesthetic)
- Fonts (qua `next/font/google` trong `src/app/layout.tsx`):
  - `--font-body` Inter · `--font-display` Space Grotesk · `--font-serif` Playfair Display italic · `--font-mono` JetBrains Mono
- Colors chính: navy-900 `#0B1220`, gold `#C9A961`, accent cyan `#06B6D4`, page bg `#FAFBFC`
- Sidebar (admin): linear-gradient(180deg, #0B1220 0%, #122033 100%)
- Tokens: import từ `src/lib/styles.ts` (colors, fonts, radii, shadows)
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
src/app/admin/        → Admin dashboard (protected by NextAuth v5)
src/app/api/          → API routes (tRPC, AI, Facebook, webhooks)
src/components/       → Shared UI components (ResponsiveShell, buttons, cards, etc.)
src/lib/              → Business logic (ai/, facebook/, auth.ts, prisma.ts, styles.ts)
prisma/               → Database schema
docker/               → Dockerfile, .env.example
contex/               → Product data, pricing (bạn bổ sung)
skill/skill.md        → ADC Design System reference
```

## Key Files
- `skill/skill.md` — ADC Design System (fonts, colors, components)
- `src/lib/styles.ts` — Design tokens & shared style objects (navy+gold+cyan)
- `src/app/globals.css` — CSS custom properties + utility classes (.container/.display/.serif/.eyebrow/.grain)
- `src/lib/ai/providers.ts` — AI provider interface
- `src/lib/auth.ts` — NextAuth v5 config (Google OAuth + Prisma Adapter)
- `src/components/layout/ResponsiveShell.tsx` — Admin layout component
- `src/components/layout/PublicLayout.tsx` — Public site layout (TopBar + Header + Footer)
- `src/components/layout/PageHero.tsx` — Shared hero cho public sub-pages
- `prisma/schema.prisma` — Database schema
- `docker/Dockerfile` — Production Docker image (Next.js standalone)

## Deploy
- Coolify trên VPS
- Git push → auto-deploy
- Domain: alphacenter.vn
- SSL: Let's Encrypt (Coolify/Traefik)

## Data Sources
- Excel files trong `D:\aLPHA\` (product pricing, categories)
- `contex/` directory (bổ sung thêm bởi team)
- Migration scripts trong `scripts/`
