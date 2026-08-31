import { describe, expect, it, vi } from "vitest";

vi.mock("@/sanity/client", () => ({ getSanityWriteClient: () => null }));
vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn(),
  orderInbox: () => "x@y.z",
}));

const { soldLines } = await import("@/lib/stock");

const session = (efamy_lines?: string) =>
  ({ metadata: efamy_lines ? { efamy_lines } : {} }) as never;

describe("soldLines", () => {
  it("reads the basket back off the session", () => {
    expect(
      soldLines(session("beef-chilli-sauce|250g|2;coat-and-cook|250g|1")),
    ).toEqual([
      { slug: "beef-chilli-sauce", size: "250g", quantity: 2 },
      { slug: "coat-and-cook", size: "250g", quantity: 1 },
    ]);
  });

  it("returns nothing when the metadata is absent", () => {
    expect(soldLines(session())).toEqual([]);
  });

  /*
   * The string is truncated at Stripe's 500 character limit, so the last entry
   * can arrive half written. A partial line is dropped rather than guessed at.
   */
  it("skips an entry that was cut off", () => {
    expect(
      soldLines(session("beef-chilli-sauce|250g|2;kelewele-seas")),
    ).toEqual([{ slug: "beef-chilli-sauce", size: "250g", quantity: 2 }]);
  });

  it("skips a quantity that is not a whole number", () => {
    expect(soldLines(session("beef|250g|two"))).toEqual([]);
  });
});
