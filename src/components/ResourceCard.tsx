import type { Resource } from '../types'
import { CATEGORY_BY_ID } from '../data/categories'
import { formatDistance, walkMinutes } from '../utils/geo'
import CategoryIcon from './CategoryIcon'

interface Props {
  resource: Resource
  active: boolean
  onToggle: () => void
  onShowOnMap: () => void
}

export default function ResourceCard({ resource: r, active, onToggle, onShowOnMap }: Props) {
  const primary = CATEGORY_BY_ID.get(r.categories[0])
  const secondary = CATEGORY_BY_ID.get(r.categories[1])

  const siteLabel = r.website?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

  return (
    <article className={`card ${active ? 'card-active' : ''}`}>
      <button className="card-head" onClick={onToggle} aria-expanded={active}>
        <span
          className="cat-dot"
          style={{ background: primary?.color }}
          aria-hidden="true"
        >
          <CategoryIcon id={primary?.id ?? ''} size={14} />
        </span>
        <span className="card-main">
          <span className="card-name">{r.name}</span>
          <span className="card-meta">
            <span className="cat-badge">{primary?.label}</span>
            {secondary && <span className="cat-badge cat-badge-soft">{secondary.label}</span>}
          </span>
        </span>
        <span className="card-dist">
          <strong>{formatDistance(r.distanceM)}</strong>
          <small>{walkMinutes(r.distanceM)} min walk</small>
        </span>
        {r.affectedBy && r.affectedBy.length > 0 && (
          <span className="card-warn-dot" title={r.affectedBy.join(' · ')} aria-hidden="true" />
        )}
      </button>

      {active && (
        <div className="card-detail">
          {r.affectedBy && r.affectedBy.length > 0 && (
            <div className="card-hazard" role="alert">
              <strong>May be affected:</strong> {r.affectedBy.join(' · ')}
            </div>
          )}
          <dl>
            {r.address && (
              <>
                <dt>Address</dt>
                <dd>{r.address}</dd>
              </>
            )}
            {r.openingHours && (
              <>
                <dt>Hours</dt>
                <dd>{r.openingHours}</dd>
              </>
            )}
            {r.phone && (
              <>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${r.phone.replace(/\s+/g, '')}`}>{r.phone}</a>
                </dd>
              </>
            )}
            {r.website && (
              <>
                <dt>Web</dt>
                <dd>
                  <a href={r.website} target="_blank" rel="noopener noreferrer">
                    {siteLabel}
                  </a>
                </dd>
              </>
            )}
          </dl>
          <div className="card-actions">
            <a
              className="btn-directions"
              href={`https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Directions
            </a>
            <button type="button" className="btn-ghost" onClick={onShowOnMap}>
              Show on map
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
