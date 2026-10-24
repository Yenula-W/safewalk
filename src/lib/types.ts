export type Category =
  | "lighting"
  | "crossing"
  | "sidewalk"
  | "traffic"
  | "speeding"
  | "dogs"
  | "flooding"
  | "construction"
  | "isolated"
  | "unsafe_feeling"
  | "other";

export interface Report {
  id: string;
  lat: number;
  lng: number;
  category: Category;
  severity: number;
  note: string;
  created_at: string;
}

export type LatLng = { lat: number; lng: number };

export const CATEGORY_LABELS: Record<Category, string> = {
  lighting: "Poor lighting",
  crossing: "Unsafe crossing",
  sidewalk: "Sidewalk ends",
  traffic: "Heavy traffic",
  speeding: "Speeding cars",
  dogs: "Loose dogs",
  flooding: "Flooding / ditch",
  construction: "Construction",
  isolated: "Isolated stretch",
  unsafe_feeling: "Feels unsafe",
  other: "Other",
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

/** Severity 1–5 → colour, shared by the map and the landing page. */
export const SEVERITY_COLOR = ["", "#84cc16", "#eab308", "#f97316", "#ef4444", "#b91c1c"];
