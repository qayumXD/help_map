export function loadCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function saveCache(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full/unavailable */
  }
}

export const CACHE_KEYS = {
  search: 'hm:search',
  resources: 'hm:resources',
  quakes: 'hm:quakes',
  alerts: 'hm:alerts',
  eonet: 'hm:eonet',
} as const
