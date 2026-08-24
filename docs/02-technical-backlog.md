# HelpMap Technical Backlog

_Prioritized work items. IDs referenced by [03-roadmap-90day](03-roadmap-90day.md)._
_Status legend: ☐ open · ◐ in progress · ☑ done_

---

## P0 — Correctness, compliance, trust foundations
_Blockers for any public/funder-facing deployment._

### T1 ☑ Add LICENSE + attribution compliance
- Choose code license (MIT or Apache-2.0; Apache preferred if seeking institutional adoption — explicit patent grant).
- Data notice: OSM data under ODbL (share-alike applies to derived databases, not our code license).
- Verify visible OSM attribution on map (exists) + add contact email to repo/site per tile policy recommendation.

### T2 ☑ Privacy statement (in-app page)
Document the architecture's privacy story: location used on-device only; geocoding queries send place text to Nominatim; hazard feeds receive lat/lng-rounded coordinates (already `.toFixed(4)` ≈ 11 m); localStorage keys list (`hm:search`, `hm:resources`, `hm:quakes`, `hm:alerts`); no analytics/cookies today.

### T3 ☑ Basemap abstraction (tile provider switchable)
Current hard dependency: `tile.openstreetmap.org` (policy allows but discourages production reliance; blockable without notice).
- Extract tile URL into config (`TILE_PROVIDERS` map: osm / carto / protomaps-selfhost…).
- Env-driven default; runtime fallback if tiles 4xx/403.
- Keep SW cache policy per provider.

### T4 ☑ Geocoder abstraction
Nominatim policy requires swappability without app update.
- Interface: `geocode(query) → {lat,lng,label}` + `reverse(point)` behind `services/geocode.ts` facade (partially exists).
- Add response caching layer (localStorage TTL 24 h) — also satisfies "results must be cached" clause.
- Candidate alternates: Photon (Komoot, free/self-host), Pelias/Geocode Maps.

### T5 ☐ Overpass reliability strategy
Public instances degraded simultaneously during session testing (502/504).
- Short term: keep dual-endpoint failover; add exponential backoff + jitter; request timeout already 25 s.
- Mid term: nightly self-generated regional snapshots (Overpass → static JSON bundles committed/served as assets) so search works even when Overpass is down; live query remains primary, snapshot is fallback.
- Long term: own instance (~$20–40/mo VPS) once funded.

### T6 ☑ Accessibility pass (WCAG 2.1 AA basics)
- Label all icon-only buttons (audit `aria-label` coverage) ✓ mostly done
- Color-contrast audit of chips/badges/banner text (amber-on-cream banner suspect)
- Keyboard path through card expand/collapse and layers bar
- Screen-reader smoke test (NVDA/VoiceOver) of search → results → detail flow`n`n**Completed 2026-08-24:** all 13 color pairs verified ≥4.5:1 computationally; desktop `aria-hidden` bug fixed (visible pane was hidden from AT); dialogs now trap Escape + manage focus; skip-link, `h1` landmark, keyboard-scrollable chip/layers rows, `prefers-reduced-motion`, 28px refresh targets. **Outstanding:** live NVDA/VoiceOver walkthrough queued for pilot phase (needs real devices).

---

## P1 — Field-ready UX

### T7 ☑ i18n scaffold (EN + 日本語 first)
- Library decision: `i18next` (+react-i18next) vs lightweight context dictionary (~30 strings today). Recommend i18next for plural/date handling growth.
- Translate: header/tagline, categories, filters, banners, empty states, buttons, coverage note.
- Language switcher in header; `<html lang>` sync; persist choice.
- Japanese terms: フードバンク, 炊き出し, 宿泊支援 etc. — copy review by native speaker before pilot.

### T8 ☑ Per-listing issue reporting
- Button on expanded card: "Report a problem".
- Primary action: deep-link OSM note at exact location — `https://www.openstreetmap.org/note/new#lat=&lon=&text=...` pre-filled (no backend needed; improvements flow back into shared data commons).
- Secondary (later, needs tiny serverless): internal report queue for partner moderation (see T15).

### T9 ☑ Open-now status
- Parse `opening_hours` (use `opening_hours` npm lib or simplified parser for common patterns).
- Card badge: "Open now" / "Closed · opens Tue 09:00" / unknown = silent.
- Filter chip: "Open now".

### T10 ☑ Directions options
- Google (current) + Apple Maps (`maps.apple.com/?daddr=`) + OSM (`openstreetmap.org/directions?to=`) chooser — respects users without Google accounts.

### T11 ☑ Emergency mode toggle
- Large-text/high-contrast stylesheet variant (CSS custom props swap), persistent across visits, prominent on mobile.
- Reduces chrome: hides tagline/layers, enlarges touch targets.

### T12 ☑ First-run framing
- One-screen explainer: what HelpMap is, that it's free, no account, location stays private. Shown once (localStorage flag), skippable.

---

## P2 — Dashboards & operations (post-pilot instrumentation)

### T13 ☐ Public status/health strip
- Feed health monitor: last-success timestamps for Overpass/NWS/USGS/GIBS surfaced from existing `LayerChip` state + a `/status` mini-page. Reuses `useLiveLayer` metadata; no new infra.

### T14 ☐ Privacy-preserving usage analytics
- Requirement: funder evidence without surveillance of vulnerable users.
- Options: self-hosted Umami/Plausible (aggregate counts only, no PII, no location tracking beyond coarse region) vs fully local counter. Recommend Umami on same VPS as future Overpass instance.
- Events: search performed, category filter used, directions clicked, report clicked. Never: user location, identifiers.

### T15 ☐ Partner submission queue (first real backend)
- Netlify/Vercel serverless function + KV store (or Cloudflare Workers + D1).
- Flow: community submits listing (name/category/hours/photo optional/contact) → partner moderator approves → two sinks: (a) immediate display via app's supplemental dataset, (b) suggested OSM edit export so data flows back to the commons.
- Includes spam controls (rate limit, honeypot).

### T16 ☐ Coverage dashboard
- For funders/partners: per-region category counts, staleness histogram, report volume. Rendered from T14/T15 aggregates. Static-generated chart page is sufficient.

### T17 ☐ Satellite layer (GIBS)
- Verified integration: Leaflet TileLayer against `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/{layer}/default/{date}/GoogleMapsCompatible_Level{N}/{z}/{y}/{x}.{ext}`.
- MVP: VIIRS/MODIS true-color "yesterday" toggle + thermal-anomaly overlay. Date picker later. Attribution line required ("NASA EOSDIS GIBS").

### T18 ☐ Additional hazard/data integrations
Priority order: GDACS global alerts → healthsites.io health facilities → Open-Meteo AQ index chip → FIRMS hotspots (needs free MAP_KEY) → FEMA declarations.

---

## Architecture notes (preserve context)

- **Stack:** Vite + React 19 + TS strict, react-leaflet v5 (React 19 compatible), vite-plugin-pwa (Workbox generateSW), oxlint. No backend today.
- **State:** single-file App orchestration; `useLiveLayer` hook owns fetch/cache/staleness per hazard feed (visibility-aware auto-refresh; localStorage hydration on first enable).
- **Caching layers:** Workbox runtime caches (tiles CacheFirst 14d; APIs NetworkFirst) + localStorage app-level snapshots. Viewed-tile caching complies with OSMF policy; **never add prefetch/offline-region downloads while using OSMF tiles** (prohibited) — offline regions only legal after switching to self-hosted/provider vector tiles.
- **Tooling hazard:** NEVER edit files via PowerShell Get-Content/Set-Content on this machine — it corrupts UTF-8 (mojibake). Use agent Write/Edit tools or explicit .NET UTF-8 APIs only.`n- **Known sharp edges:** Overpass name-regex queries can take down both endpoints — never reintroduce unconstrained regex scans; NWS rejects undocumented params (`limit`) — test contract changes live; react-leaflet v5 needs `@types/leaflet`.
- **Deploy target:** static (Netlify/Vercel/Pages). Remote: `git@github.com:qayumXD/help_map.git` over `ssh.github.com:443` (ISP blocks port 22 — remote URL already configured accordingly).
