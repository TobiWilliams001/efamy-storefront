import { z } from "zod";

// Client vars must be referenced as full `process.env.NEXT_PUBLIC_*` literals
// so Next.js can inline them — never index `process.env` dynamically.
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
