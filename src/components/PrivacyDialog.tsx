import { APP_REPO } from '../config'
import { useT } from '../i18n/useT'
import { useDialog } from '../hooks/useDialog'

interface Props {
  open: boolean
  onClose: () => void
}

export default function PrivacyDialog({ open, onClose }: Props) {
  const { t } = useT()
  const ref = useDialog(open, onClose)
  if (!open) return null
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        ref={ref}
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-head">
          <h2 id="privacy-title">{t('privacy.title')}</h2>
          <button
            type="button"
            className="dialog-close"
            onClick={onClose}
            aria-label={t('common.dismiss')}
          >
            ×
          </button>
        </div>

        <section className="dialog-section">
          <h3>{t('privacy.collect.title')}</h3>
          <p>{t('privacy.collect.body')}</p>
        </section>

        <section className="dialog-section">
          <h3>{t('privacy.location.title')}</h3>
          <p>{t('privacy.location.body')}</p>
          <p>
            <strong>{t('privacy.location.third')}:</strong> {t('privacy.location.thirdBody')}
          </p>
        </section>

        <section className="dialog-section">
          <h3>{t('privacy.storage.title')}</h3>
          <p>{t('privacy.storage.body')}</p>
        </section>

        <section className="dialog-section">
          <h3>{t('privacy.sources.title')}</h3>
          <p>{t('privacy.sources.body')}</p>
        </section>

        <footer className="dialog-foot">
          {t('privacy.contact')}{' '}
          <a href={APP_REPO} target="_blank" rel="noopener noreferrer">
            GitHub Issues
          </a>
        </footer>
      </div>
    </div>
  )
}
