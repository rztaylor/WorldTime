import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Home, SlidersHorizontal } from 'lucide-react'
import { useTimezones } from '../../app/TimezoneProvider'
import { hourKind } from '../../lib/overlap'
import { zonedDateTime } from '../../lib/timezone'
import type { TimeFormat, WorkingHours } from '../../types/timezone'

export function OverlapHours({ now }: { now: number }) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { selected, workingHours, nightHours, timeFormat, setWorkingHours, setNightHours } = useTimezones()
  const home = selected.find((item) => item.isHome) ?? selected[0]
  const homeDay = zonedDateTime(now, home.timezone).startOf('day')
  const timePattern = timeFormat === '12h' ? 'h:mm a' : 'HH:mm'
  const currentPosition = Math.min(100, Math.max(0, zonedDateTime(now, home.timezone).diff(homeDay, 'hours').hours / 24 * 100))
  const initialCurrentPosition = useRef(currentPosition)
  const hours = Array.from({ length: 24 }, (_, hour) => hour)

  useLayoutEffect(() => {
    const chart = chartRef.current
    if (!chart || !window.matchMedia('(max-width: 800px)').matches) return
    const centerCurrentTime = () => {
      const marker = chart.querySelector<HTMLElement>('.current-time')
      const location = chart.querySelector<HTMLElement>('.overlap-location')
      if (!marker || !location) return
      const markerContentX = marker.offsetParent instanceof HTMLElement
        ? marker.offsetParent.offsetLeft + marker.offsetLeft
        : 720 * initialCurrentPosition.current / 100 + location.offsetWidth
      const cellViewportWidth = chart.clientWidth - location.offsetWidth
      chart.scrollLeft = Math.max(0, markerContentX - location.offsetWidth - cellViewportWidth / 2)
    }
    const frame = requestAnimationFrame(centerCurrentTime)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section id="overlap" className="overlap-panel" aria-labelledby="overlap-title">
      <div className="overlap-header">
        <div className="overlap-title">
          <span>
            <h1 id="overlap-title">Compare</h1>
            <p>Scan local hours across every location</p>
          </span>
          <button
            className="schedule-settings-toggle"
            type="button"
            aria-label={settingsOpen ? 'Hide schedule settings' : 'Show schedule settings'}
            aria-expanded={settingsOpen}
            aria-controls="schedule-settings"
            onClick={() => setSettingsOpen((open) => !open)}
          >
            <SlidersHorizontal aria-hidden="true" />
          </button>
        </div>
        <div id="schedule-settings" className={`schedule-settings${settingsOpen ? ' open' : ''}`} aria-label="Schedule colour settings">
          <HourRange label="Working hours" value={workingHours} timeFormat={timeFormat} onChange={setWorkingHours} />
          <HourRange label="Nighttime" value={nightHours} timeFormat={timeFormat} onChange={setNightHours} />
        </div>
      </div>

      <div className="overlap-chart-shell">
        <div className="overlap-fixed-locations" aria-hidden="true">
          {selected.map((item) => <LocationLabel key={item.id} className="overlap-fixed-location" item={item} now={now} timePattern={timePattern} />)}
        </div>
        <div ref={chartRef} className="overlap-chart" aria-label={`Working hours for ${selected.length} locations. Times shown in ${home.city}.`}>
          <div className="overlap-rows">
          {selected.map((item, index) => {
            return (
              <div className="overlap-row" key={item.id}>
                <LocationLabel className="overlap-location" item={item} now={now} timePattern={timePattern} />
                <div className="overlap-timeline">
                  {hours.map((hour) => {
                    const localTime = homeDay.plus({ hours: hour }).setZone(item.timezone)
                    const differsFromHomeDay = localTime.toISODate() !== homeDay.toISODate()
                    const kind = hourKind(localTime.hour, workingHours, nightHours)
                    return (
                      <span className={`hour-cell ${kind}`} key={hour} title={`${item.city}: ${formatHour(localTime.hour, timeFormat)} · ${kind === 'work' ? 'Working hours' : kind === 'night' ? 'Nighttime' : 'Outside working hours'}`}>
                        {differsFromHomeDay && <em>{localTime.toFormat('ccc')}</em>}
                        <strong>{localTime.toFormat(timeFormat === '12h' ? 'h' : 'HH')}</strong>
                        {timeFormat === '12h' && <small>{localTime.toFormat('a')}</small>}
                      </span>
                    )
                  })}
                  <span className="current-time" style={{ '--current-position': `${currentPosition}%` } as CSSProperties} aria-hidden="true">
                    {index === 0 && <span>Now</span>}
                  </span>
                </div>
                <span className="sr-only">{item.city}: working hours are {formatHour(workingHours.start, timeFormat)} to {formatHour(workingHours.end, timeFormat)} local time.</span>
              </div>
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}

function LocationLabel({ className, item, now, timePattern }: { className: string; item: ReturnType<typeof useTimezones>['selected'][number]; now: number; timePattern: string }) {
  const localNow = zonedDateTime(now, item.timezone)
  return (
    <div className={className}>
      <strong>{item.city}{item.isHome && <Home aria-label="Home timezone" />}</strong>
      <span>{localNow.toFormat(timePattern)}</span>
    </div>
  )
}

function HourRange({ label, value, timeFormat, onChange }: { label: string; value: WorkingHours; timeFormat: TimeFormat; onChange: (hours: WorkingHours) => void }) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <div className="schedule-range">
        <select aria-label={`${label} start`} value={value.start} onChange={(event) => onChange({ ...value, start: Number(event.target.value) })}>
          {hourOptions(timeFormat, value.end)}
        </select>
        <span aria-hidden="true">to</span>
        <select aria-label={`${label} end`} value={value.end} onChange={(event) => onChange({ ...value, end: Number(event.target.value) })}>
          {hourOptions(timeFormat, value.start)}
        </select>
      </div>
    </fieldset>
  )
}

function hourOptions(timeFormat: TimeFormat, disabledHour: number) {
  return Array.from({ length: 24 }, (_, hour) => <option value={hour} key={hour} disabled={hour === disabledHour}>{formatHour(hour, timeFormat)}</option>)
}

function formatHour(hour: number, timeFormat: TimeFormat) {
  return zonedDateTime(Date.UTC(2026, 0, 1, hour), 'UTC').toFormat(timeFormat === '12h' ? 'h a' : 'HH:mm')
}
