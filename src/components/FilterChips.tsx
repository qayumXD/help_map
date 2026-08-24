import { CATEGORIES } from '../data/categories'
import { useT } from '../i18n/useT'
import CategoryIcon from './CategoryIcon'

interface Props {
  active: Set<string>
  counts: Map<string, number>
  total: number
  onToggle: (id: string) => void
}

export default function FilterChips({ active, counts, total, onToggle }: Props) {
  const { t } = useT()
  return (
    <div className="chips-row" role="group" aria-label={t('chips.label')}>
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
      <span className="chips-total" aria-live="polite">
        {t('chips.shown', { total })}
      </span>
    </div>
  )
}
