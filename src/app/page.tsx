import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-24">
      <p className="text-sm tracking-[0.2em] text-muted-foreground uppercase">
        {siteConfig.legalName}
      </p>
      <h1 className="mt-4 text-4xl sm:text-5xl">{siteConfig.tagline}</h1>
      <p className="mt-6 max-w-prose text-lg text-muted-foreground">
        {siteConfig.description}
      </p>
      <p className="mt-10 text-sm">
        Foundation in place — design system and site layout are next.
      </p>
    </main>
  );
}
