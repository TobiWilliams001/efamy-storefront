import { Section, SectionHeader } from "@/components/layout/section";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <Section spacing="lg" width="narrow">
      <SectionHeader
        as="h1"
        eyebrow={siteConfig.legalName}
        title={siteConfig.tagline}
        description={siteConfig.description}
      />
      <p className="text-sm text-muted-foreground">
        Site layout in place — homepage sections are next.
      </p>
    </Section>
  );
}
