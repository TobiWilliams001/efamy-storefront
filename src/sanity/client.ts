import { createClient } from "next-sanity";

const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-05-15",
};

// Falsy when unconfigured, which lets the catalogue fall back to static data.
export const isSanityConfigured = Boolean(sanityConfig.projectId);

export const client = createClient({
  ...sanityConfig,
  useCdn: false,
});
