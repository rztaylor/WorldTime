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
        <div className="map-layout"><TimezoneSidebar now={now} /><WorldMap now={now} /></div>
        <TimezoneStrip now={now} />
        <OverlapHours now={now} />
      </main>
    </div>
  )
}
