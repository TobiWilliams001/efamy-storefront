export type ConsentChoice = "accepted" | "rejected";

const STORAGE_KEY = "efamy.consent.v1";
const EVENT = "efamy:consent";

export function readConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: ConsentChoice): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage unavailable. The banner returns next visit, which is the safe
    // direction to fail.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** For useSyncExternalStore, so nothing has to setState inside an effect. */
export const consentStore = {
  subscribe(onChange: () => void) {
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  },
  getSnapshot: () => readConsent(),
  /** Undecided on the server, so nothing renders until the client knows. */
  getServerSnapshot: (): ConsentChoice | null => null,
};
