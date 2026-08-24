export interface LatLng {
  lat: number
  lng: number
}

export type CatId = 'food' | 'shelter' | 'health' | 'hygiene' | 'water' | 'community'

export interface Category {
  id: CatId
  color: string
  matches: (tags: Record<string, string>) => boolean
}

export interface Resource {
  id: string
  name: string
  categories: CatId[]
  lat: number
  lng: number
  distanceM: number
  address?: string
  phone?: string
  website?: string
  openingHours?: string
  affectedBy?: string[]
}

export interface Quake {
  id: string
  mag: number
  place: string
  timeMs: number
  depthKm: number
  lat: number
  lng: number
  url: string
}

export type AlertSeverity = 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown'

export interface WeatherAlert {
  id: string
  event: string
  headline?: string
  severity: AlertSeverity
  areaDesc: string
  instruction?: string
  expiresMs: number | null
  lat: number
  lng: number
  polygon?: [number, number][]
}

export type LayerId = 'quakes' | 'alerts' | 'eonet'

export interface LayerMeta {
  id: LayerId
  refreshMs: number
}

export const LAYERS: LayerMeta[] = [
  { id: 'alerts', refreshMs: 5 * 60_000 },
  { id: 'quakes', refreshMs: 10 * 60_000 },
  { id: 'eonet', refreshMs: 30 * 60_000 },
]

export interface GlobalEvent {
  id: string
  title: string
  category: string
  dateMs: number
  lat: number
  lng: number
  link: string
}
