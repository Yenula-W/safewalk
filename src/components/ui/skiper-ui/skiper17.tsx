"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useRef } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface CardData {
  id: number | string;
  content: React.ReactNode;
}

interface StickyCard002Props {
  cards: CardData[];
  className?: string;
  containerClassName?: string;
  cardClassName?: string;
  /** Fires when the scrubbed timeline crosses into card `index`. */
  onActive?: (index: number) => void;
}

/**
 * Adapted from Skiper UI's StickyCard_002: cards hold arbitrary React content
 * instead of images, the cleanup only kills this component's triggers, and an
 * onActive callback lets each card start its own animation when it lands.
 */
const StickyCard002 = ({
  cards,
  className,
  containerClassName,
  cardClassName,
  onActive,
}: StickyCard002Props) => {
  const container = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const els = cardRefs.current;
      const totalCards = els.length;
      if (!els[0]) return;

      gsap.set(els[0], { y: "0%", scale: 1, rotation: 0 });
      for (let i = 1; i < totalCards; i++) {
        if (els[i]) gsap.set(els[i], { y: "100%", scale: 1, rotation: 0 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky-cards",
          start: "top top",
          end: `+=${window.innerHeight * 1.6 * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
          onEnter: () => onActive?.(0),
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const current = els[i];
        const next = els[i + 1];
        if (!current || !next) continue;

        scrollTimeline
          .to(current, { scale: 0.85, rotation: 4, opacity: 0.4, duration: 1, ease: "none" }, i)
          .to(next, { y: "0%", duration: 1, ease: "none" }, i)
          .call(() => onActive?.(i + 1), [], i + 0.6);
      }

      const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
      if (container.current) resizeObserver.observe(container.current);

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.scrollTrigger?.kill();
        scrollTimeline.kill();
      };
    },
    { scope: container }
  );

  // No fixed height on the wrapper: the pin spacer must be free to push later content down.
  return (
    <div className={cn("relative w-full", className)} ref={container}>
      <div className="sticky-cards relative flex h-screen w-full items-center justify-center overflow-hidden p-3 lg:p-8">
        <div className={cn("relative h-[86%] w-full max-w-6xl", containerClassName)}>
          {cards.map((card, i) => (
            <div
              key={card.id}
              className={cn("absolute inset-0 overflow-hidden rounded-3xl", cardClassName)}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            >
              {card.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { StickyCard002 };

/**
 * Skiper 17 StickyCard_002 — React + Gsap + scrollTrigger
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
