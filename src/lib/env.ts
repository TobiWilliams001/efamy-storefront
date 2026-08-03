import { z } from "zod";

/**
 * Validated environment variables.
 *
 * Client variables must be referenced as full literals (`process.env.NEXT_PUBLIC_X`)
 * so Next.js can inline them at build time — never index `process.env` dynamically.
 * Server-only variables (CMS tokens, payment keys, SMTP) get added here as those
 * integrations land, and must never be prefixed with `NEXT_PUBLIC_`.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
});

const parsed = clientSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
  );
}

export const env = parsed.data;
