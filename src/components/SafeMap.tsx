"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { CATEGORY_LABELS, SEVERITY_COLOR, type LatLng, type Report } from "@/lib/types";

const YELLOW = "oklch(0.9 0.19 98)";

function ClickHandler({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({ click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }) });
  return null;
}

/** Flies the map to `target` whenever it changes (used by "Use my location"). */
function FlyTo({ target }: { target: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 16, { duration: 1.2 });
  }, [map, target]);
  return null;
}

interface Props {
  center: LatLng;
  reports: Report[];
  pending: LatLng | null;
  route: { a: LatLng | null; b: LatLng | null };
  focus: LatLng | null;
  onPick: (p: LatLng) => void;
}

export default function SafeMap({ center, reports, pending, route, focus, onPick }: Props) {
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={15} className="dark-map h-full w-full bg-background" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onPick={onPick} />
      <FlyTo target={focus} />
      {reports.map((r) => (
        <CircleMarker
          key={r.id}
          center={[r.lat, r.lng]}
          radius={6 + r.severity * 1.5}
          pathOptions={{ color: SEVERITY_COLOR[r.severity], fillColor: SEVERITY_COLOR[r.severity], fillOpacity: 0.55, weight: 2 }}
        >
          <Popup>
            <strong>{CATEGORY_LABELS[r.category]}</strong> · severity {r.severity}/5
            {r.note && <div className="mt-1 opacity-80">{r.note}</div>}
            <div className="mt-1 text-xs opacity-50">{new Date(r.created_at).toLocaleDateString()}</div>
          </Popup>
        </CircleMarker>
      ))}
      {pending && <CircleMarker center={[pending.lat, pending.lng]} radius={10} pathOptions={{ color: YELLOW, fillColor: YELLOW, fillOpacity: 0.3, dashArray: "4" }} />}
      {route.a && <CircleMarker center={[route.a.lat, route.a.lng]} radius={8} pathOptions={{ color: "#fff", fillColor: "#fff", fillOpacity: 1 }} />}
      {route.b && <CircleMarker center={[route.b.lat, route.b.lng]} radius={8} pathOptions={{ color: YELLOW, fillColor: YELLOW, fillOpacity: 1 }} />}
      {route.a && route.b && (
        <Polyline positions={[[route.a.lat, route.a.lng], [route.b.lat, route.b.lng]]} pathOptions={{ color: YELLOW, weight: 3, dashArray: "8 10", lineCap: "round" }} />
      )}
      {focus && <CircleMarker center={[focus.lat, focus.lng]} radius={7} pathOptions={{ color: "#60a5fa", fillColor: "#60a5fa", fillOpacity: 0.9 }} />}
    </MapContainer>
  );
}
