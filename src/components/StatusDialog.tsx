import { useT } from '../i18n/useT'
import { useDialog } from '../hooks/useDialog'
import { timeAgo } from '../utils/geo'

export interface FeedStatus {
  name: string
  state: 'ok' | 'stale' | 'error' | 'loading' | 'off'
  updatedAt: number | null
  detail?: string
}

interface Props {
  open: boolean
  onClose: () => void
  feeds: FeedStatus[]
}

const STATE_CLASS: Record<FeedStatus['state'], string> = {
  ok: 'st-ok',
  stale: 'st-stale',
  error: 'st-error',
  loading: 'st-loading',
  off: 'st-off',
}

export default function StatusDialog({ open, onClose, feeds }: Props) {
  const { t } = useT()
  const ref = useDialog(open, onClose)
  if (!open) return null

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        ref={ref}
        className="dialog status-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-head">
          <h2 id="status-title">{t('status.title')}</h2>
          <button
            type="button"
            className="dialog-close"
            onClick={onClose}
            aria-label={t('common.dismiss')}
          >
            ×
          </button>
        </div>

        <table className="status-table">
          <thead>
            <tr>
              <th scope="col">{t('status.feed')}</th>
              <th scope="col">{t('status.state')}</th>
              <th scope="col">{t('status.lastCheck')}</th>
            </tr>
          </thead>
          <tbody>
            {feeds.map((f) => (
              <tr key={f.name}>
                <td>
                  {f.name}
                  {f.detail && <span className="st-detail"> · {f.detail}</span>}
                </td>
                <td>
                  <span className={`st-pill ${STATE_CLASS[f.state]}`}>{f.state}</span>
                </td>
                <td>{f.updatedAt !== null ? timeAgo(f.updatedAt) : t('status.never')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="status-note">{t('status.note')}</p>
      </div>
    </div>
  )
}
