# HelpMap

Find free help near you — food banks, shelters, clinics, showers, drinking water and community spaces on one live map, with disaster-awareness layers.

## Features

- **Search by city/address or GPS** — results sorted closest-first, filterable by category
- **Live hazard layers** — NWS severe-alert polygons (US) and USGS earthquakes (M2.5+, 300 km) drawn on the map; resources inside an alert zone or a strong quake's felt radius get a warning badge
- **Auto-refresh** — hazard feeds update every 5–10 minutes while the tab is open, with per-layer freshness chips
- **Offline-friendly PWA** — installable, cached map tiles, last search restored when offline
- **Mobile-first** — list/map tabs on phones, side-by-side panes on desktop

## Data sources

| Source | Used for | License |
| --- | --- | --- |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) via Overpass API | all resource listings | ODbL |
| [NWS api.weather.gov](https://www.weather.gov/documentation/services-web-api) | active weather alerts (US) | public domain |
| [USGS Earthquake Catalog](https://earthquake.usgs.gov/fdsnws/event/1/) | recent seismic events | public domain |

Coverage depends on OpenStreetMap contributors and varies by region — free-food services in particular are under-mapped in some areas. Missing a place? Add it on OpenStreetMap and it appears here within minutes.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build + service worker in dist/
npm run lint     # oxlint
```

No backend required — deploys as a static site to Netlify, Vercel, GitHub Pages, etc.

## Documentation

- [Research report](docs/01-research.md) — adoption barriers, data-source policies, satellite access, funding landscape
- [Technical backlog](docs/02-technical-backlog.md) — prioritized work items (T1–T18)
- [90-day roadmap](docs/03-roadmap-90day.md) — phases, milestones, funding sequence

## License

- Code: [Apache-2.0](LICENSE)
- Map data: © OpenStreetMap contributors, [ODbL](https://opendatacommons.org/licenses/odbl/)
- Weather alerts (NWS) and earthquake data (USGS): US public domain
