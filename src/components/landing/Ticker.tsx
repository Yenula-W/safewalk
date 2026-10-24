"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const ITEMS = ["Report in 3 taps", "No account", "80 m route radius", "Cypress, TX", "Built by students"];

export default function Ticker() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to("[data-track]", { xPercent: -50, duration: 22, ease: "none", repeat: -1 });
    },
    { scope: root }
  );

  const row = ITEMS.map((t, i) => (
    <span key={i} className="display flex items-center gap-8 pr-8 text-[9vw] text-black md:text-[5vw]">
      {t}
      <span className="h-[0.45em] w-[0.45em] rounded-full bg-black" />
    </span>
  ));

  return (
    <div ref={root} className="relative z-10 -rotate-1 overflow-hidden bg-signal py-3">
      <div data-track className="flex w-max whitespace-nowrap">
        <div className="flex">{row}</div>
        <div className="flex" aria-hidden>{row}</div>
      </div>
    </div>
  );
}
