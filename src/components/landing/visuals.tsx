"use client";

import { useRef } from "react";
import { EASE, gsap, useGSAP } from "@/lib/gsap";
import { CATEGORY_LABELS } from "@/lib/types";

/*
 * Each visual builds a paused timeline and plays it when `active` flips on,
 * so they work inside the pinned card stack where ScrollTrigger positions
 * would be meaningless.
 */

export function ReportVisual({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: EASE } })
        .from("[data-chip]", { y: 10, opacity: 0, stagger: 0.06, duration: 0.5 })
        .to("[data-chip='crossing']", { backgroundColor: "oklch(0.9 0.19 98)", color: "#000", duration: 0.35 }, "+=0.2")
        .to("[data-fill]", { scaleX: 0.8, duration: 0.8, ease: "power2.inOut" }, "-=0.1")
        .to("[data-sev]", { textContent: 4, snap: { textContent: 1 }, duration: 0.8 }, "<")
        .to("[data-submit]", { backgroundColor: "oklch(0.9 0.19 98)", color: "#000", duration: 0.3 }, "+=0.1")
        .to("[data-submit-label]", { textContent: "Reported ✓", duration: 0 });
    },
    { scope: root }
  );

  useGSAP(() => { if (active) tl.current?.play(); }, { dependencies: [active] });

  return (
    <div ref={root} className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur md:p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-white/50">What is the problem?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
          <span key={k} data-chip={k} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/85">
            {v}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/50">
        <span>Severity</span>
        <span className="tabular-nums text-white"><span data-sev>1</span>/5</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div data-fill className="h-full w-full origin-left scale-x-[0.2] rounded-full bg-signal" />
      </div>
      <div data-submit className="mt-5 rounded-full border border-white/15 py-2 text-center text-xs uppercase tracking-[0.18em]">
        <span data-submit-label>Submit</span>
      </div>
    </div>
  );
}

export function ScoreVisual({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const R = 54;
  const C = 2 * Math.PI * R;

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .to("[data-ring]", { strokeDashoffset: C * (1 - 0.52), duration: 1.4, ease: "power3.out" })
        .to("[data-num]", { textContent: 52, snap: { textContent: 1 }, duration: 1.4, ease: "power3.out" }, 0)
        .from("[data-issue]", { x: -10, opacity: 0, stagger: 0.12, duration: 0.5, ease: EASE }, "-=0.8");
    },
    { scope: root }
  );

  useGSAP(() => { if (active) tl.current?.play(); }, { dependencies: [active] });

  return (
    <div ref={root} className="flex items-center gap-6 rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur md:gap-8 md:p-6">
      <div className="relative h-32 w-32 shrink-0 md:h-40 md:w-40">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
          <circle data-ring cx="64" cy="64" r={R} fill="none" strokeWidth="6" strokeLinecap="round" stroke="oklch(0.9 0.19 98)" strokeDasharray={C} strokeDashoffset={0} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span data-num className="display text-5xl text-white">100</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">of 100</span>
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        {[["Unsafe crossing", 5, "#ef4444"], ["Poor lighting", 4, "#f97316"], ["Sidewalk ends", 3, "#eab308"]].map(([t, s, c]) => (
          <li key={t as string} data-issue className="flex items-center gap-2 text-white/85">
            <span className="h-2 w-2 rounded-full" style={{ background: c as string }} />
            {t}
            <span className="text-xs text-white/40">{s}/5</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PrivacyVisual({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "power2.inOut" } })
        .to("[data-strike]", { scaleX: 1, stagger: 0.18, duration: 0.5 })
        .to("[data-field]", { opacity: 0.35, stagger: 0.18, duration: 0.5 }, "<");
    },
    { scope: root }
  );

  useGSAP(() => { if (active) tl.current?.play(); }, { dependencies: [active] });

  return (
    <div ref={root} className="w-full max-w-sm space-y-2.5 rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur md:p-6">
      {["Full name", "Email address", "Password"].map((f) => (
        <div key={f} data-field className="relative rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/70">
          {f}
          <span data-strike className="absolute left-4 right-4 top-1/2 h-0.5 origin-left scale-x-0 bg-signal" />
        </div>
      ))}
    </div>
  );
}
