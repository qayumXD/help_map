import type { LatLng } from '../types'

const NOMINATIM = 'https://nominatim.openstreetmap.org'

interface NominatimResult {
  lat: string
  lon: string
  display_name?: string
  address?: Record<string, string>
}

export async function geocodeAddress(query: string): Promise<LatLng & { label: string }> {
  const url = `${NOMINATIM}/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=1`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`)
  const results = (await res.json()) as NominatimResult[]
  if (results.length === 0) throw new Error(`No results found for "${query}"`)
  return {
    lat: Number(results[0].lat),
    lng: Number(results[0].lon),
    label: shortLabel(results[0]),
  }
}

export function currentPosition(): Promise<LatLng> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED)
          reject(new Error('Location permission denied — search for your city instead'))
        else reject(new Error('Could not get your location — try searching instead'))
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 },
    )
  })
}

export async function reverseLabel(point: LatLng): Promise<string> {
  try {
    const res = await fetch(
      `${NOMINATIM}/reverse?lat=${point.lat}&lon=${point.lng}&format=jsonv2&zoom=14`,
    )
    if (!res.ok) return 'your location'
    const json = (await res.json()) as NominatimResult
    return json.display_name ? shortLabel(json) : 'your location'
  } catch {
    return 'your location'
  }
}

function shortLabel(result: NominatimResult): string {
  const a = result.address ?? {}
  const main = a.suburb ?? a.neighbourhood ?? a.city_district ?? a.town ?? a.village ?? a.city
  if (main && a.country_code?.toUpperCase() === 'US')
    return [main, a.state].filter(Boolean).join(', ')
  if (main) return [main, a.country].filter(Boolean).join(', ')
  return (result.display_name ?? 'this area').split(',').slice(0, 2).join(',')
}
