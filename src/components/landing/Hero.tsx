"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import { EASE, gsap, useGSAP } from "@/lib/gsap";
import Magnetic from "./Magnetic";

const HeroMap = dynamic(() => import("./HeroMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[oklch(0.1_0.004_270)]" />,
});

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Entrance: the two words slam in, then the small line and button.
      gsap
        .timeline({ defaults: { ease: EASE } })
        .from("[data-word]", { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.2)
        .from("[data-sub]", { y: 16, opacity: 0, duration: 0.7 }, "-=0.5")
        .from("[data-map]", { scale: 1.12, opacity: 0, duration: 1.6, ease: "power2.out" }, 0);

      // Scroll: pin the scene; the type blows up and fades while the map pushes in.
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=180%", pin: true, scrub: 0.6 },
        })
        .to("[data-type]", { scale: 1.9, yPercent: -18, opacity: 0, ease: "power1.in" }, 0)
        .to("[data-sub]", { opacity: 0, y: -20 }, 0)
        .to("[data-map]", { scale: 1.25 }, 0)
        .to("[data-shade]", { opacity: 0.85 }, 0);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="pin-scene relative h-[100svh] w-full overflow-hidden">
      <div data-map className="absolute inset-0 pointer-events-none">
        <HeroMap />
      </div>
      <div data-shade className="absolute inset-0 bg-black/40" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative flex h-full flex-col items-center justify-center px-5 text-center">
        <h1 data-type className="display text-[26vw] leading-[0.82] text-white md:text-[20vw]">
          <span className="block overflow-hidden"><span data-word className="block">Safe</span></span>
          <span className="block overflow-hidden"><span data-word className="block text-signal">Walk</span></span>
        </h1>
        <div data-sub className="mt-8 flex flex-col items-center gap-5">
          <p className="max-w-xs text-sm uppercase tracking-[0.22em] text-white/80 md:max-w-none">
            Know the walk before you take it
          </p>
          <Magnetic>
            <Link
              href="/app"
              className="block rounded-full bg-signal px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-black active:scale-[0.98]"
            >
              Open the map
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
