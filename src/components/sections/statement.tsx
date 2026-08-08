import { Container } from "@/components/layout/container";

export function Statement() {
  return (
    <section className="bg-clay/40 py-20 lg:py-28">
      <Container width="prose">
        <p className="font-heading text-3xl text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          Pure quality, pure taste, pure satisfaction.
        </p>
        <p className="mt-6 text-pretty text-muted-foreground sm:text-lg">
          Fresh ginger, garlic and onions are our main ingredients. No colours,
          additives or preservatives added.
        </p>
      </Container>
    </section>
  );
}
