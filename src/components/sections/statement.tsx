import { Container } from "@/components/layout/container";

/**
 * A quiet band of large type between the product grids. Without it the homepage
 * runs grid straight into grid and reads as a catalogue rather than a brand.
 */
export function Statement() {
  return (
    <section className="bg-clay/40 py-20 lg:py-28">
      <Container width="prose">
        <p className="font-heading text-3xl text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          Mild or hot, the recipe underneath is the same. Choosing the gentler
          jar should never mean settling for less flavour.
        </p>
      </Container>
    </section>
  );
}
