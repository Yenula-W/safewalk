"use client";

import NumberFlow from "@number-flow/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProgressiveBlur } from "@/components/ui/skiper-ui/skiper41";
import { EASE, gsap, useGSAP } from "@/lib/gsap";

const HeroMap = dynamic(() => import("./HeroMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[oklch(0.16_0.004_270)]" />,
});

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(100);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: EASE, duration: 0.9 } });
      tl.from("[data-hero-line]", { y: 40, opacity: 0, stagger: 0.09 })
        .from("[data-hero-sub]", { y: 18, opacity: 0, duration: 0.7 }, "-=0.5")
        .from("[data-hero-cta]", { y: 14, opacity: 0, stagger: 0.07, duration: 0.6 }, "-=0.45")
        .from("[data-hero-frame]", { y: 48, opacity: 0, scale: 0.97, duration: 1.1 }, "-=0.55")
        .from("[data-hero-glow]", { opacity: 0, duration: 1.4 }, "<")
        .from("[data-hero-card]", { y: 20, opacity: 0, duration: 0.7 }, "-=0.4");
    },
    { scope: root }
  );

  useEffect(() => {
    const t = setTimeout(() => setScore(52), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden pt-32 md:pt-40">
      {/* Signature visual: a streetlight cone from the top of the page. */}
      <div
        data-hero-glow
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-18rem] h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-signal/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <p data-hero-line className="mb-7 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/45">
          Fig 0.0 — Cypress, TX · 29.69° N, 95.70° W · Neighborhood Hacks 2026
        </p>

        <h1 className="max-w-4xl text-[2.75rem] font-medium leading-[1.02] tracking-[-0.035em] md:text-7xl lg:text-[5.25rem]">
          <span data-hero-line className="block">Know the walk</span>
          <span data-hero-line className="block font-serif italic text-signal">
            before you take it.
          </span>
        </h1>

        <p data-hero-sub className="mt-7 max-w-xl text-base leading-relaxed text-foreground/55 md:text-lg">
          Students in Cypress flag the dark corners, missing sidewalks and bad
          crossings on their walk. SafeWalk turns those reports into a score
          anyone can check before they leave.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            data-hero-cta
            href="/app"
            className="rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Open the map
          </Link>
          <a
            data-hero-cta
            href="#how"
            className="rounded-full px-5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            See how it works →
          </a>
        </div>

        {/* The product, in the hero. */}
        <div className="relative mt-16 md:mt-20">
          <div
            data-hero-frame
            className="relative overflow-hidden rounded-2xl border border-hairline bg-[oklch(0.16_0.004_270)] shadow-[0_40px_120px_-30px_oklch(0.84_0.16_82_/_0.25)]"
          >
            <div className="flex items-center gap-2 border-b border-hairline px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
              <span className="ml-3 font-mono text-[11px] text-foreground/40">safewalk / route check</span>
            </div>
            <div className="relative aspect-[4/3] md:aspect-[16/9]">
              <HeroMap />
              <ProgressiveBlur position="bottom" backgroundColor="oklch(0.13 0.004 270)" height="110px" blurAmount="3px" className="z-[400]" />
            </div>
          </div>

          {/* Layered depth: the score card floats over the frame edge. */}
          <div
            data-hero-card
            className="z-[410] mt-3 rounded-xl border border-hairline bg-[oklch(0.17_0.004_270_/_0.92)] p-4 shadow-2xl backdrop-blur md:absolute md:bottom-10 md:left-8 md:mt-0 md:w-[15.5rem]"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/40">Route score</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-4xl font-medium tabular-nums tracking-tight">
                <NumberFlow value={score} transformTiming={{ duration: 1400, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }} />
              </span>
              <span className="text-sm text-foreground/40">/100</span>
            </div>
            <p className="mt-1 text-sm text-signal">{score < 75 ? "Use caution" : "Looks clear"}</p>
            <p className="mt-2 text-xs leading-relaxed text-foreground/50">
              3 reported issues within 80 m of your line.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
