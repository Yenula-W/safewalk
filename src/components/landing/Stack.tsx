"use client";

import { useState } from "react";
import { StickyCard002 } from "@/components/ui/skiper-ui/skiper17";
import { PrivacyVisual, ReportVisual, ScoreVisual } from "./visuals";

function Scene({
  word,
  line,
  bg,
  children,
}: {
  word: string;
  line: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex h-full w-full flex-col justify-between p-6 md:flex-row md:items-center md:p-12 ${bg}`}>
      <div>
        <h2 className="display text-[22vw] leading-[0.82] md:text-[11vw]">{word}</h2>
        <p className="mt-4 text-xs uppercase tracking-[0.22em] opacity-70">{line}</p>
      </div>
      <div className="flex justify-end md:w-1/2">{children}</div>
    </div>
  );
}

export default function Stack() {
  const [active, setActive] = useState(-1);
  const seen = (i: number) => active >= i;

  const cards = [
    {
      id: "report",
      content: (
        <Scene word="Report" line="Three taps, no form" bg="bg-[oklch(0.18_0.004_270)] text-white">
          <ReportVisual active={seen(0)} />
        </Scene>
      ),
    },
    {
      id: "score",
      content: (
        <Scene word="Score" line="Every report within 80 m of your line" bg="bg-signal text-black">
          <ScoreVisual active={seen(1)} />
        </Scene>
      ),
    },
    {
      id: "private",
      content: (
        <Scene word="Private" line="No name. No email. No account." bg="bg-white text-black">
          <PrivacyVisual active={seen(2)} />
        </Scene>
      ),
    },
  ];

  return (
    <section id="report">
      <StickyCard002 cards={cards} onActive={(i) => setActive((a) => Math.max(a, i))} />
    </section>
  );
}
