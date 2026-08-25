import type { Metadata } from "next";

import { Prose } from "@/components/common/prose";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Returns",
  description: `How returns and refunds work when you order from ${siteConfig.legalName}.`,
  alternates: { canonical: routes.returns },
};

export default function ReturnsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Returns &amp; Refunds" />
      <Section spacing="afterHeader" width="prose">
        <Prose>
          <h2>Something wrong with your order</h2>
          <p>
            If an item arrives damaged, incorrect, or past its best before date,
            contact us with your order number and a photograph and we will put
            it right. This applies regardless of anything else on this page,
            because statutory rights cannot be signed away.
          </p>

          <h2>If you change your mind</h2>
          <p>
            Tell us as soon as you can. If your order has not left us we will
            cancel it and refund you in full.
          </p>
          <p>
            Once it has been sent, get in touch before returning anything. We
            sell food, so what we can accept back depends on the item and
            whether it is still sealed, and we would rather sort that out with
            you than have a parcel arrive we cannot do anything with.
          </p>

          <h2>Refunds</h2>
          <p>
            Refunds go back to the card you paid with. Once we have processed
            it, how quickly it appears is down to your bank, and it is usually a
            few working days.
          </p>

          <h2>If your parcel has not arrived</h2>
          <p>
            Email us with your order number and we will look into it. Please do
            not wait: the sooner you tell us, the sooner we can chase it or send
            a replacement.
          </p>

          <h2>Contact</h2>
          <p>
            Email{" "}
            <a href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </a>{" "}
            or use our <a href={routes.contact}>contact form</a>.
          </p>
        </Prose>
      </Section>
    </>
  );
}
