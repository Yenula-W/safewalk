"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Magnetic from "./Magnetic";

/** Perspective text that stands up as you scroll (after Skiper UI's PerspectiveTextScroll), then the CTA. */
export default function Finale() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=120%", pin: true, scrub: 0.8 },
        })
        .fromTo("[data-persp]", { rotateX: 42, y: window.innerWidth >= 768 ? 320 : 160, opacity: 0.3 }, { rotateX: 0, y: 0, opacity: 1, ease: "none" }, 0)
        .fromTo("[data-cta]", { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: "none" }, 0.6);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="pin-scene relative flex h-[100svh] flex-col items-center justify-center overflow-hidden bg-background px-5 text-center">
      <div className="pointer-events-none absolute left-1/2 top-full h-[40rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/25 blur-[140px]" />
      <div style={{ perspective: "700px" }}>
        <h2 data-persp className="display text-[17vw] leading-[0.82] text-white md:text-[12vw]" style={{ transformStyle: "preserve-3d" }}>
          Light up<br />
          <span className="text-signal">the walk</span>
        </h2>
      </div>
      <div data-cta className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Magnetic>
          <Link href="/app" className="block rounded-full bg-signal px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-black">
            Open the map
          </Link>
        </Magnetic>
        <Magnetic>
          <a href="https://github.com/Yenula-W/safewalk" target="_blank" rel="noreferrer" className="block rounded-full border border-white/30 px-7 py-3 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black">
            Code
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
