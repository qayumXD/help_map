import { APP_NAME, APP_REPO } from '../config'

interface Props {
  open: boolean
  onClose: () => void
}

const SECTIONS: { title: string; body: (string | [string, string])[] }[] = [
  {
    title: 'What we collect',
    body: [
      `${APP_NAME} has no accounts, no analytics and no cookies. We do not collect or store any personal data on our servers — there are no HelpMap servers at all. The app is a static website.`,
    ],
  },
  {
    title: 'Your location',
    body: [
      'If you tap "Use my location", your browser provides coordinates to the app on your device. Those coordinates stay in your browser and are used only to compute distances locally.',
      ['Sent to third parties', 'When you search a place name, the text goes to OpenStreetMap\'s Nominatim geocoding service. Rounded map-view coordinates (~1 km precision) are included in requests for resource listings (Overpass API) and hazard feeds (weather.gov, USGS).'],
    ],
  },
  {
    title: 'Stored on your device only',
    body: [
      'Your last search and results, cached map tiles and recent geocoding answers are stored in your browser\'s local storage so the app works offline. Keys used: hm:search, hm:resources, hm:quakes, hm:alerts, hm:cache:*. Clearing your browser data removes everything.',
    ],
  },
  {
    title: 'Data sources & licenses',
    body: [
      'Map data © OpenStreetMap contributors (ODbL). Weather alerts via NOAA/NWS. Earthquake data via USGS. Satellite imagery via NASA EOSDIS GIBS when enabled.',
    ],
  },
]

export default function PrivacyDialog({ open, onClose }: Props) {
  if (!open) return null
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-head">
          <h2 id="privacy-title">Privacy</h2>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close privacy information">
            ×
          </button>
        </div>
        {SECTIONS.map((s) => (
          <section key={s.title} className="dialog-section">
            <h3>{s.title}</h3>
            {s.body.map((b, i) =>
              typeof b === 'string' ? (
                <p key={i}>{b}</p>
              ) : (
                <p key={i}>
                  <strong>{b[0]}:</strong> {b[1]}
                </p>
              ),
            )}
          </section>
        ))}
        <footer className="dialog-foot">
          Questions or concerns?{' '}
          <a href={APP_REPO} target="_blank" rel="noopener noreferrer">
            Open an issue on GitHub
          </a>
          .
        </footer>
      </div>
    </div>
  )
}
