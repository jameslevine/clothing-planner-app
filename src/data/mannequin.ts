/* Body-zone definitions for the interactive mannequin outfit builder.
   A neutral, faceless feminine figure. Each zone maps to wardrobe categories
   and is positioned (in %) over the figure so a + hotspot sits on the right
   body area. No likeness, no photo — privacy-safe by design. */
import type { Category } from "./wardrobe";

export interface BodyZone {
  id: string;
  label: string;
  categories: Category[];
  /* hotspot position as % of the mannequin frame */
  x: number;
  y: number;
  /* default filled garment for the demo (optional) */
  defaultGarment?: string;
}

export const bodyZones: BodyZone[] = [
  { id: "hat", label: "Hat", categories: ["Accessories"], x: 50, y: 6 },
  { id: "earrings", label: "Earrings", categories: ["Jewellery"], x: 61, y: 12 },
  { id: "eyewear", label: "Eyewear", categories: ["Accessories"], x: 39, y: 11 },
  { id: "necklace", label: "Necklace", categories: ["Jewellery"], x: 50, y: 22 },
  { id: "scarf", label: "Neck Scarf", categories: ["Accessories"], x: 37, y: 24 },
  { id: "top", label: "Top", categories: ["Tops", "Knitwear"], x: 50, y: 36 },
  { id: "outerwear", label: "Outerwear", categories: ["Outerwear", "Tailoring"], x: 26, y: 40 },
  { id: "bag", label: "Bag", categories: ["Bags"], x: 76, y: 50 },
  { id: "belt", label: "Belt", categories: ["Accessories"], x: 50, y: 52 },
  { id: "bottom", label: "Bottom", categories: ["Trousers", "Dresses"], x: 50, y: 64 },
  { id: "socks", label: "Socks / Hosiery", categories: ["Accessories"], x: 57, y: 84 },
  { id: "shoes", label: "Shoes", categories: ["Shoes"], x: 45, y: 94 },
];

/* The demo "filled" outfit used when entering from a recommendation. */
export const sampleFilled: Record<string, string> = {
  outerwear: "g1",
  top: "g3",
  bottom: "g7",
  shoes: "g9",
  bag: "g10",
  necklace: "g14",
};
