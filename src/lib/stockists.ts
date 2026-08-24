export type Stockist = {
  id: string;
  name: string;
  /** As Efamy groups them: a region, a county or a city, whichever they use. */
  region: string;
  address?: string;
  city?: string;
  postcode?: string;
  phone?: string;
  url?: string;
};

/**
 * Independent retailers, as supplied by Efamy in August 2026.
 *
 * Partial by nature: their records hold a shop name, an area and a phone
 * number, rarely a street address. A customer can still ring ahead, which is
 * the point of the page.
 *
 * Numbers arrived written "(0) 7884947904", the trunk-prefix notation, and are
 * stored as the number someone would actually dial.
 */
export const stockists: Stockist[] = [
  {
    id: "tema-market-east-street",
    name: "Tema Market",
    region: "South East",
    city: "East Street",
    postcode: "SE17",
    phone: "07884 947904",
  },
  {
    id: "yaa-asantewaa-bermondsey",
    name: "Yaa Asantewaa",
    region: "South East",
    city: "Bermondsey",
    postcode: "SE16",
    phone: "07950 443931",
  },
  {
    id: "ba-foods-tooting",
    name: "BA Foods",
    region: "South West",
    city: "Tooting",
    postcode: "SW17",
    phone: "07477 016160",
  },
  {
    id: "nyame-bekyere-brixton",
    name: "Nyame Bekyere",
    region: "South West",
    city: "Brixton",
    postcode: "SW9",
    phone: "020 7924 0578",
  },
  {
    id: "techiman-market-harlesden",
    name: "Techiman Market",
    region: "North West",
    city: "Harlesden",
    postcode: "NW10",
    phone: "07916 344358",
  },
  {
    id: "afghan-bazaar-burnt-oak",
    name: "Afghan Bazaar",
    region: "North West",
    city: "Burnt Oak",
    postcode: "HA8",
    phone: "07954 138318",
  },
  {
    id: "oheneba-groceries-burnt-oak",
    name: "Oheneba Groceries",
    region: "North West",
    city: "Burnt Oak",
    postcode: "HA8",
    phone: "07841 654483",
  },
  {
    id: "bsherie-afro-mart-waltham-cross",
    name: "Bsherie Afro Mart",
    region: "Enfield",
    city: "Waltham Cross",
    postcode: "EN8",
    phone: "07960 228408",
  },
  {
    id: "comfort-supermarket-bedford",
    name: "Comfort Supermarket",
    region: "Bedfordshire",
    city: "Bedford",
    postcode: "MK40",
    phone: "07405 251255",
  },
  {
    id: "afro-shop-luton",
    name: "Afro Shop",
    region: "Bedfordshire",
    city: "Luton",
    postcode: "LU1",
    phone: "07985 365278",
  },
  {
    id: "kaka-northampton",
    name: "Kaka",
    region: "Northamptonshire",
    city: "Northampton",
    postcode: "NN1",
    phone: "07956 008486",
  },
  {
    id: "o3-food-store-northampton",
    name: "O3 Food Store",
    region: "Northamptonshire",
    city: "Northampton",
    postcode: "NN1",
    phone: "07766 925601",
  },
  {
    id: "malata-market-northampton",
    name: "Malata Market",
    region: "Northamptonshire",
    city: "Northampton",
    postcode: "NN1",
    phone: "07927 703948",
  },
  {
    id: "asantewaa-taste-far-cotton",
    name: "Asantewaa Taste",
    region: "Northamptonshire",
    city: "Far Cotton",
    phone: "07415 872832",
  },
  {
    id: "afro-carribean-groceries-corby",
    name: "Afro Carribean Groceries",
    region: "Northamptonshire",
    city: "Corby",
    postcode: "NN17",
    phone: "07946 436043",
  },
  {
    id: "agbobloshie-afro-shop-corby",
    name: "Agbobloshie Afro Shop",
    region: "Northamptonshire",
    city: "Corby",
    postcode: "NN17",
    phone: "07426 482875",
  },
  {
    id: "continental-choice-corby",
    name: "Continental Choice",
    region: "Northamptonshire",
    city: "Corby",
    postcode: "NN17",
    phone: "07498 353769",
  },
  {
    id: "afro-shop-wellingborough",
    name: "Afro Shop",
    region: "Northamptonshire",
    city: "Wellingborough",
    postcode: "NN8",
    phone: "07868 380050",
  },
  {
    id: "markola-mkt-birmingham",
    name: "Markola Mkt",
    region: "Birmingham",
    city: "Birmingham",
    postcode: "B9",
    phone: "07761 809190",
  },
  {
    id: "sweet-elohim-afro-shop-wolverhampton",
    name: "Sweet Elohim Afro Shop",
    region: "Wolverhampton",
    city: "Wolverhampton",
    postcode: "WV1",
    phone: "07828 313729",
  },
];

/** Grouped for display, in the order Efamy listed them. */
export function stockistsByRegion() {
  const regions = new Map<string, Stockist[]>();
  for (const stockist of stockists) {
    const existing = regions.get(stockist.region);
    if (existing) existing.push(stockist);
    else regions.set(stockist.region, [stockist]);
  }
  return [...regions.entries()].map(([region, shops]) => ({ region, shops }));
}
