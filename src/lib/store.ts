import { createClient } from "@supabase/supabase-js";
import type { Report } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = url && key ? createClient(url, key) : null;

export const isDemoMode = !supabase;

const LS_KEY = "safewalk-demo-reports";
const lat0 = Number(process.env.NEXT_PUBLIC_MAP_LAT ?? 29.691);
const lng0 = Number(process.env.NEXT_PUBLIC_MAP_LNG ?? -95.697);

// Clearly-labelled sample pins so the demo isn't empty. Replace with real walks.
function sampleReports(): Report[] {
  const now = new Date().toISOString();
  const mk = (i: number, dLat: number, dLng: number, category: Report["category"], severity: number, note: string): Report => ({
    id: `sample-${i}`, lat: lat0 + dLat, lng: lng0 + dLng, category, severity, note: `[sample] ${note}`, created_at: now,
  });
  return [
    mk(1, 0.002, 0.001, "lighting", 4, "Streetlight out near bus stop"),
    mk(2, -0.001, 0.003, "crossing", 5, "No crosswalk on wide road"),
    mk(3, 0.0035, -0.002, "sidewalk", 3, "Sidewalk ends, walk on the road"),
  ];
}

export async function loadReports(): Promise<Report[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("reports").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) throw error;
    return data as Report[];
  }
  try {
    const raw = localStorage.getItem(LS_KEY);
    return [...(raw ? (JSON.parse(raw) as Report[]) : []), ...sampleReports()];
  } catch {
    return sampleReports();
  }
}

export async function addReport(r: Omit<Report, "id" | "created_at">): Promise<Report> {
  if (supabase) {
    const { data, error } = await supabase.from("reports").insert(r).select().single();
    if (error) throw error;
    return data as Report;
  }
  const full: Report = { ...r, id: crypto.randomUUID(), created_at: new Date().toISOString() };
  try {
    const raw = localStorage.getItem(LS_KEY);
    const list = raw ? (JSON.parse(raw) as Report[]) : [];
    localStorage.setItem(LS_KEY, JSON.stringify([...list, full]));
  } catch {}
  return full;
}
