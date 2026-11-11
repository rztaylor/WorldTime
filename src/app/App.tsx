import { lazy, Suspense, useState } from 'react'
import { Header } from '../components/header/Header'
import type { WorkspaceView } from '../components/header/Header'
import { TimezoneSidebar } from '../components/timezone/TimezoneSidebar'
import { TimezoneStrip } from '../components/timezone/TimezoneStrip'
import { useClock } from '../hooks/useClock'
import { useTimezones } from './TimezoneProvider'

// Map geometry, d3 and the Compare schedule load as separate chunks so the shell renders first.
const WorldMap = lazy(() => import('../components/map/WorldMap').then((module) => ({ default: module.WorldMap })))
const OverlapHours = lazy(() => import('../components/overlap/OverlapHours').then((module) => ({ default: module.OverlapHours })))

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
            <Suspense fallback={<section className="map-panel" aria-label="Loading world map" aria-busy="true" />}>
              <WorldMap now={now} />
            </Suspense>
            <TimezoneStrip now={now} hiddenOnMobile={mapCountrySelected} />
          </div>
        </main>
      ) : (
        <main className="compare-view">
          <Suspense fallback={null}>
            <OverlapHours now={now} />
          </Suspense>
        </main>
      )}
    </div>
  )
}
