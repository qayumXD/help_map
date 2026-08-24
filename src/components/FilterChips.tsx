import { CATEGORIES } from '../data/categories'
import CategoryIcon from './CategoryIcon'

interface Props {
  active: Set<string>
  counts: Map<string, number>
  total: number
  onToggle: (id: string) => void
}

export default function FilterChips({ active, counts, total, onToggle }: Props) {
  return (
    <div className="chips-row" role="group" aria-label="Filter by category">
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
            <span>{cat.label}</span>
            <span className="chip-count">{count}</span>
          </button>
        )
      })}
      <span className="chips-total" aria-live="polite">
        {total} shown
      </span>
    </div>
  )
}
