export type OpenState = 'open' | 'closed'

const DAY_INDEX: Record<string, number> = {
  su: 0,
  mo: 1,
  tu: 2,
  we: 3,
  th: 4,
  fr: 5,
  sa: 6,
}

const D = 'su|mo|tu|we|th|fr|sa'
const DAYS_RE = new RegExp(
  `^((?:${D})(?:\\s*-\\s*(?:${D}))?(?:\\s*,\\s*(?:${D})(?:\\s*-\\s*(?:${D}))?)*)\\s+(.+)$`,
)

function expandDays(spec: string): Set<number> {
  const out = new Set<number>()
  const tokens = spec.toLowerCase().match(new RegExp(D, 'g')) ?? []
  let prev: number | null = null
  for (const token of tokens) {
    const idx = DAY_INDEX[token]
    if (idx === undefined) continue
    out.add(idx)
    if (prev !== null && idx !== (prev + 1) % 7) {
      let d: number = (prev + 1) % 7
      while (d !== idx) {
        out.add(d)
        d = (d + 1) % 7
      }
    }
    prev = idx
  }
  return out
}

/**
 * Lightweight evaluator for common OSM opening_hours patterns
 * (24/7, day selectors/ranges/lists, HH:MM-HH:MM spans incl. overnight,
 * semicolon-separated rules). Returns null when the value cannot be
 * confidently evaluated ("by appointment", sunrise/sunset, etc.).
 */
export function getOpenState(oh: string | undefined, now = new Date()): OpenState | null {
  if (!oh) return null
  const normalized = oh.trim().toLowerCase()
  if (normalized === '24/7') return 'open'
  if (normalized.length === 0) return null

  const today = now.getDay()
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  let sawUsableTimeRule = false
  const coveredDays = new Set<number>()

  for (const segment of normalized.split(';')) {
    const seg = segment.trim()
    if (seg.length === 0) continue

    let days: Set<number> | null = null
    let rest = seg
    const dm = seg.match(DAYS_RE)
    if (dm) {
      days = expandDays(dm[1])
      rest = dm[2].trim()
      for (const d of days) coveredDays.add(d)
    }

    if (days !== null && !days.has(today)) continue

    if (/^24\/7$/.test(rest)) return 'open'
    if (/^(off|closed)$/.test(rest)) return 'closed'

    const spans = [...rest.matchAll(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/g)]
    if (spans.length === 0) continue
    sawUsableTimeRule = true

    for (const s of spans) {
      const start = Number(s[1]) * 60 + Number(s[2])
      const end = Number(s[3]) * 60 + Number(s[4])
      if (start <= end) {
        if (minutesNow >= start && minutesNow < end) return 'open'
      } else if (minutesNow >= start || minutesNow < end) {
        return 'open'
      }
    }
  }

  if (sawUsableTimeRule) return 'closed'
  if (coveredDays.size > 0 && !coveredDays.has(today)) return 'closed'
  return null
}
