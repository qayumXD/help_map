import { useCallback, useEffect, useRef, useState } from 'react'
import { loadCache, saveCache } from '../utils/cache'

export type LayerStatus = 'idle' | 'loading' | 'ok' | 'error'

interface CacheWrap<T> {
  t: number
  items: T[]
}

interface Options<T> {
  enabled: boolean
  /** Change this to invalidate the layer (e.g. when the search point moves). */
  resetKey: string
  fetcher: () => Promise<T[]>
  intervalMs: number
  cacheKey?: string
}

/** Re-renders on a slow tick so relative timestamps stay fresh. */
export function useTick(ms = 30_000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(id)
  }, [ms])
  return now
}

export function useLiveLayer<T>({
  enabled,
  resetKey,
  fetcher,
  intervalMs,
  cacheKey,
}: Options<T>) {
  const [items, setItems] = useState<T[]>([])
  const [status, setStatus] = useState<LayerStatus>('idle')
  const [updatedAt, setUpdatedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetcherRef = useRef(fetcher)
  useEffect(() => {
    fetcherRef.current = fetcher
  })

  const busyRef = useRef(false)
  const hydratedRef = useRef(false)

  const run = useCallback(async () => {
    if (busyRef.current) return
    busyRef.current = true
    setStatus((s) => (s === 'ok' ? s : 'loading'))
    try {
      // First run this session: show cached data instantly, then refresh.
      if (!hydratedRef.current && cacheKey) {
        hydratedRef.current = true
        const cached = loadCache<CacheWrap<T>>(cacheKey)
        if (cached && Array.isArray(cached.items)) {
          setItems(cached.items)
          setUpdatedAt(cached.t)
          setStatus('ok')
        }
      }
      const data = await fetcherRef.current()
      setItems(data)
      setUpdatedAt(Date.now())
      setStatus('ok')
      setError(null)
      if (cacheKey) saveCache(cacheKey, { t: Date.now(), items: data } satisfies CacheWrap<T>)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fetch failed')
      setStatus('error')
    } finally {
      busyRef.current = false
    }
  }, [cacheKey])

  // Initial load / re-load when the search point changes.
  useEffect(() => {
    if (!enabled) return
    void Promise.resolve().then(run)
  }, [enabled, resetKey, run])

  // Auto-refresh while the tab is visible.
  useEffect(() => {
    if (!enabled) return
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') void run()
    }, intervalMs)
    const onVisible = () => {
      if (
        document.visibilityState === 'visible' &&
        updatedAt !== null &&
        Date.now() - updatedAt > intervalMs * 1.5
      ) {
        void run()
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [enabled, intervalMs, run, updatedAt])

  return { items, status, updatedAt, error, refresh: () => void run() }
}
