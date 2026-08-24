# HelpMap 90-Day Roadmap

_Goal: from working prototype → fundable, pilot-backed public good._
_Companion docs: [research](01-research.md) · [technical backlog](02-technical-backlog.md) (IDs T1–T18)._

---

## Phase 0 — Foundations (Week 1–2)
**Theme: make it safe & legitimate to show people.**

| Item | Backlog | Exit criteria |
| --- | --- | --- |
| LICENSE chosen + added | T1 | Repo has LICENSE; ODbL data note in README |
| Privacy statement page | T2 | In-app page linked from header/footer |
| Basemap + geocoder abstractions | T3, T4 | Provider switch via config; cached geocoding live |
| Overpass backoff + snapshot plan | T5 | Failover hardened; snapshot design written |
| Accessibility basics pass | T6 | Contrast fixes, keyboard paths, SR smoke test notes |

**Milestone M0:** public URL live with compliance artifacts. Nothing embarrassing for a funder to find.

## Phase 1 — Field-ready UX (Week 2–5)
**Theme: usable by the actual end users, in their language.**

| Item | Backlog | Exit criteria |
| --- | --- | --- |
| i18n EN/日本語 + switcher | T7 | Full UI translated; native-speaker copy review done |
| Issue reporting on cards | T8 | OSM-note deep link works from every listing |
| Open-now badges + filter | T9 | Parses common `opening_hours`; tested against real data |
| Directions chooser | T10 | Google/Apple/OSM options |
| Emergency mode | T11 | Large-text/high-contrast toggle persists |
| First-run explainer | T12 | One-time privacy/trust screen |

**Milestone M1:** a Japanese-speaking user in Osaka can find, verify and navigate to help without English. (Food coverage still thin — that's Phase 2's partnership work.)

## Phase 2 — Coverage & integrations (Week 5–9)
**Theme: close the gaps we proved exist.**

| Item | Backlog | Exit criteria |
| --- | --- | --- |
| GIBS satellite toggle | T17 | "Yesterday" imagery + fire anomalies on map |
| GDACS global alerts layer | T18 | Non-US hazards visible (cyclone/flood/volcano) |
| healthsites.io facilities merged | T18 | Health category depth improves in test regions |
| Japan food registry outreach begins | — | Contact musubie / local NPOs re: こども食堂 dataset partnership |
| Open-Meteo AQ chip | T18 | AQI shown during searches |

**Milestone M2:** Tokyo search shows *some* credible food results (bundled/partnered data), global disaster coverage beyond US.

## Phase 3 — Pilot & evidence (Week 7–11, overlaps Phase 2)
**Theme: distribution + proof. The step everyone skips.**

- Sign **one pilot partner** (shelter network, food bank alliance, or city social services — start local to founder location; Japan angle is differentiator if reachable)
- Instrument privacy-preserving analytics (T14) + status strip (T13)
- Weekly usage digest; collect 3+ testimonials/case notes
- Begin partner submission queue build (T15)

**Milestone M3:** documented real-world usage: sessions, searches, directions clicks, one saved-trip story.

## Phase 4 — Funding applications (Week 10–13)

| Application | Angle | Prereqs met by |
| --- | --- | --- |
| HOT microgrant | OSM ecosystem tool, coverage-gap contribution loop | M0–M2 |
| NLnet successor fund (Restack/CodeSupply/ELFA — watch calls) | open internet commons, offline PWA, self-hostable civic infra | M0–M3 |
| UNICEF Venture Fund ($100K EoI) | Digital Public Good for children/families in program country | Requires pilot in program country → decide pilot geography early |
| Parallel: GitHub Sponsors / Open Collective live | recurring community support | M0 |

**Milestone M4:** ≥2 applications submitted with evidence pack (metrics, testimonials, privacy/accessibility statements, governance section).

---

## Decision points
1. **Pilot geography** (Week 2): Japan-first (differentiator + founder interest, slower partnerships) vs local-first (faster partner access, generic product). Determines UNICEF eligibility framing.
2. **First backend** (Phase 3): submission queue introduces serverless dependency — keep it minimal (single function + KV).
3. **Tile provider spend**: stay $0 until policy pressure or scale forces move; revisit at >10K MAU.

## Risks
- Overpass public instability persists → mitigated by snapshots (T5); worst case app degrades to snapshot-only search.
- Partner outreach takes longer than weeks → don't block Phase 2 tech work on it.
- Scope creep into raw satellite processing → explicitly deferred until funded (research doc §4).
