/**
 * PLACEHOLDER MENU — TODO(client): confirm every item and price with the
 * owner before launch. Prices are plausible Karachi street prices, not
 * quoted ones. Owner updates = edit this file and redeploy.
 */

export interface MenuItem {
  id: string;
  name: string; // English
  nameUrdu?: string; // optional Urdu display name
  description?: string;
  pricePKR: number; // integer rupees
  category: "chai" | "paratha" | "snacks" | "extras";
  popular?: boolean; // renders a "Most loved" tag
}

export type MenuCategory = MenuItem["category"];

export const categoryLabels: Record<MenuCategory, string> = {
  chai: "Chai",
  paratha: "Paratha",
  snacks: "Snacks",
  extras: "Extras",
};

export const categoryOrder: readonly MenuCategory[] = [
  "chai",
  "paratha",
  "snacks",
  "extras",
];

export const menu: MenuItem[] = [
  // Chai
  {
    id: "doodh-patti",
    name: "Doodh Patti",
    nameUrdu: "دودھ پتی",
    description: "The signature. Slow-brewed in pure milk, no water.",
    pricePKR: 80,
    category: "chai",
    popular: true,
  },
  {
    id: "karak-chai",
    name: "Karak Chai",
    nameUrdu: "کڑک چائے",
    description: "Strong, boiled hard, for the long nights.",
    pricePKR: 70,
    category: "chai",
  },
  {
    id: "masala-chai",
    name: "Masala Chai",
    nameUrdu: "مصالحہ چائے",
    description: "Cardamom, cinnamon and a little heat.",
    pricePKR: 90,
    category: "chai",
  },
  {
    id: "kashmiri-chai",
    name: "Kashmiri Chai",
    nameUrdu: "کشمیری چائے",
    description: "Pink, salty-sweet, topped with crushed pistachio.",
    pricePKR: 120,
    category: "chai",
  },
  {
    id: "green-tea",
    name: "Green Tea (Sabz Chai)",
    nameUrdu: "سبز چائے",
    description: "Light and clean, served with lemon on request.",
    pricePKR: 60,
    category: "chai",
  },
  // Paratha
  {
    id: "sada-paratha",
    name: "Sada Paratha",
    description: "Flaky, ghee-crisped, straight off the tawa.",
    pricePKR: 60,
    category: "paratha",
  },
  {
    id: "aloo-paratha",
    name: "Aloo Paratha",
    description: "Stuffed with spiced potato, served with achaar.",
    pricePKR: 120,
    category: "paratha",
    popular: true,
  },
  {
    id: "cheese-paratha",
    name: "Cheese Paratha",
    description: "Melted cheese sealed inside a crisp shell.",
    pricePKR: 180,
    category: "paratha",
  },
  {
    id: "anda-paratha",
    name: "Anda Paratha",
    description: "Egg fried into the layers. A 2 AM classic.",
    pricePKR: 140,
    category: "paratha",
  },
  // Snacks
  {
    id: "anda-khagina",
    name: "Anda Khagina",
    description: "Scrambled eggs with tomato, onion and green chilli.",
    pricePKR: 150,
    category: "snacks",
  },
  {
    id: "french-fries",
    name: "French Fries",
    description: "Hot, salted, chaat masala on request.",
    pricePKR: 150,
    category: "snacks",
  },
  {
    id: "samosa",
    name: "Samosa (2 pc)",
    description: "Crisp aloo samosas with imli chutney.",
    pricePKR: 60,
    category: "snacks",
  },
  {
    id: "bun-kabab",
    name: "Bun Kabab",
    description: "Shami kabab, egg and chutney in a toasted bun.",
    pricePKR: 120,
    category: "snacks",
    popular: true,
  },
  // Extras
  {
    id: "mineral-water",
    name: "Mineral Water",
    pricePKR: 60,
    category: "extras",
  },
  {
    id: "soft-drink",
    name: "Soft Drink",
    pricePKR: 80,
    category: "extras",
  },
];

export function formatPKR(pricePKR: number): string {
  return `Rs. ${pricePKR}`;
}
