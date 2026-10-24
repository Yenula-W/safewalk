"use client";

import Finale from "./Finale";
import Hero from "./Hero";
import Nav from "./Nav";
import Score from "./Score";
import SmoothScroll from "./SmoothScroll";
import Stack from "./Stack";
import Ticker from "./Ticker";

export default function Landing() {
  return (
    <SmoothScroll>
      <div className="landing dark min-h-screen bg-background text-foreground">
        <Nav />
        <main>
          <Hero />
          <Ticker />
          <Stack />
          <Score />
          <Finale />
        </main>
      </div>
    </SmoothScroll>
  );
}
