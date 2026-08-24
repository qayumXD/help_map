export const APP_NAME = 'HelpMap'
export const APP_REPO = 'https://github.com/qayumXD/help_map'

/** Deploy-time configurable so OSMF services can be swapped without code changes. */
export const TILE_URL =
  import.meta.env.VITE_TILE_URL ??
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

export const TILE_ATTRIBUTION =
  import.meta.env.VITE_TILE_ATTRIBUTION ??
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

export const NOMINATIM_BASE = import.meta.env.VITE_NOMINATIM_BASE ?? 'https://nominatim.openstreetmap.org'
