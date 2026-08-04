import { routes } from "@/lib/routes";

export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Shop", href: routes.shop },
  { label: "About", href: routes.about },
  { label: "Stockists", href: routes.stockists },
  { label: "Contact", href: routes.contact },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Shop",
    items: [
      { label: "All products", href: routes.shop },
      { label: "Chilli sauces", href: routes.category("chilli-sauces") },
      { label: "Seasonings", href: routes.category("seasonings") },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: routes.about },
      { label: "Stockists", href: routes.stockists },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    title: "Help",
    items: [
      { label: "FAQs", href: routes.faq },
      { label: "Returns", href: routes.returns },
      { label: "Privacy", href: routes.privacy },
      { label: "Terms", href: routes.terms },
    ],
  },
];
