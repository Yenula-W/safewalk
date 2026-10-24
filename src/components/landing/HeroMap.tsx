"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import { gsap } from "@/lib/gsap";

const CENTER: [number, number] = [29.691, -95.697];

const PINS: { pos: [number, number]; color: string }[] = [
  { pos: [29.693, -95.696], color: "#ea580c" },
  { pos: [29.69, -95.694], color: "#dc2626" },
  { pos: [29.6945, -95.699], color: "#ca8a04" },
];

const ROUTE: [number, number][] = [
  [29.6955, -95.7005],
  [29.6895, -95.6935],
];

function pinIcon(color: string) {
  return L.divIcon({
    className: "hero-pin",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    html: `<span class="ring" style="--c:${color}"></span><span class="dot" style="--c:${color}"></span>`,
  });
}

/** Draws the route line once the SVG path exists. */
function RouteDraw() {
  const map = useMap();
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const path = map.getPane("overlayPane")?.querySelector<SVGPathElement>("path.hero-route");
      if (!path) return;
      const len = path.getTotalLength();
      // fromTo renders the start state immediately, so the line is hidden until it draws.
      gsap.fromTo(
        path,
        { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", delay: 0.9 }
      );
    });
    return () => cancelAnimationFrame(id);
  }, [map]);
  return null;
}

export default function HeroMap() {
  return (
    <MapContainer
      center={CENTER}
      zoom={15}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
      attributionControl
      className="dark-map hero-map h-full w-full bg-background"
    >
      {/* Standard OSM tiles, inverted to dark in CSS: no API key needed. */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {PINS.map((p, i) => (
        <Marker key={i} position={p.pos} icon={pinIcon(p.color)} interactive={false} />
      ))}
      <Polyline
        positions={ROUTE}
        pathOptions={{ className: "hero-route", color: "oklch(0.84 0.16 82)", weight: 2.5, lineCap: "round" }}
      />
      {ROUTE.map((p, i) => (
        <Marker key={`r${i}`} position={p} icon={pinIcon(i === 0 ? "#f5f5f5" : "oklch(0.84 0.16 82)")} interactive={false} />
      ))}
      <RouteDraw />
    </MapContainer>
  );
}
