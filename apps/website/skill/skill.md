---
name: ADC Marketing - Design System
description: >
  Design language cho ADC Marketing (alphacenter.vn). Brand: Navy + Gold + Cyan accent,
  typography phong phú, premium dental lab aesthetic. Luôn gọi skill này khi thiết kế
  hoặc chỉnh sửa UI để đảm bảo nhất quán public + admin.
---

# ADC Marketing Design System

Brand identity: **navy premium + gold heritage + cyan informational accent**, typography editorial (display + serif italic + mono eyebrows), grain texture tinh tế. Inspired by Claude Design.

## 1. Nguyên tắc chung

- **KHÔNG dùng Tailwind** — dùng inline `style={{}}` props.
- Import tokens từ `@/lib/styles` (`colors`, `fonts`, `radii`, `shadows`, `transitions`) hoặc dùng CSS vars từ `globals.css`.
- UI text tiếng Việt, code tiếng Anh.
- Tất cả public pages wrap bởi `PublicLayout` (đã có TopBar + Header + Footer).
- Admin pages wrap bởi `ResponsiveShell` (sidebar navy gradient).

### ⚠️ Color Contrast — bắt buộc

- Nền tối (navy) → chữ trắng hoặc `rgba(255,255,255,0.65–0.72)` cho secondary.
- Nền sáng (`#FAFBFC` / white) → chữ `--ink-900 #0E1726` hoặc `--ink-700 #334155`.
- Gold `#C9A961` là accent brand, **không** dùng cho long-form text (contrast thấp).
- Cyan `#06B6D4` là informational/active state, không dùng cho primary brand action.

---

## 2. Color tokens

### Brand — Navy + Gold

```
navy-950: #050B15   navy-900: #0B1220   navy-800: #122033   navy-700: #1A2D47
gold:     #C9A961   gold-light: #E3CC8F  gold-dark: #9B7F3E
```

### Accent — Cyan (informational)

```
accent:     #06B6D4   accent-600: #0891B2   accent-300: #67E8F9   accent-50: #ECFEFF
```

### Ink (text)

```
ink-900: #0E1726  ink-700: #334155  ink-500: #64748B  ink-400: #94A3B8  ink-300: #CBD5E1
```

### Surfaces

```
bg:        #FAFBFC   (default page)
bg-warm:   #F6F4EE   (testimonials, soft sections)
card:      #ffffff
line:      #E5E9F0   line-soft: #F1F4F8

sidebar (admin): linear-gradient(180deg, #0B1220, #122033)
```

---

## 3. Typography

Fonts load qua `next/font` trong `src/app/layout.tsx`:

```
--font-body:    Inter          — body, UI text
--font-display: Space Grotesk  — headings, wordmarks, stat numbers
--font-serif:   Playfair Display italic — editorial emphasis spans
--font-mono:    JetBrains Mono — eyebrows, captions, labels
```

Dùng qua `className`:
- `.display` — display font, letter-spacing tight, line-height 1.1
- `.serif` — Playfair italic cho highlight word/phrase
- `.mono` — JetBrains Mono
- `.eyebrow` — mono 11px uppercase tracking 0.2em, color `--ink-500`

Pattern heading editorial:
```tsx
<h2 className="display" style={{ fontSize: 'clamp(30px, 3.5vw, 46px)' }}>
  Máy móc hàng đầu, <span className="serif" style={{ color: 'var(--ink-500)' }}>độ chính xác tuyệt đối.</span>
</h2>
```

---

## 4. Buttons — 4 variants

Import từ `@/lib/styles`:

| Variant | Khi nào dùng | Source |
|---|---|---|
| `primaryButton` | Brand action (Gold gradient) — "Khám phá", "Báo giá", "Đặt hàng" | `colors.gold → goldDark` |
| `accentButton` | Informational CTA (Cyan gradient) — "Xem sản phẩm", "Đọc thêm" | `colors.accent → accent600` |
| `navyButton` | Dark CTA solid (inverted) — on light bg, ghost of hero | `colors.navy900` |
| `ghostButton` | Secondary — "Kiểm tra BH", "Liên hệ" | `transparent + border` |

Trong public pages nhiều khi dùng pill shape `borderRadius: 999, padding: '12px 22px'` inline. Headers dùng pill 999; admin giữ `radii.md = 10px` vuông cho consistency dashboard.

---

## 5. Common patterns

### Eyebrow + underline
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
  <span style={{ width: 28, height: 1, background: 'var(--gold)' }} />
  <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>Công nghệ · Technology</span>
</div>
```

### Grain texture
Thêm `className="grain"` lên section có navy bg — CSS utility sẽ overlay noise SVG opacity 0.04.

### Card
```tsx
<article className="card" style={{ padding: 0, overflow: 'hidden' }}>
  {/* image + content */}
</article>
```
`.card` chưa có trong globals.css — inline: `{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16 }`.

### Dark hero (sub-pages)
Dùng `<PageHero eyebrow title serif tail subtitle image />` từ `@/components/layout/PageHero`.

---

## 6. Responsive

Breakpoints chuẩn (inline `<style>` trong component):
- `@media (max-width: 980px)` — hide desktop nav, show mobile menu
- `@media (max-width: 900px)` — grids → 1 cột hoặc 2 cột
- `@media (max-width: 560px)` — all grids → 1 cột

Container max-width 1240px, padding ngang 32px.

---

## 7. Files quan trọng

- `src/lib/styles.ts` — tokens + shared style objects (source of truth)
- `src/app/globals.css` — CSS custom properties + `.container/.display/.serif/.mono/.eyebrow/.grain` utilities
- `src/app/layout.tsx` — fonts qua `next/font/google`
- `src/components/layout/Logo.tsx` — brand mark SVG + wordmark "alpha."
- `src/components/layout/PublicLayout.tsx` — TopBar + Header + Footer composer
- `src/components/layout/PageHero.tsx` — shared hero cho sub-pages
- `src/components/layout/publicNav.ts` — nav items (plain module, không `'use client'`)

Khi tạo page mới: copy pattern từ 7 public pages hiện có (`src/app/(public)/*/page.tsx`).
