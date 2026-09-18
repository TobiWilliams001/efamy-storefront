// This module reads SANITY_API_WRITE_TOKEN, which grants write access to the
// live dataset. The guard is what stops it being bundled into the browser if
// something here is ever imported from a client component by mistake, the same
// boundary stripe.ts, email.ts and stock.ts already hold.
import "server-only";

import { createClient, type SanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const isSanityConfigured = Boolean(projectId);

let cached: SanityClient | null = null;

/**
 * Null when Sanity is not configured, which lets the catalogue fall back to
 * static data. Built lazily because createClient throws on an empty projectId,
 * and at module scope that would take the whole build down.
 */
export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured) return null;
  cached ??= createClient({
    projectId,
    dataset,
    apiVersion: "2026-05-15",
    useCdn: false,
  });
  return cached;
}

/**
 * A client that can write, for the one job that needs it: counting stock down
 * after a payment. Null without a token, so a deployment that has not been
 * given one degrades to not counting rather than failing an order.
 */
let writer: SanityClient | null = null;

export function getSanityWriteClient(): SanityClient | null {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!isSanityConfigured || !token) return null;
  writer ??= createClient({
    projectId,
    dataset,
    apiVersion: "2026-05-15",
    useCdn: false,
    token,
  });
  return writer;
}
