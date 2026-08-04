/**
 * The product colour system from the brand guidelines. These are supporting
 * accents only: badges, chips and small highlights. Never a page background.
 */
const ACCENTS: Record<string, string> = {
  beans: "#5C7A3F",
  beef: "#8D5446",
  chicken: "#E58D43",
  fish: "#8EBB63",
  goat: "#8D5446",
  pork: "#C34B6A",
  turkey: "#E58D43",
  seasoning: "#C89B2F",
  kelewele: "#E07B39",
  coat: "#294D96",
  oil: "#C89B2F",
};

const FALLBACK = "#C89B2F";

/** Matched on the slug so a new product picks up its colour without extra data. */
export function productAccent(slug: string): string {
  const key = Object.keys(ACCENTS).find((entry) => slug.includes(entry));
  return key ? ACCENTS[key] : FALLBACK;
}
