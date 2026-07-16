/* Bulk-upload draft queue + enrichment status for the admin portal. */
import type { LabelData } from "./wardrobe";

export type EnrichStatus = "analysing" | "draft" | "needs-review";

export interface DraftItem {
  id: string;
  image: string;
  status: EnrichStatus;
  /* AI-extracted attributes (present once analysed) */
  type?: string;
  category?: string;
  colour?: string;
  brand?: string;
  confidence?: number; // overall %
  label?: LabelData; // present if a label photo was attached
}

/* A bulk upload of 8 photos mid-enrichment: some still analysing,
   most landed in draft, a couple flagged for review. */
export const draftQueue: DraftItem[] = [
  { id: "d1", image: "/wardrobe/blazer.jpg", status: "draft", type: "Blazer", category: "Tailoring", colour: "Charcoal", brand: "Saint Laurent", confidence: 97 },
  { id: "d2", image: "/wardrobe/dress.jpg", status: "draft", type: "Midi Dress", category: "Dresses", colour: "Sand", brand: "Toteme", confidence: 95 },
  { id: "d3", image: "/wardrobe/heels.jpg", status: "draft", type: "Pumps", category: "Shoes", colour: "Nude", brand: "Manolo Blahnik", confidence: 92 },
  { id: "d4", image: "/wardrobe/bag.jpg", status: "needs-review", type: "Top-Handle Bag", category: "Bags", colour: "Tan", brand: "—", confidence: 64 },
  { id: "d5", image: "/wardrobe/scarf.jpg", status: "draft", type: "Scarf", category: "Accessories", colour: "Camel", brand: "Johnstons", confidence: 90 },
  { id: "d6", image: "/wardrobe/trousers.jpg", status: "needs-review", type: "Trousers", category: "Trousers", colour: "Stone", brand: "—", confidence: 58 },
  { id: "d7", image: "/wardrobe/silkdress.jpg", status: "analysing" },
  { id: "d8", image: "/wardrobe/knit2.jpg", status: "analysing" },
];

export const uploadStats = {
  total: 8,
  analysing: 2,
  draft: 4,
  needsReview: 2,
};

/* Label data freshly extracted from a label photo (for the capture flow demo). */
export const extractedLabel: LabelData = {
  composition: "100% Cashmere",
  care: ["Dry clean only", "Do not bleach", "Cool iron", "Do not tumble dry"],
  origin: "Made in Italy",
  size: "IT 42 / UK 10",
  styleCode: "TR-OC-114",
};
