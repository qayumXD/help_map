import LanguageSwitcher from './LanguageSwitcher'
import { useT } from '../i18n/useT'

interface Props {
  onPrivacy: () => void
  emergency: boolean
  onToggleEmergency: () => void
}

export default function Header({ onPrivacy, emergency, onToggleEmergency }: Props) {
  const { t } = useT()
  return (
    <header className="header">
      <div className="logo">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
        <h1 className="logo-name">HelpMap</h1>
      </div>
      <p className="tagline">{t('app.tagline')}</p>
      <div className="header-actions">
        <button
          type="button"
          className={`icon-btn ${emergency ? 'icon-btn-active' : ''}`}
          onClick={onToggleEmergency}
          aria-pressed={emergency}
          aria-label={t('mode.toggle')}
          title={t('mode.toggle')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" />
          </svg>
        </button>
        <LanguageSwitcher />
        <button type="button" className="privacy-link" onClick={onPrivacy}>
          {t('header.privacy')}
        </button>
      </div>
    </header>
  )
}
