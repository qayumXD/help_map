import type { LatLng, Resource } from '../types'
import { categorize } from '../data/categories'
import { en } from '../i18n/en'
import { haversineM } from '../utils/geo'

const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]

const AMENITIES =
  'food_bank|shelter|clinic|doctors|social_facility|toilets|shower|public_bath|drinking_water|library|community_centre'

function buildQuery(point: LatLng, radiusKm: number): string {
  const around = `(around:${Math.round(radiusKm * 1000)},${point.lat},${point.lng})`
  return `[out:json][timeout:25];
(
  nwr["amenity"~"^(${AMENITIES})$"]${around};
  nwr["social_facility"~"^(food_bank|soup_kitchen|homeless_shelter)$"]["amenity"!~"."]${around};
);
out center tags;`
}

interface OverpassElement {
  type: string
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

async function fetchEndpoint(endpoint: string, query: string): Promise<OverpassElement[]> {
  const res = await fetch(endpoint, {
    method: 'POST',
    body: 'data=' + encodeURIComponent(query),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  if (!res.ok) throw new Error(`Overpass error ${res.status}`)
  const json = (await res.json()) as { elements?: OverpassElement[] }
  return json.elements ?? []
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function toResource(el: OverpassElement): Resource | null {
  const lat = el.lat ?? el.center?.lat
  const lng = el.lon ?? el.center?.lon
  if (lat === undefined || lng === undefined) return null
  const tags = el.tags ?? {}
  const categories = categorize(tags)
  if (categories.length === 0) return null

  const street = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ')
  const cityLine = [tags['addr:city'], tags['addr:postcode']].filter(Boolean).join(' ')
  const addressParts = [street, cityLine].filter(Boolean)

  return {
    id: `${el.type}/${el.id}`,
    name:
      tags.name ??
      tags.operator ??
      en[`cat.${categories[0]}` as keyof typeof en] ??
      'Unnamed place',
    categories,
    lat,
    lng,
    distanceM: 0,
    address: addressParts.length > 0 ? addressParts.join(', ') : undefined,
    phone: tags.phone ?? tags['contact:phone'],
    website: tags.website ?? tags['contact:website'],
    openingHours: tags.opening_hours,
  }
}

export async function fetchResources(
  point: LatLng,
  radiusKm: number,
  origin: LatLng,
): Promise<Resource[]> {
  const query = buildQuery(point, radiusKm)
  let elements: OverpassElement[] | null = null
  let lastError: unknown = null

  for (let attempt = 0; attempt < ENDPOINTS.length + 1 && elements === null; attempt++) {
    if (attempt > 0) await sleep(700 + attempt * 900 + Math.random() * 500)
    try {
      elements = await fetchEndpoint(ENDPOINTS[attempt % ENDPOINTS.length], query)
    } catch (err) {
      lastError = err
    }
  }
  if (elements === null) throw lastError ?? new Error('Overpass unavailable')

  const resources = elements
    .map(toResource)
    .filter((r): r is Resource => r !== null)
    .map((r) => ({ ...r, distanceM: haversineM(origin.lat, origin.lng, r.lat, r.lng) }))
    .sort((a, b) => a.distanceM - b.distanceM)

  const seen = new Set<string>()
  return resources.filter((r) => {
    const key = `${r.name}|${Math.round(r.lat * 10000)}|${Math.round(r.lng * 10000)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
