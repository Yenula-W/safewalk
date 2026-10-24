"use client";

import { useRef } from "react";
import { EASE, gsap, useGSAP } from "@/lib/gsap";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import Nav from "./Nav";
import Proof from "./Proof";
import SmoothScroll from "./SmoothScroll";
import Statement from "./Statement";

export default function Landing() {
  const root = useRef<HTMLDivElement>(null);

  // One reveal rule for every [data-reveal] block below the fold.
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: EASE,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <SmoothScroll>
      <div ref={root} className="landing dark min-h-screen bg-background text-foreground">
        <Nav />
        <main>
          <Hero />
          <Proof />
          <Statement />
          <Features />
          <HowItWorks />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
