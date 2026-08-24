import { useCallback, useMemo, useState } from 'react'
import type { LatLng, LayerId, Quake, Resource, WeatherAlert } from './types'
import { LAYERS } from './types'
import { CATEGORIES } from './data/categories'
import { currentPosition, geocodeAddress, reverseLabel } from './services/geocode'
import { fetchResources } from './services/overpass'
import { fetchQuakes } from './services/quakes'
import { fetchAlerts } from './services/alerts'
import { annotateResources } from './utils/impact'
import { CACHE_KEYS, loadCache, saveCache } from './utils/cache'
import { useLiveLayer, useTick } from './hooks/useLiveLayer'
import type { LayerChip } from './components/LayersBar'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import FilterChips from './components/FilterChips'
import LayersBar from './components/LayersBar'
import ResultsList from './components/ResultsList'
import MapView from './components/MapView'

type Status = 'idle' | 'loading' | 'ready'

interface SavedSearch {
  point: LatLng
  label: string
  radiusKm: number
}

const REFRESH_MS: Record<LayerId, number> = Object.fromEntries(
  LAYERS.map((l) => [l.id, l.refreshMs]),
) as Record<LayerId, number>

function loadInitial():
  | { point: LatLng; label: string; radiusKm: number; resources: Resource[] }
  | null {
  const saved = loadCache<SavedSearch>(CACHE_KEYS.search)
  const cachedResources = loadCache<Resource[]>(CACHE_KEYS.resources)
  if (!saved || !Array.isArray(cachedResources)) return null
  if (typeof saved.point?.lat !== 'number') return null
  return {
    point: saved.point,
    label: saved.label,
    radiusKm: saved.radiusKm ?? 5,
    resources: cachedResources,
  }
}

export default function App() {
  const [initial] = useState(loadInitial)
  const [position, setPosition] = useState<LatLng | null>(initial?.point ?? null)
  const [locationLabel, setLocationLabel] = useState(initial?.label ?? '')
  const [radiusKm, setRadiusKm] = useState(initial?.radiusKm ?? 5)
  const [activeCats, setActiveCats] = useState<Set<string>>(
    () => new Set(CATEGORIES.map((c) => c.id)),
  )
  const [resources, setResources] = useState<Resource[]>(initial?.resources ?? [])
  const [status, setStatus] = useState<Status>(initial ? 'ready' : 'idle')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(() =>
    initial
      ? navigator.onLine === false
        ? 'You are offline — showing your last saved results.'
        : 'Restored your last search. Search again for fresh results.'
      : null,
  )
  const [activeId, setActiveId] = useState<string | null>(null)
  const [view, setView] = useState<'list' | 'map'>('list')
  const [locating, setLocating] = useState(false)
  const [layersOn, setLayersOn] = useState<Record<LayerId, boolean>>({
    alerts: true,
    quakes: true,
  })

  /* ---------- live hazard layers ---------- */

  const posKey = position ? `${position.lat.toFixed(4)},${position.lng.toFixed(4)}` : ''

  const quakesLayer = useLiveLayer<Quake>({
    enabled: position !== null && layersOn.quakes,
    resetKey: posKey,
    fetcher: () => (position ? fetchQuakes(position) : Promise.resolve([])),
    intervalMs: REFRESH_MS.quakes,
    cacheKey: CACHE_KEYS.quakes,
  })

  const alertsLayer = useLiveLayer<WeatherAlert>({
    enabled: position !== null && layersOn.alerts,
    resetKey: posKey,
    fetcher: () => (position ? fetchAlerts(position) : Promise.resolve([])),
    intervalMs: REFRESH_MS.alerts,
    cacheKey: CACHE_KEYS.alerts,
  })

  const now = useTick(30_000)

  /* ---------- search ---------- */

  const runSearch = useCallback(async (point: LatLng, label: string, km: number) => {
    setStatus('loading')
    setError(null)
    setActiveId(null)
    setInfo(null)
    setPosition(point)
    setLocationLabel(label)
    try {
      const rs = await fetchResources(point, km, point)
      setResources(rs)
      setStatus('ready')
      saveCache(CACHE_KEYS.search, { point, label, radiusKm: km } satisfies SavedSearch)
      saveCache(CACHE_KEYS.resources, rs)
      setNotice(
        rs.length === 0
          ? `Nothing found within ${km} km. Try a wider radius or a different area.`
          : null,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong — try again')
      setStatus((s) => (resources.length > 0 ? 'ready' : s))
    }
  }, [resources.length])

  const handleLocate = useCallback(async () => {
    setError(null)
    setLocating(true)
    try {
      const pt = await currentPosition()
      const label = await reverseLabel(pt)
      await runSearch(pt, label, radiusKm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not get your location')
    } finally {
      setLocating(false)
    }
  }, [runSearch, radiusKm])

  const handleSearchAddress = useCallback(
    async (query: string) => {
      setError(null)
      setLocating(false)
      try {
        const hit = await geocodeAddress(query)
        await runSearch(hit, hit.label, radiusKm)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      }
    },
    [runSearch, radiusKm],
  )

  const changeRadius = useCallback(
    (km: number) => {
      setRadiusKm(km)
      if (position) void runSearch(position, locationLabel, km)
    },
    [position, locationLabel, runSearch],
  )

  const toggleCat = useCallback((id: string) => {
    setActiveCats((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      if (next.size === 0) return new Set(CATEGORIES.map((c) => c.id))
      return next
    })
  }, [])

  /* ---------- derived data ---------- */

  const filtered = useMemo(
    () => resources.filter((r) => r.categories.some((c) => activeCats.has(c))),
    [resources, activeCats],
  )

  const annotated = useMemo(
    () =>
      annotateResources(filtered, {
        quakesEnabled: layersOn.quakes,
        quakes: quakesLayer.items,
        alertsEnabled: layersOn.alerts,
        alerts: alertsLayer.items,
      }),
    [filtered, layersOn, quakesLayer.items, alertsLayer.items],
  )

  const affectedCount = annotated.reduce((n, r) => n + (r.affectedBy?.length ? 1 : 0), 0)

  const counts = useMemo(() => {
    const m = new Map<string, number>()
    for (const r of resources)
      for (const c of r.categories) m.set(c, (m.get(c) ?? 0) + 1)
    return m
  }, [resources])

  const layerChips: Record<LayerId, LayerChip> = {
    quakes: {
      enabled: layersOn.quakes && position !== null,
      status: quakesLayer.status,
      updatedAt: quakesLayer.updatedAt,
      error: quakesLayer.error,
      stale:
        quakesLayer.updatedAt !== null &&
        now - quakesLayer.updatedAt > REFRESH_MS.quakes * 2.5,
      count: quakesLayer.items.length,
    },
    alerts: {
      enabled: layersOn.alerts && position !== null,
      status: alertsLayer.status,
      updatedAt: alertsLayer.updatedAt,
      error: alertsLayer.error,
      stale:
        alertsLayer.updatedAt !== null &&
        now - alertsLayer.updatedAt > REFRESH_MS.alerts * 2.5,
      count: alertsLayer.items.filter((a) => a.polygon).length,
    },
  }

  const toggleLayer = useCallback((id: LayerId) => {
    setLayersOn((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  /* ---------- render ---------- */

  return (
    <div className="app">
      <Header />

      <div className="controls">
        <SearchBar
          radiusKm={radiusKm}
          onRadiusChange={changeRadius}
          onLocate={() => void handleLocate()}
          locating={locating}
          onSubmit={handleSearchAddress}
        />
        {status === 'ready' && resources.length > 0 && (
          <>
            <FilterChips
              active={activeCats}
              counts={counts}
              total={annotated.length}
              onToggle={toggleCat}
            />
            <LayersBar
              chips={layerChips}
              now={now}
              onToggle={toggleLayer}
              onRefresh={(id) => (id === 'quakes' ? quakesLayer.refresh() : alertsLayer.refresh())}
            />
          </>
        )}
      </div>

      {error && (
        <div className="banner banner-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} aria-label="Dismiss error">
            ×
          </button>
        </div>
      )}

      {info && (
        <div className="banner banner-info">
          <span>{info}</span>
          <button type="button" onClick={() => setInfo(null)} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      {affectedCount > 0 && (
        <div className="banner banner-warn" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            <path d="M12 9v4M12 17h.01" />
          </svg>
          <span>
            <strong>{affectedCount}</strong> place{affectedCount === 1 ? '' : 's'} may be
            affected by active hazards — see the warning badges on their cards.
          </span>
          <button type="button" onClick={() => setLayersOn({ alerts: false, quakes: false })} aria-label="Dismiss warning">
            ×
          </button>
        </div>
      )}

      <main className="content">
        <section
          className={`pane pane-results ${view === 'list' ? '' : 'pane-hidden'}`}
          aria-hidden={view !== 'list'}
        >
          <ResultsList
            status={status}
            notice={notice}
            resources={annotated}
            activeId={activeId}
            onSelect={(id) => setActiveId((prev) => (prev === id ? null : id))}
            onShowOnMap={(id) => {
              setActiveId(id)
              setView('map')
            }}
            locationLabel={locationLabel}
            onLocate={() => void handleLocate()}
            position={position}
            foodMissing={(counts.get('food') ?? 0) === 0}
          />
        </section>

        <section
          className={`pane pane-map ${view === 'map' ? '' : 'pane-hidden'}`}
          aria-hidden={view !== 'map'}
        >
          <MapView
            position={position}
            resources={annotated}
            activeId={activeId}
            onSelect={(id) => setActiveId((prev) => (prev === id ? null : id))}
            quakes={quakesLayer.items}
            alerts={alertsLayer.items}
            showQuakes={layersOn.quakes && position !== null}
            showAlerts={layersOn.alerts && position !== null}
          />
        </section>
      </main>

      {status !== 'idle' && (
        <nav className="view-tabs" aria-label="Switch between list and map">
          <button
            type="button"
            className={view === 'list' ? 'tab tab-active' : 'tab'}
            onClick={() => setView('list')}
            aria-pressed={view === 'list'}
          >
            List{status === 'ready' ? ` (${annotated.length})` : ''}
          </button>
          <button
            type="button"
            className={view === 'map' ? 'tab tab-active' : 'tab'}
            onClick={() => setView('map')}
            aria-pressed={view === 'map'}
          >
            Map
          </button>
        </nav>
      )}
    </div>
  )
}
