import type { Metadata } from "next";
import { PackageOpen, ShoppingBag } from "lucide-react";

import { CategoryCard } from "@/components/commerce/category-card";
import { HeatLevel } from "@/components/commerce/heat-level";
import { ProductCardSkeleton } from "@/components/commerce/product-card-skeleton";
import { ProductGrid } from "@/components/commerce/product-grid";
import { EmptyState } from "@/components/common/empty-state";
import { Section, SectionHeader } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  placeholderCategories,
  placeholderProducts,
} from "@/lib/placeholder-data";
import type { HeatLevel as HeatLevelValue } from "@/types/product";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "background", className: "bg-background" },
  { name: "foreground", className: "bg-foreground" },
  { name: "primary", className: "bg-primary" },
  { name: "secondary", className: "bg-secondary" },
  { name: "muted", className: "bg-muted" },
  { name: "accent", className: "bg-accent" },
  { name: "destructive", className: "bg-destructive" },
  { name: "border", className: "bg-border" },
];

export default function DesignSystemPage() {
  return (
    <main className="flex-1">
      <Section spacing="sm">
        <SectionHeader
          as="h1"
          eyebrow="Internal"
          title="Design system"
          description="Every shared primitive rendered in one place. Not indexed, not linked from the site."
        />
      </Section>

      <Section surface="muted" spacing="sm">
        <SectionHeader as="h2" title="Colour" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map((swatch) => (
            <div key={swatch.name}>
              <div
                className={`h-16 rounded-lg ring-1 ring-foreground/10 ${swatch.className}`}
              />
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {swatch.name}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="sm">
        <SectionHeader as="h2" title="Typography" />
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl">Heading one — Fraunces</h1>
          <h2 className="text-3xl sm:text-4xl">Heading two — Fraunces</h2>
          <h3 className="text-2xl">Heading three — Fraunces</h3>
          <p className="max-w-prose text-lg text-muted-foreground">
            Large body copy in Inter, used for section descriptions and
            introductory paragraphs.
          </p>
          <p className="max-w-prose">
            Default body copy in Inter. Long-form text sits in a constrained
            measure so lines stay readable.
          </p>
          <p className="text-sm text-muted-foreground">
            Small print — used for metadata, sizes and legal copy.
          </p>
        </div>
      </Section>

      <Section surface="muted" spacing="sm">
        <SectionHeader as="h2" title="Buttons" />
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xl">Shop the range</Button>
            <Button size="xl" variant="outline">
              Learn more
            </Button>
            <Button size="xl" variant="secondary">
              Secondary
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg">Large</Button>
            <Button>Default</Button>
            <Button size="sm">Small</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            <code className="font-mono text-xs">xl</code> (44px) is the minimum
            comfortable touch target — use it for primary calls to action.
          </p>
        </div>
      </Section>

      <Section spacing="sm">
        <SectionHeader as="h2" title="Badges & heat level" />
        <div className="flex flex-wrap items-center gap-3">
          <Badge>New</Badge>
          <Badge variant="secondary">Out of stock</Badge>
          <Badge variant="outline">Offer</Badge>
        </div>
        <Separator className="my-6" />
        <div className="space-y-3">
          {([1, 2, 3, 4, 5] as HeatLevelValue[]).map((level) => (
            <div key={level}>
              <HeatLevel level={level} showLabel />
            </div>
          ))}
        </div>
      </Section>

      <Section surface="muted" spacing="sm">
        <SectionHeader as="h2" title="Form controls" />
        <div className="grid max-w-xl gap-5">
          <div className="grid gap-2">
            <Label htmlFor="demo-email">Email address</Label>
            <Input
              id="demo-email"
              type="email"
              placeholder="you@example.com"
              className="h-11"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="demo-message">Message</Label>
            <Textarea
              id="demo-message"
              placeholder="How can we help?"
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="demo-invalid">Invalid state</Label>
            <Input
              id="demo-invalid"
              aria-invalid="true"
              defaultValue="not-an-email"
              className="h-11"
            />
            <p className="text-sm text-destructive">
              Enter a valid email address.
            </p>
          </div>
        </div>
      </Section>

      <Section spacing="sm">
        <SectionHeader
          as="h2"
          title="Product cards"
          description="Placeholder imagery — real photography replaces this."
          action={
            <Button variant="outline" size="lg">
              View all
            </Button>
          }
        />
        <ProductGrid products={placeholderProducts} eagerCount={2} />
      </Section>

      <Section surface="muted" spacing="sm">
        <SectionHeader as="h2" title="Category cards" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {placeholderCategories.map((item) => (
            <CategoryCard key={item.id} category={item} />
          ))}
        </div>
      </Section>

      <Section spacing="sm">
        <SectionHeader as="h2" title="Loading state" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </Section>

      <Section surface="muted" spacing="sm">
        <SectionHeader as="h2" title="Empty states" />
        <div className="grid gap-6 sm:grid-cols-2">
          <EmptyState
            icon={PackageOpen}
            title="No products match those filters"
            description="Try clearing a filter or browsing the full range."
            action={
              <Button variant="outline" size="lg">
                Clear filters
              </Button>
            }
          />
          <EmptyState
            icon={ShoppingBag}
            title="Your basket is empty"
            description="Once you add something, it will show up here."
            action={<Button size="lg">Start shopping</Button>}
          />
        </div>
      </Section>
    </main>
  );
}
