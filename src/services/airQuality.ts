import type { LatLng } from '../types'
import { withLocalCache } from '../utils/localMemo'

export interface AirQuality {
  usAqi: number
  euAqi: number
  pm25: number
}

/** Current air quality for a point (Open-Meteo Air Quality API, no key). */
export async function fetchAirQuality(point: LatLng): Promise<AirQuality> {
  return withLocalCache(`aqi:${point.lat.toFixed(2)},${point.lng.toFixed(2)}`, 3_600_000, async () => {
    const params = new URLSearchParams({
      latitude: point.lat.toFixed(3),
      longitude: point.lng.toFixed(3),
      current: 'us_aqi,european_aqi,pm2_5',
    })
    const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`)
    if (!res.ok) throw new Error(`Open-Meteo error ${res.status}`)
    const json = (await res.json()) as {
      current?: { us_aqi?: number; european_aqi?: number; pm2_5?: number }
    }
    const c = json.current ?? {}
    return {
      usAqi: Math.round(c.us_aqi ?? 0),
      euAqi: Math.round(c.european_aqi ?? 0),
      pm25: Math.round((c.pm2_5 ?? 0) * 10) / 10,
    }
  })
}

export function aqiBand(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: 'Good', color: '#2fae6e' }
  if (aqi <= 100) return { label: 'Moderate', color: '#c9a100' }
  if (aqi <= 150) return { label: 'Unhealthy (sensitive)', color: '#e07b00' }
  if (aqi <= 200) return { label: 'Unhealthy', color: '#d23b57' }
  if (aqi <= 300) return { label: 'Very unhealthy', color: '#9b2226' }
  return { label: 'Hazardous', color: '#7a4fd0' }
}
