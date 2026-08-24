import type { Resource } from '../types'
import type { LatLng } from '../types'
import { useT } from '../i18n/useT'
import ResourceCard from './ResourceCard'

interface Props {
  status: 'idle' | 'loading' | 'ready'
  resources: Resource[]
  activeId: string | null
  onSelect: (id: string) => void
  onShowOnMap: (id: string) => void
  locationLabel: string
  onLocate: () => void
  position?: LatLng | null
  foodMissing?: boolean
}

function CoverageNote({
  position,
  foodMissing,
}: {
  position?: LatLng | null
  foodMissing?: boolean
}) {
  const { t } = useT()
  const mapUrl = position
    ? `https://www.openstreetmap.org/#map=15/${position.lat.toFixed(4)}/${position.lng.toFixed(4)}`
    : 'https://www.openstreetmap.org/'
  return (
    <p className="coverage-note">
      {t('coverage.body')}
      {foodMissing ? t('coverage.bodyFood') : ''}.{' '}
      <a href={mapUrl} target="_blank" rel="noopener noreferrer">
        {t('coverage.link')}
      </a>
      {t('coverage.suffix')}
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
  resources,
  activeId,
  onSelect,
  onShowOnMap,
  locationLabel,
  onLocate,
  position,
  foodMissing,
}: Props) {
  const { t } = useT()

  if (status === 'idle') {
    return (
      <div className="idle">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <h2>{t('idle.title')}</h2>
        <p>{t('idle.body')}</p>
        <button type="button" className="btn-primary btn-lg" onClick={onLocate}>
          {t('idle.cta')}
        </button>
        <p className="idle-hint">{t('idle.hint')}</p>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <>
        <p className="results-count">{t('results.searching', { place: locationLabel || t('results.placeFallback') })}</p>
        <Skeletons />
      </>
    )
  }

  if (resources.length === 0) {
    return (
      <div className="idle">
        <h2>{t('results.noneTitle')}</h2>
        <p>{t('results.noneBody')}</p>
        <CoverageNote position={position} foodMissing={foodMissing} />
      </div>
    )
  }

  return (
    <>
      <p className="results-count" aria-live="polite">
        {t('results.count', { n: resources.length, place: locationLabel || t('results.placeFallback') })}
        {' Â· '}
        {t('results.closest')}
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
