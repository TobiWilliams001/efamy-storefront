export type Stockist = {
  id: string;
  name: string;
  address: string;
  city: string;
  postcode: string;
  url?: string;
};

/**
 * Empty until the client supplies their retailer list. The stockists page
 * renders an empty state rather than inventing shops.
 */
export const stockists: Stockist[] = [];
