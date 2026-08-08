export type Stockist = {
  id: string;
  name: string;
  county: string;
  address?: string;
  city?: string;
  postcode?: string;
  phone?: string;
  url?: string;
};

/**
 * Independent retailers, as listed by Efamy. Several entries are deliberately
 * partial — the client's records hold only a town or a phone number for some
 * shops, and a half-address is still enough for a customer to ring ahead.
 */
export const stockists: Stockist[] = [
  {
    id: "afro-caribbean-slough",
    name: "Afro Carribean Shop",
    county: "Berkshire",
    address: "50-51 Herschel Street",
    city: "Slough",
    postcode: "SL1 1PB",
    phone: "07931 933984",
  },
  {
    id: "freddie-afro-caribbean",
    name: "Freddie Afro-Carribean",
    county: "Berkshire",
    city: "Reading",
    phone: "07702 345773",
  },
  {
    id: "amazing-grace-dagenham",
    name: "Amazing Grace",
    county: "Essex",
    address: "592 Longbridge Road",
    city: "Dagenham",
    postcode: "RM8 2AR",
    phone: "020 8598 1748",
  },
  {
    id: "kaka-supermarket",
    name: "Kaka Supermarket",
    county: "Northamptonshire",
    city: "Northampton",
    phone: "01604 639554",
  },
  {
    id: "nana-afro-shop",
    name: "Nana Afro Shop",
    county: "Northamptonshire",
    city: "Northampton",
    phone: "01604 232929",
  },
  {
    id: "royal-supermarket",
    name: "Royal Supermarket",
    county: "Northamptonshire",
    city: "Northampton",
  },
  {
    id: "afro-caribbean-groceries-corby",
    name: "Afro-Carribean Groceries",
    county: "Northamptonshire",
    address: "Corporation Street",
    city: "Corby",
    postcode: "NN17 1NG",
    phone: "07946 436043",
  },
  {
    id: "comfort-supermarket",
    name: "Comfort Supermarket",
    county: "Bedfordshire",
    address: "The Parade",
    city: "Bedford",
    phone: "01234 364866",
  },
  {
    id: "adom-enterprise",
    name: "Adom Enterprise",
    county: "Buckinghamshire",
    address: "Open Market",
    city: "Milton Keynes",
    phone: "07424 427498",
  },
];

export function stockistsByCounty() {
  const counties = new Map<string, Stockist[]>();
  for (const stockist of stockists) {
    const existing = counties.get(stockist.county);
    if (existing) existing.push(stockist);
    else counties.set(stockist.county, [stockist]);
  }
  return [...counties.entries()].map(([county, shops]) => ({ county, shops }));
}
