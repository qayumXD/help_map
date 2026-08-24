import type { AlertSeverity, LatLng, WeatherAlert } from '../types'

interface NwsProperties {
  id?: string
  '@id'?: string
  event?: string
  headline?: string
  severity?: string
  areaDesc?: string
  instruction?: string
  status?: string
  expires?: string
  effective?: string
}

interface NwsGeometry {
  type: 'Polygon' | 'MultiPolygon'
  coordinates: number[][][] | number[][][][]
}

interface NwsFeature {
  id?: string
  properties: NwsProperties
  geometry: NwsGeometry | null
}

const SEVERITIES: AlertSeverity[] = ['Extreme', 'Severe', 'Moderate', 'Minor']

function firstRingCoords(geom: NwsGeometry): [number, number][] | undefined {
  if (geom.type === 'Polygon') {
    const ring = geom.coordinates[0] as unknown as [number, number][]
    return ring.length >= 4 ? ring : undefined
  }
  const polys = geom.coordinates as number[][][][]
  const ring = polys[0]?.[0] as unknown as [number, number][] | undefined
  return ring && ring.length >= 4 ? ring : undefined
}

function centroid(ring: [number, number][]): { lat: number; lng: number } {
  let sx = 0
  let sy = 0
  for (const [x, y] of ring) {
    sx += x
    sy += y
  }
  return { lng: sx / ring.length, lat: sy / ring.length }
}

export async function fetchAlerts(point: LatLng, signal?: AbortSignal): Promise<WeatherAlert[]> {
  const params = new URLSearchParams({
    point: `${point.lat.toFixed(4)},${point.lng.toFixed(4)}`,
    status: 'actual',
  })
  const res = await fetch(`https://api.weather.gov/alerts/active?${params}`, {
    signal,
    headers: { Accept: 'application/geo+json' },
  })
  if (!res.ok) throw new Error(`NWS error ${res.status}`)
  const json = (await res.json()) as { features?: NwsFeature[] }

  return (json.features ?? [])
    .filter((f) => (f.properties.status ?? 'Actual') === 'Actual')
    .filter((f) => f.properties.event)
    .map((f) => {
      const p = f.properties
      const ring = f.geometry ? firstRingCoords(f.geometry) : undefined
      const c = ring ? centroid(ring) : { lat: point.lat, lng: point.lng }
      const sevIdx = SEVERITIES.indexOf((p.severity ?? '') as AlertSeverity)
      return {
        id: p.id ?? p['@id'] ?? `${p.event}-${p.effective}`,
        event: p.event as string,
        headline: p.headline,
        severity: sevIdx >= 0 ? SEVERITIES[sevIdx] : 'Unknown',
        areaDesc: p.areaDesc ?? '',
        instruction: p.instruction,
        expiresMs: p.expires ? Date.parse(p.expires) : null,
        lat: c.lat,
        lng: c.lng,
        polygon: ring,
      }
    })
    .sort((a, b) => {
      const rank = (s: AlertSeverity) => (s === 'Extreme' ? 0 : s === 'Severe' ? 1 : s === 'Moderate' ? 2 : 3)
      return rank(a.severity) - rank(b.severity)
    })
}

export function isActive(a: WeatherAlert): boolean {
  return a.expiresMs === null || a.expiresMs > Date.now()
}
