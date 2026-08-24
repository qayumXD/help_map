import type { Category } from '../types'

/** Food-assistance venue names often missing dedicated OSM tags (esp. Japan). */
export const FOOD_TEXT =
  /food ?bank|foodbank|food pantry|soup kitchen|community (fridge|kitchen)|フードバンク|こども食堂|子ども食堂|炊き出し/i

export const CATEGORIES: Category[] = [
  {
    id: 'food',
    label: 'Food & Meals',
    color: '#e07b00',
    matches: (t) =>
      t.amenity === 'food_bank' ||
      /(food|soup|meal)/i.test(t.social_facility ?? '') ||
      FOOD_TEXT.test(t.name ?? '') ||
      FOOD_TEXT.test(t.operator ?? '') ||
      FOOD_TEXT.test(t.description ?? ''),
  },
  {
    id: 'shelter',
    label: 'Shelter',
    color: '#7a4fd0',
    matches: (t) => t.amenity === 'shelter' || t.social_facility === 'homeless_shelter',
  },
  {
    id: 'health',
    label: 'Health',
    color: '#d23b57',
    matches: (t) =>
      t.amenity === 'clinic' ||
      t.amenity === 'doctors' ||
      (t.healthcare !== undefined && t.amenity !== 'pharmacy'),
  },
  {
    id: 'hygiene',
    label: 'Hygiene',
    color: '#1f8fce',
    matches: (t) =>
      t.amenity === 'toilets' || t.amenity === 'shower' || t.amenity === 'public_bath',
  },
  {
    id: 'water',
    label: 'Water',
    color: '#0aa2c0',
    matches: (t) => t.amenity === 'drinking_water',
  },
  {
    id: 'community',
    label: 'Community & Wi-Fi',
    color: '#0e7a5f',
    matches: (t) =>
      t.amenity === 'library' ||
      (t.amenity === 'community_centre' && !FOOD_TEXT.test(t.name ?? '')),
  },
]

export const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]))

export function categorize(tags: Record<string, string>): string[] {
  return CATEGORIES.filter((c) => c.matches(tags)).map((c) => c.id)
}
