import { Clock3, Globe2, Home, Monitor, Moon, Sun } from 'lucide-react'
import { GlobalSearch } from './GlobalSearch'
import { useTimezones } from '../../app/TimezoneProvider'

export function Header() {
  const { active, selected, setHome, theme, cycleTheme, timeFormat, toggleTimeFormat } = useTimezones()
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
      </nav>
      <div className="header-actions">
        <GlobalSearch />
        <button className="format-button" onClick={toggleTimeFormat} aria-label={`Using ${timeFormat === '12h' ? '12' : '24'}-hour time. Change time format`}>
          <Clock3 /><span>{timeFormat === '12h' ? '12H' : '24H'}</span>
        </button>
        <button className="icon-button" onClick={cycleTheme} aria-label={`Theme: ${theme}. Change theme`}>
          {theme === 'dark' ? <Moon /> : theme === 'light' ? <Sun /> : <Monitor />}
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
    </header>
  )
}
