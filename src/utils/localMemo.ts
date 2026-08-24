import { loadCache, saveCache } from './cache'

interface CacheEntry<T> {
  t: number
  v: T
}

export async function withLocalCache<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>,
): Promise<T> {
  const storeKey = `hm:cache:${key}`
  const cached = loadCache<CacheEntry<T>>(storeKey)
  if (cached && typeof cached.t === 'number' && Date.now() - cached.t < ttlMs) {
    return cached.v
  }
  const value = await fn()
  saveCache(storeKey, { t: Date.now(), v: value } satisfies CacheEntry<T>)
  return value
}
