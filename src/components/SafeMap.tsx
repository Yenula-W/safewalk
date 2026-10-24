"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { DARK_TILES } from "@/lib/tiles";
import { CATEGORY_LABELS, SEVERITY_COLOR, type LatLng, type Report } from "@/lib/types";

const YELLOW = "oklch(0.9 0.19 98)";

interface Props {
  center: LatLng;
  reports: Report[];
  pending: LatLng | null;
  route: { a: LatLng | null; b: LatLng | null };
  focus: LatLng | null;
  onPick: (p: LatLng) => void;
}

export default function SafeMap({ center, reports, pending, route, focus, onPick }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const initialCenter = useRef(center);

  // Each effect setup owns a fresh map. Strict Mode and Fast Refresh may run
  // setup/cleanup again; never reuse the instance that cleanup has removed.
  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current).setView(
      [initialCenter.current.lat, initialCenter.current.lng], 15
    );
    mapRef.current = map;
    // Esri's dark canvas needs no API key and isn't rate-limited like tile.openstreetmap.org.
    L.tileLayer(DARK_TILES.base, { attribution: DARK_TILES.attribution, maxNativeZoom: 16, maxZoom: 19 }).addTo(map);
    L.tileLayer(DARK_TILES.labels, { maxNativeZoom: 16, maxZoom: 19, pane: "overlayPane", opacity: 0.9 }).addTo(map);
    const resize = new ResizeObserver(() => map.invalidateSize());
    resize.observe(container.current);
    return () => {
      resize.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const click = (event: L.LeafletMouseEvent) => onPick({ lat: event.latlng.lat, lng: event.latlng.lng });
    map.on("click", click);
    return () => { map.off("click", click); };
  }, [onPick]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const layers = L.layerGroup().addTo(map);
    for (const report of reports) {
      const popup = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = CATEGORY_LABELS[report.category];
      popup.append(title, ` · severity ${report.severity}/5`);
      if (report.note) {
        const note = document.createElement("div");
        note.className = "mt-1 opacity-80";
        note.textContent = report.note;
        popup.append(note);
      }
      const date = document.createElement("div");
      date.className = "mt-1 text-xs opacity-50";
      date.textContent = new Date(report.created_at).toLocaleDateString();
      popup.append(date);
      L.circleMarker([report.lat, report.lng], {
        radius: 6 + report.severity * 1.5,
        color: SEVERITY_COLOR[report.severity],
        fillColor: SEVERITY_COLOR[report.severity], fillOpacity: 0.55, weight: 2,
      }).bindPopup(popup).addTo(layers);
    }
    return () => { layers.remove(); };
  }, [reports]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const layers = L.layerGroup().addTo(map);
    if (pending) L.circleMarker([pending.lat, pending.lng], { radius: 10, color: YELLOW, fillColor: YELLOW, fillOpacity: 0.3, dashArray: "4" }).addTo(layers);
    if (route.a) L.circleMarker([route.a.lat, route.a.lng], { radius: 8, color: "#fff", fillColor: "#fff", fillOpacity: 1 }).addTo(layers);
    if (route.b) L.circleMarker([route.b.lat, route.b.lng], { radius: 8, color: YELLOW, fillColor: YELLOW, fillOpacity: 1 }).addTo(layers);
    if (route.a && route.b) L.polyline([[route.a.lat, route.a.lng], [route.b.lat, route.b.lng]], { color: YELLOW, weight: 3, dashArray: "8 10", lineCap: "round" }).addTo(layers);
    if (focus) L.circleMarker([focus.lat, focus.lng], { radius: 7, color: "#60a5fa", fillColor: "#60a5fa", fillOpacity: 0.9 }).addTo(layers);
    return () => { layers.remove(); };
  }, [pending, route, focus]);

  useEffect(() => {
    if (focus) mapRef.current?.flyTo([focus.lat, focus.lng], 16, { duration: 1.2 });
  }, [focus]);

  return <div ref={container} className="dark-map h-full w-full bg-background" />;
}
