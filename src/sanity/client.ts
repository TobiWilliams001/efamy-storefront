import { createClient, type SanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const isSanityConfigured = Boolean(projectId);

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
