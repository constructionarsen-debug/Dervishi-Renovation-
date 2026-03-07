# Dervishi Renovation Website

Developed by **DuaDev Agency**

## Setup

1) Install deps

```bash
npm install
```

2) Create `.env` (copy from `.env.example`) and fill your Neon `DATABASE_URL` and `NEXTAUTH_SECRET`.

3) Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

4) Run

```bash
npm run dev
```

## Admin

- Login: `/admin/login`
- Default credentials are taken from `ADMIN_EMAIL` + `ADMIN_PASSWORD` in `.env`.

## Stripe

Payments are designed to be **manual** (no auto-subscription): the user pays once for 30 days of Q&A access.

Required ENV:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `APP_URL` (or `NEXTAUTH_URL`) for email + redirect links

Endpoints:
- Checkout redirect: `GET /api/stripe/checkout?token=<orderAccessToken>`
- Webhook: `POST /api/stripe/webhook`

## Content & Design

- Landing page layout inspired by the provided screenshot.
- Light/Dark mode with `next-themes`.
- Projects gallery includes a simple lightbox.
