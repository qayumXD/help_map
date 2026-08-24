import type { Resource } from '../types'
import { CATEGORY_BY_ID } from '../data/categories'
import { formatDistance, walkMinutes } from '../utils/geo'
import { useT } from '../i18n/useT'
import CategoryIcon from './CategoryIcon'

interface Props {
  resource: Resource
  active: boolean
  onToggle: () => void
  onShowOnMap: () => void
}

const REPORT_PREFIX: Record<string, string> = {
  en: 'Listing may need updating: ',
  ja: '掲載内容の更新が必要かもしれません: ',
}

export default function ResourceCard({ resource: r, active, onToggle, onShowOnMap }: Props) {
  const { t, locale } = useT()
  const primary = CATEGORY_BY_ID.get(r.categories[0])
  const secondary = CATEGORY_BY_ID.get(r.categories[1])

  const siteLabel = r.website?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
  const prefix = REPORT_PREFIX[locale] ?? REPORT_PREFIX.en
  const noteUrl = `https://www.openstreetmap.org/note/new#map=18/${r.lat.toFixed(5)}/${r.lng.toFixed(5)}&text=${encodeURIComponent(
    prefix + r.name,
  )}`

  return (
    <article className={`card ${active ? 'card-active' : ''}`}>
      <button className="card-head" onClick={onToggle} aria-expanded={active}>
        <span className="cat-dot" style={{ background: primary?.color }} aria-hidden="true">
          <CategoryIcon id={primary?.id ?? ''} size={14} />
        </span>
        <span className="card-main">
          <span className="card-name">{r.name}</span>
          <span className="card-meta">
            {primary && <span className="cat-badge">{t(`cat.${primary.id}`)}</span>}
            {secondary && (
              <span className="cat-badge cat-badge-soft">{t(`cat.${secondary.id}`)}</span>
            )}
          </span>
        </span>
        <span className="card-dist">
          <strong>{formatDistance(r.distanceM)}</strong>
          <small>{t('card.minWalk', { m: walkMinutes(r.distanceM) })}</small>
        </span>
        {r.affectedBy && r.affectedBy.length > 0 && (
          <span className="card-warn-dot" title={r.affectedBy.join(' · ')} aria-hidden="true" />
        )}
      </button>

      {active && (
        <div className="card-detail">
          {r.affectedBy && r.affectedBy.length > 0 && (
            <div className="card-hazard" role="alert">
              <strong>{t('card.affected')}</strong> {r.affectedBy.join(' · ')}
            </div>
          )}
          <dl>
            {r.address && (
              <>
                <dt>{t('detail.address')}</dt>
                <dd>{r.address}</dd>
              </>
            )}
            {r.openingHours && (
              <>
                <dt>{t('detail.hours')}</dt>
                <dd>{r.openingHours}</dd>
              </>
            )}
            {r.phone && (
              <>
                <dt>{t('detail.phone')}</dt>
                <dd>
                  <a href={`tel:${r.phone.replace(/\s+/g, '')}`}>{r.phone}</a>
                </dd>
              </>
            )}
            {r.website && (
              <>
                <dt>{t('detail.web')}</dt>
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
              {t('detail.directions')}
            </a>
            <button type="button" className="btn-ghost" onClick={onShowOnMap}>
              {t('detail.showMap')}
            </button>
          </div>
          <a className="report-link" href={noteUrl} target="_blank" rel="noopener noreferrer">
            {t('card.report')}
          </a>
        </div>
      )}
    </article>
  )
}
