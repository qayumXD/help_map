export const en = {
  'app.tagline': 'Free food, shelter, care & support near you',
  'header.privacy': 'Privacy',

  'search.placeholder': 'Enter a city or address…',
  'search.submit': 'Search',
  'search.locate': 'Use my location',
  'search.locating': 'Locating…',
  'search.within': 'Within',
  'search.clear': 'Clear search',

  'cat.food': 'Food & Meals',
  'cat.shelter': 'Shelter',
  'cat.health': 'Health',
  'cat.hygiene': 'Hygiene',
  'cat.water': 'Water',
  'cat.community': 'Community & Wi-Fi',

  'chips.label': 'Filter by category',
  'chips.shown': '{total} shown',
  'chips.openNow': 'Open now',

  'layers.live': 'Live',
  'layers.alerts': 'Weather alerts',
  'layers.quakes': 'Earthquakes',
  'layers.loading': 'loading…',
  'layers.refresh': 'Refresh {label}',

  'common.dismiss': 'Dismiss',

  'info.offline': 'You are offline — showing your last saved results.',
  'info.restored': 'Restored your last search. Search again for fresh results.',
  'warn.text':
    '{n} place(s) may be affected by active hazards — see the warning badges on their cards.',

  'idle.title': 'Find free help near you',
  'idle.body':
    'Food banks, shelters, clinics, showers, drinking water and community spaces — all in one map. Your location never leaves your device.',
  'idle.cta': 'Use my location',
  'idle.hint': '…or search for a city above.',

  'results.searching': 'Searching near {place}…',
  'results.noneTitle': 'No results here',
  'results.noneBody': 'Try widening the radius or turning filters back on.',
  'results.count': '{n} place(s) near {place}',
  'results.closest': 'closest first',
  'results.placeFallback': 'you',

  'coverage.body': 'Coverage depends on OpenStreetMap contributors and varies by region',
  'coverage.bodyFood':
    ' — free-food services are especially under-mapped in this area',
  'coverage.link': 'Add it on OpenStreetMap',
  'coverage.suffix': '. Know a missing place? Add it and it will appear here within minutes.',

  'card.minWalk': '{m} min walk',
  'card.affected': 'May be affected:',
  'card.report': 'Report a problem',
  'card.open': 'Open',
  'card.closed': 'Closed',

  'mode.toggle': 'Toggle high-visibility mode',

  'onboard.title': 'Welcome to HelpMap',
  'onboard.p1':
    'Find free food, shelter, health care and community services near you — completely free, no account needed.',
  'onboard.p2':
    'Your location stays on your device. Listings come from OpenStreetMap and public safety feeds.',
  'onboard.cta': 'Get started',

  'detail.address': 'Address',
  'detail.hours': 'Hours',
  'detail.phone': 'Phone',
  'detail.web': 'Web',
  'detail.directions': 'Directions',
  'detail.showMap': 'Show on map',

  'map.placeholder': 'Search or share your location to see the map.',
  'quake.details': 'Details on USGS',

  'privacy.title': 'Privacy',
  'privacy.collect.title': 'What we collect',
  'privacy.collect.body':
    'HelpMap has no accounts, no analytics and no cookies. We do not collect or store personal data on servers — there are no HelpMap servers. The app is a static website.',
  'privacy.location.title': 'Your location',
  'privacy.location.body':
    'When you tap "Use my location", your browser provides coordinates to the app on your device. They stay in your browser and are used only for local distance calculations.',
  'privacy.location.third': 'Sent to third parties',
  'privacy.location.thirdBody':
    "When you search a place name, that text goes to OpenStreetMap's Nominatim geocoding service. Requests for listings (Overpass API) and hazard feeds (weather.gov, USGS) include coordinates rounded to ~1 km precision.",
  'privacy.storage.title': 'Stored on your device only',
  'privacy.storage.body':
    "Your last search and results, cached map tiles and recent geocoding answers are stored in your browser's local storage for offline use. Keys: hm:search, hm:resources, hm:quakes, hm:alerts, hm:cache:*. Clearing browser data removes everything.",
  'privacy.sources.title': 'Data sources & licenses',
  'privacy.sources.body':
    'Map data © OpenStreetMap contributors (ODbL). Weather alerts via NOAA/NWS. Earthquake data via USGS. Satellite imagery via NASA EOSDIS GIBS when enabled.',
  'privacy.contact': 'Questions? Open an issue on GitHub.',
}

export type Dict = Record<keyof typeof en, string>

export default en
