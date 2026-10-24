"use client";

import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { ProgressiveBlur } from "@/components/ui/skiper-ui/skiper41";
import { TextRoll } from "@/components/ui/skiper-ui/skiper58";

const links = [
  { label: "Report", href: "#report" },
  { label: "Watch out", href: "#watch" },
  { label: "Score", href: "#score" },
  { label: "Code", href: "https://github.com/Yenula-W/safewalk" },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <ProgressiveBlur position="top" backgroundColor="transparent" height="100%" blurAmount="6px" className="-z-10" />
      <div className="relative mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={28} />
          <span className="display text-xl text-white mix-blend-difference">SafeWalk</span>
        </Link>

        {/* Difference blend keeps the text readable over the yellow and white scenes. */}
        <nav className="hidden items-center gap-10 mix-blend-difference md:flex" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white">
              <TextRoll className="text-xs">{l.label}</TextRoll>
            </a>
          ))}
        </nav>

        <Link
          href="/app"
          className="rounded-full border border-white/40 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-white mix-blend-difference transition-colors hover:bg-white hover:text-black"
        >
          Open map
        </Link>
      </div>
    </header>
  );
}
