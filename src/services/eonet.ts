import type { GlobalEvent, LatLng } from '../types'
import { haversineM } from '../utils/geo'

const EONET_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events'

interface EonetGeometryItem {
  date: string
  type: string
  coordinates: number[]
}

interface EonetEvent {
  id: string
  title: string
  link?: string
  categories?: { id: string; title: string }[]
  geometry?: EonetGeometryItem[]
}

export const EVENT_COLORS: Record<string, string> = {
  wildfires: '#e07b00',
  severeStorms: '#7a4fd0',
  volcanoes: '#d23b57',
  floods: '#1f8fce',
  earthquakes: '#b45309',
  landslides: '#6b7280',
  drought: '#a16207',
  dustHaze: '#ca8a04',
  seaLakeIce: '#0aa2c0',
  snow: '#64748b',
}

export function eventColor(category: string): string {
  return EVENT_COLORS[category] ?? '#7a4fd0'
}

/** Open global natural-hazard events from the last two weeks (NASA EONET). */
export async function fetchGlobalEvents(point: LatLng): Promise<GlobalEvent[]> {
  const params = new URLSearchParams({ status: 'open', days: '14', limit: '250' })
  const res = await fetch(`${EONET_URL}?${params}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`EONET error ${res.status}`)
  const json = (await res.json()) as { events?: EonetEvent[] }

  return (json.events ?? [])
    .map((e) => {
      const geo = e.geometry?.[e.geometry.length - 1]
      if (!geo || !Array.isArray(geo.coordinates)) return null
      const lng = geo.coordinates[0]
      const lat = geo.coordinates[1]
      if (typeof lat !== 'number' || typeof lng !== 'number') return null
      return {
        id: e.id,
        title: e.title,
        category: e.categories?.[e.categories.length - 1]?.id ?? 'severeStorms',
        dateMs: Date.parse(geo.date),
        lat,
        lng,
        link: e.link ?? '',
      }
    })
    .filter((ev): ev is GlobalEvent => ev !== null)
    .sort(
      (a, b) =>
        haversineM(point.lat, point.lng, a.lat, a.lng) -
        haversineM(point.lat, point.lng, b.lat, b.lng),
    )
}
