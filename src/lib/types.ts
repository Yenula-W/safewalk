export type Category =
  | "lighting"
  | "crossing"
  | "sidewalk"
  | "traffic"
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
  sidewalk: "Broken / missing sidewalk",
  traffic: "Fast or heavy traffic",
  unsafe_feeling: "Feels unsafe",
  other: "Other",
};
