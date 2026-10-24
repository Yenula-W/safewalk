"use client";

import NumberFlow from "@number-flow/react";
import { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

// Real properties of the product, not made-up traction numbers.
const STATS = [
  { value: 6, label: "hazard types you can report" },
  { value: 80, suffix: " m", label: "radius checked along your route" },
  { value: 0, label: "accounts, names or emails collected" },
  { value: 280, label: "character cap keeps notes anonymous" },
];

export default function Proof() {
  const root = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);

  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: root.current, start: "top 80%", once: true, onEnter: () => setLive(true) });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="border-t border-hairline">
      <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`px-5 py-10 md:px-8 md:py-14 ${i > 0 ? "border-l border-hairline" : ""} ${i >= 2 ? "border-t border-hairline md:border-t-0" : ""} ${i === 2 ? "border-l-0 md:border-l" : ""}`}
          >
            <div className="text-4xl font-medium tabular-nums tracking-tight md:text-5xl">
              <NumberFlow value={live ? s.value : 0} suffix={s.suffix} transformTiming={{ duration: 1200, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }} />
            </div>
            <p className="mt-2 text-sm text-foreground/50">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
