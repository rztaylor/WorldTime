import { useState } from 'react'
import { Header } from '../components/header/Header'
import type { WorkspaceView } from '../components/header/Header'
import { WorldMap } from '../components/map/WorldMap'
import { OverlapHours } from '../components/overlap/OverlapHours'
import { TimezoneSidebar } from '../components/timezone/TimezoneSidebar'
import { TimezoneStrip } from '../components/timezone/TimezoneStrip'
import { useClock } from '../hooks/useClock'
import { useTimezones } from './TimezoneProvider'

export function App() {
  const now = useClock()
  const [view, setView] = useState<WorkspaceView>('map')
  const { mapCountrySelected } = useTimezones()
  return (
    <div className="app-shell">
      <Header view={view} onViewChange={setView} />
      {view === 'map' ? (
        <main className="content-layout">
          <TimezoneSidebar now={now} />
          <div className="main-content">
            <WorldMap now={now} />
            <TimezoneStrip now={now} hiddenOnMobile={mapCountrySelected} />
          </div>
        </main>
      ) : (
        <main className="compare-view">
          <OverlapHours now={now} />
        </main>
      )}
    </div>
  )
}
