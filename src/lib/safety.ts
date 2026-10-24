import type { LatLng, Report } from "./types";

const EARTH_M = 6371000;
const rad = (d: number) => (d * Math.PI) / 180;

export function distanceM(a: LatLng, b: LatLng): number {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_M * Math.asin(Math.sqrt(h));
}

/** Distance in metres from point p to the segment a-b (local flat approximation). */
export function distanceToSegmentM(p: LatLng, a: LatLng, b: LatLng): number {
  const k = Math.cos(rad(a.lat));
  const px = p.lng * k, py = p.lat;
  const ax = a.lng * k, ay = a.lat;
  const bx = b.lng * k, by = b.lat;
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  const closest = { lat: ay + t * dy, lng: (ax + t * dx) / k };
  return distanceM(p, closest);
}

export interface RouteAssessment {
  score: number; // 0 (risky) .. 100 (clear)
  label: "Looks clear" | "Use caution" | "Risky";
  nearby: Report[];
  lengthM: number;
}

/** Reports within `radiusM` of the straight line A→B, weighted by severity and recency. */
export function assessRoute(
  a: LatLng,
  b: LatLng,
  reports: Report[],
  radiusM = 80,
  now = Date.now()
): RouteAssessment {
  const lengthM = distanceM(a, b);
  const nearby = reports.filter((r) => distanceToSegmentM(r, a, b) <= radiusM);
  const penalty = nearby.reduce((sum, r) => {
    const ageDays = (now - new Date(r.created_at).getTime()) / 86_400_000;
    const recency = ageDays <= 30 ? 1 : ageDays <= 180 ? 0.7 : 0.4;
    return sum + r.severity * 4 * recency;
  }, 0);
  const score = Math.max(0, Math.round(100 - penalty));
  const label = score >= 75 ? "Looks clear" : score >= 45 ? "Use caution" : "Risky";
  return { score, label, nearby, lengthM };
}
