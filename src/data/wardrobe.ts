/* Mock wardrobe data for the prototype. Realistic luxury items mapped to the
   curated editorial imagery in /public/wardrobe. This is the swappable seam —
   screens read from here; a real API would replace these arrays. */

export type Category =
  | "Outerwear"
  | "Knitwear"
  | "Tops"
  | "Dresses"
  | "Trousers"
  | "Tailoring"
  | "Shoes"
  | "Bags"
  | "Jewellery"
  | "Accessories";

export interface Garment {
  id: string;
  name: string;
  brand: string;
  category: Category;
  color: string;
  colorHex: string;
  fabric: string;
  pattern: string;
  formality: "Casual" | "Smart" | "Formal" | "Evening";
  seasons: string[];
  image: string;
  hanger?: string; // QR hanger code
  lastWorn?: string;
  favourite?: boolean;
  /* Extracted from a photo of the garment's care/composition label. */
  label?: LabelData;
}

/* Data read from a clothing label photo (care symbols, composition, origin). */
export interface LabelData {
  composition: string; // e.g. "100% Cashmere"
  care: string[]; // e.g. ["Dry clean only", "Do not bleach"]
  origin: string; // e.g. "Made in Italy"
  size: string; // e.g. "IT 42 / UK 10"
  styleCode?: string;
}

const img = (name: string) => `/wardrobe/${name}.jpg`;

export const garments: Garment[] = [
  {
    id: "g1",
    name: "Cashmere Overcoat",
    brand: "The Row",
    category: "Outerwear",
    color: "Camel",
    colorHex: "#b08d57",
    fabric: "Cashmere",
    pattern: "Solid",
    formality: "Smart",
    seasons: ["Autumn", "Winter"],
    image: img("coat"),
    hanger: "H-014",
    lastWorn: "14 March",
    favourite: true,
    label: {
      composition: "100% Cashmere",
      care: ["Dry clean only", "Do not bleach", "Cool iron"],
      origin: "Made in Italy",
      size: "IT 42 / UK 10",
      styleCode: "TR-OC-114",
    },
  },
  {
    id: "g2",
    name: "Belted Trench",
    brand: "Burberry",
    category: "Outerwear",
    color: "Honey",
    colorHex: "#caa56a",
    fabric: "Gabardine",
    pattern: "Solid",
    formality: "Smart",
    seasons: ["Spring", "Autumn"],
    image: img("trench"),
    hanger: "H-022",
    lastWorn: "2 April",
  },
  {
    id: "g3",
    name: "Ribbed Wool Knit",
    brand: "Loro Piana",
    category: "Knitwear",
    color: "Oatmeal",
    colorHex: "#d8cabb",
    fabric: "Merino Wool",
    pattern: "Ribbed",
    formality: "Casual",
    seasons: ["Autumn", "Winter"],
    image: img("knit"),
    hanger: "H-031",
    favourite: true,
    label: {
      composition: "90% Merino Wool, 10% Cashmere",
      care: ["Hand wash cold", "Dry flat", "Do not tumble dry"],
      origin: "Made in Scotland",
      size: "M",
      styleCode: "LP-RK-208",
    },
  },
  {
    id: "g4",
    name: "Silk Blouse",
    brand: "Equipment",
    category: "Tops",
    color: "Ivory",
    colorHex: "#f3ede1",
    fabric: "Silk",
    pattern: "Solid",
    formality: "Smart",
    seasons: ["All season"],
    image: img("blouse"),
    hanger: "H-040",
    lastWorn: "28 March",
  },
  {
    id: "g5",
    name: "Pleated Midi Dress",
    brand: "Toteme",
    category: "Dresses",
    color: "Sand",
    colorHex: "#cbb699",
    fabric: "Crêpe",
    pattern: "Solid",
    formality: "Smart",
    seasons: ["Spring", "Summer"],
    image: img("dress"),
    hanger: "H-052",
  },
  {
    id: "g6",
    name: "Bias-Cut Slip Dress",
    brand: "Bottega Veneta",
    category: "Dresses",
    color: "Champagne",
    colorHex: "#e3d2b0",
    fabric: "Silk Satin",
    pattern: "Solid",
    formality: "Evening",
    seasons: ["Summer"],
    image: img("silkdress"),
    hanger: "H-058",
    favourite: true,
  },
  {
    id: "g7",
    name: "Tailored Trousers",
    brand: "Max Mara",
    category: "Trousers",
    color: "Stone",
    colorHex: "#bcae97",
    fabric: "Virgin Wool",
    pattern: "Solid",
    formality: "Smart",
    seasons: ["All season"],
    image: img("trousers"),
    hanger: "H-063",
    lastWorn: "20 March",
  },
  {
    id: "g8",
    name: "Double-Breasted Blazer",
    brand: "Saint Laurent",
    category: "Tailoring",
    color: "Charcoal",
    colorHex: "#34322e",
    fabric: "Wool",
    pattern: "Solid",
    formality: "Formal",
    seasons: ["All season"],
    image: img("blazer"),
    hanger: "H-071",
  },
  {
    id: "g9",
    name: "Leather Pumps",
    brand: "Manolo Blahnik",
    category: "Shoes",
    color: "Nude",
    colorHex: "#cdb09a",
    fabric: "Calf Leather",
    pattern: "Solid",
    formality: "Formal",
    seasons: ["All season"],
    image: img("heels"),
    hanger: "S-004",
    favourite: true,
  },
  {
    id: "g10",
    name: "Structured Top-Handle Bag",
    brand: "Hermès",
    category: "Bags",
    color: "Tan",
    colorHex: "#b3905f",
    fabric: "Leather",
    pattern: "Solid",
    formality: "Smart",
    seasons: ["All season"],
    image: img("bag"),
    hanger: "A-011",
    favourite: true,
  },
  {
    id: "g11",
    name: "Cashmere Scarf",
    brand: "Johnstons of Elgin",
    category: "Accessories",
    color: "Camel",
    colorHex: "#bd9a68",
    fabric: "Cashmere",
    pattern: "Solid",
    formality: "Casual",
    seasons: ["Autumn", "Winter"],
    image: img("scarf"),
    hanger: "A-018",
  },
  {
    id: "g12",
    name: "Acetate Sunglasses",
    brand: "Celine",
    category: "Accessories",
    color: "Tortoise",
    colorHex: "#7a5a36",
    fabric: "Acetate",
    pattern: "Tortoiseshell",
    formality: "Casual",
    seasons: ["Spring", "Summer"],
    image: img("sunglasses"),
    hanger: "A-025",
  },
  {
    id: "g13",
    name: "Cropped Cardigan",
    brand: "Khaite",
    category: "Knitwear",
    color: "Cream",
    colorHex: "#e8ddc8",
    fabric: "Cashmere",
    pattern: "Solid",
    formality: "Casual",
    seasons: ["Spring", "Autumn"],
    image: img("knit2"),
    hanger: "H-035",
  },
  {
    id: "g14",
    name: "Gold Chain Necklace",
    brand: "Cartier",
    category: "Jewellery",
    color: "Gold",
    colorHex: "#c2a271",
    fabric: "18k Gold",
    pattern: "Solid",
    formality: "Formal",
    seasons: ["All season"],
    image: img("jewellery"),
    hanger: "J-002",
    favourite: true,
  },
  {
    id: "g15",
    name: "Pearl Drop Earrings",
    brand: "Mikimoto",
    category: "Jewellery",
    color: "Ivory",
    colorHex: "#f3ede1",
    fabric: "Pearl & Gold",
    pattern: "Solid",
    formality: "Evening",
    seasons: ["All season"],
    image: img("earrings"),
    hanger: "J-005",
  },
  {
    id: "g16",
    name: "Wide-Brim Felt Hat",
    brand: "Maison Michel",
    category: "Accessories",
    color: "Camel",
    colorHex: "#bd9a68",
    fabric: "Wool Felt",
    pattern: "Solid",
    formality: "Smart",
    seasons: ["Autumn", "Winter"],
    image: img("hat"),
    hanger: "A-030",
  },
  {
    id: "g17",
    name: "Leather Waist Belt",
    brand: "Hermès",
    category: "Accessories",
    color: "Tan",
    colorHex: "#b3905f",
    fabric: "Calf Leather",
    pattern: "Solid",
    formality: "Smart",
    seasons: ["All season"],
    image: img("belt"),
    hanger: "A-033",
  },
  {
    id: "g18",
    name: "Silk Neck Scarf",
    brand: "Hermès",
    category: "Accessories",
    color: "Champagne",
    colorHex: "#e3d2b0",
    fabric: "Silk Twill",
    pattern: "Print",
    formality: "Smart",
    seasons: ["Spring", "Summer"],
    image: img("neckscarf"),
    hanger: "A-036",
  },
  {
    id: "g19",
    name: "Ribbed Cashmere Socks",
    brand: "Loro Piana",
    category: "Accessories",
    color: "Oatmeal",
    colorHex: "#d8cabb",
    fabric: "Cashmere",
    pattern: "Ribbed",
    formality: "Casual",
    seasons: ["Autumn", "Winter"],
    image: img("socks"),
    hanger: "A-040",
  },
];

export const categories: Category[] = [
  "Outerwear",
  "Knitwear",
  "Tops",
  "Dresses",
  "Trousers",
  "Tailoring",
  "Shoes",
  "Bags",
  "Jewellery",
  "Accessories",
];

export const colorFacets = [
  { name: "Ivory", hex: "#f3ede1" },
  { name: "Camel", hex: "#b08d57" },
  { name: "Stone", hex: "#bcae97" },
  { name: "Charcoal", hex: "#34322e" },
  { name: "Tan", hex: "#b3905f" },
  { name: "Champagne", hex: "#e3d2b0" },
];

export const brands = [
  "The Row", "Burberry", "Loro Piana", "Hermès", "Saint Laurent",
  "Max Mara", "Bottega Veneta", "Celine", "Cartier", "Khaite",
];

export const fabrics = [
  "Cashmere", "Silk", "Wool", "Leather", "Cotton", "Gabardine",
];

export const formalities = ["Casual", "Smart", "Formal", "Evening"] as const;

export const seasons = ["Spring", "Summer", "Autumn", "Winter"];

export function getGarment(id: string): Garment | undefined {
  return garments.find((g) => g.id === id);
}
