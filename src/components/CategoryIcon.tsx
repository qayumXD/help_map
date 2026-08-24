export default function CategoryIcon({ id, size = 16 }: { id: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (id) {
    case 'food':
      return (
        <svg {...common}>
          <path d="M3 2v7a2 2 0 0 0 4 0V2" />
          <path d="M5 2v20" />
          <path d="M19 2a4 4 0 0 0-4 4v7h4z" />
          <path d="M19 13v9" />
        </svg>
      )
    case 'shelter':
      return (
        <svg {...common}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
      )
    case 'health':
      return (
        <svg {...common}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.51 4.04 3 5.5l7 7Z" />
          <path d="M3.5 13h4L9 10l2 5 1.5-2h4" />
        </svg>
      )
    case 'hygiene':
      return (
        <svg {...common}>
          <circle cx="7" cy="16" r="4" />
          <circle cx="16" cy="9" r="2.5" />
          <circle cx="18" cy="17" r="1.5" />
          <circle cx="12" cy="5" r="1.5" />
        </svg>
      )
    case 'water':
      return (
        <svg {...common}>
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
        </svg>
      )
    case 'community':
      return (
        <svg {...common}>
          <path d="M5 13a10 10 0 0 1 14 0" />
          <path d="M8.5 16.5a5 5 0 0 1 7 0" />
          <path d="M12 20h.01" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
  }
}
