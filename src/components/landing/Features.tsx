"use client";

import NumberFlow from "@number-flow/react";
import { useRef, useState } from "react";
import { EASE, gsap, useGSAP } from "@/lib/gsap";
import { CATEGORY_LABELS } from "@/lib/types";

/* ---------- Visual 1: the report form, filling itself in ---------- */
function ReportVisual() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: EASE },
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
      tl.from("[data-chip]", { y: 10, opacity: 0, stagger: 0.06, duration: 0.5 })
        .to("[data-chip='crossing']", { backgroundColor: "oklch(0.84 0.16 82)", color: "#000", duration: 0.35 }, "+=0.2")
        .to("[data-fill]", { scaleX: 0.8, duration: 0.8, ease: "power2.inOut" }, "-=0.1")
        .to("[data-sev]", { textContent: 4, snap: { textContent: 1 }, duration: 0.8 }, "<")
        .to("[data-submit]", { backgroundColor: "oklch(0.84 0.16 82)", color: "#000", duration: 0.3 }, "+=0.1")
        .to("[data-submit-label]", { textContent: "Reported ✓", duration: 0 });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="rounded-2xl border border-hairline bg-[oklch(0.16_0.004_270)] p-5 md:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/40">New report · 29.6932, −95.6961</p>
      <p className="mt-4 text-sm text-foreground/60">What is the problem?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
          <span key={k} data-chip={k} className="rounded-full border border-hairline px-3 py-1 text-xs text-foreground/80">
            {v}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between text-sm text-foreground/60">
        <span>How bad is it?</span>
        <span className="tabular-nums text-foreground"><span data-sev>1</span>/5</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/10">
        <div data-fill className="h-full w-full origin-left scale-x-[0.2] rounded-full bg-signal" />
      </div>
      <div data-submit className="mt-5 rounded-lg border border-hairline py-2 text-center text-sm font-medium">
        <span data-submit-label>Submit report</span>
      </div>
    </div>
  );
}

/* ---------- Visual 2: the route score ring ---------- */
function ScoreVisual() {
  const root = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(100);
  const R = 54;
  const C = 2 * Math.PI * R;

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true, onEnter: () => setScore(52) },
      });
      tl.to("[data-ring]", { strokeDashoffset: C * (1 - 0.52), duration: 1.4, ease: "power3.out" })
        .from("[data-issue]", { x: -10, opacity: 0, stagger: 0.12, duration: 0.5, ease: EASE }, "-=0.8");
    },
    { scope: root }
  );

  return (
    <div ref={root} className="flex items-center gap-6 rounded-2xl border border-hairline bg-[oklch(0.16_0.004_270)] p-5 md:gap-8 md:p-6">
      <div className="relative h-32 w-32 shrink-0 md:h-36 md:w-36">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle cx="64" cy="64" r={R} fill="none" stroke="currentColor" strokeWidth="6" className="text-foreground/10" />
          <circle
            data-ring
            cx="64" cy="64" r={R} fill="none" strokeWidth="6" strokeLinecap="round"
            stroke="oklch(0.84 0.16 82)" strokeDasharray={C} strokeDashoffset={0}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-medium tabular-nums tracking-tight">
            <NumberFlow value={score} transformTiming={{ duration: 1400, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }} />
          </span>
          <span className="text-[10px] uppercase tracking-[0.14em] text-foreground/40">of 100</span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-signal">Use caution</p>
        <p className="mt-0.5 text-xs text-foreground/50">986 m · 3 issues within 80 m</p>
        <ul className="mt-3 space-y-1.5 text-sm">
          {[["Unsafe crossing", 5, "#dc2626"], ["Poor lighting", 4, "#ea580c"], ["Sidewalk ends", 3, "#ca8a04"]].map(([t, s, c]) => (
            <li key={t as string} data-issue className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: c as string }} />
              <span className="text-foreground/80">{t}</span>
              <span className="font-mono text-[11px] text-foreground/40">{s}/5</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Visual 3: the fields we never ask for ---------- */
function PrivacyVisual() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
      tl.to("[data-strike]", { scaleX: 1, stagger: 0.18, duration: 0.5 })
        .to("[data-field]", { opacity: 0.35, stagger: 0.18, duration: 0.5 }, "<")
        .from("[data-keep]", { y: 10, opacity: 0, duration: 0.6, ease: EASE }, "-=0.2");
    },
    { scope: root }
  );

  return (
    <div ref={root} className="rounded-2xl border border-hairline bg-[oklch(0.16_0.004_270)] p-5 md:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/40">Sign up</p>
      <div className="mt-4 space-y-2.5">
        {["Full name", "Email address", "Password"].map((f) => (
          <div key={f} data-field className="relative rounded-lg border border-hairline px-3 py-2 text-sm text-foreground/60">
            {f}
            <span data-strike className="absolute left-3 right-3 top-1/2 h-px origin-left scale-x-0 bg-signal" />
          </div>
        ))}
      </div>
      <p data-keep className="mt-5 text-sm leading-relaxed text-foreground/80">
        Just the spot and what’s wrong. <span className="text-foreground/50">Notes are capped at 280 characters and the app asks for no personal details.</span>
      </p>
    </div>
  );
}

/* ---------- Section ---------- */
const FEATURES = [
  {
    fig: "Fig 1.0",
    title: "Report in three taps.",
    body: "Tap the map, pick what’s wrong, rate how bad it is. It takes less time than crossing the street you’re reporting.",
    Visual: ReportVisual,
  },
  {
    fig: "Fig 1.1",
    title: "A score, not a guess.",
    body: "Pick a start and an end. SafeWalk counts every report within 80 metres of your line, weighted by severity and how recent it is.",
    Visual: ScoreVisual,
  },
  {
    fig: "Fig 1.2",
    title: "Nothing to sign up for.",
    body: "No accounts, no names, no emails. A student reporting an unlit street shouldn’t have to hand over their identity to do it.",
    Visual: PrivacyVisual,
  },
];

export default function Features() {
  return (
    <section id="product" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {FEATURES.map((f, i) => (
          <div
            key={f.fig}
            className={`grid items-center gap-10 py-20 md:grid-cols-2 md:gap-16 md:py-28 ${i > 0 ? "border-t border-hairline" : ""}`}
          >
            <div data-reveal className={i % 2 === 1 ? "md:order-2" : ""}>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">{f.fig}</p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] md:text-4xl">{f.title}</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-foreground/55">{f.body}</p>
            </div>
            <div data-reveal className={i % 2 === 1 ? "md:order-1" : ""}>
              <f.Visual />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
