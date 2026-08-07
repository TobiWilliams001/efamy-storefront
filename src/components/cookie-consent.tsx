"use client";

import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { consentStore, writeConsent } from "@/lib/consent";

/**
 * Analytics cookies are not essential, so under UK PECR they need consent
 * before being set. Nothing loads until a choice is made, and rejecting is as
 * easy as accepting.
 */
export function CookieConsent() {
  const choice = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.getSnapshot,
    consentStore.getServerSnapshot,
  );

  if (choice) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-card p-5 shadow-card-hover sm:p-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-pretty text-muted-foreground">
          We use cookies to understand how the site is used. They are optional,
          and nothing is set until you choose.
        </p>
        <div className="flex shrink-0 gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => writeConsent("rejected")}
          >
            Reject
          </Button>
          <Button size="lg" onClick={() => writeConsent("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
