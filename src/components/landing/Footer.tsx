import Link from "next/link";

export default function Footer() {
  return (
    <>
      <section className="relative overflow-hidden border-t border-hairline">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-full h-[30rem] w-[50rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-signal/15 blur-[110px]"
        />
        <div className="relative mx-auto max-w-6xl px-5 py-28 text-center md:px-8 md:py-40">
          <h2 data-reveal className="text-5xl font-medium tracking-[-0.035em] md:text-7xl">
            Light up <span className="font-serif italic text-signal">the walk.</span>
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-md text-base text-foreground/55">
            Add the spot you always cross the street to avoid. Someone else is avoiding it too.
          </p>
          <div data-reveal className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/app"
              className="rounded-full bg-signal px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Open the map
            </Link>
            <a
              href="https://github.com/Yenula-W/safewalk"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-hairline px-6 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-foreground/[0.05]"
            >
              View the code
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-xs text-foreground/40 md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            SafeWalk · Built for{" "}
            <a href="https://neighborhoodhacks.org/" className="text-foreground/60 hover:text-foreground">Neighborhood Hacks</a>{" "}
            · Cypress, Texas
          </p>
          <p>
            Community reports are estimates, not guarantees. In danger, call 911. UI pieces from{" "}
            <a href="https://skiper-ui.com" className="text-foreground/60 hover:text-foreground">Skiper UI</a>.
          </p>
        </div>
      </footer>
    </>
  );
}
