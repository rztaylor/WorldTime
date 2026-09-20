import { Clock3, Globe2, Home, Moon, Search, Sun } from 'lucide-react'
import { GlobalSearch } from './GlobalSearch'
import { useTimezones } from '../../app/TimezoneProvider'

export function Header() {
  const { active, selected, setHome, theme, cycleTheme } = useTimezones()
  const activeCard = selected.find((item) => item.timezone === active.timezone)

  return (
    <header className="site-header">
      <a className="brand" href="#map" aria-label="World Time home">
        <Globe2 aria-hidden="true" />
        <span><strong>WORLD TIME</strong><small>People. Places. Better Timing.</small></span>
      </a>
      <nav aria-label="Primary navigation">
        <a className="active" href="#map">Map</a>
        <a href="#timezones">Timezones</a>
        <a href="#overlap">Compare</a>
        <a href="#about">About</a>
      </nav>
      <div className="header-actions">
        <GlobalSearch />
        <button className="icon-button" onClick={cycleTheme} aria-label={`Theme: ${theme}. Change theme`}>
          {theme === 'dark' ? <Moon /> : theme === 'light' ? <Sun /> : <Clock3 />}
        </button>
        <button
          className="home-button"
          disabled={!activeCard || activeCard.isHome}
          onClick={() => activeCard && setHome(activeCard.id)}
        >
          <Home aria-hidden="true" />
          <span>{activeCard?.isHome ? 'Home Timezone' : 'Set Home Timezone'}</span>
        </button>
      </div>
      <button className="mobile-search" onClick={() => document.getElementById('global-search')?.focus()} aria-label="Open search"><Search /></button>
    </header>
  )
}
