"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";

import { consentStore } from "@/lib/consent";

// Loads nothing until analytics cookies are consented to, and nothing at all
// unless an ID is set, which keeps preview traffic out of the production data.
export function Analytics({ id }: { id?: string }) {
  const choice = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.getSnapshot,
    consentStore.getServerSnapshot,
  );

  if (!id || choice !== "accepted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
