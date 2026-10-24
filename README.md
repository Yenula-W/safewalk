# SafeWalk

**Know the walk before you take it.** Students in Cypress, Texas flag the hazards on their walk to school, the bus stop or work: streetlights that are out, crossings with no signal, sidewalks that end at a ditch. SafeWalk puts every report on a shared map and scores any route 0–100 before you leave.

Built by a high-school student for [Neighborhood Hacks](https://neighborhoodhacks.org/), Safety & Emergency Response track.

- **Live:** https://safewalk-rho.vercel.app (the map is at [/app](https://safewalk-rho.vercel.app/app))
- **Devpost text and requirements checklist:** [SUBMISSION.md](SUBMISSION.md)
- **Field evidence log:** [docs/evidence-log.md](docs/evidence-log.md)

## The problem

A lot of students here walk before sunrise and after dark. The hazards on those walks are ordinary and invisible to anyone who drives: a dark stretch between two streetlights, a four-lane road with no crosswalk, a sidewalk that just stops. Nobody records them from the walker's point of view. City 311 takes one complaint at a time and can't be searched by route, so a student deciding "is this way okay tonight?" has nothing to check.

The first-hand observations, survey results and sources behind this are kept in [docs/evidence-log.md](docs/evidence-log.md) and written up in [SUBMISSION.md](SUBMISSION.md).

## What it does

- **Report a spot.** Tap the map, pick one of 11 hazard types (poor lighting, unsafe crossing, sidewalk ends, heavy traffic, speeding cars, loose dogs, flooding/ditch, construction, isolated stretch, feels unsafe, other), rate severity 1–5, add an optional 280-character note.
- **Check my route.** Tap a start and a destination. SafeWalk finds every report within 80 m of the straight line and scores the route. Each report costs `severity × 4` points, scaled by recency (full weight under 30 days, 0.7 under 180, 0.4 after). 75+ "Looks clear", 45–74 "Use caution", below 45 "Risky".
- **Use my location.** One tap centres the map on you so you can report while you walk.
- **Private by design.** No accounts, names or emails. Notes are capped and the UI asks for no personal details. A report is an anonymous point.
- **Shared.** Every report goes to a Supabase database protected by row-level security: anyone can read and add, nobody can edit or delete from the browser.

## Built with

- Next.js 15 (App Router), TypeScript, Tailwind CSS 4
- MapLibre GL with OpenFreeMap's dark vector tiles (crisp at any zoom, no API key)
- Supabase (Postgres + row-level security)
- GSAP + ScrollTrigger and Lenis for the landing page; Skiper UI components (sticky card stack, text roll, progressive blur)
- Vercel, deploying on every push to `main`

## Run it locally

```bash
npm install
cp .env.example .env.local   # add your Supabase URL and publishable key, or leave empty for demo mode
npm run dev
```

Without Supabase keys the app runs in demo mode and keeps reports in your browser. To use your own database, create a Supabase project, run [supabase/schema.sql](supabase/schema.sql) in the SQL editor, and put the URL and publishable key in `.env.local`.

## Project layout

```
src/app/              routes: / (landing), /app (map)
src/components/       SafeWalkApp + SafeMap (MapLibre), landing/ scenes, ui/skiper-ui/
src/lib/              safety.ts (route scoring), store.ts (Supabase / demo storage), types.ts
supabase/schema.sql   table, constraints and RLS policies
docs/evidence-log.md  field observations and survey
```

## What's next

- Real walking routes (OpenRouteService / OSRM) instead of a straight line
- "Still a problem?" confirmations so stale reports fade and fixed ones disappear
- A monthly hotspot export for the school district and Harris County Precinct 4
- Moderation and rate limiting before a wider launch

## License

MIT. Map data © OpenStreetMap contributors via OpenFreeMap. Community reports are estimates, not guarantees of safety; in an emergency call 911.
