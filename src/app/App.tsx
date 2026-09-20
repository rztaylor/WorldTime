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
      <main className="content-layout">
        <TimezoneSidebar now={now} />
        <div className="main-content">
          <WorldMap now={now} />
          <TimezoneStrip now={now} />
          <OverlapHours now={now} />
        </div>
      </main>
    </div>
  )
}
