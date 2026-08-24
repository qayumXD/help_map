import type { LatLng, Quake } from '../types'

const URL_BASE = 'https://earthquake.usgs.gov/fdsnws/event/1/query'

interface UsgsFeature {
  id: string
  properties: {
    mag: number | null
    place: string | null
    time: number
    updated: number
    url: string | null
    type: string | null
  }
  geometry: {
    coordinates: [number, number, number]
  } | null
}

export async function fetchQuakes(point: LatLng, signal?: AbortSignal): Promise<Quake[]> {
  const start = new Date(Date.now() - 48 * 3600_000).toISOString()
  const params = new URLSearchParams({
    format: 'geojson',
    starttime: start,
    minmagnitude: '2.5',
    latitude: point.lat.toFixed(4),
    longitude: point.lng.toFixed(4),
    maxradiuskm: '300',
    orderby: 'time',
  })
  const res = await fetch(`${URL_BASE}?${params}`, {
    signal,
    headers: { Accept: 'application/geo+json' },
  })
  if (!res.ok) throw new Error(`USGS error ${res.status}`)
  const json = (await res.json()) as { features?: UsgsFeature[] }

  return (json.features ?? [])
    .filter((f) => f.geometry && f.properties.mag !== null)
    .map((f) => ({
      id: f.id,
      mag: f.properties.mag as number,
      place: f.properties.place ?? 'Unknown location',
      timeMs: f.properties.time,
      depthKm: Math.round(f.geometry?.coordinates[2] ?? 0),
      lat: f.geometry?.coordinates[1] ?? 0,
      lng: f.geometry?.coordinates[0] ?? 0,
      url: f.properties.url ?? '',
    }))
    .sort((a, b) => b.timeMs - a.timeMs)
}

/** Quakes strong enough to plausibly disrupt services. */
export function isDisruptive(q: Quake): boolean {
  return q.mag >= 4.5
}

/** Rough felt-radius heuristic in km, scaled by magnitude. */
export function impactRadiusKm(q: Quake): number {
  return Math.min(120, Math.max(15, q.mag * 12))
}
