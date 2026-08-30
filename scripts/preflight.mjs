// What the live site is actually running, as opposed to what is configured.
//
//   pnpm preflight
//
// Every issue this project has hit came from the gap between those two things:
// a value saved in Vercel does nothing until a build starts after it.

const SITE = process.argv[2] ?? "https://www.efamy.co.uk";
const EXPECTED_URL = SITE.replace(/\/$/, "");

const pass = (m) => console.log(`  \x1b[32mok\x1b[0m    ${m}`);
const fail = (m) => { console.log(`  \x1b[31mFAIL\x1b[0m  ${m}`); failures++; };
const warn = (m) => console.log(`  \x1b[33mwarn\x1b[0m  ${m}`);
let failures = 0;

async function text(path, init) {
  const res = await fetch(`${SITE}${path}`, init);
  return { status: res.status, body: await res.text() };
}

console.log(`\nChecking ${SITE}\n`);

// 1. Is the running build recent, or is it serving something from before the
//    last change? Judged by copy that only exists in current code. This
//    separates "stale build" from "wrong value", which look identical from
//    outside and cost this project several wasted redeploys.
const fresh = await text("/nope");
fresh.body.includes("That page has moved on")
  ? pass("running the current build")
  : warn("running an older build — redeploy before trusting anything below");

// 2. Which build is live, judged by what the pages advertise about themselves.
const home = await text("/");
const og = home.body.match(/og:url" content="([^"]+)"/)?.[1];
og === EXPECTED_URL
  ? pass(`site url is ${og}`)
  : fail(
      `site url is ${og}, expected ${EXPECTED_URL}. If the build is current, ` +
        `NEXT_PUBLIC_SITE_URL holds this value in Vercel's Production environment`,
    );

// 3. Stripe can only deliver an order if this answers, and rejects forgeries.
const hook = await text("/api/stripe/webhook", {
  method: "POST",
  headers: { "stripe-signature": "t=1,v1=deadbeef", "content-type": "application/json" },
  body: "{}",
});
if (hook.body.includes("not configured")) fail("webhook has no signing secret");
else if (hook.status === 400) pass("webhook is configured and rejects forged signatures");
else warn(`webhook answered ${hook.status}: ${hook.body.slice(0, 40)}`);

// 4. The pages a customer must be able to reach.
for (const path of ["/shop", "/cart", "/checkout", "/contact", "/order/confirmed"]) {
  const res = await fetch(`${SITE}${path}`);
  res.ok ? pass(`${path} responds`) : fail(`${path} responds ${res.status}`);
}

// 5. Nothing to sell means nothing else matters.
const shop = await text("/shop");
const count = new Set(shop.body.match(/\/products\/[a-z0-9-]+/g) ?? []).size;
count > 0 ? pass(`${count} products on the shop`) : fail("no products on the shop");

// 6. Sitemap should name the same host the pages do.
const map = await text("/sitemap.xml");
const first = map.body.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? "";
first.startsWith(EXPECTED_URL)
  ? pass("sitemap uses the live domain")
  : fail(`sitemap says ${first}`);

console.log(
  failures
    ? `\n${failures} problem${failures > 1 ? "s" : ""}. If the build is current, the value in Vercel is wrong; if it is not, redeploy first.\n`
    : "\nEverything the site advertises about itself is correct.\n",
);
process.exit(failures ? 1 : 0);
