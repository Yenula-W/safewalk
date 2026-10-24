# SafeWalk

**Crowdsourced safer walking routes for students.** Students flag poorly lit streets, unsafe crossings and broken sidewalks on a map. Anyone can check how many reported problems lie along their walk before they leave.

Built for [Neighborhood Hacks](https://neighborhoodhacks.org/), Safety & Emergency Response track.

**Live:** https://safewalk-rho.vercel.app (landing page; the map is at `/app`)

## The problem

Many students in Cypress, Texas walk to school, the bus stop or after-school jobs, often early in the morning or after dark. Crime in Cypress has recently risen sharply. <!-- TODO: add source, e.g. local police / news report with date and numbers --> On top of that, the walk itself carries everyday hazards: streetlights that are out, wide roads with no crosswalk, and sidewalks that just end. Nobody tracks these from a walker's point of view. City 311 systems take one report at a time, and you can't search them for a route.

### How we know it's real

> Fill this in as you collect evidence. This section matters most to the judges.

- [ ] **Crime trend:** source and numbers for the recent rise in Cypress crime (link + date)
- [ ] **Route walk-through:** walked ___ routes to school/bus stops at dusk on ___ and logged ___ problem spots (see `docs/evidence-log.md`)
- [ ] **Student survey:** ___ of ___ students surveyed said they avoid or feel unsafe on part of their walk
- [ ] **Conversations:** talked to ___ (parent / teacher / crossing guard / neighbor) who said ___

## What it does

- **Report a spot:** tap the map, choose a category (lighting, crossing, sidewalk, traffic, feels unsafe), rate severity 1–5 and add an optional short note.
- **Check my route:** tap a start and a destination to get a 0–100 score based on reports within 80 m of the path. Recent and severe reports count more.
- **Privacy by design:** no accounts and no names. Notes are capped at 280 characters, and the app tells users not to include personal details.

## Built with

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Leaflet / react-leaflet with OpenStreetMap tiles
- Supabase (Postgres + row-level security) for shared reports
- Demo mode: without Supabase keys, reports are stored in the browser so the app works out of the box

## Run it

```bash
npm install
cp .env.example .env.local   # optional: add Supabase keys
npm run dev
```

To use Supabase, create a project, run `supabase/schema.sql` in the SQL editor, and put the URL and anon key in `.env.local`.

## Challenges

<!-- Fill in honestly as you go. -->

## What's next

- Real walking routes (OSRM / OpenRouteService) instead of a straight line
- Upvote / "still a problem?" confirmations so stale reports fade
- Export a monthly hotspot report to send to the city or school district
- Moderation and rate limiting before a public launch
