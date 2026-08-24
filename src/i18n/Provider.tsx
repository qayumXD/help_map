import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { I18nContext, detectLocale, persistLocale, translate } from './core'
import type { I18n, Locale } from './core'

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<I18n>(() => {
    function setLocale(l: Locale) {
      setLocaleState(l)
      persistLocale(l)
      document.documentElement.lang = l
    }
    return { locale, setLocale, t: (key, params) => translate(locale, key, params) }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
