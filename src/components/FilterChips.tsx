import { CATEGORIES } from '../data/categories'
import { useT } from '../i18n/useT'
import CategoryIcon from './CategoryIcon'

interface Props {
  active: Set<string>
  counts: Map<string, number>
  total: number
  onToggle: (id: string) => void
  openOnly: boolean
  onToggleOpen: () => void
}

export default function FilterChips({
  active,
  counts,
  total,
  onToggle,
  openOnly,
  onToggleOpen,
}: Props) {
  const { t } = useT()
  return (
    <div className="chips-row" role="group" aria-label={t('chips.label')} tabIndex={0}>
      {CATEGORIES.map((cat) => {
        const isActive = active.has(cat.id)
        const count = counts.get(cat.id) ?? 0
        return (
          <button
            key={cat.id}
            className={`chip ${isActive ? 'chip-active' : ''}`}
            style={isActive ? { ['--chip' as string]: cat.color } : undefined}
            onClick={() => onToggle(cat.id)}
            aria-pressed={isActive}
          >
            <CategoryIcon id={cat.id} size={14} />
            <span>{t(`cat.${cat.id}`)}</span>
            <span className="chip-count">{count}</span>
          </button>
        )
      })}
      <button
        type="button"
        className={`chip ${openOnly ? 'chip-active' : ''}`}
        style={openOnly ? { ['--chip' as string]: '#2fae6e' } : undefined}
        onClick={onToggleOpen}
        aria-pressed={openOnly}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        <span>{t('chips.openNow')}</span>
      </button>
      <span className="chips-total" aria-live="polite">
        {t('chips.shown', { total })}
      </span>
    </div>
  )
}
