import "server-only";

import { z } from "zod";

/**
 * Server-only. Importing this from a Client Component pulls all of zod into the
 * browser bundle — it did exactly that once, costing ~65 KB gzipped. The
 * `server-only` import makes that a build error instead of a silent regression.
 *
 * Client Components must read `process.env.NEXT_PUBLIC_*` as full literals so
 * Next.js can inline them at build time.
 */
const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
  );
}

export const env = parsed.data;
