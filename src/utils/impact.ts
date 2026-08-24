import type { Quake, Resource, WeatherAlert } from '../types'
import { isActive } from '../services/alerts'
import { impactRadiusKm, isDisruptive } from '../services/quakes'
import { haversineM, pointInPolygon } from './geo'

interface AnnotateOptions {
  quakesEnabled: boolean
  quakes: Quake[]
  alertsEnabled: boolean
  alerts: WeatherAlert[]
}

/** Tag each resource with human-readable hazards covering its location. */
export function annotateResources(resources: Resource[], opts: AnnotateOptions): Resource[] {
  return resources.map((r) => {
    const notes = new Set<string>()

    if (opts.alertsEnabled) {
      for (const a of opts.alerts) {
        if (!isActive(a) || !a.polygon) continue
        if (pointInPolygon(r, a.polygon)) notes.add(a.event)
      }
    }

    if (opts.quakesEnabled) {
      for (const q of opts.quakes) {
        if (!isDisruptive(q)) continue
        const km = haversineM(r.lat, r.lng, q.lat, q.lng) / 1000
        if (km <= impactRadiusKm(q)) notes.add(`M${q.mag.toFixed(1)} earthquake`)
      }
    }

    return notes.size > 0 ? { ...r, affectedBy: [...notes] } : { ...r, affectedBy: undefined }
  })
}
