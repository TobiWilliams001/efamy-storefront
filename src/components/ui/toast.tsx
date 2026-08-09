"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

type Toast = {
  id: number;
  message: string;
  action?: { label: string; href: string };
};

const DURATION = 5000;

const ToastContext = createContext<((toast: Omit<Toast, "id">) => void) | null>(
  null,
);

export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used within a ToastProvider");
  return show;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback((toast: Omit<Toast, "id">) => {
    const id = nextId.current++;
    // Only ever one on screen: a stack of confirmations is noise, not feedback.
    setToasts([{ ...toast, id }]);
  }, []);

  return (
    <ToastContext value={show}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext>
  );
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    /*
     * Sits above the sticky buy bar on mobile so it never covers the button it
     * is confirming. `aria-live="polite"` announces it without stealing focus,
     * which would throw a keyboard user out of the page.
     */
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-60 flex justify-center px-4 sm:bottom-6 sm:justify-end sm:px-6"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), DURATION);
    return () => window.clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-white/10 bg-ink/95 p-3 pl-4 text-ink-foreground shadow-card-hover backdrop-blur-sm",
        "motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-3",
      )}
    >
      <Check
        aria-hidden="true"
        className="size-5 shrink-0 text-gold"
        strokeWidth={2}
      />
      <p className="flex-1 text-sm">{toast.message}</p>

      {toast.action ? (
        <a
          href={toast.action.href}
          className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-gold underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-gold/40 focus-visible:outline-none"
        >
          {toast.action.label}
        </a>
      ) : null}

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:text-ink-foreground focus-visible:ring-3 focus-visible:ring-gold/40 focus-visible:outline-none"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

/** Convenience for the one message the shop sends most often. */
export function useAddedToBasket() {
  const show = useToast();
  return useMemo(
    () => (name: string) =>
      show({
        message: `${name} added to your basket`,
        action: { label: "View basket", href: "/cart" },
      }),
    [show],
  );
}
