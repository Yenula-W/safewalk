import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SafeWalk — Know the walk before you take it";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card: the route mark, the name, the one-line promise. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0b0b0c",
          color: "#fff",
          fontFamily: "Arial Black, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#F5D03B" />
            <path d="M7 23 L13 15 L18 19 L24 10" stroke="#0a0a0a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="10" r="3.2" fill="#0a0a0a" />
          </svg>
          <div style={{ fontSize: 34, letterSpacing: 2, textTransform: "uppercase" }}>SafeWalk</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 150, lineHeight: 0.85, letterSpacing: -4, textTransform: "uppercase" }}>Know the walk</div>
          <div style={{ fontSize: 150, lineHeight: 0.85, letterSpacing: -4, textTransform: "uppercase", color: "#F5D03B" }}>
            before you take it.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "rgba(255,255,255,0.5)", letterSpacing: 4, textTransform: "uppercase" }}>
          <span>Crowdsourced route safety for students</span>
          <span>Cypress, TX</span>
        </div>
      </div>
    ),
    size
  );
}
