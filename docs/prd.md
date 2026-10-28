# veek.me 2026 — Product Requirements Document

| | |
|---|---|
| **Owner** | Lucky Victory Success (Veek / CodewithVeek) |
| **Status** | Live on veek.me since 2026-10-28 (M6 cutover). M5 partly done; open items in §14 |
| **Last updated** | 2026-10-22 |
| **Repo** | `codewithveek/portfolio-2026` |
| **Replaces** | `codewithveek/my-portfolio` (v5, Next.js on Vercel) |

This document is the source of truth for the rebuild. If code and this document disagree, update one of them in the same pull request. Section numbers are stable; refer to them in commits and PRs (for example `PRD §6.4`).

---

## 1. Why we are rebuilding

The current site (v5) has four problems that cost interviews:

1. **It serves an empty page.** `BrutalAppShell` renders only a loader for the first 1.7 s, and every section is a client component that starts hidden. The HTML a crawler, a link preview or a slow phone receives contains "Initializing… PLEASE WAIT" and nothing else.
2. **The best work is missing.** The three listed projects are a client real-estate site, FluxMedia and an archived SDK repo. Zia, the Afriex developer ecosystem, DriftWatch, Cutroom and the Nippyy backend are absent.
3. **There is no writing section.** Lucky has 30+ technical articles on DEV, about half of them on Afriex's DEV organization. That is the strongest DevRel evidence he has, and the site does not show it.
4. **Nothing asks for the hire.** No "open to roles" signal, no résumé, no experience timeline, and the only call to action is a form at the bottom.

## 2. Goals, non-goals and success measures

### 2.1 Goals

- **G1. Get Lucky hired** into a backend, full-stack, frontend or DevRel role. Every design decision is judged against this.
- **G2. Pass the 30-second scan.** A recruiter who lands on the page learns name, role, what he builds, proof, and how to reach him without scrolling past the second screen.
- **G3. Reward the deep read.** A hiring manager can open a case study and find the problem, the architecture, the trade-offs and real results.
- **G4. Feel premium.** Smooth, cinematic motion in the spirit of bmwf3.com (analysis in §15), without the friction that site can afford and a portfolio cannot.
- **G5. Be the proof.** The site itself is production-grade: server-rendered, fast, accessible, typed, tested, deployed on Cloudflare Workers.

### 2.2 Non-goals (v1)

- A CMS. Content lives in the repo as MDX and typed TypeScript.
- A blog engine. Articles stay on DEV; the site links out.
- Live 3D / WebGL. Depth comes from SVG line art, pre-rendered video and layered parallax (§7.6).
- Sending email to arbitrary recipients (auto-replies to visitors). See §9.4.
- Internationalisation, comments, newsletter.

### 2.3 Success measures

| Measure | Target | How |
|---|---|---|
| Hero CTA click-through ("See my work", "Hire me", "Résumé") | ≥ 15 % of sessions | Analytics Engine events (§9.7) |
| Case study opens | ≥ 25 % of sessions | `case_study_view` event |
| Contact form submissions and email clicks | Tracked weekly; no target until baseline exists | `contact_submit`, `cta_click{id:"email"}` |
| Largest Contentful Paint (mobile, 4G, p75) | < 2.0 s | Cloudflare Web Analytics, Lighthouse CI |
| Cumulative Layout Shift | < 0.05 | same |
| Interaction to Next Paint | < 200 ms | same |
| Accessibility | 0 serious/critical axe violations; Lighthouse a11y ≥ 95 | Playwright + axe in CI |
| HTML without JavaScript | Every section's text present | Playwright test with JS disabled (§12.3) |

## 3. Audience

| Visitor | Time on site | What they need | Where they get it |
|---|---|---|---|
| Recruiter / talent partner | 30–60 s | Role fit, location/timezone, seniority signals, résumé, contact | Hero, proof strip, dock nav, résumé links |
| Hiring manager / senior engineer | 3–10 min | How he thinks: architecture, trade-offs, code quality | Case studies, GitHub links, writing |
| DevRel lead | 3–10 min | Can he teach, write, build community and SDKs | Afriex ecosystem case study, writing section, Scrimba proof, voice note |
| Founder (contract work) | 1–3 min | Can he ship a whole product | Zia case study, testimonials |

Location line used everywhere: **Lagos, Nigeria · WAT (UTC+1) · open to remote and relocation**. UTC+1 overlaps the full European working day and US East Coast mornings; say so in the About copy.

## 4. Positioning and core copy

Use this copy as the starting point. Plain, direct sentences; no buzzwords.

- **Name (hero display):** LUCKY VICTORY
- **Hero label (mono):** ● OPEN TO ROLES · LAGOS · WAT (UTC+1)
- **Hero sentence:** Backend & full-stack engineer building payment systems, AI agent tooling and developer tools — and writing about all three.
- **Primary CTA:** See my work → (scrolls to `#work`)
- **Secondary CTA:** Résumé (opens a two-item menu: Backend / Frontend PDFs, in `public/resume/`)
- **Top-right and dock CTA:** Hire me → (scrolls to `#contact`)
- **Positioning sequence (§6.3):** "I build software that…" → *moves money* · *watches agents* · *ships to customers* · *explains itself*
- **Closing headline:** LET'S BUILD WHAT'S NEXT

Title tag: `Lucky Victory — Backend & Full-Stack Engineer`. Meta description: `Lucky Victory (Veek) builds payment systems, AI agent tooling and developer tools. Open to backend, full-stack and DevRel roles. Lagos, UTC+1, remote.`

## 5. Information architecture

| Route | Purpose | Rendering |
|---|---|---|
| `/` | Home, the conversion page (§6) | SSR + edge cache (§9.2) |
| `/work/:slug` | Case study (§6.10) | SSR + edge cache |
| `/writing` | All articles: featured first, then the DEV feed, filterable by topic | SSR + edge cache |
| `/resume/lucky-victory-backend-engineer.pdf`, `/resume/lucky-victory-frontend-engineer.pdf` | Static PDFs | Static asset |
| `/api/contact` | Contact form action (POST only) | Worker, never cached |
| `/api/events` | Analytics beacon (POST only) | Worker, never cached |
| `/sitemap.xml`, `/robots.txt` | SEO | Generated at build |
| `*` | 404 page in the site's style with links home and to `/writing` | SSR |

`www.veek.me` redirects (301) to `veek.me`. No trailing slashes.

## 6. Page specifications

The home page has eight sections (§6.2–§6.9) plus the global chrome (§6.1). Its total length should be **8–10 viewport heights** on a 1440×900 desktop, excluding the pinned positioning section (§6.3), which adds about 2 viewports of scroll distance. Depth moves to case-study pages.

Numbered kickers, in page order: `01 · SELECTED WORK`, `02 · ABOUT`, `03 · KIND WORDS`, `04 · WRITING`, `05 · CONTACT`.

Each section below lists **layout**, **content** and **motion**. Motion names refer to the patterns defined in §8.

### 6.1 Global chrome

- **Top bar** (inside the hero, not fixed): `VEEK` wordmark left; `Hire me →` outline button right.
- **Dock nav** (fixed, bottom centre, appears once the hero leaves the viewport): `Work · Writing · About · Contact` plus a lime `Hire me` pill and a résumé icon button. Shows the active section. On mobile it becomes a compact bar with `Work · Writing · Hire me`. Motion: `dock-enter`, `active-indicator`.
- **Scroll progress line:** 2 px line along the top edge, lime, `scaleX` bound to page scroll. Motion: `progress-line`.
- **Skip link:** "Skip to content", first focusable element.
- **No loader, no intro gate.**

### 6.2 Hero (`#home`)

**Layout (desktop ≥ 1024 px):** full-viewport (`min-height: 100svh`), black. Copy column on the left (columns 1–6 of 12). The portrait fills the right half full-bleed, bottom-anchored, extending under the copy column and fading to black toward the left and bottom so the text always sits on near-black. A faint 96 px grid covers the background. A lime orbit motif (§7.6) sits behind the portrait at 25–35 % opacity. Bottom-left: mono `SCROLL ↓`.

**Layout (mobile < 768 px):** portrait on top (55 svh, cropped head-and-shoulders, fading into black at the bottom), copy below it. CTAs stack full-width.

**Content:** label, name, sentence and CTAs from §4.

**Motion:** `hero-intro` (CSS-only, runs once on load), `portrait-parallax`, `orbit-drift`. The hero must look complete with JavaScript disabled.

Reference: `docs/design/hero-mock.png` (rough mock with the real graded portrait from §7.5; the font is a placeholder, so use §7.2).

### 6.3 Positioning (`#positioning`)

**Layout:** a pinned section. Outer height 300 vh; inner `position: sticky; top: 0; height: 100svh`. Centred: mono kicker `I BUILD SOFTWARE THAT…`, one large display line beneath it, a row of four progress ticks, and a one-line proof caption under the word. The orbit motif fills the background and rotates with scroll.

**Content:**

| Word | Proof caption |
|---|---|
| MOVES MONEY | Fintech backends, NIBSS-compliant rails, and the official Afriex TypeScript SDK. |
| WATCHES AGENTS | DriftWatch traces agent behaviour as OpenTelemetry; Vetit reviews MCP servers before agents use them. |
| SHIPS TO CUSTOMERS | Zia: inventory forecasting and reordering for Shopify merchants, built and run end to end. |
| EXPLAINS ITSELF | 30+ technical articles, SDK docs, and Cutroom, which turns a codebase into launch videos. |

**Motion:** `pinned-word-swap`, `orbit-rotate`. With reduced motion or no JS, render all four word/caption pairs as a static stacked list (no pinning).

### 6.4 Proof strip

**Layout:** one row of 4 stat blocks under a hairline border (2×2 on mobile). Mono label above, display number below.

**Content (each must be true and sourced; see §10.5):**

- `ARTICLES PUBLISHED` → count from the DEV feed at build time (currently 30+ technical, excluding non-technical posts).
- `NPM PACKAGES MAINTAINED` → count from `content/proof.ts` (currently `@afriex/sdk`, `medusa-payment-afriex`, `@driftwatch/sdk`, `cutroom`, `@fluxmedia/core`, `@hymem/core`).
- `HACKATHON WINS` → the number from a list Lucky supplies (§14). Hover/tap reveals the list.
- `SCRIMBA COMMUNITY` → `Community manager, 2021–present` (confirm current status, §14).

**Motion:** `count-up` (once, on enter), `fade-up`.

### 6.5 Selected work (`#work`)

**Layout (desktop):** the signature section, modelled on the "surfaces" section of the reference. Two columns:

- **Left (columns 1–4), sticky:** project index `01 / 05`, project title (h3), one-sentence summary, stack tags (mono), a `Read case study →` link, and a vertical tick list showing which project is active.
- **Right (columns 6–12):** a stack of media cards (product screenshots or short loops), one per project. Each card is `position: sticky` with an increasing `top` offset so the next card slides up and overlaps the previous one. The covered card scales down slightly and dims.

**Mobile:** no stacking. Each project is a block: media card, then title, summary, tags and link.

**Content:** the five featured projects in §10.1, in this order: Zia, Afriex developer ecosystem, DriftWatch, Cutroom, Nippyy backend. Below the stack, a compact **Experiments** grid (3 columns, text-only cards with a mono label): pii-mask, Vetit, hymem, FluxMedia, MediWatch, Claude skills (KlozBuy removed at Lucky's request, 2026-10-28).

**Motion:** `stack-cards`, `index-crossfade`, `cursor-label` ("View case study"), `card-to-case-study` (View Transition on click).

### 6.6 About (`#about`)

**Layout:** two columns. Left: one large statement sentence (h2 size, sentence case). Right: two short paragraphs, then a compact experience timeline (role · organisation · years, newest first, max 5 rows) and a "Hear from me" voice-note pill (§7.7).

**Content:** statement draft: "I like the unglamorous parts: the access-control matrix, the webhook that arrives twice, the SDK error message someone reads at 2 a.m." Experience rows: supplied by Lucky (§14).

**Motion:** `word-highlight` on the statement (words brighten from muted to white as they scroll through the viewport; two keywords turn lime), `blur-in` on paragraphs.

### 6.7 Testimonials

**Layout:** two quote cards side by side (stacked on mobile). The first card is the featured one: lime background, black text. The second is a dark surface card. Each card: quote, name, title, monogram avatar (initials; no stock photos).

**Content:**

1. "Victory is a very talented developer who generously shares his knowledge with others. He is a very valued member of our community, willing and capable of helping others get unstuck. Any company that gets ahold of Victory should do its utmost to keep him." — **Per Borgen, CEO, Scrimba**
2. "Lucky is an exceptional developer with a very calm spirit. He not only developed a professional website for us, but also took the pain of training us to use it with and without his supervision. He delivered quality service with cost-effective advice." — **Dr. Oladapo David Ifeluwa, Lecturer, Statistician & Data Scientist**

Structure the data so more testimonials can be added; with three or more, switch to the reference's carousel (active card lime, others dimmed, arrows, progress line).

**Motion:** `fade-up` staggered.

### 6.8 Writing (`#writing`)

**Layout:** the one **light section** on the page: paper background (`--color-paper`), dark text. This is the "new chapter" contrast flip from the reference. Kicker `04 · WRITING`, h2 `I WRITE WHAT I BUILD`, then a 3-column grid of 6 featured article cards (title, publication, reading time, topic tag), then `All writing →` to `/writing`.

**Content:** featured list in §10.3. Cards show the publication (`DEV · codewithveek` or `DEV · Afriex`) and link out.

**Motion:** `section-reveal` (the paper section's clip-path opens from an inset rounded rectangle to full width as it enters), `fade-up` on cards.

### 6.9 Closing CTA and footer (`#contact`)

**Layout:** black. Giant display headline `LET'S BUILD WHAT'S NEXT` (two lines). Below it: a full-width lime primary button `Email me → hello@veek.me` and an outline button `Book a 20-min call` (Cal.com link, §14) side by side (stacked on mobile). Below: a short contact form (name, email, company optional, message) and the two résumé links. Footer row: `© 2026 Lucky Victory Success` · GitHub · LinkedIn · X · DEV · `Built with React Router on Cloudflare Workers` (mono, muted).

**Motion:** `mask-reveal` on the headline, `fade-up` on the rest.

### 6.10 Case study page (`/work/:slug`)

Template, top to bottom:

1. **Header:** back link `← All work`, mono kicker (`CASE STUDY · 01`), title (display), tagline, meta row (Role · Period · Stack · Status) and link buttons (Live, Repo, npm, Docs, Article).
2. **Hero media:** cover image or loop. Motion: `expand-media` (grows from an inset card to full width as the reader scrolls) and is the target of `card-to-case-study`.
3. **The problem** (2–4 short paragraphs).
4. **What I built:** an architecture diagram (inline SVG, drawn on scroll with `line-draw`) and a short walkthrough.
5. **Decisions and trade-offs:** 2–4 items, each "We chose X over Y because Z; the cost was W."
6. **Results:** only sourced metrics (§10.5). If there are none yet, show what shipped and its status instead.
7. **What I would do next.**
8. **CTA block:** "Want this kind of work on your team?" → Hire me / Résumé. Then a `Next project →` card.

### 6.11 `/writing`

Header, topic filter chips (All · AI & agents · Payments & fintech · Databases · Security · Web), featured articles first, then every technical article from the DEV feed sorted by date. Filtering is client-side over SSR'd data and works without JS via `?topic=` query links.

## 7. Visual design system

### 7.1 Colour tokens

Dark is the default for every visitor, whatever their system setting. A sun/moon toggle in the top bar and the dock turns on an optional light theme; the choice is stored in `localStorage` and applied before first paint. Without JavaScript the site is dark. In the light theme, lime stays a fill colour, text that was lime uses `--color-accent-deep`, and the home Writing section flips to dark to keep the contrast change (§6.8). Details: `docs/decisions/0008-light-theme.md`. Keep accent coverage to about **5 % of any screen**: CTAs, labels, active nav, trace lines and at most one glow.

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--color-bg` | `#08080A` | Page background | — |
| `--color-surface` | `#111114` | Cards, dock | — |
| `--color-surface-raised` | `#18181C` | Hover, active tab | — |
| `--color-border` | `#2A2A2E` | Hairlines, outline buttons | — |
| `--color-text` | `#EDEDED` | Primary text | 17.1:1 on bg |
| `--color-text-muted` | `#A1A1A8` | Body copy, captions | 7.8:1 on bg |
| `--color-text-faint` | `#6B6B72` | Decorative/large text only | 3.8:1 (not for body) |
| `--color-accent` | `#C6F432` | Signal lime: CTAs, labels, lines | 15.6:1 on bg |
| `--color-accent-ink` | `#08080A` | Text on lime | 15.6:1 |
| `--color-paper` | `#F2F0EA` | Writing section background | — |
| `--color-paper-text` | `#111113` | Text on paper | 16.6:1 |
| `--color-paper-muted` | `#5C5C63` | Secondary text on paper | 5.8:1 |
| `--color-accent-deep` | `#4D6600` | Lime's stand-in on paper (links, labels) | 5.7:1 on paper |

Never put lime text on paper. Never put white text on lime.

Reference: `docs/design/accent-options.png` (lime chosen).

### 7.2 Typography

- **Display and body:** **Google Sans Flex** (variable, OFL-1.1, `@fontsource-variable/google-sans-flex`, use the `wdth.css` build). Axes used: `wdth` 25–151, `wght` 1–1000. This is the same family the reference uses; its wide caps are this font at high width.
- **Mono labels:** **JetBrains Mono** (`@fontsource-variable/jetbrains-mono`).
- Self-host both (bundled via Fontsource; no Google Fonts requests). Preload the display subset used above the fold. `font-display: swap` with `size-adjust`ed fallbacks to keep CLS < 0.05.

| Style | Family | Size (clamp) | wdth | wght | Case | Line height | Tracking |
|---|---|---|---|---|---|---|---|
| `display-xl` (hero name, closing CTA) | Google Sans Flex | `clamp(3.5rem, 9vw, 9rem)` | 140 | 800 | UPPER | 0.88 | -0.01em |
| `display-lg` (positioning word, section titles) | Google Sans Flex | `clamp(2.5rem, 6vw, 6rem)` | 130 | 800 | UPPER | 0.9 | -0.005em |
| `heading-xl` (statements) | Google Sans Flex | `clamp(1.75rem, 3.2vw, 3rem)` | 100 | 450 | Sentence | 1.15 | -0.01em |
| `heading-md` (card/project titles) | Google Sans Flex | `1.5rem` | 110 | 650 | UPPER | 1.1 | 0 |
| `body-lg` | Google Sans Flex | `1.125rem` | 100 | 400 | Sentence | 1.6 | 0 |
| `body` | Google Sans Flex | `1rem` | 100 | 400 | Sentence | 1.6 | 0 |
| `label` | JetBrains Mono | `0.75rem` | — | 500 | UPPER | 1.4 | 0.14em |

Numbered kickers use the pattern `01 · STATEMENT`: number in lime, text in `--color-text`.

### 7.3 Layout, spacing, shape

- 12-column grid, max content width 1320 px. Gutters: 16 px (mobile), 32 px (tablet), 96 px (desktop ≥ 1280).
- 4 px spacing base. Section vertical padding `clamp(6rem, 12vw, 10rem)`.
- Shape: buttons and inputs 2 px radius (crisp, like the reference); media cards 16 px; dock 14 px; chips full pill.
- Borders are 1 px `--color-border`. No drop shadows; depth comes from layering, glow and scale.

### 7.4 Texture

- Background grid: 96 px lines at `rgba(255,255,255,0.03)` in the hero and the closing section only.
- Film grain: a static 128 px noise PNG (≤ 10 KB) at 3–4 % opacity, `position: fixed`, `pointer-events: none`. Do not animate grain.
- Glow: at most one radial lime glow per viewport, `blur(120–160px)`, opacity ≤ 0.12.

### 7.5 Portrait

Source: `assets-src/portrait/original.png` (1086×1448, front-lit, busy room background, black T-shirt).

The pipeline (`tools/portrait/grade-portrait.py`, see its README) produces a transparent, graded master:

1. Background removal with `rembg` (`isnet-general-use`, alpha matting on).
2. Saturation × 0.72, contrast × 1.12.
3. Key light from the copy side: brightness falls from 100 % at the subject's left edge to about 55 % at the right edge.
4. Lower 45 % of the frame (arms) falls into shadow (down to 55 % brightness).
5. **Rim light: subtle.** Lime, on the right-hand edge only, inner rim ≤ 25 % strength, no outer halo (an earlier draft had a strong outer glow that made the cut-out look like a sticker).

A graded master generated from the current photo is committed at `assets-src/portrait/graded-master.png`.

`scripts/build-images.ts` (sharp) then exports AVIF and WebP with alpha at 800, 1200 and 1800 px tall, plus a 24 px blurred placeholder. Sizes larger than the source are capped at the source height instead of upscaled (`docs/decisions/0006-portrait-export-sizes.md`). The hero `<img>` uses `srcset`, `fetchpriority="high"`, explicit `width`/`height`, and no lazy loading. Budget: ≤ 180 KB for the 1200 px AVIF.

**Ask:** the source is a little small for 2× screens. If a larger original exists (≥ 1800 px tall), replace `original.png` and re-run the pipeline.

### 7.6 Signature motif: orbits and traces

The reference's "globe" is plain SVG ellipses animated on scroll; we do the same, themed on Lucky's work (OpenTelemetry traces, payment flows).

- **Orbit:** one circle, three meridian ellipses (`rx` 100 %, 55 %, 15 % of radius), one dashed equator. 1 px lime stroke. Rotation illusion: animate each meridian's `rx` with `|cos(θ + offset)|` as θ follows scroll or time.
- **Trace lines:** horizontal span bars like a flame graph (mono labels, varying widths) used as section dividers and in case-study diagrams. They draw in with `line-draw`.
- All motif SVGs are inline, `aria-hidden="true"`, and ≤ 2 KB each.

### 7.7 Media

- **Project media:** screenshots as AVIF/WebP via `scripts/build-images.ts`. Short loops (≤ 8 s, muted, `playsinline`, `loop`) as H.264 MP4 plus VP9 WebM, ≤ 2 MB each, with a poster frame. Loops play only while in view (`IntersectionObserver`) and never under reduced motion (show the poster).
- **Voice note (`Hear from me · 0:25`):**
  - 20–30 s, recorded by Lucky (script draft in §14).
  - Processing: high-pass 80 Hz, light noise reduction, loudness normalised to −16 LUFS (`ffmpeg -af "highpass=f=80,afftdn,loudnorm=I=-16:TP=-1.5:LRA=11"`).
  - Encode AAC in `.m4a` at 64 kbps mono (≈ 240 KB). `preload="none"`.
  - Waveform peaks precomputed at build into JSON (no Web Audio decoding at runtime).
  - Player: custom controls over a native `<audio>` element. Keyboard operable, announces play/pause, shows elapsed time.
  - Transcript always available in a `<details>` element right under the player.
  - **Never autoplays.** Secondary element; the page must not depend on it.

## 8. Motion specification

### 8.1 Principles

1. **Content first.** Every element is visible in the server HTML. Motion enhances arrival; it never gates content. No loaders, no intro gates, no hiding content until hydration.
2. **Animate `transform`, `opacity`, `clip-path` and `filter` only.** Never animate layout properties (`width`, `height`, `top`, `margin`).
3. **One idea per viewport.** At most one scroll-linked "hero moment" visible at a time.
4. **Fast for interactions, slow for scenery.** UI feedback 120–200 ms; scroll scenery is bound to scroll position, not time.
5. **Respect the visitor.** `prefers-reduced-motion: reduce` disables smooth scrolling, parallax, pinning, scroll-linked transforms and video autoplay. Fades of ≤ 200 ms remain.

### 8.2 Libraries

| Library | Version (Oct 2026) | Use |
|---|---|---|
| `motion` (`motion/react`) | 14.x | `useScroll`, `useTransform`, `motion.*` components, `AnimatePresence`, `layout` |
| `lenis` | 1.3.x | Smooth wheel scrolling on desktop |
| React Router `viewTransition` | 8.x | Page transitions via the browser View Transitions API |

No GSAP, no Lottie in v1, no three.js.

**Lenis configuration:** one instance in `shared/motion/smooth-scroll-provider.tsx`: `new Lenis({ autoRaf: true, syncTouch: false, lerp: 0.1 })`. Not created when reduced motion is on or when the primary pointer is coarse (`matchMedia('(pointer: coarse)')`), so touch devices keep native scrolling. Anchor links and the dock use `lenis.scrollTo(target, { offset })` when Lenis exists, and native `scrollIntoView` otherwise. Scrollable inner elements get `data-lenis-prevent`. Keyboard scrolling (Space, Page Down, arrows) must keep working.

### 8.3 Tokens (`shared/motion/motion-tokens.ts`)

```ts
export const easing = {
  outExpo: [0.16, 1, 0.3, 1],      // default for entrances (reference site's main curve)
  inOutCubic: [0.65, 0, 0.35, 1],  // two-way state changes
  outQuart: [0.25, 1, 0.5, 1],     // small UI feedback
} as const;

export const duration = {
  instant: 0.12, // press feedback
  fast: 0.18,    // hover, focus, toggles
  base: 0.45,    // most entrances
  slow: 0.7,     // headline reveals
  scenic: 1.2,   // portrait settle
} as const;

export const stagger = { tight: 0.04, base: 0.08 } as const;

export const springs = {
  dock: { type: "spring", stiffness: 500, damping: 40 },
  cursorLabel: { type: "spring", stiffness: 550, damping: 45, mass: 0.6 },
} as const;
```

### 8.4 Pattern catalogue

Each pattern is a reusable component or hook in `shared/motion/`. "Scroll-linked" means the value is a pure function of scroll position (`useScroll` → `useTransform`); "triggered" means it plays once when the element enters the viewport (`whileInView`, `viewport: { once: true, amount: 0.3 }`).

| Pattern | Type | Spec | Reduced motion |
|---|---|---|---|
| `hero-intro` | CSS keyframes on load | Name lines rise from `translateY(105%)` inside an `overflow: hidden` mask, 0.7 s `outExpo`, 80 ms stagger. Label and sentence fade-up 0.45 s after 0.2 s. Portrait fades from 0 and scales 1.06 → 1 over 1.2 s. Pure CSS so it runs before hydration. | Content shown immediately |
| `portrait-parallax` | Scroll-linked | Target: hero; offset `["start start", "end start"]`. Portrait `y` 0 → 120 px, `scale` 1 → 1.08; copy `y` 0 → -40 px; glow opacity 0.12 → 0. | Off |
| `orbit-drift` / `orbit-rotate` | Time / scroll-linked | Hero: meridians rotate one full cycle per 24 s (CSS/`requestAnimationFrame`, paused when off-screen). Positioning: θ bound to section progress (one half-turn per word). | Static orbit |
| `progress-line` | Scroll-linked | `scaleX` = page `scrollYProgress`, `transform-origin: left`. | Static (hidden) |
| `dock-enter` | Triggered by hero exit | Hero observed with `IntersectionObserver`; when < 10 % visible, dock animates `y` 24 → 0 and `opacity` 0 → 1 with `springs.dock`; reverses when the hero returns. | Fade only |
| `active-indicator` | Layout | Active dock item background is one layer whose `clip-path` slides between items (not `layoutId`, which needs Motion's larger `domMax` bundle; see `docs/decisions/0005-dock-indicator-and-motion-bundle.md`). Active section chosen by `IntersectionObserver` with `rootMargin: "-45% 0px -45% 0px"`. | Instant swap |
| `pinned-word-swap` | Scroll-linked index | Section progress (0–1) maps to word index `floor(progress × 4)`, clamped. On index change: outgoing word `y` 0 → -40 %, `opacity` → 0, `filter: blur(8px)`; incoming from `y` 40 %, blur 8 px → 0; 0.45 s `outExpo`. Kicker types out once on first entry (mono, 18 ms per character). Ticks fill with lime as progress passes each quarter. | Static list |
| `count-up` | Triggered | Numbers count from 0 to value over 1.2 s `outExpo`, tabular numerals, final value in the SSR HTML (the animation starts from 0 only after hydration). | Final value |
| `fade-up` | Triggered | `y` 24 → 0, `opacity` 0 → 1, 0.45 s `outExpo`, `stagger.base` for groups. Initial hidden state applied only after hydration via a `data-motion-ready` attribute on `<html>`. | Off |
| `blur-in` | Triggered | `filter: blur(8px)` → 0, `opacity` 0.2 → 1, 0.6 s. | Off |
| `word-highlight` | Scroll-linked | Statement split into word spans (SSR). Offset `["start 0.85", "end 0.35"]`. Each word's opacity goes 0.25 → 1 across its slice of progress; marked keywords end lime. | Full opacity |
| `mask-reveal` | Triggered | Same as the hero name reveal, for display headlines below the fold. | Off |
| `stack-cards` | CSS sticky + scroll-linked | Card *i*: `position: sticky; top: calc(12vh + i × 28px)`. As card *i+1* rises over it (its own `useScroll` offset `["start end", "start start"]`), card *i* scales 1 → 0.94 and dims (brightness 1 → 0.6). | No scaling; plain list |
| `index-crossfade` | Triggered by active card | Left column title/summary/tags cross-fade (`AnimatePresence mode="wait"`, 0.3 s) when the active card changes. | Instant swap |
| `cursor-label` | Pointer | Over project media (only `pointer: fine`), a pill `View case study →` follows the pointer with `springs.cursorLabel`. The system cursor stays visible. Not a custom cursor replacement. | Off (static label in card corner) |
| `card-to-case-study` | View Transition | Card media and title get `view-transition-name: project-media-{slug}` / `project-title-{slug}`; the case-study hero uses the same names. `<Link viewTransition>`. Duration 0.35 s `outExpo` via `::view-transition-group(*)`. Other content cross-fades. | Cross-fade 0.15 s |
| `expand-media` | Scroll-linked | Case-study hero media: offset `["start end", "start start"]`; `scale` 0.86 → 1, `border-radius` 16 → 0 px (via `clip-path: inset(... round ...)`). | Full size |
| `line-draw` | Triggered | SVG strokes: `pathLength` 0 → 1 over 0.9 s `outExpo`, staggered 0.06 s. | Drawn |
| `section-reveal` | Scroll-linked | Paper section: `clip-path: inset(6% 4% 0 4% round 24px)` → `inset(0 0 0 0 round 0)` over offset `["start end", "start 0.4"]`. | No clip |
| Button hover | CSS | Fill wipes left → right 180 ms `outQuart`; arrow nudges 4 px. Focus ring: 2 px lime outline, 2 px offset. | Colour change only |

### 8.5 Implementation rules

- Wrap scroll-linked logic in hooks (`use-section-progress.ts`, `use-parallax.ts`) so components stay small.
- Use `useReducedMotion()` from `motion/react` through one wrapper hook, `use-motion-preference.ts`, which also reports coarse pointers.
- Never create `useScroll` targets that pin more than one section at a time.
- Videos and orbit animations pause when off-screen.
- Measure: the home page must hold 60 fps while scrolling on a mid-range laptop (Chrome Performance panel, 4× CPU throttle shows no long tasks > 50 ms during scroll).

## 9. Technical architecture

### 9.1 Stack (versions current on 2026-10-22; pin exact versions in `package.json`)

| Concern | Choice |
|---|---|
| Framework | React Router **v8** (framework mode), React 19.2+ |
| Build | Vite 7+ with `@cloudflare/vite-plugin` (dev runs in the real Workers runtime) |
| Runtime / hosting | Cloudflare Workers + static assets |
| Language | TypeScript, `strict: true`, `noUncheckedIndexedAccess: true`, no `any` |
| Styling | Tailwind CSS v4 with tokens from §7 declared in `@theme` |
| Motion | `motion`, `lenis` (§8.2) |
| Content | MDX (`@mdx-js/rollup`) + Zod-validated frontmatter |
| Database | Cloudflare D1 + Drizzle ORM (contact messages only) |
| Email | Cloudflare Email Service `send_email` binding (§9.4) |
| Abuse protection | Cloudflare Turnstile + Workers rate-limiting binding |
| Analytics | Cloudflare Web Analytics + Workers Analytics Engine events |
| Tests | Vitest (+ `@cloudflare/vitest-pool-workers`), Playwright, `@axe-core/playwright`, Lighthouse CI |
| Node | 22.22+ (React Router v8 minimum) |
| Package manager | pnpm |

Scaffold with `npm create cloudflare@latest -- portfolio-2026 --framework=react-router`, then restructure to §9.6. React Router v8 removed `react-router-dom` (import from `react-router` and `react-router/dom`), made middleware always on, and removed the old Cloudflare dev proxy in favour of `@cloudflare/vite-plugin`.

### 9.2 Rendering and caching

- **SSR for every page** (`ssr: true`). This alone fixes the v5 "empty HTML" problem.
- **Edge cache for content pages.** Content is bundled at build time, so rendering is cheap, but cache anyway: in `workers/app.ts`, for `GET` requests to `/`, `/work/*` and `/writing`, look up `caches.default` with a cache key that includes the build ID (`BUILD_ID` var set by CI). On a miss, render, set `Cache-Control: public, max-age=0, s-maxage=86400`, and `ctx.waitUntil(cache.put(...))`. A new deploy changes the build ID, so stale pages are never served. The key also includes a build ID baked in at build time, and cache hits get a fresh CSP nonce via `HTMLRewriter` (`docs/decisions/0001-rendering.md`). Do not cache responses with `Set-Cookie` or non-200 status. The Cache API does nothing on `workers.dev` URLs, so verify caching on the custom domain (M6).
- **Prerendering is optional.** Cloudflare's React Router guide currently says prerendering is not supported with the Cloudflare Vite plugin; the plugin exposes only an experimental `prerenderWorker` option. Milestone M0 includes a time-boxed spike (≤ 2 hours). Adopt prerendering only if it builds and deploys cleanly; nothing in this PRD depends on it.

### 9.3 Content pipeline

- Projects: `app/content/projects/{slug}.mdx`, frontmatter validated by `projectFrontmatterSchema` (§10.2). Loaded with `import.meta.glob(..., { eager: true })` in `app/content/projects.server.ts`, validated at build; a schema error fails the build.
- Testimonials, experience, proof stats and featured writing: typed arrays in `app/content/*.ts`, validated by Zod in a unit test.
- DEV feed: `scripts/fetch-writing.ts` calls `https://dev.to/api/articles?username=codewithveek&per_page=100` (paginate until empty), maps each item to `{ title, url, publishedAt, readingTimeMinutes, tags, publication }` where `publication` is `"Afriex"` when the URL starts with `https://dev.to/afriex/`, applies an exclusion list (non-technical posts, see §10.3), and writes `app/content/generated/dev-articles.json`. Runs in CI before build. If the API fails, CI uses the last committed snapshot and logs a warning.
- npm stats: `scripts/fetch-package-stats.ts` reads `https://api.npmjs.org/downloads/point/last-month/{pkg}` for packages in `content/proof.ts` and writes `app/content/generated/package-stats.json`. Download counts are displayed only when ≥ 100/month.
- A scheduled GitHub Action rebuilds and deploys daily at 05:17 UTC so the writing list stays current.

### 9.4 Contact form and email

**Flow (`POST /api/contact`, resource route action):**

1. Parse `FormData`. Validate with `contactSubmissionSchema` (Zod): `name` 2–80 chars, `email` valid, `company` optional ≤ 120, `message` 20–4000, honeypot field `website` must be empty, `startedAt` timestamp must be ≥ 3 s old.
2. Verify Turnstile: `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` (form-encoded, 10 s timeout) with `secret`, `response` and `remoteip` (`CF-Connecting-IP`). Reject unless `success` is true, `action` is `contact`, and `hostname` is in the `TURNSTILE_HOSTNAMES` var (comma-separated; production never lists localhost). Tokens over 2048 characters are rejected without a call. Site key `0x4AAAAAAFisNj5DU2mpX_9j`; local development and e2e use Cloudflare's test keys from `.dev.vars`.
3. Rate limit: `env.CONTACT_RATE_LIMITER.limit({ key: "contact:" + clientIp })`. Limits are per Cloudflare location and approximate (eventually consistent), so treat this as a backstop; Turnstile is the primary defence. Cloudflare advises against IP keys in general; for an anonymous form the IP is the only reasonable key, so accept that trade-off and keep the limit generous (3 per 60 s).
4. Insert into D1 (`contact_messages`: `id` ULID, `name`, `email`, `company`, `message`, `ip_hash` (SHA-256 with a secret salt, never the raw IP), `user_agent` (≤ 512 chars), `status` `received|sent|failed`, `error_code`, `created_at`).
5. Send the notification with the `send_email` binding:

   ```ts
   await env.EMAIL.send({
     from: { email: "contact@veek.me", name: "veek.me contact form" },
     to: env.CONTACT_INBOX,              // secret; must be a verified destination address
     replyTo: { email: submission.email, name: submission.name },
     subject: `New message from ${submission.name}`,
     text: renderContactText(submission),
     html: renderContactHtml(submission), // escape all user input
   });
   ```

   On success, set `status = "sent"`. On error, read `error.code` (for example `E_SENDER_NOT_VERIFIED`, `E_RECIPIENT_NOT_ALLOWED`, `E_RATE_LIMIT_EXCEEDED`), store it with `status = "failed"`, log it, and still tell the visitor their message was received (it is in D1).
6. Respond: with JS, the form shows an inline success state; without JS, redirect to `/?sent=1#contact` and render the success message server-side. Validation errors return field messages and keep the entered values. Without JS the form posts to the home route's action (same handler) so errors can render on the page; Turnstile needs JS, so no-JS submissions are pointed to the email address (`docs/decisions/0002-contact-without-javascript.md`).

**Setup requirements (one-time, Lucky):**

- `veek.me` DNS is already on Cloudflare and Email Routing is already enabled (MX points to `route*.mx.cloudflare.net`).
- Onboard `veek.me` as an Email Service sending domain so `contact@veek.me` is an allowed sender.
- Verify the personal inbox as an Email Routing destination address, and store it as the `CONTACT_INBOX` secret (never in the repo).
- Sending to verified destination addresses works on the Workers Free plan. Sending to arbitrary recipients (for example an auto-reply to the visitor) requires Workers Paid and is out of scope for v1.

The legacy `EmailMessage` API from `cloudflare:email` is still supported, but use the structured `send()` API for new code.

### 9.5 Bindings and configuration (`wrangler.jsonc`, relevant parts)

```jsonc
{
  "name": "veek-portfolio",
  "compatibility_date": "2026-10-01",
  "compatibility_flags": ["nodejs_compat"],
  "send_email": [
    { "name": "EMAIL", "allowed_sender_addresses": ["contact@veek.me"] }
  ],
  "ratelimits": [
    { "name": "CONTACT_RATE_LIMITER", "namespace_id": "2601", "simple": { "limit": 3, "period": 60 } }
  ],
  "d1_databases": [
    { "binding": "DB", "database_name": "veek-portfolio", "database_id": "<from wrangler d1 create>", "migrations_dir": "drizzle" }
  ],
  "analytics_engine_datasets": [
    { "binding": "EVENTS", "dataset": "veek_portfolio_events" }
  ],
  "vars": { "TURNSTILE_SITE_KEY": "<public site key>", "BUILD_ID": "dev" },
  "routes": [
    { "pattern": "veek.me", "custom_domain": true },
    { "pattern": "www.veek.me", "custom_domain": true }
  ]
}
```

Secrets (set with `wrangler secret put`, mirrored in `.dev.vars.example` with placeholder values): `TURNSTILE_SECRET_KEY`, `CONTACT_INBOX`, `IP_HASH_SALT`. Rate-limiting bindings need Wrangler ≥ 4.36. Generate binding types with `wrangler types`; never hand-write the `Env` interface. Keep the template's `main`/`assets` settings; add `routes` only at cutover (§11, M6).

### 9.6 Project structure

Organised by feature. Every file and folder name is kebab-case.

```
app/
  root.tsx
  routes.ts                         # explicit route config (no file-based naming)
  routes/
    home-route.tsx
    work-detail-route.tsx
    writing-route.tsx
    contact-action-route.ts         # POST /api/contact
    events-action-route.ts          # POST /api/events
    sitemap-route.ts
    robots-route.ts
    not-found-route.tsx
  features/
    hero/                 hero-section.tsx, hero-portrait.tsx, hero-headline.tsx
    positioning/          positioning-section.tsx, word-swap.tsx, proof-caption.tsx
    proof/                proof-strip.tsx, stat-block.tsx
    work/                 work-section.tsx, project-stack.tsx, project-stack-card.tsx,
                          project-index-panel.tsx, experiments-grid.tsx
    case-study/           case-study-header.tsx, case-study-media.tsx, decision-list.tsx,
                          results-list.tsx, next-project-card.tsx
    about/                about-section.tsx, experience-timeline.tsx
    voice-note/           voice-note-player.tsx, use-audio-player.ts
    testimonials/         testimonials-section.tsx, quote-card.tsx
    writing/              writing-section.tsx, article-card.tsx, topic-filter.tsx
    contact/              contact-section.tsx, contact-form.tsx, contact-schema.ts,
                          handle-contact-submission.server.ts, verify-turnstile.server.ts,
                          send-contact-email.server.ts, render-contact-email.ts
    navigation/           top-bar.tsx, dock-nav.tsx, scroll-progress-line.tsx,
                          use-active-section.ts
    analytics/            track-event.ts, record-event.server.ts
  shared/
    motion/               motion-tokens.ts, smooth-scroll-provider.tsx,
                          use-motion-preference.ts, use-section-progress.ts,
                          use-parallax.ts, fade-up.tsx, mask-reveal-text.tsx,
                          word-highlight.tsx, count-up.tsx, cursor-label.tsx
    ui/                   button.tsx, mono-label.tsx, section-kicker.tsx,
                          orbit-motif.tsx, trace-lines.tsx, media-loop.tsx
    seo/                  build-meta.ts, person-json-ld.ts
    lib/                  ulid.ts, hash-ip.server.ts, env.server.ts
  content/
    projects/             zia.mdx, afriex-ecosystem.mdx, driftwatch.mdx, cutroom.mdx,
                          nippyy-backend.mdx
    experiments.ts, testimonials.ts, experience.ts, proof.ts, featured-writing.ts
    schemas.ts
    generated/            dev-articles.json, package-stats.json
  styles/
    app.css               # Tailwind v4 @theme tokens, base, fonts
workers/
  app.ts                  # Worker entry: cache wrapper (§9.2), security headers, RR handler
db/
  schema/contact-messages.ts
drizzle/                  # migrations
scripts/
  fetch-writing.ts, fetch-package-stats.ts, build-images.ts, build-og-images.ts,
  build-waveform.ts
tools/
  portrait/               grade-portrait.py, README.md
assets-src/
  portrait/original.png
public/
  media/ fonts/ resume/ og/
tests/
  e2e/                    *.spec.ts
docs/
  prd.md, design/
```

Code standards are in `CLAUDE.md` and apply to every file.

### 9.7 Analytics

- Cloudflare Web Analytics for page views and Core Web Vitals (enable in the dashboard; no cookies).
- Conversion events via `navigator.sendBeacon("/api/events", body)` → `env.EVENTS.writeDataPoint({ blobs: [eventName, detail, path], doubles: [1], indexes: [eventName] })`. Events: `cta_click{id}`, `resume_download{variant}`, `case_study_view{slug}`, `contact_submit{result}`, `voice_note_play`, `outbound_click{host}`. Validate event names against an allowlist; drop anything else. No personal data.

### 9.8 SEO and sharing

- `meta` exports per route (title, description, canonical, Open Graph, Twitter).
- JSON-LD `Person`: name `Lucky Victory Success`, `alternateName` `["Lucky Victory", "Veek", "CodewithVeek"]`, `jobTitle` `Software Engineer`, `url`, `sameAs` (GitHub, LinkedIn, X, DEV).
- OG images generated at build by `scripts/build-og-images.ts` (rendered with Playwright's Chromium so the variable fonts work; see `docs/decisions/0004-og-images-with-chromium.md`) into `public/og/{route}.png`, 1200×630, black with the lime label, display title and a small portrait crop. No runtime image generation.
- `sitemap.xml` lists `/`, `/writing` and every `/work/:slug`.

### 9.9 Security headers (set in `workers/app.ts`)

- `Content-Security-Policy` with a per-request nonce passed to React Router's `<Scripts nonce>` / `<ScrollRestoration nonce>`: `default-src 'self'; script-src 'self' 'nonce-{n}' https://challenges.cloudflare.com https://static.cloudflareinsights.com; frame-src https://challenges.cloudflare.com; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; style-src 'self' 'unsafe-inline'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

## 10. Content

Never invent numbers. Every metric shown on the site needs a `source` (§10.5). Items marked **[Lucky]** need input before they ship (collected in §14).

### 10.1 Featured projects

**01 · Zia** (`/work/zia`)
- Tagline: Inventory forecasting and reordering for Shopify merchants.
- Role: Founder & engineer, end to end. Period: Sep 2026 – present (per Lucky's résumés, Oct 2026). Status: live (`getzia.xyz`, app at `app.getzia.xyz`).
- What to show: embedded Shopify app and standalone dashboard; purchase orders, supplier mapping, rule-based forecasts (not marketed as AI), Shopify sync and billing, plan-based seat limits (Starter/Growth/Scale), API keys, 30-day soft-delete and restore of organisations; Zia AI assistant (model-agnostic harness, monthly AI credits, actions that need confirmation); internal staff console on its own Worker (separate staff accounts, required 2FA, owner/admin/support/analyst roles, audit log).
- Architecture story: **two builds kept in feature parity**, Node (`server/` + `client/`) and Cloudflare Workers (`cloudflare/api` + `cloudflare/web`), on TiDB, with better-auth (organisations, 2FA, admin, API keys). The trade-off section should explain why.
- Repo is private: show screenshots and diagrams, no repo link.
- Metrics: **[Lucky]** (merchants, SKUs synced, POs created, uptime), only if real.

**02 · Afriex developer ecosystem** (`/work/afriex-ecosystem`) — the flagship DevRel case study
- Tagline: An SDK, two commerce plugins and 16+ guides that make cross-border payments easy to integrate.
- What exists:
  - `@afriex/sdk`: the official TypeScript SDK for the Afriex Business API (customers, transactions, payment methods, balances, rates, webhooks). Repo lives in Afriex's GitHub org; Lucky is the npm maintainer. Docs: `afriex-sdk-docs.vercel.app`.
  - `medusa-payment-afriex`: Medusa v2 payment plugin (bank transfer and Afriex Checkout, verified webhooks, per-region toggles).
  - Afriex Gateway for WooCommerce (WordPress plugin, classic and block checkout).
  - Example apps: `afriex-checkout`, `afriex-creator-payout` (with the two-part "Build a Digital Marketplace" series).
  - 16+ articles published on the Afriex DEV organisation (webhooks, idempotency and sandbox, virtual accounts, mobile money collection, stablecoin settlement, MCP agents, comparisons).
- Role: Developer Relations Engineer, Apr–Oct 2026 (per Lucky's résumés). 18 articles on Afriex's DEV publication.
- Metrics: npm downloads via `package-stats.json` (shown when ≥ 100/month); article count from the feed.
- Note for the old site's bug: the v5 site linked the archived `codewithveek/afriex-sdk`; link the current repo/package.

**03 · DriftWatch** (`/work/driftwatch`)
- Tagline: A self-observing AI agent SDK.
- What it does: traces every tool call and model step as OpenTelemetry; drift is detected from Prometheus metrics built from that telemetry (tool-call mix, error rate, latency, token spend); a policy-driven autopilot notifies, pauses, rolls back or throttles, with human approval for destructive actions.
- Facts: MIT, pnpm monorepo (Node ≥ 22), packages `@driftwatch/sdk`, `@driftwatch/autopilot`, `@driftwatch/server`, `@driftwatch/console`; layers over the Vercel AI SDK, brings no provider SDKs, reads no env vars itself. Docs: `drift-watch-docs.vercel.app`. Articles: "Detecting AI Agent Behavioral Drift with OpenTelemetry and SigNoz", "AI Agent observability with DriftWatch and SigNoz".
- Media: SigNoz dashboards and a trace flame graph (Lucky has these).
- **Before launch:** consolidate `drift-watch` (canonical, few commits) and `drift-watch-legacy` (history) so reviewers do not find two repos with identical READMEs. **[Lucky]**

**04 · Cutroom** (`/work/cutroom`)
- Tagline: Turn a codebase into product videos, on open models.
- What it does: reads a repo (redacting secrets first), writes a product brief whose every feature cites file-and-line evidence, writes a storyboard, **audits every claim against the code** (UI labels, code excerpts, numbers, commands, then a Gemma judge), waits for human approval, renders with Remotion and normalises loudness to −16 LUFS. Local mode runs fully offline (Gemma reasoning, Kokoro voice) with a privacy guard and an egress guard enforced in code.
- Facts: built for the DEV Hacktoberfest 2026 open-source AI challenge; on npm as `cutroom` (`npx cutroom demo`); deploy buttons for Render and DigitalOcean. Article: "We ship every week now. Our launch videos don't. So I built Cutroom."
- Media: a real Cutroom-rendered video as the case-study loop. This is also the most visual project, so it should have the strongest media.
- Domain `cutroom.tech` planned; link only once live.

**05 · Nippyy backend** (`/work/nippyy-backend`)
- Tagline: Backend foundations for a cross-border fintech product.
- What to show (Fastify + TypeScript): an access-control module combining RBAC, ABAC and maker-checker approvals across nine fintech roles; NIBSS-compliant session ID and transaction reference utilities validated against real transaction samples (including spec discrepancies found); an OCR and field-extraction pipeline (Google Cloud Vision + Claude tool use, BullMQ, hybrid pipeline); correlation IDs for distributed tracing; integrations with Afriex and 9PSB.
- Private repo: diagrams and short sanitised code excerpts only. **[Lucky]** confirm what can be shown publicly.

### 10.2 Project frontmatter schema

```ts
// app/content/schemas.ts (shape; implement with Zod)
type ProjectStatus = "live" | "open-source" | "private" | "hackathon";

interface ProjectFrontmatter {
  slug: string;                       // kebab-case, matches file name
  order: number;                      // position in the work stack
  title: string;
  tagline: string;                    // ≤ 90 chars
  summary: string;                    // ≤ 200 chars, used on cards
  role: string;
  period: { start: string; end: string | null }; // "YYYY-MM"
  status: ProjectStatus;
  stack: string[];
  links: { live?: string; repo?: string; npm?: string; docs?: string; article?: string };
  cover: { image: string; alt: string; video?: { mp4: string; webm: string; poster: string } };
  metrics: Array<{ label: string; value: string; source: string }>; // source is required
  confidentiality?: string;           // note shown on private projects
}
```

### 10.3 Writing

**Featured (in order):**

1. From RAG to Agents: How TiDB Powers Modern AI Applications (DEV · codewithveek)
2. AI Memory Systems: Everything You Need to Know (DEV · codewithveek)
3. Afriex Webhook Integration Guide: Signature Verification, Event Handling, and Production Best Practices (DEV · Afriex)
4. Detecting AI Agent Behavioral Drift with OpenTelemetry and SigNoz (DEV · codewithveek)
5. Build a Digital Marketplace with Afriex, Fastify and Postgres, Part 1 (DEV · Afriex)
6. Understanding TOCTOU: The Race Condition Hiding in Your Code (DEV · codewithveek)

**Excluded from the feed** (non-technical): "Your Phone Is Stealing Your Life: Here's How to Take It Back", "The Architecture of Self: Why You Keep Building the Wrong Life". Keep the exclusion list in `featured-writing.ts`.

Do not show reaction or comment counts.

### 10.4 Experiments grid

| Name | One line | Link |
|---|---|---|
| pii-mask | Zero-dependency TypeScript PII masking: 31 detectors (including NIN and BVN), six modes including reversible tokenization, React bindings; four npm packages, 9,000+ combined downloads. | repo, npm |
| Vetit | Reviews an MCP server, probes how its tools behave, and writes a least-privilege grant a human approves (Agent Harness Hackathon, Aug 2026). | repo |
| hymem | Bitemporal, multi-tenant memory for AI agents with pluggable storage (`@hymem/core`). | repo, npm |
| FluxMedia | One TypeScript upload API across Cloudinary, S3 and R2 (`@fluxmedia/core`). | fluxmedia.dev |
| MediWatch | Vision-agent pipeline (YOLO + Moondream + Gemini) on Stream's Vision Agents SDK, built for a hackathon. | repo |
| Claude skills | Public skills including product videos and database schema engineering. | `codewithveek/skills` |

### 10.5 Proof and metrics rules

- Every number on the site comes from (a) a generated JSON file with a fetch date, or (b) an entry in `content/*.ts` with a `source` string (link or note such as "Shopify partner dashboard, Oct 2026").
- If a number cannot be sourced, show the qualitative fact instead.
- Remove the v5 claims that cannot be backed (99.9 % uptime, sub-200 ms, "reduced page load by 60 %" on the real-estate project). The real-estate project does not appear on the new site.

## 11. Milestones and acceptance criteria

Work on a feature branch per milestone; open a PR per milestone. **Production deploys and the DNS cutover need Lucky's explicit go-ahead.**

**M0 — Scaffold (½ day)**
- React Router v8 + Cloudflare template running with `pnpm dev`; structure from §9.6; strict TS, ESLint, Prettier; Tailwind v4 with §7 tokens; fonts self-hosted.
- CI: install, typecheck, lint, unit tests, build on every PR; preview upload (`wrangler versions upload`) with the preview URL posted to the PR.
- Prerender spike result recorded in `docs/decisions/0001-rendering.md`.
- ✅ Accept when: a PR preview URL serves a styled "hello" page with server-rendered HTML.

**M1 — Design system and static home (2 days)**
- All eight home sections and the global chrome built **without motion**, with real content from §10, responsive at 360, 768, 1024, 1440 and 1920 px.
- Portrait pipeline run; hero images within budget.
- ✅ Accept when: Playwright with JavaScript disabled finds every section's heading and text; axe shows no serious/critical violations; Lighthouse mobile performance ≥ 90.

**M2 — Motion (2–3 days)**
- Lenis provider, tokens, and every pattern in §8.4 used on the home page.
- ✅ Accept when: reduced-motion e2e run shows static content with no pinning; no layout shift from motion (CLS < 0.05); no long tasks > 50 ms during a scripted scroll with 4× CPU throttling.

**M3 — Case studies and writing (2 days)**
- `/work/:slug` template and five MDX case studies (Lucky's facts filled in, **[Lucky]** placeholders clearly marked and not rendered in production); `/writing` with filters; DEV and npm fetch scripts; View Transition card → case study.
- ✅ Accept when: all five case studies render; the build fails on invalid frontmatter; the transition works in Chromium and falls back to a cross-fade elsewhere.

**M4 — Contact, email, analytics (1 day)**
- `/api/contact` per §9.4 with D1 migration; Turnstile; rate limiting; `send_email`; `/api/events`.
- ✅ Accept when: unit tests cover validation, honeypot, timing and each `send()` error path; e2e submits the form using Turnstile's always-pass test keys (site key `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`) against a stubbed `EMAIL` binding; a real test email arrives on the preview deployment.

**M5 — Polish (1–2 days)**
- OG images, sitemap, robots, JSON-LD, security headers, 404, voice note (once recorded), résumé PDFs, final copy pass.
- ✅ Accept when: Lighthouse CI budgets pass (§2.3); securityheaders.com grade A; every link resolves.

**M6 — Launch**
- Deploy to production on the Worker's `workers.dev` URL, then QA on real devices (iPhone Safari, Android Chrome, desktop Chrome/Firefox/Safari).
- Cutover: add the Worker custom domains (§9.5), remove the Vercel DNS records for `veek.me`/`www`, confirm HTTPS and redirects. Keep the Vercel project for two weeks as a rollback.
- ✅ Accept when: `veek.me` is served by the Worker (`server: cloudflare`), the contact form delivers to the inbox, and analytics events appear.
- **Status (2026-10-28):** `veek.me` and `www.veek.me` are Worker custom domains; HTTPS, `www` → apex and trailing-slash 301s, and edge caching (`cf-cache-status: HIT`) verified. Pending: real-device QA, contact delivery (needs `CONTACT_INBOX`), analytics check. Rollback: `docs/runbooks/cutover-rollback.md`.

## 12. Quality requirements

### 12.1 Accessibility (WCAG 2.2 AA)
- Text contrast per §7.1. Lime is never used as text on paper.
- Visible focus on every interactive element (2 px lime outline, 2 px offset; on paper, `--color-accent-deep`).
- Keyboard: dock, résumé menu, filters, voice-note player and form fully operable; Escape closes menus.
- Pinned and scroll-linked sections do not trap focus; tabbing through the positioning section reaches all four words (they exist in the DOM).
- Images have meaningful `alt`; decorative SVGs `aria-hidden`.
- Voice note has a transcript; loops have no meaningful audio.

### 12.2 Performance budgets (home page)
- JavaScript (gzip, initial route): ≤ 140 KB. Use Motion's `LazyMotion` with `domAnimation` and the `m.*` components to keep the motion bundle small. Load `lenis` and the cursor label only on `pointer: fine` devices (dynamic import).
- CSS ≤ 30 KB gzip. Fonts ≤ 120 KB for the initial view (subset Latin).
- Hero portrait ≤ 180 KB; no video above the fold.
- Third-party requests on first load: Cloudflare Web Analytics beacon only (Turnstile loads only when the contact section approaches the viewport).

### 12.3 Tests
- Unit (Vitest): schemas, contact handler (all branches, bindings stubbed), email rendering escapes input, event allowlist, feed mapping/exclusion.
- Worker integration (`@cloudflare/vitest-pool-workers`): `/api/contact` and `/api/events` against D1 and stubbed bindings.
- E2E (Playwright): JS-disabled render, reduced-motion render, dock navigation, case-study transition, `/writing` filters with and without JS, contact submission, 404.
- Visual: screenshot baselines of each home section at 390 and 1440 px (reduced motion on, so frames are stable).
- Lighthouse CI on the preview URL for `/` and one case study.

## 13. Risks

| Risk | Mitigation |
|---|---|
| Smooth scrolling feels off or breaks anchors/keyboard | Desktop wheel only, reduced-motion off-switch, explicit e2e for anchors and keyboard scrolling |
| Pinned sections feel long to recruiters | Positioning section capped at 300 vh; dock always offers "Work" and "Hire me" |
| Prerendering unsupported on the Cloudflare plugin | SSR + edge cache is the plan; prerender is optional (§9.2) |
| Email Service setup (sending domain, verified destination) blocks M4 | Store in D1 first; email failure never loses a message; do the dashboard setup during M0 |
| Portrait resolution soft on 2× screens | Request higher-res original; cap rendered height so the 1800 px export is ≥ 1.5× |
| Unverifiable claims | §10.5 rules; `[Lucky]` placeholders never render in production (build check) |

## 14. Open items for Lucky

1. ~~Afriex relationship wording~~ Resolved from the résumés: Developer Relations Engineer, Apr–Oct 2026.
2. ~~Experience timeline~~ Filled from the résumés (Zia, Afriex, Nippyy, freelance) plus Scrimba.
3. **Hackathon wins:** event, project, placement, link for each (the v5 site says "6x").
4. **Scrimba:** still community manager, or end year?
5. **Zia metrics** you are comfortable publishing, with their source.
6. ~~Nippyy~~ Role and public details taken from the résumés: Software Engineer (part-time, remote), Oct 2025 – present.
7. **DriftWatch repos:** consolidate before launch?
8. **Booking link** (Cal.com or similar) for "Book a 20-min call".
9. ~~Résumés~~ Backend and frontend PDFs added (2026-10-28). A DevRel résumé would add a third menu item.
10. **Higher-resolution portrait** if available.
11. **Voice note:** record 20–30 s. Draft to rewrite in your own words: "Hi, I'm Lucky. I build backend systems for payments and tools for AI agents, and I write about both. Lately that's Zia, an inventory product for Shopify merchants, and DriftWatch, an open-source SDK for watching agents in production. I'm looking for my next role in backend, full-stack or DevRel. If that's you, the button's right below."
12. **Media:** Zia screenshots, DriftWatch SigNoz dashboards, a Cutroom-rendered video, Nippyy architecture notes. Until then, cards show a trace cover generated from each project's `architecture` spans (`docs/decisions/0003-generated-project-covers.md`).
13. ~~LinkedIn URL~~ Added: linkedin.com/in/lucky-victory-success.
14. **Repo link** for MediWatch (`app/content/experiments.ts`). KlozBuy was removed.
15. **Cloudflare setup:** D1 created and migrated, Turnstile widget `0x4AAAAAAFisNj5DU2mpX_9j` wired with its secret stored as `TURNSTILE_SECRET_KEY` on the `veek-portfolio` Worker (2026-10-23), live at `https://veek-portfolio.codewithveek.workers.dev`. Still to do: set the `CONTACT_INBOX` secret (a verified Email Routing destination), onboard `veek.me` as an Email Service sending domain, and add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to GitHub secrets for preview uploads.

## 15. Appendix: reference analysis (bmwf3.com)

Captured 2026-10-22 by scrolling the full page (≈ 27,000 px) in headless Chromium and reading the production bundle.

**Stack:** React + Vite; Motion (`useScroll`/`useTransform` about 37 times, `layoutId`, `AnimatePresence`, `whileInView`); Lenis smooth scrolling; Lottie; a custom dot cursor; all "3D" is pre-rendered MP4 (the hero is a 62 s, 18 MB H.264 background video) and SVG line art. Main easing `cubic-bezier(0.16, 1, 0.3, 1)`; springs with stiffness 500–550. Type: Google Sans Flex (wide caps via the width axis) and Space Mono.

**Sequence and what we take:**

| # | Reference | Our use |
|---|---|---|
| 1 | "START ENGINE" intro gate locks scrolling | **Dropped** (costs a click, hides content from crawlers) |
| 2 | Wide-caps hero, left copy, full-bleed video right, outline CTA top-right, vertical "scroll to discover" | Hero (§6.2) with the portrait in place of video |
| 3 | Pinned word swap with typed kicker and ticks | Positioning (§6.3) |
| 4 | Video card expands to full width; cursor label | Case-study `expand-media`, `cursor-label` |
| 5 | Floating bottom dock nav, top progress line | Dock nav and progress line (§6.1) |
| 6 | Editorial statement + quote card with portrait and voice-note button | About + voice note (§6.6) |
| 7 | Quote carousel, active card red | Testimonials (lime featured card), carousel at ≥ 3 quotes |
| 8 | Keywords highlight as you scroll; image zooms | `word-highlight` |
| 9 | Full-bleed photo with parallax, darkening into next section | Portrait parallax; section transitions |
| 10 | SVG ellipse "globe", text blurs into focus | Orbit motif (§7.6), `blur-in` |
| 11 | Sticky left text, stacking product screens on the right | Selected work (§6.5) |
| 12 | Pill tabs with numbered bold-lead lists | Available for case-study results if needed |
| 13 | Theme flips to off-white for Q&A | Writing section (§6.8) |
| 14 | Logo lockup | Not used |
| 15 | Giant closing CTA, full-width red button, email button, minimal mono footer | Closing CTA (§6.9) with lime |

**Deliberate differences:** a portfolio gets about 30 seconds of attention, so: no gate, 8–10 screens instead of ~30, content in the server HTML, video ≤ 2 MB with posters, smooth scrolling on desktop only, and everything off under reduced motion.

## 16. Sources

- Cloudflare — React Router on Workers: https://developers.cloudflare.com/workers/frameworks/framework-guides/react-router
- Cloudflare — Email Service send bindings: https://developers.cloudflare.com/email-service/configuration/send-bindings/
- Cloudflare — Email Service Workers API (`send()`): https://developers.cloudflare.com/email-service/api/send-emails/workers-api/
- Cloudflare — Send emails from Workers (plans, verified destinations): https://developers.cloudflare.com/email-routing/email-workers/send-email-workers
- Cloudflare — Rate limiting binding: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- React Router — v8.0.0 release notes: https://reactrouter.com/8.0.0/changelog.md
- DEV API — articles by user: https://dev.to/api/articles?username=codewithveek
- Reference site: https://www.bmwf3.com/
