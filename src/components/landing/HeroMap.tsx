"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { setWorkerUrl, Map as MapLibreMap, Marker, type GeoJSONSource } from "maplibre-gl";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { DARK_STYLE, YELLOW } from "@/lib/tiles";

const CENTER: [number, number] = [-95.697, 29.691];

const PINS: { pos: [number, number]; color: string }[] = [
  { pos: [-95.696, 29.693], color: "#f97316" },
  { pos: [-95.694, 29.69], color: "#ef4444" },
  { pos: [-95.699, 29.6945], color: "#eab308" },
];

const ROUTE: [number, number][] = [
  [-95.7005, 29.6955],
  [-95.6935, 29.6895],
];

function pinElement(color: string) {
  const el = document.createElement("div");
  el.className = "hero-pin";
  el.style.width = "12px";
  el.style.height = "12px";
  el.innerHTML = `<span class="ring" style="--c:${color}"></span><span class="dot" style="--c:${color}"></span>`;
  return el;
}

/** Non-interactive, slightly tilted map; the route draws itself once the style loads. */
export default function HeroMap() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
    const map = new MapLibreMap({
      container: container.current,
      style: DARK_STYLE,
      center: CENTER,
      zoom: 14.4,
      pitch: 38,
      bearing: -12,
      interactive: false,
      attributionControl: { compact: true },
    });

    const markers: Marker[] = [];
    let tween: gsap.core.Tween | null = null;

    map.on("load", () => {
      map.addSource("route", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-cap": "round" },
        paint: { "line-color": YELLOW, "line-width": 3 },
      });

      for (const p of PINS) markers.push(new Marker({ element: pinElement(p.color) }).setLngLat(p.pos).addTo(map));
      markers.push(new Marker({ element: pinElement("#f5f5f5") }).setLngLat(ROUTE[0]).addTo(map));
      markers.push(new Marker({ element: pinElement(YELLOW) }).setLngLat(ROUTE[1]).addTo(map));

      // Draw the line by extending its end point from A towards B.
      const src = map.getSource("route") as GeoJSONSource;
      const progress = { t: 0 };
      const [a, b] = ROUTE;
      tween = gsap.to(progress, {
        t: 1,
        duration: 1.6,
        delay: 0.9,
        ease: "power2.inOut",
        onUpdate: () => {
          const end: [number, number] = [a[0] + (b[0] - a[0]) * progress.t, a[1] + (b[1] - a[1]) * progress.t];
          src.setData({ type: "Feature", geometry: { type: "LineString", coordinates: [a, end] }, properties: {} });
        },
      });
    });

    const resize = new ResizeObserver(() => map.resize());
    resize.observe(container.current);
    return () => {
      tween?.kill();
      resize.disconnect();
      map.remove();
    };
  }, []);

  return <div ref={container} className="dark-map hero-map h-full w-full bg-background" />;
}
