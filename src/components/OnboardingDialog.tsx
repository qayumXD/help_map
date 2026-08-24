import { APP_NAME } from '../config'
import { useT } from '../i18n/useT'

interface Props {
  open: boolean
  onDone: () => void
}

export default function OnboardingDialog({ open, onDone }: Props) {
  const { t } = useT()
  if (!open) return null
  return (
    <div className="dialog-backdrop" onClick={onDone}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboard-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="logo onboard-logo">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"
              fill="var(--primary)"
              stroke="var(--primary)"
              strokeWidth="1.5"
            />
            <path
              d="M12 13.2s-2.6-2-2.6-3.9a1.55 1.55 0 0 1 2.6-1.1 1.55 1.55 0 0 1 2.6 1.1c0 1.9-2.6 3.9-2.6 3.9z"
              fill="#fff"
            />
          </svg>
          <span className="logo-name">{APP_NAME}</span>
        </div>
        <h2 id="onboard-title">{t('onboard.title')}</h2>
        <p className="onboard-p">{t('onboard.p1')}</p>
        <p className="onboard-p">{t('onboard.p2')}</p>
        <button type="button" className="btn-primary btn-lg onboard-cta" onClick={onDone}>
          {t('onboard.cta')}
        </button>
      </div>
    </div>
  )
}
