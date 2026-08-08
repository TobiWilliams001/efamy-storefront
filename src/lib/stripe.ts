import "server-only";

import Stripe from "stripe";

/**
 * Lazy, exactly like the Sanity client. Constructing this at module scope means
 * any build that imports the module — including a preview deploy with no keys
 * set — fails at build time rather than at request time. That already broke a
 * production deploy on this project once.
 *
 * `server-only` is the second guard: importing this from a Client Component is
 * a build error, so the secret key cannot be pulled into the browser bundle.
 */
let client: Stripe | undefined;

export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;

    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set. Add it to .env.local (test key) or the Vercel project (live key).",
      );
    }

    client = new Stripe(key);
  }

  return client;
}

/** True when payments are configured, so the UI can degrade rather than throw. */
export function paymentsEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
