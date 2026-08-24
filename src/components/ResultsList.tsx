import type { LatLng, Resource } from '../types'
import ResourceCard from './ResourceCard'

interface Props {
  status: 'idle' | 'loading' | 'ready'
  notice: string | null
  resources: Resource[]
  activeId: string | null
  onSelect: (id: string) => void
  onShowOnMap: (id: string) => void
  locationLabel: string
  onLocate: () => void
  position?: LatLng | null
  foodMissing?: boolean
}

function CoverageNote({ position, foodMissing }: { position?: LatLng | null; foodMissing?: boolean }) {
  const mapUrl = position
    ? `https://www.openstreetmap.org/#map=15/${position.lat.toFixed(4)}/${position.lng.toFixed(4)}`
    : 'https://www.openstreetmap.org/'
  return (
    <p className="coverage-note">
      Coverage depends on OpenStreetMap contributors and varies by region
      {foodMissing ? ' — free-food services are especially under-mapped here' : ''}. Know a
      missing place?{' '}
      <a href={mapUrl} target="_blank" rel="noopener noreferrer">
        Add it on OpenStreetMap
      </a>{' '}
      and it will appear here within minutes.
    </p>
  )
}

function Skeletons() {
  return (
    <div className="skeletons">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="skeleton" />
      ))}
    </div>
  )
}

export default function ResultsList({
  status,
  notice,
  resources,
  activeId,
  onSelect,
  onShowOnMap,
  locationLabel,
  onLocate,
  position,
  foodMissing,
}: Props) {
  if (status === 'idle') {
    return (
      <div className="idle">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <h2>Find free help near you</h2>
        <p>
          Food banks, shelters, clinics, showers, drinking water and community spaces — all in one map. Your location never leaves your device.
        </p>
        <button type="button" className="btn-primary btn-lg" onClick={onLocate}>
          Use my location
        </button>
        <p className="idle-hint">…or search for a city above.</p>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <>
        <p className="results-count">Searching near {locationLabel || 'you'}…</p>
        <Skeletons />
      </>
    )
  }

  if (resources.length === 0) {
    return (
      <div className="idle">
        <h2>No results here</h2>
        <p>{notice ?? 'Try widening the radius or turning filters back on.'}</p>
        <CoverageNote position={position} foodMissing={foodMissing} />
      </div>
    )
  }

  return (
    <>
      <p className="results-count" aria-live="polite">
        {resources.length} place{resources.length === 1 ? '' : 's'} near{' '}
        <strong>{locationLabel || 'you'}</strong> · closest first
      </p>
      <div className="cards">
        {resources.map((r) => (
          <ResourceCard
            key={r.id}
            resource={r}
            active={r.id === activeId}
            onToggle={() => onSelect(r.id)}
            onShowOnMap={() => onShowOnMap(r.id)}
          />
        ))}
      </div>
      <CoverageNote position={position} foodMissing={foodMissing} />
    </>
  )
}
