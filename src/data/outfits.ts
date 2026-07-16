/* Mock outfits, folders, weather, and hanger data for the prototype. */

export interface Outfit {
  id: string;
  name: string;
  garmentIds: string[];
  folder: string;
  occasion?: string;
}

export interface Folder {
  id: string;
  name: string;
  count: number;
  cover: string;
}

export const outfits: Outfit[] = [
  {
    id: "o1",
    name: "Gallery Opening",
    garmentIds: ["g8", "g4", "g7", "g9", "g10"],
    folder: "Evenings",
    occasion: "Evening",
  },
  {
    id: "o2",
    name: "Riviera Lunch",
    garmentIds: ["g6", "g12", "g9"],
    folder: "Travel",
    occasion: "Daytime",
  },
  {
    id: "o3",
    name: "City Mornings",
    garmentIds: ["g1", "g3", "g7", "g11"],
    folder: "Everyday",
    occasion: "Daytime",
  },
  {
    id: "o4",
    name: "Boardroom",
    garmentIds: ["g8", "g4", "g7", "g9"],
    folder: "Work",
    occasion: "Formal",
  },
];

export const folders: Folder[] = [
  { id: "f1", name: "Evenings", count: 8, cover: "/wardrobe/silkdress.jpg" },
  { id: "f2", name: "Travel", count: 12, cover: "/wardrobe/dress.jpg" },
  { id: "f3", name: "Everyday", count: 21, cover: "/wardrobe/knit.jpg" },
  { id: "f4", name: "Work", count: 9, cover: "/wardrobe/blazer.jpg" },
];

export const weather = {
  city: "London",
  tempC: 14,
  condition: "Light cloud",
  high: 17,
  low: 9,
  summary: "Mild with a cool breeze — a light layer is ideal.",
  hourly: [
    { time: "8a", t: 11 },
    { time: "10a", t: 13 },
    { time: "12p", t: 15 },
    { time: "2p", t: 17 },
    { time: "4p", t: 16 },
    { time: "6p", t: 13 },
  ],
};

export const today = {
  weekday: "Saturday",
  date: "22 June",
};

/* Hanger → garment map for the admin QR scan view. */
export const hangers: Record<string, string[]> = {
  "H-014": ["g1"],
  "H-022": ["g2"],
  "H-031": ["g3", "g13"],
  "H-071": ["g8"],
};
