# BreakupBox 💔

> Your AI-powered Digital Untangling Checklist after a breakup.

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/breakupbox
cd breakupbox
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Database Setup

- Create a Supabase project at supabase.com
- Run `supabase/schema.sql` in the SQL editor
- Copy your project URL and keys to `.env.local`

### 4. Auth Setup

- Create Google OAuth credentials at console.cloud.google.com
- Set redirect URI to `https://your-domain.com/api/auth/callback/google`
- Generate AUTH_SECRET: `openssl rand -base64 32`

### 5. Stripe Setup

- Create products in Stripe Dashboard:
  - "Full Checklist" — One-time $9
  - "Healing Mode" — Recurring $14/month
- Copy Price IDs to `.env.local`
- Set up webhook endpoint pointing to `/api/stripe/webhook`
- Listen for: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`

### 6. Resend Setup

- Create account at resend.com
- Add and verify your domain
- Copy API key to `.env.local`

### 7. Gemini Setup

- Get API key from aistudio.google.com
- Copy to `GEMINI_API_KEY` in `.env.local`

### 8. Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

## Architecture

- **Next.js 14** App Router
- **NextAuth v5** — Google OAuth + Magic Link
- **Supabase** — PostgreSQL with Row Level Security
- **Stripe** — One-time ($9) + Subscription ($14/mo)
- **Gemini Flash** — AI checklist generation
- **Resend** — Transactional email
- **Vercel Cron** — Sunday 9AM ghost check emails

## Pricing

| Plan | Price | Features |
|------|-------|---------|
| Free | $0 | 5 categories, basic checklist |
| Full Checklist | $9 one-time | All 16 categories, PDF export |
| Healing Mode | $14/mo | Full checklist + weekly emails |
