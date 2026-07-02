# Plerona V2 — Constitutional Remodel Compliance Record

Governing authority: **The Plerona Website Constitution & Design System v1.0**.
This document records the Phase 1 audit, the Phase 2 compliance map, and the
manual steps that remain founder-side. It is a record, not governance — the
Constitution remains the sole law (Part I, Art. 1.4).

## Phase 1 — Audit summary (pre-remodel state)

- Stack: Next.js 15 App Router, TypeScript, Tailwind 3.4, Framer Motion, R3F 8 + three 0.171 (already present), self-hosted Inter variable.
- Routes: `/` (11 sections HS-01..HS-11), `/about`, `/consult`, `/implementation`, `/checkout`, `/success` (server-verified `payment_status === 'paid'`), `/thank-you` (307 → home), `/privacy`, `/terms`, 404; APIs `/api/checkout` (503 when Stripe unconfigured; validates then creates hosted Checkout Session) and `/api/webhook` (fulfillment → Resend + Supabase, credential-gated).
- Protected systems: `lib/pricing.ts` (immutable business model), `lib/stripe.ts`, `lib/orders.ts`, `lib/email.ts`, both API routes, `CheckoutClient`, `OfferSection`, `ConnectionStepper`, `HostingSelector`, `OrderSummary`, `ConfirmationView`, `useImplementationConfig`.
- Navigation: fixed header; mobile drawer portaled to `<body>` with iOS-safe scroll lock (kept verbatim).
- Pre-V2 palette (white/ink/blue) fully superseded by the constitutional tokens.

## Phase 2 — Constitution compliance map

| Constitutional requirement | Implementation |
| --- | --- |
| Design Tokens as JSON + CSS + Tailwind (IV.1) | `lib/design-tokens.json`, `styles/tokens.css`, `tailwind.config.ts` (legacy class names aliased onto token values so protected components restyle with zero logic edits) |
| Seven color tokens only; AA contrast (IV.2, V.7.5) | All surfaces/text/accents resolve to the 7 tokens or opacity variants; snow/mist/beam on space-deep/panel all ≥ WCAG AA (min pair mist-on-panel ≈ 6.8:1) |
| Type scale 12–96px, 1.25/1.125 (IV.3) | `--text-body-1..5`, `--text-head-1..8` in tokens.css |
| Spacing 8px base (IV.4); radii 4/8/16 (IV.5); motion 150/300/600 + cubic-bezier(0.23,1,0.32,1) (IV.6) | Tokens + Tailwind `sp-*`, `rounded-sm/md/lg`, `duration-fast/base/slow`, `ease-cinematic` |
| Elevation = inner glow + subtle shadow; heavy drop shadows prohibited (IV.5.2) | `--elevation-panel`; `.panel-holo` |
| Scene Graph single JSON source (V.2) | `lib/scene-graph.json` → consumed by `lib/journey/graph.ts` (pure TS) and `lib/journey/path.ts` (three splines) |
| Locations: Hero Viewpoint, Captain's Room, Package Room + mapping (III.3) | 10 Locations. HS-01→Hero Viewpoint; HS-02→The Approach; HS-03→Chronicle Room; HS-04→Diagnostics Bay; HS-05→Engineering Deck; HS-06→Observation Deck; HS-07→Operations Room; HS-08+HS-09→**Package Room**; HS-10+About→**Captain's Room** (portrait §II.8.2); HS-11→Transmission Deck |
| Ship = O-shaped logo-vessel; Beam; Wordmark as light source (II.2–3) | `components/world/Ship.tsx`: torus hull + Beam strut spanning the O; canvas-texture **PLERONA** emissive lettering + gold point light |
| Universe with distant soft-focus worlds/cities; Ship always primary (II.1) | `SpaceEnvironment.tsx` — static starfield + glow-sprite worlds with city clusters; fog keeps them remote |
| First-person guided camera; scroll = travel; yaw/pitch clamped; 0.08 damping; mobile −30% speed + lower sensitivity (III.5, V.3) | `CameraRig.tsx` (lerp 0.08; clamps 0.30/0.20 rad desktop, 0.16/0.10 mobile) + `--travel-scale:1.3` under 768px |
| Scroll capture only in Travel Zones (V.4) | **Zero scroll capture anywhere** — native scroll drives travel; arrow keys/PageUp/Down inherit natively |
| Interaction Matrix + keyboard equivalents + visible focus (III.6, V.7.3) | TravelControls buttons, hamburger fully keyboard, `:focus-visible` beam outline global, hover beam-glow on interactive borders |
| Panels: DOM, holographic, never occluded (IV.8); critical info never 3D text (V.1.2) | `Panel.tsx` + `.panel-holo`; canvas is `pointer-events-none z-0` behind `z-10` content; every word is DOM |
| Progressive disclosure > 400 words (III.7.3) | Captain's Room founder story collapses behind an in-place, animated, reduced-motion-safe region |
| Two nav modes; hamburger everywhere, instant transition to every Location (III.4) | Drawer on **all** breakpoints listing all 10 Locations → `scrollIntoView` (auto under reduced motion); every destination resolves |
| Mini-map always available (III.9.2) | `Wayfinding.tsx` MiniMap toggle with current-Location highlight |
| Focused Mode: complete 2D, auto + user-selectable (III.10) | SSR default is `focused` (progressive enhancement); auto-engage on no-WebGL / low device / reduced-motion / sustained FPS-floor breach after DPR ladder; drawer toggle for every visitor; identical DOM tree guarantees informational completeness incl. purchasing |
| Performance budgets (V.5) | First load `/` = 160 kB gz; lazy 3D chunk ≈ 150 kB → core+3D ≈ 310 kB ≤ 650 kB. Static geometry, `frameloop="demand"`, adaptive DPR ladder |
| No continuous loops/particles/autoplay; no italic headers; no dark patterns (VII.5) | Removed `pulse2` loop; stars/worlds static; `font-style:normal` enforced on h1–h3; purchase flow logic untouched and pressure-free |
| Content sanctity (I.5.5, VII.4) | Every HS-01..11 string, `lib/content.ts`, About copy, and all pricing copy preserved verbatim; About constants relocated unchanged to `lib/about-content.ts` shared by `/about` and the Captain's Room |
| Emotional Arc bound to triggers (III.2) | Arrival→Hero awe; exploration→Approach/Chronicle/Diagnostics clarity; understanding→Engineering/Observation/Operations; selection→Package Room; partnership→Captain's Room + Transmission. Stage entry = IntersectionObserver Location events (consent-gated analytics hook-ready per V.9) |

## Constitutional notes & founder-side items

1. **Founder Location ratification (III.3.5):** Hero Viewpoint, Captain's Room, and Package Room follow explicit constitutional assignment. The seven remaining assignments (recorded in the Scene Graph with `founderAssigned: false`) are provisional and await founder ratification; changing any is a Scene-Graph edit only.
2. **Founder portrait (II.8.2):** the Captain's Room hangs a procedurally painted "galactic warrior" placeholder. Supply final artwork by replacing `createFounderPortraitTexture` with a texture load (and `/public/founder.jpg` for the DOM portrait).
3. **Captain's Room voice (II.7.4):** existing About copy is preserved exactly under content sanctity; it is sincere but not comedic. Rewriting it in the founder's personal/humorous voice is a founder copy decision — drop-in via `lib/about-content.ts`.
4. **Pre-Launch Gate items requiring humans/devices (VIII.3):** Lighthouse ≥ 90 on production, WCAG manual audit, 8-participant Emotional-Arc testing, and real low-end-device budget verification cannot be executed from this environment and remain open gates before the release is constitutionally "complete."
5. **Stripe end-to-end:** verified in code and via live 503/400 guards here (no credentials in this environment, by design). Run one test-key purchase on the Vercel preview to confirm the unchanged flow end-to-end.
