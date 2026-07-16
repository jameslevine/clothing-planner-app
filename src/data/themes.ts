/* Theme-based outfit generation + activity tracking + profile constants. */
import { getGarment, type Garment } from "./wardrobe";

export const APP_VERSION = "1.0.0 (build 142)";

/* ---- Shuffle / theme generator ---- */
export interface Theme {
  id: string;
  label: string;
  hint: string;
}

export const eventThemes: Theme[] = [
  { id: "dinner", label: "Dinner Party", hint: "Refined, evening-ready" },
  { id: "wedding", label: "Wedding Guest", hint: "Elegant, celebratory" },
  { id: "funeral", label: "Funeral", hint: "Sombre, respectful" },
  { id: "work", label: "Boardroom", hint: "Sharp, tailored" },
  { id: "weekend", label: "Weekend", hint: "Relaxed, easy" },
  { id: "travel", label: "Travel", hint: "Comfortable, polished" },
];

export const colourThemes: Theme[] = [
  { id: "neutral", label: "Neutral", hint: "Ivory · camel · stone" },
  { id: "monochrome", label: "Monochrome", hint: "Charcoal · black" },
  { id: "warm", label: "Warm", hint: "Tan · champagne · brass" },
];

/* Three generated looks for the default (Dinner Party) theme. */
export interface GeneratedLook {
  id: string;
  name: string;
  garmentIds: string[];
}

export const generatedLooks: Record<string, GeneratedLook[]> = {
  dinner: [
    { id: "gl1", name: "Option 1 · Quiet drama", garmentIds: ["g6", "g8", "g9", "g14"] },
    { id: "gl2", name: "Option 2 · Soft evening", garmentIds: ["g4", "g7", "g9", "g15"] },
    { id: "gl3", name: "Option 3 · Tailored ease", garmentIds: ["g8", "g4", "g7", "g10"] },
  ],
  wedding: [
    { id: "gl4", name: "Option 1 · Romantic", garmentIds: ["g5", "g16", "g9", "g15"] },
    { id: "gl5", name: "Option 2 · Sleek", garmentIds: ["g6", "g9", "g10", "g14"] },
    { id: "gl6", name: "Option 3 · Polished", garmentIds: ["g4", "g7", "g9", "g18"] },
  ],
  funeral: [
    { id: "gl7", name: "Option 1 · Sombre", garmentIds: ["g8", "g4", "g7", "g9"] },
    { id: "gl8", name: "Option 2 · Restrained", garmentIds: ["g1", "g8", "g7", "g9"] },
    { id: "gl9", name: "Option 3 · Quiet", garmentIds: ["g8", "g3", "g7", "g9"] },
  ],
};

export function looksForTheme(themeId: string): GeneratedLook[] {
  return generatedLooks[themeId] ?? generatedLooks.dinner;
}

export function lookGarments(look: GeneratedLook): Garment[] {
  return look.garmentIds.map(getGarment).filter((g): g is Garment => Boolean(g));
}

/* "Style N looks around this item" — outfits built around a chosen piece. */
export function looksAroundItem(itemId: string): GeneratedLook[] {
  // simple deterministic pairing for the prototype
  const pools = [
    ["g8", "g9", "g14"],
    ["g7", "g10", "g18"],
    ["g1", "g9", "g15"],
  ];
  return pools.map((extra, i) => ({
    id: `around-${itemId}-${i}`,
    name: `Look ${i + 1}`,
    garmentIds: [itemId, ...extra.filter((x) => x !== itemId)],
  }));
}

/* ---- Activity tracking (admin portal) ---- */
export interface Activity {
  id: string;
  who: string;
  initials: string;
  action: string;
  target: string;
  time: string;
  type: "upload" | "outfit" | "edit" | "login" | "share";
}

export const activityFeed: Activity[] = [
  { id: "a1", who: "Sofia M.", initials: "SM", action: "added", target: "Pearl Drop Earrings", time: "12 min ago", type: "upload" },
  { id: "a2", who: "Eleanor", initials: "EL", action: "created outfit", target: "Quiet drama", time: "38 min ago", type: "outfit" },
  { id: "a3", who: "James O.", initials: "JO", action: "prepared", target: "Boardroom · 25 Jun", time: "1 hr ago", type: "outfit" },
  { id: "a4", who: "Lena P.", initials: "LP", action: "edited tags on", target: "Cashmere Overcoat", time: "2 hrs ago", type: "edit" },
  { id: "a5", who: "Eleanor", initials: "EL", action: "shared", target: "Gala vote", time: "3 hrs ago", type: "share" },
  { id: "a6", who: "Marco R.", initials: "MR", action: "signed in", target: "", time: "4 hrs ago", type: "login" },
  { id: "a7", who: "Sofia M.", initials: "SM", action: "added", target: "Silk Neck Scarf", time: "Yesterday", type: "upload" },
  { id: "a8", who: "James O.", initials: "JO", action: "created outfit", target: "Riviera Lunch", time: "Yesterday", type: "outfit" },
];

export const activityStats = {
  outfitsCreated: 34,
  itemsAdded: 12,
  activeStaff: 4,
  lastSync: "Just now",
};

/* per-staff activity volume for the simple bar chart */
export const staffActivity = [
  { name: "Sofia M.", initials: "SM", actions: 86 },
  { name: "James O.", initials: "JO", actions: 64 },
  { name: "Lena P.", initials: "LP", actions: 41 },
  { name: "Marco R.", initials: "MR", actions: 18 },
];
