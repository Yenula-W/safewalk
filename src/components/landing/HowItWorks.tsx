const STEPS = [
  {
    n: "01",
    title: "Walk it",
    body: "Students log what they see on their real routes: a light that’s out, a crossing with no signal, a sidewalk that ends.",
  },
  {
    n: "02",
    title: "Map it",
    body: "Each report lands on a shared map with a category, a 1–5 severity and a date. Recent reports count more than old ones.",
  },
  {
    n: "03",
    title: "Check it",
    body: "Before leaving, anyone taps two points and gets a score. Over time the map becomes a case file to hand to the city.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div data-reveal className="max-w-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">Fig 2.0 — How it works</p>
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] md:text-4xl">
            Built by the people who walk it.
          </h2>
        </div>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} data-reveal className="bg-background p-6 md:p-8">
              <span className="font-mono text-[11px] text-signal">{s.n}</span>
              <h3 className="mt-6 text-xl font-medium tracking-tight">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/55">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
