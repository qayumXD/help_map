import { useState } from 'react'

interface Props {
  radiusKm: number
  onRadiusChange: (km: number) => void
  onLocate: () => void
  locating: boolean
  onSubmit: (query: string) => Promise<void>
}

const RADII = [1, 2, 3, 5, 10]

export default function SearchBar({
  radiusKm,
  onRadiusChange,
  onLocate,
  locating,
  onSubmit,
}: Props) {
  const [query, setQuery] = useState('')

  return (
    <div className="searchwrap">
      <form
        className="searchbar"
        onSubmit={(e) => {
          e.preventDefault()
          const q = query.trim()
          if (q.length > 0) void onSubmit(q)
        }}
      >
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a city or address…"
          aria-label="Search for a location"
          enterKeyHint="search"
        />
        {query.length > 0 && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
        <button type="submit" className="btn-search" disabled={locating}>
          Search
        </button>
      </form>

      <div className="quickrow">
        <button
          type="button"
          className="btn-primary"
          onClick={onLocate}
          disabled={locating}
        >
          {locating ? (
            <>
              <span className="spinner" aria-hidden="true" /> Locating…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
              Use my location
            </>
          )}
        </button>
        <label className="radius-select">
          Within
          <select
            value={radiusKm}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
          >
            {RADII.map((km) => (
              <option key={km} value={km}>
                {km} km
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
