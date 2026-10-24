"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Full-bleed split scene: the score counts down from 100 as you scroll. */
export default function Score() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const num = { v: 100 };
      const el = root.current?.querySelector<HTMLElement>("[data-big]");
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=360%", pin: true, scrub: 0.8 },
        })
        .to(num, {
          v: 52,
          ease: "none",
          onUpdate: () => {
            if (el) el.textContent = String(Math.round(num.v));
          },
        }, 0)
        // Yellow starts full-bleed and retreats to the left half, revealing the route.
        .fromTo("[data-split]", { width: "100%" }, { width: window.innerWidth >= 768 ? "50%" : "100%", ease: "none", duration: 0.6 }, 0)
        .fromTo("[data-label]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: "none" }, 0.5)
        .fromTo("[data-pin]", { scale: 0 }, { scale: 1, stagger: 0.12, ease: "back.out(2)" }, 0.3);
    },
    { scope: root }
  );

  return (
    <section id="score" ref={root} className="pin-scene relative h-[100svh] overflow-hidden bg-background">
      <div data-split className="absolute inset-y-0 left-0 w-full bg-signal" />

      <div className="relative grid h-full md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 text-black md:px-12">
          <span data-big className="display text-[44vw] leading-[0.8] md:text-[22vw]">100</span>
          <p data-label className="mt-2 text-xs uppercase tracking-[0.22em]">
            of 100 · Use caution
          </p>
        </div>

        <div className="relative hidden items-center justify-center md:flex">
          {/* Straight-line route with the three reports that drag the score down. */}
          <svg viewBox="0 0 400 400" className="h-[70vh] w-auto">
            <line x1="60" y1="330" x2="340" y2="70" stroke="oklch(0.9 0.19 98)" strokeWidth="3" strokeDasharray="6 8" />
            <circle cx="60" cy="330" r="8" fill="#fff" />
            <circle cx="340" cy="70" r="8" fill="oklch(0.9 0.19 98)" />
            <g data-pin style={{ transformOrigin: "150px 230px" }}><circle cx="150" cy="230" r="14" fill="#ef4444" /><circle cx="150" cy="230" r="26" fill="#ef4444" opacity="0.25" /></g>
            <g data-pin style={{ transformOrigin: "215px 185px" }}><circle cx="215" cy="185" r="12" fill="#f97316" /><circle cx="215" cy="185" r="22" fill="#f97316" opacity="0.25" /></g>
            <g data-pin style={{ transformOrigin: "280px 120px" }}><circle cx="280" cy="120" r="10" fill="#eab308" /><circle cx="280" cy="120" r="18" fill="#eab308" opacity="0.25" /></g>
          </svg>
        </div>
      </div>
    </section>
  );
}
