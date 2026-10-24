"use client";

import {
  AlertTriangle,
  Ban,
  CarFront,
  Construction,
  Dog,
  EyeOff,
  Footprints,
  Gauge,
  Lightbulb,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { CATEGORY_LABELS, type Category } from "@/lib/types";

const ICONS: Partial<Record<Category, LucideIcon>> = {
  lighting: Lightbulb,
  crossing: Footprints,
  sidewalk: Ban,
  traffic: CarFront,
  speeding: Gauge,
  dogs: Dog,
  flooding: Waves,
  construction: Construction,
  isolated: EyeOff,
  unsafe_feeling: AlertTriangle,
};

/** Pinned horizontal scroll: the page moves sideways through every hazard you can report. */
export default function WatchOut() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const track = root.current?.querySelector<HTMLElement>("[data-track]");
      if (!track) return;
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance() * 1.6}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
      // Icons tilt as they pass the centre of the screen.
      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
        gsap.fromTo(
          card.querySelector("[data-icon]"),
          { rotate: -12, scale: 0.8 },
          {
            rotate: 8,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: gsap.getTweensOf(track)[0], start: "left right", end: "right left", scrub: true },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section id="watch" ref={root} className="pin-scene relative h-[100svh] overflow-hidden bg-background">
      <div data-track className="flex h-full w-max items-center gap-4 px-5 md:gap-6 md:px-10">
        <div className="flex h-[70vh] w-[82vw] shrink-0 flex-col justify-end md:w-[40vw]">
          <h2 className="display text-[26vw] leading-[0.8] text-white md:text-[12vw]">
            Watch<br />
            <span className="text-signal">out for</span>
          </h2>
        </div>
        {(Object.keys(ICONS) as Category[]).map((key, i) => {
          const Icon = ICONS[key]!;
          const yellow = i % 3 === 1;
          return (
            <div
              key={key}
              data-card
              className={`flex h-[70vh] w-[72vw] shrink-0 flex-col justify-between rounded-3xl p-7 md:w-[26vw] md:p-9 ${
                yellow ? "bg-signal text-black" : "border border-white/10 bg-[oklch(0.17_0.004_270)] text-white"
              }`}
            >
              <Icon data-icon strokeWidth={1.4} className="h-24 w-24 md:h-32 md:w-32" />
              <div>
                <span className="font-mono text-xs opacity-50">{String(i + 1).padStart(2, "0")}</span>
                <p className="display mt-2 text-4xl md:text-[2.4vw]">{CATEGORY_LABELS[key]}</p>
              </div>
            </div>
          );
        })}
        <div className="w-[10vw] shrink-0" />
      </div>
    </section>
  );
}
