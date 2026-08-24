import { useContext } from 'react'
import { I18nContext } from './core'
import type { I18n } from './core'

export function useT(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useT must be used within I18nProvider')
  return ctx
}
