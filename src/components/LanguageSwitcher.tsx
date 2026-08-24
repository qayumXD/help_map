import { LOCALES } from '../i18n/core'
import type { Locale } from '../i18n/core'
import { useT } from '../i18n/useT'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useT()
  return (
    <label className="lang-switch">
      <span className="visually-hidden">Language</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label="Language"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  )
}
