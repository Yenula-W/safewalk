"use client";

import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { CATEGORY_LABELS, type LatLng, type Report } from "@/lib/types";

const SEVERITY_COLOR = ["", "#65a30d", "#ca8a04", "#ea580c", "#dc2626", "#7f1d1d"];

function ClickHandler({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({ click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }) });
  return null;
}

interface Props {
  center: LatLng;
  reports: Report[];
  pending: LatLng | null;
  route: { a: LatLng | null; b: LatLng | null };
  onPick: (p: LatLng) => void;
}

export default function SafeMap({ center, reports, pending, route, onPick }: Props) {
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={15} className="h-full w-full" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onPick={onPick} />
      {reports.map((r) => (
        <CircleMarker
          key={r.id}
          center={[r.lat, r.lng]}
          radius={6 + r.severity * 1.5}
          pathOptions={{ color: SEVERITY_COLOR[r.severity], fillOpacity: 0.55 }}
        >
          <Popup>
            <strong>{CATEGORY_LABELS[r.category]}</strong> (severity {r.severity}/5)
            {r.note && <div>{r.note}</div>}
            <div className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</div>
          </Popup>
        </CircleMarker>
      ))}
      {pending && <CircleMarker center={[pending.lat, pending.lng]} radius={9} pathOptions={{ color: "#2563eb", dashArray: "4" }} />}
      {route.a && <CircleMarker center={[route.a.lat, route.a.lng]} radius={8} pathOptions={{ color: "#16a34a", fillOpacity: 1 }} />}
      {route.b && <CircleMarker center={[route.b.lat, route.b.lng]} radius={8} pathOptions={{ color: "#7c3aed", fillOpacity: 1 }} />}
      {route.a && route.b && (
        <Polyline positions={[[route.a.lat, route.a.lng], [route.b.lat, route.b.lng]]} pathOptions={{ color: "#2563eb", dashArray: "8" }} />
      )}
    </MapContainer>
  );
}
