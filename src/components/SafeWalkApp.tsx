"use client";

import { LocateFixed } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { assessRoute } from "@/lib/safety";
import { addReport, isDemoMode, loadReports } from "@/lib/store";
import { CATEGORIES, CATEGORY_LABELS, SEVERITY_COLOR, type Category, type LatLng, type Report } from "@/lib/types";

const SafeMap = dynamic(() => import("./SafeMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[oklch(0.1_0.004_270)]" />,
});

const CENTER: LatLng = {
  lat: Number(process.env.NEXT_PUBLIC_MAP_LAT ?? 29.691),
  lng: Number(process.env.NEXT_PUBLIC_MAP_LNG ?? -95.697),
};

type Mode = "report" | "route";

const SEVERITY_WORDS = ["", "Minor", "Annoying", "Risky", "Dangerous", "Severe"];

export default function SafeWalkApp() {
  const [mode, setMode] = useState<Mode>("report");
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [pending, setPending] = useState<LatLng | null>(null);
  const [category, setCategory] = useState<Category>("lighting");
  const [severity, setSeverity] = useState(3);
  const [note, setNote] = useState("");
  const [route, setRoute] = useState<{ a: LatLng | null; b: LatLng | null }>({ a: null, b: null });
  const [focus, setFocus] = useState<LatLng | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    loadReports().then(setReports).catch(() => setError("Could not load reports."));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const onPick = useCallback(
    (p: LatLng) => {
      if (mode === "report") setPending(p);
      else setRoute((r) => (!r.a || (r.a && r.b) ? { a: p, b: null } : { a: r.a, b: p }));
    },
    [mode]
  );

  const assessment = useMemo(
    () => (route.a && route.b ? assessRoute(route.a, route.b, reports) : null),
    [route, reports]
  );

  async function submit() {
    if (!pending) return;
    try {
      const saved = await addReport({ ...pending, category, severity, note: note.trim().slice(0, 280) });
      setReports((rs) => [saved, ...rs]);
      setPending(null);
      setNote("");
      setToast("Reported. Thanks for looking out.");
    } catch {
      setError("Could not save the report. Try again.");
    }
  }

  function locate() {
    if (!navigator.geolocation) return setError("Location isn't available in this browser.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFocus({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setError("Couldn't get your location.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  const tab = (m: Mode, label: string) => (
    <button
      onClick={() => setMode(m)}
      className={`flex-1 rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
        mode === m ? "bg-signal text-black" : "bg-white/5 text-white/70 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="dark flex h-[100svh] flex-col bg-background text-foreground md:flex-row">
      <aside className="flex w-full flex-col gap-5 overflow-y-auto border-b border-white/10 p-5 md:w-[26rem] md:border-b-0 md:border-r">
        <header className="flex items-center justify-between">
          <Link href="/" aria-label="SafeWalk home">
            <Logo />
          </Link>
          <Link href="/" className="text-[11px] uppercase tracking-[0.18em] text-white/50 hover:text-white">
            ← Home
          </Link>
        </header>

        {isDemoMode && (
          <p className="rounded-lg border border-signal/30 bg-signal/10 px-3 py-2 text-xs text-signal">
            Demo mode: reports stay in this browser. Pins marked [sample] are placeholders.
          </p>
        )}

        <div className="flex gap-2">{tab("report", "Report a spot")}{tab("route", "Check my route")}</div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {mode === "report" ? (
          <section className="space-y-4">
            <p className="text-sm text-white/70">{pending ? "Spot selected. What's wrong there?" : "Tap the map where the problem is."}</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((k) => (
                <button
                  key={k}
                  onClick={() => setCategory(k)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    category === k ? "border-signal bg-signal text-black" : "border-white/15 text-white/80 hover:border-white/40"
                  }`}
                >
                  {CATEGORY_LABELS[k]}
                </button>
              ))}
            </div>
            <label className="block">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-white/50">
                <span>How bad is it?</span>
                <span style={{ color: SEVERITY_COLOR[severity] }}>{severity}/5 · {SEVERITY_WORDS[severity]}</span>
              </div>
              <input
                type="range" min={1} max={5} value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="mt-2 w-full accent-[oklch(0.9_0.19_98)]"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.16em] text-white/50">
              Note <span className="normal-case tracking-normal text-white/35">(optional · no names or personal details)</span>
              <textarea
                value={note} maxLength={280} rows={2}
                onChange={(e) => setNote(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 p-2 text-sm normal-case tracking-normal text-white placeholder:text-white/30 focus:border-signal focus:outline-none"
                placeholder="e.g. Streetlight out between the two bus stops"
              />
            </label>
            <button
              disabled={!pending}
              onClick={submit}
              className="w-full rounded-full bg-signal py-3 text-xs font-medium uppercase tracking-[0.18em] text-black transition-opacity disabled:opacity-30"
            >
              Submit report
            </button>
          </section>
        ) : (
          <section className="space-y-4">
            <p className="text-sm text-white/70">
              {assessment ? "Tap anywhere to start a new route." : route.a ? "Now tap your destination." : "Tap your start point, then your destination."}
            </p>
            {assessment && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-end gap-2">
                  <span className="display text-6xl leading-none" style={{ color: assessment.score >= 75 ? "#84cc16" : assessment.score >= 45 ? "oklch(0.9 0.19 98)" : "#ef4444" }}>
                    {assessment.score}
                  </span>
                  <span className="pb-1 text-xs uppercase tracking-[0.16em] text-white/50">/100 · {assessment.label}</span>
                </div>
                <p className="mt-2 text-sm text-white/60">
                  {Math.round(assessment.lengthM)} m straight line · {assessment.nearby.length} issue{assessment.nearby.length === 1 ? "" : "s"} within 80 m
                </p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {assessment.nearby.map((r) => (
                    <li key={r.id} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: SEVERITY_COLOR[r.severity] }} />
                      {CATEGORY_LABELS[r.category]}
                      <span className="text-xs text-white/40">{r.severity}/5</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[11px] text-white/35">Estimate from community reports. Not a guarantee of safety.</p>
              </div>
            )}
          </section>
        )}

        <div className="mt-auto space-y-3 pt-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.14em] text-white/40">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ background: SEVERITY_COLOR[s] }} />
                {s}
              </span>
            ))}
            <span className="ml-auto">{reports.length} report{reports.length === 1 ? "" : "s"}</span>
          </div>
          <p className="text-[11px] text-white/35">In danger? Call 911.</p>
        </div>
      </aside>

      <main className="relative min-h-[50vh] flex-1">
        <SafeMap center={CENTER} reports={reports} pending={pending} route={route} focus={focus} onPick={onPick} />
        <button
          onClick={locate}
          aria-label="Use my location"
          className="absolute right-4 top-4 z-[500] flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[oklch(0.17_0.004_270)] text-white shadow-lg hover:bg-[oklch(0.22_0.004_270)]"
        >
          <LocateFixed className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} />
        </button>
        {toast && (
          <div className="absolute bottom-6 left-1/2 z-[500] -translate-x-1/2 rounded-full bg-signal px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-black shadow-xl">
            {toast}
          </div>
        )}
      </main>
    </div>
  );
}
