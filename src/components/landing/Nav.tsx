"use client";

import Link from "next/link";
import { ProgressiveBlur } from "@/components/ui/skiper-ui/skiper41";
import { TextRoll } from "@/components/ui/skiper-ui/skiper58";

const links = [
  { label: "Problem", href: "#problem" },
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how" },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <ProgressiveBlur position="top" backgroundColor="oklch(0.13 0.004 270)" height="100%" blurAmount="10px" className="-z-10" />
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-sm font-medium tracking-tight">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-signal blur-[3px]" />
            <span className="absolute inset-0 rounded-full bg-signal" />
          </span>
          SafeWalk
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-foreground/60 transition-colors hover:text-foreground">
              <TextRoll className="text-sm">{l.label}</TextRoll>
            </a>
          ))}
        </nav>

        <Link
          href="/app"
          className="rounded-full border border-hairline bg-foreground/[0.04] px-4 py-1.5 text-sm font-medium backdrop-blur transition-colors hover:bg-foreground/[0.08]"
        >
          Open the map
        </Link>
      </div>
    </header>
  );
}
