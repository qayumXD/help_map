# HelpMap Research Report

_Compiled: 2026-08-24 · Method: live verification (web fetches of primary sources + live API queries run against production endpoints during this session). Every policy claim below was read from the source document on the day of compilation unless marked otherwise._

---

## 1. What blocks community adoption today

Ranked by severity, based on product reality + how comparable platforms (211, Ushahidi, healthsites.io) achieved usage:

| # | Barrier | Evidence / reasoning |
| --- | --- | --- |
| 1 | **No trust & distribution loop** | People in crisis use known channels (211 hotlines, shelter referrals, caseworkers, Google Maps). An unknown web app is not discovered organically. Partnerships are the distribution channel. |
| 2 | **Stale listings destroy trust** | One wasted trip to a closed food bank loses the user permanently. We currently have: no "report closed/moved" button, no open-now signal, no local maintainer accountability. |
| 3 | **Community cannot contribute listings in-app** | Adding a place requires OSM editing knowledge. Real platforms have a dead-simple submission queue + moderation. This gap also caps our data moat. |
| 4 | **English-only** | Fatal for Japan/global pilots. i18n is entry criteria, not polish. |
| 5 | **Coverage gaps by region/category** | Proven live: central Tokyo returns **zero** `amenity=food_bank` and zero objects matching フードバンク / こども食堂 names in OSM (Overpass queries run 2026-08-24). Users judge the platform by the category they need most. |

---

## 2. Current data sources and their verified limits

| Source | Used for | Verified constraint (from official policy / live test) |
| --- | --- | --- |
| **Overpass API** (`overpass-api.de`, mirror `overpass.kumi.systems`) | All resource listings | Public donation-funded infra, **no SLA**. Live incidents this session: Kumi mirror returned HTTP 502 on every request during testing; DE returned 504 gateway timeouts on regex-name queries over 10 km radii. Query design must stay lean (see §7 lessons). |
| **tile.openstreetmap.org** | Basemap raster tiles | OSMF Tile Usage Policy: best-effort, blockable without notice; bulk download/offline *prefetch* **prohibited**; our service-worker caching of actively-viewed tiles is permitted ("keep a sufficient local cache"); requires visible attribution ✓, valid Referer ✓, identifiable UA. Policy explicitly directs production apps to alternative providers or self-hosting at scale. |
| **Nominatim** (`nominatim.openstreetmap.org`) | Search geocoding + reverse labels | Usage policy: **absolute max 1 request/second per app**, no autocomplete implementations, results must be cached, service must be switchable without app update. Fine for pilot volume; scaling risk. Note: policy explicitly addresses LLM/vibe-coded apps — our compliance posture should be deliberate and documented. |
| **api.weather.gov (NWS)** | Active severe-alert polygons (US only) | Public domain. No key. Live test caught a real contract detail: `limit` param rejected (400) — we ship `status=actual` instead. Polygon geometry present on many (not all) alerts. |
| **USGS Earthquake Catalog (fdsnws)** | M2.5+ quakes within 300 km / 48 h | Public domain, no key, generous. Radius+time+magnitude scoping validated live (NYC, Costa Rica, Alaska tests). |

### Session lessons baked into the codebase
- Overpass value-negation syntax is `"amenity"!~"regex"` (not `[!"amenity"...]`) — cost us a debug cycle.
- Unanchored name-regex scans over large radii are **server-killing**: 93–119 s responses and 504s even bounded by venue-type filters. Dropped deliberately; coverage gaps are handled in UI honestly instead.
- Both public Overpass endpoints can be simultaneously degraded — the app's failover chain is necessary but not sufficient for production reliability (→ self-hosted/mirrored instance in backlog).

---

## 3. Missing utilizations (verified available, mostly free)

| Source | Fills | Access model |
| --- | --- | --- |
| **healthsites.io** | Curated global health-facility registry built on OSM; GeoJSON/CSV/API output; partners include MSF, ICRC, HOT, HeiGIT | Open (ODbL); direct upgrade for Health category where raw OSM is thin (Global South especially) |
| **NASA FIRMS** | Near-real-time satellite fire hotspots | Free MAP_KEY (EarthData registration); CSV/WFS |
| **GDACS** (EU/JRC) | Global all-hazard alerts: cyclones, floods, volcanoes, tsunamis, wildfires — fills the huge non-US hole in our alert layer | Free GeoRSS/JSON feeds |
| **ReliefWeb API / HDX** | UN-OCHA humanitarian reports & curated disaster datasets | Free API |
| **Open-Meteo** | Air quality (critical in wildfire smoke events) + forecasts + GloFAS river-discharge flood risk | Free, no key |
| **National registries** | Japan: musubie こども食堂 database (the actual fix for the Tokyo food gap — needs outreach/partnership, no stable public API confirmed yet). US: Feeding America locator, WhyHunger, AmpleHarvest. UK: Trussell Trust. | Mixed; some require partnership/MoU rather than scraping |
| **FEMA APIs** | Disaster declarations, National Risk Index (US resilience scoring) | Free, keyed |

---

## 4. Satellite data — can we access it? Yes.

Three tiers, easiest first:

1. **NASA GIBS — trivially easy, zero cost, verified.**
   - Free WMTS/XYZ tile service at `gibs.earthdata.nasa.gov`; **EPSG:3857 Web Mercator supported**, Leaflet explicitly documented as supported client.
   - Daily layers: MODIS/VIIRS true-color imagery, thermal anomalies (fires), floods, aerosols.
   - Integration = one Leaflet `TileLayer` with dated REST URL pattern:
     `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/{layer}/default/{YYYY-MM-DD}/{matrixSet}/{z}/{y}/{x}.{ext}`
   - No key, no registration. "Yesterday's satellite view" toggle ≈ one afternoon of work.

2. **Prebuilt event products — moderate.**
   - Copernicus EMS activation GeoJSONs (flood extents, fire scars), NIFC/WFIGS US fire perimeters, NOAA HMS smoke polygons. Download/serve as overlay layers; no image processing on our side.

3. **Raw satellite analysis — later, funded-work territory.**
   - Sentinel-1 SAR (sees through clouds → flood mapping), Sentinel-2 optical (10 m), Landsat via Copernicus Data Space / USGS EarthExplorer / AWS Open Data. Requires processing pipeline (STAC catalogs, batch jobs) — only justified post-funding.

**Recommended stance:** consume prebuilt products as map layers now; never build our own image-analysis pipeline before a partner demonstrates need.

---

## 5. UI audit (honest)

**Good:** mobile-first layout, focus-visible states, semantic buttons/aria, clean hierarchy, offline restore messaging, freshness chips.

**Gaps for field/stressed users:**

- No i18n / language switcher (blocker for JP pilot)
- No "open now" status (opening_hours unparsed)
- No per-listing issue reporting ("closed", "moved", "wrong info")
- No emergency mode (large text, high contrast, reduced chrome)
- No photos/human context on cards; Google-only directions deep-link
- Screen-reader flows untested; icon-only affordances unlabeled in places
- No onboarding framing for first-time crisis users (what is this, is it private, what does it cost = nothing)

**Verdict:** demo-quality today; field-quality after P1 backlog (docs/02).

---

## 6. Funding landscape for hosting/sponsorship

### Verified programs

| Program | Amount | Status (verified 2026-08-24) | Fit notes |
| --- | --- | --- | --- |
| **UNICEF Venture Fund** | up to **$100K equity-free** (+mentorship) | Active; 30-min Expression of Interest | Invests **only** in open-source solutions positioned as Digital Public Goods; strong fit if pilot serves children/families in program countries |
| **NLnet / NGI** | €5K–€50K grants, scalable | NGI Zero Commons Fund **closed June 2026** (final call); successor programmes announced: **Restack, CodeSupply, ELFA** | The classic funder for exactly this kind of open civic internet tool; watch new calls |
| **HOT microgrants** | typically ~$500–$5K | Cycles periodic (funding page moved — recheck hotosm.org) | Also the door to Missing Maps community validation + OSM ecosystem credibility |
| **GitHub Sponsors / Open Collective** | recurring small | Always open | Community sustainment; works even pre-institutional funding |
| Cloud credit programs (AWS Imagine, Google.org) | infra credits | Rolling | Covers tile-hosting/Overpass costs directly |

### What every funder will require (the real gate)

1. **One signed pilot partner** (shelter network / food bank alliance / city social services) actually using HelpMap
2. **Usage evidence** — even modest: sessions, searches, repeat users, testimonials
3. **Privacy policy** for location data (our architecture is privacy-strong: location never leaves device except geocoding queries — must be written down)
4. **Accessibility statement** + basic WCAG conformance claim
5. **Open-source license** on the repo (currently MISSING — P0)
6. **Named maintainer + governance** (even a simple README governance section)
7. Theory of change / problem-solution narrative with the Tokyo-gap story as motivation evidence

### Cost reality

| Item | Now | At pilot scale | At regional scale |
| --- | --- | --- | --- |
| Static hosting | $0 (free tier) | $0–20/mo | $20–100/mo |
| Domain | ~$12/yr | ~$12/yr | ~$12/yr |
| Tiles | $0 (OSMF, within policy) | $0–50/mo (provider e.g. MapTiler/Stadia free tiers) | $100–200+/mo or self-host |
| Overpass capacity | $0 (public) | $20–40/mo VPS (own instance) | $40–100/mo |
| Geocoding | $0 (Nominatim, within policy) | $0–30/mo (Photon self-host or provider) | $30–80/mo |

**Total to be raised initially: roughly $50–150/month** — the funding ask is about credibility + sustainability, not survival.

---

## 7. Key strategic conclusions

1. **Distribution beats features.** One partner org > ten new data layers.
2. **Trust mechanics (freshness, reporting, open-now) are the core product**, not enhancements — a help-directory is only as good as its worst stale listing.
3. **Coverage gaps are structural in OSM for aid categories** (proven in Tokyo). Strategy: bundle curated snapshots (musubie etc.) + honest UI + contribution loop back into OSM.
4. **Satellite layer is cheap credibility** — GIBS toggle gives "disaster-grade" perception for one afternoon of work, and it's genuinely useful in fires/floods.
5. **Compliance posture is a funding prerequisite**: OSMF policies, Nominatim switchability, privacy-first architecture documented. Funders check these.
6. **90-day sequence** (detailed in [03-roadmap](03-roadmap-90day.md)): compliance/i18n/reporting → pilot partner + instrumentation → integration sprints (healthsites, GDACS, GIBS) → applications (NLnet successor, HOT, UNICEF VF).
