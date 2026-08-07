# Environment variables

**No real values appear in this file, and none should ever be committed.**
Secrets live in a password manager and in the hosting provider's environment
settings. `.env.local` is gitignored; `.env.example` holds names and blank
values only.

## How to read this

- `NEXT_PUBLIC_*` is **compiled into the browser bundle**. Anyone can read it.
  Never put a secret behind that prefix.
- Everything else is server-only and never reaches the browser.
- Next.js inlines these at build time, so **changing one in Vercel requires a
  redeploy** to take effect.

## Storefront

| Name                            | Scope  | Required          | Purpose                                                                                                                                                                                                                         |
| ------------------------------- | ------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | Public | Yes in production | Canonical origin. Used for the sitemap, canonical tags, Open Graph URLs and structured data. Defaults to `http://localhost:3000`, so if it is unset in production **your sitemap and social previews will point at localhost**. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public | No                | Sanity project. Not a secret; it appears in client requests by design. Without it the site serves the static catalogue.                                                                                                         |
| `NEXT_PUBLIC_SANITY_DATASET`    | Public | No                | Usually `production`. Defaults to `production`.                                                                                                                                                                                 |
| `NEXT_PUBLIC_GA_ID`             | Public | No                | Google Analytics 4 measurement ID, `G-XXXXXXXXXX`. Analytics renders nothing when unset, which keeps local and preview traffic out of the production data.                                                                      |
| `RESEND_API_KEY`                | Server | No                | Transactional email for the contact form. Until it is set the form validates and reports honestly that sending is not connected, rather than pretending to send.                                                                |

## Scripts only

| Name                     | Scope  | Purpose                                                                                                                                                   |
| ------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SANITY_API_WRITE_TOKEN` | Server | Write access for `scripts/seed-sanity.mjs`. **Never** put this in `.env.local` or Vercel. Pass it inline for the one command that needs it, then discard. |

## Not yet used

Added when the integration lands. Listed so nobody invents a different name.

| Name                                 | For                                 |
| ------------------------------------ | ----------------------------------- |
| `STRIPE_SECRET_KEY`                  | Server-side Stripe calls            |
| `STRIPE_WEBHOOK_SECRET`              | Verifying Stripe webhook signatures |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe.js in the browser            |

## Local setup

```bash
cp .env.example .env.local
```

Fill in what you need. An empty file is fine: the site runs on the static
catalogue.

## Vercel setup

Settings → Environment Variables. Set at minimum:

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
```

Apply to Production, Preview and Development unless there is a reason not to.
Preview deployments should generally **not** carry `NEXT_PUBLIC_GA_ID`, so test
traffic stays out of analytics.

**Redeploy after any change.** Vercel does not apply new variables to existing
deployments.

## Rotating a secret

1. Generate the new value at the provider
2. Update it in Vercel, and in the password manager
3. Redeploy
4. Revoke the old value at the provider

Do the revoke last, so a failed deploy does not take the site down with it.

## If a secret leaks

Assume it is compromised the moment it is pasted into a chat, a screenshot, a
terminal that gets shared, or a commit. Rotate immediately — do not wait to
find out whether anyone used it. Rewriting git history does not help, because
the value is already out.
