/* Wear history, analytics, and recommendations for the prototype. */
import { getGarment, type Category, type Garment } from "./wardrobe";
import { outfits } from "./outfits";

/* ---- Planner: a day can have a planned outfit (future) or a worn record (past) ---- */
export interface PlannedDay {
  date: string; // ISO-ish label
  weekday: string;
  dayNum: number;
  outfitId?: string;
  status: "worn" | "planned" | "empty";
  occasion?: string;
}

/* This week (planning) + recent past (history). 22 June is "today" (Sat). */
export const plannerDays: PlannedDay[] = [
  { date: "16 Jun", weekday: "Mon", dayNum: 16, outfitId: "o4", status: "worn", occasion: "Work" },
  { date: "17 Jun", weekday: "Tue", dayNum: 17, outfitId: "o3", status: "worn", occasion: "Daytime" },
  { date: "18 Jun", weekday: "Wed", dayNum: 18, outfitId: "o1", status: "worn", occasion: "Evening" },
  { date: "19 Jun", weekday: "Thu", dayNum: 19, outfitId: "o3", status: "worn", occasion: "Daytime" },
  { date: "20 Jun", weekday: "Fri", dayNum: 20, outfitId: "o2", status: "worn", occasion: "Travel" },
  { date: "21 Jun", weekday: "Fri", dayNum: 21, outfitId: "o4", status: "worn", occasion: "Work" },
  { date: "22 Jun", weekday: "Sat", dayNum: 22, outfitId: "o3", status: "planned", occasion: "Daytime" },
  { date: "23 Jun", weekday: "Sun", dayNum: 23, outfitId: "o1", status: "planned", occasion: "Evening" },
  { date: "24 Jun", weekday: "Mon", dayNum: 24, status: "empty" },
  { date: "25 Jun", weekday: "Tue", dayNum: 25, outfitId: "o4", status: "planned", occasion: "Work" },
  { date: "26 Jun", weekday: "Wed", dayNum: 26, status: "empty" },
];

export const pastOutfits = plannerDays
  .filter((d) => d.status === "worn" && d.outfitId)
  .reverse();

/* Month calendar (June) — outfit assigned per day for the month view. */
export interface CalCell {
  day: number | null; // null = padding cell
  outfitId?: string;
  status?: "worn" | "planned";
  today?: boolean;
}

const monthOutfit: Record<number, { id: string; status: "worn" | "planned" }> = {
  3: { id: "o3", status: "worn" },
  5: { id: "o1", status: "worn" },
  9: { id: "o4", status: "worn" },
  12: { id: "o2", status: "worn" },
  16: { id: "o4", status: "worn" },
  17: { id: "o3", status: "worn" },
  18: { id: "o1", status: "worn" },
  20: { id: "o2", status: "worn" },
  22: { id: "o3", status: "planned" },
  23: { id: "o1", status: "planned" },
  25: { id: "o4", status: "planned" },
  28: { id: "o2", status: "planned" },
};

/* June 2026 starts on a Monday; 30 days. Build a 5-week grid (Mon-first). */
export function juneGrid(): CalCell[] {
  const cells: CalCell[] = [];
  // June 1 2026 = Monday → 0 leading pads
  for (let d = 1; d <= 30; d++) {
    const o = monthOutfit[d];
    cells.push({ day: d, outfitId: o?.id, status: o?.status, today: d === 22 });
  }
  // pad to a multiple of 7
  while (cells.length % 7 !== 0) cells.push({ day: null });
  return cells;
}

/* Day-detail: dayparts the client can plan for a given day. */
export interface DayPart {
  part: string;
  time: string;
  outfitId?: string;
  occasion?: string;
}
export const sampleDayParts: DayPart[] = [
  { part: "Morning", time: "9:00", outfitId: "o3", occasion: "Café & errands" },
  { part: "Afternoon", time: "13:00", outfitId: "o4", occasion: "Boardroom" },
  { part: "Evening", time: "19:30", occasion: "Add a look" },
];

/* ---- Analytics ---- */
export interface WornStat {
  garmentId: string;
  wears: number;
}

/* Most-worn pieces (mock counts over the season). */
export const mostWorn: WornStat[] = [
  { garmentId: "g7", wears: 24 }, // tailored trousers
  { garmentId: "g1", wears: 19 }, // camel coat
  { garmentId: "g3", wears: 17 }, // wool knit
  { garmentId: "g9", wears: 15 }, // pumps
  { garmentId: "g4", wears: 12 }, // silk blouse
  { garmentId: "g10", wears: 11 }, // top-handle bag
];

/* Least-worn pieces — candidates to rotate back in. */
export const leastWorn: WornStat[] = [
  { garmentId: "g6", wears: 1 }, // slip dress
  { garmentId: "g15", wears: 1 }, // pearl earrings
  { garmentId: "g12", wears: 2 }, // sunglasses
  { garmentId: "g5", wears: 2 }, // pleated dress
  { garmentId: "g18", wears: 3 }, // neck scarf
  { garmentId: "g16", wears: 3 }, // felt hat
];

/* Category split for the wardrobe-usage donut/bars. */
export const categoryUsage: { category: Category; pct: number }[] = [
  { category: "Tailoring", pct: 24 },
  { category: "Knitwear", pct: 21 },
  { category: "Outerwear", pct: 18 },
  { category: "Tops", pct: 14 },
  { category: "Dresses", pct: 12 },
  { category: "Shoes", pct: 11 },
];

export const insightStats = {
  outfitsThisMonth: 22,
  newPieces: 3,
  mostWornColour: "Camel",
  neglectedCount: 28, // pieces not worn in 90 days
  utilisation: 64, // % of wardrobe worn this season
};

/* Pieces she rarely reaches for — surfaced to rotate back in. */
export const rediscover: Garment[] = ["g6", "g13", "g12", "g5"]
  .map(getGarment)
  .filter((g): g is Garment => Boolean(g));

/* ---- Recommendations engine (mock) ---- */
export interface OutfitRec {
  id: string;
  title: string;
  reason: string;
  garmentIds: string[];
}

export const outfitRecs: OutfitRec[] = [
  {
    id: "r1",
    title: "Cool-morning ease",
    reason: "For today's 14° & light cloud",
    garmentIds: ["g1", "g3", "g7", "g9"],
  },
  {
    id: "r2",
    title: "Rotate your slip dress",
    reason: "Not worn in 6 weeks · pairs with the blazer",
    garmentIds: ["g6", "g8", "g9"],
  },
  {
    id: "r3",
    title: "Effortless travel",
    reason: "Based on your Riviera Lunch look",
    garmentIds: ["g5", "g12", "g10"],
  },
];

export function recGarments(rec: OutfitRec): Garment[] {
  return rec.garmentIds.map(getGarment).filter((g): g is Garment => Boolean(g));
}

export { outfits, getGarment };
