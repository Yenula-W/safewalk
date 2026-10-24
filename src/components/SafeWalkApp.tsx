"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { assessRoute } from "@/lib/safety";
import { addReport, isDemoMode, loadReports } from "@/lib/store";
import { CATEGORY_LABELS, type Category, type LatLng, type Report } from "@/lib/types";

const SafeMap = dynamic(() => import("./SafeMap"), { ssr: false });

const CENTER: LatLng = {
  lat: Number(process.env.NEXT_PUBLIC_MAP_LAT ?? 29.691),
  lng: Number(process.env.NEXT_PUBLIC_MAP_LNG ?? -95.697),
};

type Mode = "report" | "route";

export default function SafeWalkApp() {
  const [mode, setMode] = useState<Mode>("report");
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<LatLng | null>(null);
  const [category, setCategory] = useState<Category>("lighting");
  const [severity, setSeverity] = useState(3);
  const [note, setNote] = useState("");
  const [route, setRoute] = useState<{ a: LatLng | null; b: LatLng | null }>({ a: null, b: null });

  useEffect(() => {
    loadReports().then(setReports).catch(() => setError("Could not load reports."));
  }, []);

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
    } catch {
      setError("Could not save the report. Try again.");
    }
  }

  const tab = (m: Mode, label: string) => (
    <button
      onClick={() => setMode(m)}
      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${mode === m ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <aside className="w-full space-y-4 overflow-y-auto border-b p-4 md:w-96 md:border-b-0 md:border-r">
        <header>
          <h1 className="text-2xl font-bold">SafeWalk</h1>
          <p className="text-sm text-gray-600">
            Students flag unsafe spots on their walk. Everyone gets a safer-route check.
          </p>
          {isDemoMode && (
            <p className="mt-1 rounded bg-amber-50 p-2 text-xs text-amber-800">
              Demo mode: reports are saved in this browser only. Pins marked [sample] are placeholders.
            </p>
          )}
        </header>

        <div className="flex gap-2">{tab("report", "Report a spot")}{tab("route", "Check my route")}</div>

        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

        {mode === "report" ? (
          <section className="space-y-3">
            <p className="text-sm">{pending ? "Spot selected. Add details:" : "Tap the map where the problem is."}</p>
            <label className="block text-sm">
              What is the problem?
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="mt-1 w-full rounded border p-2">
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label className="block text-sm">
              How bad is it? ({severity}/5)
              <input type="range" min={1} max={5} value={severity} onChange={(e) => setSeverity(Number(e.target.value))} className="w-full" />
            </label>
            <label className="block text-sm">
              Note (optional, no names or personal details)
              <textarea value={note} maxLength={280} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full rounded border p-2" rows={2} />
            </label>
            <button disabled={!pending} onClick={submit} className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white disabled:opacity-40">
              Submit report
            </button>
          </section>
        ) : (
          <section className="space-y-3">
            <p className="text-sm">Tap your start point, then your destination.</p>
            {assessment ? (
              <div className="rounded-lg border p-3">
                <div className="text-3xl font-bold">{assessment.score}<span className="text-base font-normal">/100</span></div>
                <div className="font-medium">{assessment.label}</div>
                <p className="text-sm text-gray-600">
                  {Math.round(assessment.lengthM)} m, {assessment.nearby.length} reported issue(s) within 80 m of the line.
                </p>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {assessment.nearby.map((r) => <li key={r.id}>{CATEGORY_LABELS[r.category]} ({r.severity}/5)</li>)}
                </ul>
                <p className="mt-2 text-xs text-gray-500">Straight-line estimate from community reports. Not a guarantee of safety.</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">{route.a ? "Now tap the destination." : "No route selected."}</p>
            )}
          </section>
        )}

        <p className="text-xs text-gray-500">{reports.length} reports on the map. In danger? Call 911.</p>
      </aside>
      <main className="min-h-[50vh] flex-1">
        <SafeMap center={CENTER} reports={reports} pending={pending} route={route} onPick={onPick} />
      </main>
    </div>
  );
}
