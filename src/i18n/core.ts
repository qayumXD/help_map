import { createContext } from 'react'
import en, { type Dict } from './en'
import ja from './ja'
import es from './es'

export type Locale = 'en' | 'ja' | 'es'

export const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'es', label: 'Español' },
]

const DICTS: Record<Locale, Dict> = { en, ja, es }
const STORAGE_KEY = 'hm:lang'

export type Params = Record<string, string | number>

export interface I18n {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: keyof Dict, params?: Params) => string
}

export const I18nContext = createContext<I18n | null>(null)

function interpolate(template: string, params?: Params): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    params[k] !== undefined ? String(params[k]) : `{${k}}`,
  )
}

export function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && saved in DICTS) return saved as Locale
  } catch {
    /* storage unavailable */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : ''
  return nav in DICTS ? (nav as Locale) : 'en'
}

export function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* storage unavailable */
  }
}

export function translate(locale: Locale, key: keyof Dict, params?: Params): string {
  let template: string = DICTS[locale][key] ?? en[key] ?? key
  if (params && Number.isInteger(params.n)) {
    const pluralKey = `${key}_${params.n === 1 ? 'one' : 'other'}` as keyof Dict
    template = DICTS[locale][pluralKey] ?? en[pluralKey] ?? template
  }
  return interpolate(template, params)
}
