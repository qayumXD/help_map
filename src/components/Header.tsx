export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"
            fill="var(--primary)"
            stroke="var(--primary)"
            strokeWidth="1.5"
          />
          <path
            d="M12 13.2s-2.6-2-2.6-3.9a1.55 1.55 0 0 1 2.6-1.1 1.55 1.55 0 0 1 2.6 1.1c0 1.9-2.6 3.9-2.6 3.9z"
            fill="#fff"
          />
        </svg>
        <span className="logo-name">HelpMap</span>
      </div>
      <p className="tagline">Free food, shelter, care &amp; support near you</p>
    </header>
  )
}
