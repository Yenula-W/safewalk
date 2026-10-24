"use client";

import Finale from "./Finale";
import Hero from "./Hero";
import Nav from "./Nav";
import Score from "./Score";
import SmoothScroll from "./SmoothScroll";
import Stack from "./Stack";
import Ticker from "./Ticker";
import WatchOut from "./WatchOut";

export default function Landing() {
  return (
    <SmoothScroll>
      <div className="landing dark min-h-screen bg-background text-foreground">
        <div className="grain" aria-hidden />
        <Nav />
        <main>
          <Hero />
          <Ticker />
          <Stack />
          <WatchOut />
          <Score />
          <Finale />
        </main>
      </div>
    </SmoothScroll>
  );
}
