# Devpost submission draft — SafeWalk

Copy each section into the matching Devpost field. Anything in **[brackets]** is yours to fill from your own observations; don't submit it with placeholders.

## Requirements checklist

| Requirement | Status |
|---|---|
| Project name | ✅ SafeWalk |
| Elevator pitch (1–2 sentences) | ✅ below |
| "What is the specific problem, and how do you know it's real?" | ⚠️ draft below, needs **your** evidence from `docs/evidence-log.md` |
| What the solution does and how it works | ✅ below |
| What you built it with | ✅ below |
| Challenges you ran into | ✅ below (add your own) |
| What you'd do next | ✅ below |
| Demo video, 2–6 min, project working | ❌ to record — shot list below |
| Public code repository | ✅ https://github.com/Yenula-W/safewalk |
| Live demo (not required, helps judges) | ✅ https://safewalk-rho.vercel.app |
| Track | Safety & Emergency Response |

## Project name

SafeWalk

## Elevator pitch

Students in Cypress, TX flag the dark corners, missing sidewalks and bad crossings on their walk to school. SafeWalk turns those reports into a 0–100 score anyone can check before they leave.

## What is the specific problem, and how do you know it's real?

**[Required. This is the section judges weigh most. Write it in first person from your evidence log.]**

Suggested shape:

1. **What you saw.** "On [dates] I walked [N] routes between [neighbourhood] and [school / bus stop] around [time]. I logged [N] spots: [N] streetlights out, [N] places the sidewalk ends and you walk on the road, [N] crossings on roads over 40 mph with no signal." — pull from `docs/evidence-log.md`.
2. **Who you talked to.** "[N] of [N] students I surveyed said they avoid or feel unsafe on part of their walk; [N] had changed their route or schedule because of it. [A parent / crossing guard / teacher] told me [quote]."
3. **What the data says.** "[Source, date]: crime in Cypress rose [X]% in [period]." Use a source you can link (Harris County Sheriff's Office data, a local news report). If you can't find a number, say what you observed instead; don't invent one.
4. **Why nothing covers it.** City 311 takes one report at a time and can't be searched by route. Nobody tracks the walk from the walker's point of view.

## What it does and how it works

- **Report a spot.** Tap the map, pick one of 11 hazard types (poor lighting, unsafe crossing, sidewalk ends, heavy traffic, speeding cars, loose dogs, flooding/ditch, construction, isolated stretch, feels unsafe, other), rate severity 1–5, add an optional 280-character note. No account.
- **Check my route.** Tap a start and a destination. SafeWalk finds every report within 80 m of the straight line and scores the route 0–100. Each report costs `severity × 4` points, scaled by recency (full weight under 30 days, 0.7 under 180 days, 0.4 after). ≥75 "Looks clear", 45–74 "Use caution", below 45 "Risky".
- **Use my location** centres the map on you so reporting on the walk itself is one tap.
- **Privacy by design.** No accounts, names or emails; notes are capped and the UI asks for no personal details. Reports are anonymous points.
- **Shared data.** The live site is connected to Supabase, so every report anyone adds is visible to everyone, protected by row-level security (anyone can read and insert, nobody can edit or delete from the client). Without keys the app falls back to a browser-local demo mode.

## What we built it with

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Leaflet + react-leaflet with OpenStreetMap tiles (inverted to dark in CSS, no API key) · Supabase (Postgres, row-level security) · GSAP + ScrollTrigger and Lenis for the landing page motion · Skiper UI components (sticky card stack, text roll, progressive blur) · Vercel for hosting with deploy-on-push.

## Challenges we ran into

- CARTO's dark basemap now requires an API key, so the dark map is standard OSM tiles run through a CSS `invert + hue-rotate` filter instead.
- Vercel refused the first deploy because Next 15.5.4 had a published vulnerability; upgrading to 15.5.28 fixed it.
- GSAP's pinned ScrollTrigger inside a fixed-height container silently overflowed instead of pushing the next section down; the stack wrapper had to size itself.
- Leaflet touches `window` on import, so every map component is loaded client-side only with `next/dynamic`.
- **[Add yours: e.g. getting students to answer the survey, deciding on the 80 m radius, scoring without real routing.]**

## What's next

- Real walking routes (OpenRouteService / OSRM) instead of a straight line.
- "Still a problem?" confirmations so stale reports fade and fixed ones disappear.
- A monthly hotspot export to send to the school district and Harris County Precinct 4.
- Moderation and rate limiting before a public launch.

## Demo video — shot list (2–6 minutes)

1. 0:00 — You, on camera or voice-over, on the actual walk: the problem in one sentence. Show one real hazard spot.
2. 0:30 — Landing page scroll on a laptop (hero, ticker, card stack, Watch out, score, finale).
3. 1:15 — Open the map on a phone. Tap "Use my location". Report a real spot: category, severity, note, submit.
4. 2:00 — Check a route: tap start and destination, read the score and the issues list.
5. 2:40 — Evidence: your survey numbers and the crime source on screen for 10 seconds.
6. 3:00 — What's next, one line. Repo and live links on screen.
