import { Globe2 } from 'lucide-react'
import { Header } from '../components/header/Header'
import { WorldMap } from '../components/map/WorldMap'
import { OverlapHours } from '../components/overlap/OverlapHours'
import { TimezoneSidebar } from '../components/timezone/TimezoneSidebar'
import { TimezoneStrip } from '../components/timezone/TimezoneStrip'
import { useClock } from '../hooks/useClock'

export function App() {
  const now = useClock()
  return (
    <div className="app-shell">
      <Header />
      <main>
        <div className="map-layout"><TimezoneSidebar now={now} /><WorldMap /></div>
        <TimezoneStrip now={now} />
        <OverlapHours now={now} />
      </main>
      <footer id="about">
        <a className="footer-brand" href="#map"><Globe2 /> <strong>WORLD TIME</strong></a>
        <span>People. Places. Better Timing.</span>
        <span>Times stay in your browser.</span>
        <span>Built for a more connected world.</span>
      </footer>
    </div>
  )
}
