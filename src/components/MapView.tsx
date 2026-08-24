import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Polygon, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { AlertSeverity, LatLng, Quake, Resource, WeatherAlert } from '../types'
import { CATEGORY_BY_ID } from '../data/categories'
import { isActive } from '../services/alerts'
import { TILE_ATTRIBUTION, TILE_URL } from '../config'
import { timeAgo } from '../utils/geo'
import { useT } from '../i18n/useT'

interface Props {
  position: LatLng | null
  resources: Resource[]
  activeId: string | null
  onSelect: (id: string) => void
  quakes: Quake[]
  alerts: WeatherAlert[]
  showQuakes: boolean
  showAlerts: boolean
}

function pinIcon(color: string, active: boolean): L.DivIcon {
  return L.divIcon({
    className: 'hm-pin-wrap',
    html: `<span class="hm-pin${active ? ' hm-pin-active' : ''}" style="--pin:${color}"></span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

function quakeIcon(mag: number): L.DivIcon {
  const size = Math.round(12 + mag * 3.5)
  return L.divIcon({
    className: 'hm-pin-wrap',
    html: `<span class="hm-quake" style="--qs:${size}px"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function alertStyle(severity: AlertSeverity): L.PathOptions {
  switch (severity) {
    case 'Extreme':
    case 'Severe':
      return { color: '#c62838', fillColor: '#d23b57', fillOpacity: 0.14, weight: 2 }
    case 'Moderate':
      return { color: '#c76a00', fillColor: '#e07b00', fillOpacity: 0.11, weight: 1.5 }
    default:
      return { color: '#1877b8', fillColor: '#1f8fce', fillOpacity: 0.08, weight: 1.5 }
  }
}

function AutoResize() {
  const map = useMap()
  useEffect(() => {
    const el = map.getContainer()
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(el)
    return () => ro.disconnect()
  }, [map])
  return null
}

function Follow({ position }: { position: LatLng | null }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.setView([position.lat, position.lng], 13)
  }, [position, map])
  return null
}

function FitToResults({ resources }: { resources: Resource[] }) {
  const map = useMap()
  const key = useMemo(() => resources.map((r) => r.id).join(','), [resources])
  useEffect(() => {
    if (resources.length > 1) {
      const bounds = L.latLngBounds(resources.map((r) => [r.lat, r.lng] as [number, number]))
      map.fitBounds(bounds.pad(0.2), { maxZoom: 16 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return null
}

function FlyToActive({ resource }: { resource: Resource | undefined }) {
  const map = useMap()
  useEffect(() => {
    if (resource) {
      map.flyTo([resource.lat, resource.lng], Math.max(map.getZoom(), 16), { duration: 0.6 })
    }
  }, [resource, map])
  return null
}

export default function MapView({
  position,
  resources,
  activeId,
  onSelect,
  quakes,
  alerts,
  showQuakes,
  showAlerts,
}: Props) {
  const visibleAlerts = useMemo(
    () => (showAlerts ? alerts.filter((a) => a.polygon && isActive(a)) : []),
    [alerts, showAlerts],
  )
  const visibleQuakes = showQuakes ? quakes : []
  const activeResource = resources.find((r) => r.id === activeId)
  const { t } = useT()

  if (!position) {
    return (
      <div className="map-placeholder">
        <p>{t('map.placeholder')}</p>
      </div>
    )
  }

  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={13}
      scrollWheelZoom
      className="hm-map"
      attributionControl={true}
    >
      <TileLayer
        attribution={TILE_ATTRIBUTION}
        url={TILE_URL}
      />
      <AutoResize />
      <Follow position={position} />
      <FitToResults resources={resources} />
      <FlyToActive resource={activeResource} />

      {visibleAlerts.map((a) => (
        <Polygon
          key={a.id}
          positions={(a.polygon as [number, number][]).map(([x, y]) => [y, x])}
          pathOptions={{ ...alertStyle(a.severity), dashArray: '5 4' }}
        >
          <Tooltip sticky>
            {a.event} — {a.areaDesc}
          </Tooltip>
        </Polygon>
      ))}

      {resources.map((r) => (
        <Marker
          key={r.id}
          position={[r.lat, r.lng]}
          icon={pinIcon(
            CATEGORY_BY_ID.get(r.categories[0])?.color ?? '#0e7a5f',
            r.id === activeId,
          )}
          eventHandlers={{ click: () => onSelect(r.id) }}
          zIndexOffset={r.id === activeId ? 1000 : 0}
        />
      ))}

      {visibleQuakes.map((q) => (
        <Marker key={`quake-${q.id}`} position={[q.lat, q.lng]} icon={quakeIcon(q.mag)}>
          <Popup>
            <strong>M{q.mag.toFixed(1)}</strong> · {q.depthKm} km deep
            <br />
            {q.place}
            <br />
            <span className="popup-muted">{timeAgo(q.timeMs)}</span>
            {q.url && (
              <>
                <br />
                <a href={q.url} target="_blank" rel="noopener noreferrer">
                  {t('quake.details')}
                </a>
              </>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
