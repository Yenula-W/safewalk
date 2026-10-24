"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { setWorkerUrl, Map as MapLibreMap, NavigationControl, Popup, type GeoJSONSource, type MapMouseEvent } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { DARK_STYLE, YELLOW } from "@/lib/tiles";
import { CATEGORY_LABELS, SEVERITY_COLOR, type LatLng, type Report } from "@/lib/types";

interface Props {
  center: LatLng;
  reports: Report[];
  pending: LatLng | null;
  route: { a: LatLng | null; b: LatLng | null };
  focus: LatLng | null;
  onPick: (p: LatLng) => void;
}

const EMPTY: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [] };

function reportsToGeoJSON(reports: Report[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: reports.map((r) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [r.lng, r.lat] },
      properties: {
        id: r.id,
        label: CATEGORY_LABELS[r.category],
        severity: r.severity,
        color: SEVERITY_COLOR[r.severity],
        note: r.note,
        date: new Date(r.created_at).toLocaleDateString(),
      },
    })),
  };
}

function overlayToGeoJSON(pending: LatLng | null, route: Props["route"], focus: LatLng | null): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  const point = (p: LatLng, props: Record<string, unknown>): GeoJSON.Feature => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [p.lng, p.lat] },
    properties: props,
  });
  if (pending) features.push(point(pending, { r: 11, color: YELLOW, fill: 0.25 }));
  if (route.a) features.push(point(route.a, { r: 7, color: "#ffffff", fill: 1 }));
  if (route.b) features.push(point(route.b, { r: 7, color: YELLOW, fill: 1 }));
  if (route.a && route.b) {
    features.push({
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[route.a.lng, route.a.lat], [route.b.lng, route.b.lat]] },
      properties: {},
    });
  }
  if (focus) features.push(point(focus, { r: 6, color: "#60a5fa", fill: 0.9 }));
  return { type: "FeatureCollection", features };
}

/** Builds a popup body from untrusted report text without innerHTML. */
function popupContent(p: Record<string, string>) {
  const root = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = p.label;
  root.append(title, ` · severity ${p.severity}/5`);
  if (p.note) {
    const note = document.createElement("div");
    note.className = "mt-1 opacity-80";
    note.textContent = p.note;
    root.append(note);
  }
  const date = document.createElement("div");
  date.className = "mt-1 text-xs opacity-50";
  date.textContent = p.date;
  root.append(date);
  return root;
}

export default function SafeMap({ center, reports, pending, route, focus, onPick }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const onPickRef = useRef(onPick);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  // One map per mount; Strict Mode runs this twice and the cleanup removes the first.
  useEffect(() => {
    if (!container.current) return;
    setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
    const map = new MapLibreMap({
      container: container.current,
      style: DARK_STYLE,
      center: [center.lng, center.lat],
      zoom: 14.6,
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    map.addControl(new NavigationControl({ showCompass: false }), "top-left");

    map.on("load", () => {
      map.addSource("reports", { type: "geojson", data: EMPTY });
      map.addLayer({
        id: "reports-halo",
        type: "circle",
        source: "reports",
        paint: {
          "circle-radius": ["+", 9, ["*", ["get", "severity"], 3]],
          "circle-color": ["get", "color"],
          "circle-opacity": 0.22,
        },
      });
      map.addLayer({
        id: "reports",
        type: "circle",
        source: "reports",
        paint: {
          "circle-radius": ["+", 4, ["*", ["get", "severity"], 1.4]],
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#0b0b0c",
          "circle-stroke-width": 1.5,
        },
      });
      map.addSource("overlay", { type: "geojson", data: EMPTY });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "overlay",
        filter: ["==", "$type", "LineString"],
        layout: { "line-cap": "round" },
        paint: { "line-color": YELLOW, "line-width": 3, "line-dasharray": [1.5, 2] },
      });
      map.addLayer({
        id: "overlay-points",
        type: "circle",
        source: "overlay",
        filter: ["==", "$type", "Point"],
        paint: {
          "circle-radius": ["get", "r"],
          "circle-color": ["get", "color"],
          "circle-opacity": ["get", "fill"],
          "circle-stroke-color": ["get", "color"],
          "circle-stroke-width": 2,
        },
      });

      map.on("mouseenter", "reports", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "reports", () => (map.getCanvas().style.cursor = ""));
      map.on("click", (e: MapMouseEvent) => {
        const hit = map.queryRenderedFeatures(e.point, { layers: ["reports"] })[0];
        if (hit) {
          const [lng, lat] = (hit.geometry as GeoJSON.Point).coordinates;
          new Popup({ closeButton: false, offset: 14, className: "sw-popup" })
            .setLngLat([lng, lat])
            .setDOMContent(popupContent(hit.properties as Record<string, string>))
            .addTo(map);
          return;
        }
        onPickRef.current({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      });
      setReady(true);
    });

    const resize = new ResizeObserver(() => map.resize());
    resize.observe(container.current);
    return () => {
      resize.disconnect();
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
    // The initial centre is only read once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    (mapRef.current?.getSource("reports") as GeoJSONSource | undefined)?.setData(reportsToGeoJSON(reports));
  }, [reports, ready]);

  useEffect(() => {
    if (!ready) return;
    (mapRef.current?.getSource("overlay") as GeoJSONSource | undefined)?.setData(overlayToGeoJSON(pending, route, focus));
  }, [pending, route, focus, ready]);

  useEffect(() => {
    if (focus) mapRef.current?.flyTo({ center: [focus.lng, focus.lat], zoom: 16, duration: 1200 });
  }, [focus]);

  return <div ref={container} className="dark-map h-full w-full bg-background" />;
}
