/**
 * The product colour system from the brand guidelines. These are supporting
 * accents only: badges, chips and small highlights. Never a page background.
 */
const ACCENTS: Record<string, string> = {
  beans: "#556B2F",
  beef: "#8D5446",
  chicken: "#E58D43",
  fish: "#8DBF3C",
  goat: "#7A4A3E",
  pork: "#C34B6A",
  turkey: "#D96A1E",
  seasoning: "#C89B3C",
  kelewele: "#D96A1E",
  coat: "#294D96",
  oil: "#C89B3C",
};

const FALLBACK = "#C89B3C";

/** Matched on the slug so a new product picks up its colour without extra data. */
export function productAccent(slug: string): string {
  const key = Object.keys(ACCENTS).find((entry) => slug.includes(entry));
  return key ? ACCENTS[key] : FALLBACK;
}
