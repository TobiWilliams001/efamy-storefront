"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, TriangleAlert } from "lucide-react";

import Link from "next/link";

import { submitContact } from "@/app/contact/actions";
import { Rule } from "@/components/layout/rule";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  contactSchema,
  contactTopics,
  type ContactInput,
} from "@/lib/contact-schema";
import { siteConfig } from "@/config/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { topic: "General enquiry" },
  });

  async function onSubmit(values: ContactInput) {
    setFormError(null);
    const result = await submitContact(values);

    if (result.status === "success") {
      setSent(true);
      reset();
      return;
    }

    setFormError(result.message);
  }

  if (sent) {
    return (
      /*
       * The form is replaced rather than topped with a banner, so the state is
       * unambiguous: there is nothing left to fill in and nothing to press
       * twice. Both ways forward are offered, because someone who has just
       * written to a shop either wants to keep shopping or has a second thing
       * to say.
       */
      <div
        role="status"
        className="rounded-lg border border-gold/40 bg-card p-8 text-center shadow-card sm:p-10"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2
            aria-hidden="true"
            className="size-7 text-success"
            strokeWidth={1.5}
          />
        </span>

        <h3 className="mt-6 font-heading text-2xl">Message sent</h3>
        <Rule className="mt-4" />

        <p className="mx-auto mt-5 max-w-sm text-pretty text-muted-foreground">
          It has gone to {siteConfig.contact.email}, where a person reads it.
          You will get a reply to the address you gave us.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="accent">
            <Link href={routes.shop}>Back to the shop</Link>
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => setSent(false)}
          >
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      {formError ? (
        <div
          role="alert"
          className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm"
        >
          <TriangleAlert
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-destructive"
          />
          <p>
            {formError}{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="underline underline-offset-4"
            >
              {siteConfig.contact.email}
            </a>
          </p>
        </div>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="name">Your name</Label>
        <Input
          id="name"
          className="h-11"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
        {errors.name ? (
          <p id="name-error" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          className="h-11"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="topic">What is it about?</Label>
        <select
          id="topic"
          className="h-11 rounded-lg border border-input bg-card px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          {...register("topic")}
        >
          {contactTopics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={6}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        {errors.message ? (
          <p id="message-error" className="text-sm text-destructive">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div>
        <Button
          type="submit"
          size="xl"
          variant="accent"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
