import type { LayerId } from '../types'
import { LAYERS } from '../types'
import type { LayerStatus } from '../hooks/useLiveLayer'
import { timeAgo } from '../utils/geo'
import { useT } from '../i18n/useT'

export interface LayerChip {
  enabled: boolean
  status: LayerStatus
  updatedAt: number | null
  error: string | null
  stale: boolean
  count: number
}

interface Props {
  chips: Record<LayerId, LayerChip>
  onToggle: (id: LayerId) => void
  onRefresh: (id: LayerId) => void
  now: number
  imageryOn: boolean
  onToggleImagery: () => void
}

export default function LayersBar({ chips, onToggle, onRefresh, now, imageryOn, onToggleImagery }: Props) {
  const { t } = useT()
  return (
    <div className="layers-row" role="group" aria-label={t('layers.live')} tabIndex={0}>
      <span className="layers-label">{t('layers.live')}</span>
      {LAYERS.map((meta) => {
        const chip = chips[meta.id]
        const label = t(`layers.${meta.id}`)
        const stateClass = !chip.enabled
          ? 'layer-off'
          : chip.status === 'error'
            ? 'layer-error'
            : chip.stale || (chip.updatedAt !== null && now - chip.updatedAt > meta.refreshMs * 1.5)
              ? 'layer-stale'
              : 'layer-ok'
        return (
          <div key={meta.id} className={`layer-chip ${stateClass}`}>
            <button
              type="button"
              className="layer-toggle"
              onClick={() => onToggle(meta.id)}
              aria-pressed={chip.enabled}
              title={chip.error ?? undefined}
            >
              <span className="layer-dot" aria-hidden="true" />
              <span>{label}</span>
              <span className="chip-count">{chip.count}</span>
            </button>
            <button
              type="button"
              className="layer-refresh"
              onClick={() => onRefresh(meta.id)}
              disabled={!chip.enabled}
              aria-label={t('layers.refresh', { label })}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <path d="M21 3v6h-6" />
              </svg>
            </button>
            <span className="layer-time">
              {chip.enabled && chip.status === 'loading' && chip.updatedAt === null
                ? t('layers.loading')
                : chip.enabled && chip.updatedAt !== null
                  ? timeAgo(chip.updatedAt, now)
                  : ''}
            </span>
          </div>
        )
      })}
      <button
        type="button"
        className={`layer-chip layer-static ${imageryOn ? 'imagery-on' : ''}`}
        onClick={onToggleImagery}
        aria-pressed={imageryOn}
        title={t('layers.imagery')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3.5" />
          <path d="M4.9 4.9a10 10 0 0 0 0 14.2M19.1 19.1a10 10 0 0 0 0-14.2" />
        </svg>
        <span>{t('layers.imagery')}</span>
      </button>
    </div>
  )
}
