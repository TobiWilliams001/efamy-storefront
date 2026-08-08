"use client";

import { useState } from "react";

import { subscribe } from "@/app/newsletter-actions";
import { Button } from "@/components/ui/button";

export function NewsletterSignup() {
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setMessage(null);
    const result = await subscribe(formData);
    setPending(false);

    if (result.status === "success") {
      setDone(true);
      return;
    }
    setMessage(result.message);
  }

  if (done) {
    return (
      <p role="status" className="text-sm text-ink-muted">
        Thank you — we will be in touch.
      </p>
    );
  }

  return (
    <form action={onSubmit} className="mt-4">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Your email address"
        className="h-11 w-full rounded-md border border-white/20 bg-white/5 px-3 text-sm text-ink-foreground placeholder:text-ink-muted/70 focus-visible:ring-3 focus-visible:ring-gold/40 focus-visible:outline-none"
      />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <Button
        type="submit"
        size="xl"
        variant="accent"
        disabled={pending}
        className="mt-3 w-full"
      >
        {pending ? "Subscribing…" : "Subscribe"}
      </Button>
      {message ? (
        <p role="alert" className="mt-3 text-sm text-ink-muted">
          {message}
        </p>
      ) : null}
    </form>
  );
}
