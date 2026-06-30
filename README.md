# Plerona

Production website for **Plerona LLC** — AI-powered operational infrastructure for small businesses. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, and React Three Fiber.

The entire business model — every price, offer, deliverable, and hosting tier — lives in a single source of truth at `lib/pricing.ts`. No price is hardcoded anywhere else.

---

## Stack

- **Next.js 15** (App Router, React Server Components)
- **TypeScript** (strict)
- **Tailwind CSS** — design tokens defined in `tailwind.config.ts`
- **Framer Motion** — entrance, scroll, and micro-interactions (GPU-only transforms)
- **React Three Fiber / Three.js** — immersive node-graph hero background (`components/HeroBackground.tsx`), lazy-loaded client-side with a static fallback

---

## Local development

Requires **Node.js 18.18+** (Node 20 LTS recommended).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
```

---

## Project structure

```
app/
  layout.tsx              Root layout — fonts, metadata, Navigation + Footer
  page.tsx                Homepage (full conversion arc)
  implementation/         Flagship offer page + live configurator
  consult/                Intermediary Consult sales page
  about/                  Mission, founder journey, philosophy, vision
  checkout/               Two-mode checkout (consult vs implementation)
  thank-you/              Legacy route — redirects to /success flow
  privacy/  terms/        Legal
  api/
    checkout/route.ts     Creates Stripe Checkout Session (server-side pricing)
    webhook/route.ts      Stripe webhook — verified fulfillment hook
  not-found.tsx           404
  globals.css             Design-system base layer
components/               All UI + interactive systems
lib/
  pricing.ts              IMMUTABLE business model — single source of truth
  stripe.ts               Server-only Stripe client (graceful when unset)
  orders.ts               Order normalization + Supabase record (idempotent)
  email.ts                Resend — buyer confirmation + internal notification
  content.ts              Page content (problems, timeline, layers, etc.)
  motion.ts               Shared Framer Motion variants
  useImplementationConfig.ts   Configurator state + animated price + query string
supabase/
  migrations/0001_orders.sql   Orders table schema (run once)
public/                   Static assets
```

### Adding the founder photograph

`app/about` renders `components/FounderPortrait.tsx`. Drop a photo at `public/founder.jpg` and it appears automatically; until then an editorial monogram frame is shown so the page never ships broken. Pass a different path via the `src` prop if needed.

---

## Deploy — GitHub → Vercel → Plerona.com

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial Plerona site"
   git branch -M main
   git remote add origin https://github.com/<you>/plerona.git
   git push -u origin main
   ```

2. **Import into Vercel**
   - New Project → import the repo.
   - Framework preset: **Next.js** (auto-detected). No build config changes needed.
   - Deploy.

3. **Connect the domain**
   - Vercel → Project → Settings → Domains → add `plerona.com` and `www.plerona.com`.
   - Point DNS at Vercel (A record `76.76.21.21` for the apex, or follow Vercel's exact current instructions; CNAME `www` → `cname.vercel-dns.com`).
   - Vercel issues SSL automatically.

---

## Payments (Stripe) — already wired

Checkout uses **Stripe hosted Checkout**. Prices are recomputed server-side from `lib/pricing.ts` on every request, so client-submitted amounts are never trusted. Card details are entered on Stripe's own page — they never touch Plerona's servers.

**Flow**

1. Buyer fills contact details on `/checkout` and clicks **Continue to Payment**.
2. `POST /api/checkout` validates input, rebuilds line items from the pricing source of truth, and creates a Checkout Session.
3. Buyer is redirected to Stripe, pays, and returns to `/success`, which verifies the session against Stripe (`payment_status === 'paid'`) before showing any confirmation.
4. `POST /api/webhook` receives `checkout.session.completed` (signature-verified) — the fulfillment hook where onboarding/CRM is triggered.

Hosting is intentionally **not** charged at checkout: per the business model it begins after implementation. The selected tier is stored in session metadata so the subscription can be set up at handoff.

**Go live in 4 steps**

1. Create a Stripe account and grab your secret key (`sk_test_…`, then `sk_live_…`).
2. Set environment variables (locally in `.env.local`, in production via Vercel → Settings → Environment Variables):
   ```
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   NEXT_PUBLIC_SITE_URL=https://plerona.com
   ```
3. In the Stripe Dashboard → Developers → Webhooks, add an endpoint at `https://plerona.com/api/webhook` subscribed to `checkout.session.completed`. Copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
4. Redeploy. To test locally: `stripe listen --forward-to localhost:3000/api/webhook` and use card `4242 4242 4242 4242`.

> **No fake completions.** If `STRIPE_SECRET_KEY` is not set, `/api/checkout` returns a 503 error and the checkout button surfaces it — the flow never silently "completes" an order. A confirmation is shown only on `/success` after Stripe verifies the payment as paid. The legacy `/thank-you` route now redirects home and can no longer display an unverified success state.

---

## Fulfillment — what happens after payment

When Stripe confirms a payment, `POST /api/webhook` (signature-verified) runs three independent, best-effort steps. Each is gated on its own credentials and skips cleanly if unconfigured, so nothing crashes the webhook. The whole thing is **idempotent**: the order record's unique `stripe_session_id` means a repeated Stripe event won't double-send emails.

1. **Order record (Supabase).** Inserts a row into the `orders` table — your CRM entry.
2. **Buyer confirmation email (Resend).** Branded receipt + "what happens next."
3. **Internal notification email (Resend).** Full order + contact details to your inbox, with the buyer's email as reply-to.

**Set up email (Resend)**

1. Create an account at [resend.com](https://resend.com) and verify your sending domain (e.g. `plerona.com`).
2. Set env vars:
   ```
   RESEND_API_KEY=re_xxx
   FROM_EMAIL="Plerona <hello@plerona.com>"
   NOTIFY_EMAIL=contact@plerona.com
   ```
   Until your domain is verified you can test with Resend's sandbox sender (the default).

**Set up the order record (Supabase)**

1. In your Supabase project's SQL editor, run `supabase/migrations/0001_orders.sql` (creates the `orders` table, locked down with RLS).
2. Set env vars (the **service role** key is server-only — never expose it to the client):
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=xxx
   ```

If either provider is left unconfigured, that step is skipped and the rest still run — e.g. you can ship emails first and add the database later.

---

## Design system (do not drift)

Colors, radii, and type are pinned in `tailwind.config.ts`:

- ink `#0a0a0a` · white `#ffffff` · off-white `#f7f7f7`
- blue `#1a56db` (accent) · silver `#c0c4cc` · gray `#888888` · rule `#e4e4e4`
- No gradients. Border-radius 0–4px. Font: Inter.
- Single blue accent — used with restraint.
