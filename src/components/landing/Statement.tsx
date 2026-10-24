"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Words marked strong read in full white; the rest settles to muted.
const WORDS: { t: string; strong?: boolean }[] = [
  { t: "Students" }, { t: "here" }, { t: "walk" }, { t: "to" }, { t: "school" }, { t: "before" }, { t: "sunrise", strong: true },
  { t: "and" }, { t: "home" }, { t: "after" }, { t: "dark.", strong: true },
  { t: "Crime" }, { t: "in" }, { t: "Cypress" }, { t: "has" }, { t: "risen", strong: true }, { t: "sharply.", strong: true },
  { t: "The" }, { t: "sidewalks" }, { t: "haven’t" }, { t: "changed." },
  { t: "Nobody" }, { t: "tracks" }, { t: "the" }, { t: "walk" }, { t: "from" }, { t: "a" }, { t: "walker’s", strong: true }, { t: "point", strong: true }, { t: "of", strong: true }, { t: "view.", strong: true },
];

export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to("[data-word]", {
        opacity: 1,
        stagger: 0.04,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
      });
    },
    { scope: root }
  );

  return (
    <section id="problem" ref={root} className="relative border-t border-hairline">
      <div className="mx-auto max-w-6xl px-5 py-28 md:px-8 md:py-40">
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">Fig 0.1 — The problem</p>
        <p className="max-w-5xl text-3xl font-medium leading-[1.18] tracking-[-0.025em] md:text-5xl md:leading-[1.12]">
          {WORDS.map((w, i) => (
            <span
              key={i}
              data-word
              className={w.strong ? "inline-block opacity-10" : "inline-block text-foreground/45 opacity-10"}
            >
              {w.t}
              {i < WORDS.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
        <p className="mt-10 max-w-xl text-sm leading-relaxed text-foreground/50">
          City 311 systems take one report at a time and can’t be searched by route.
          SafeWalk is built around the question students actually ask:{" "}
          <span className="text-foreground">is this way okay tonight?</span>
        </p>
      </div>
    </section>
  );
}
