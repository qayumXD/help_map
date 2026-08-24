import LanguageSwitcher from './LanguageSwitcher'
import { useT } from '../i18n/useT'

interface Props {
  onPrivacy: () => void
}

export default function Header({ onPrivacy }: Props) {
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
        <span className="logo-name">HelpMap</span>
      </div>
      <p className="tagline">{t('app.tagline')}</p>
      <div className="header-actions">
        <LanguageSwitcher />
        <button type="button" className="privacy-link" onClick={onPrivacy}>
          {t('header.privacy')}
        </button>
      </div>
    </header>
  )
}
