import { Users } from 'lucide-react'
import { useMemo, type CSSProperties } from 'react'
import { useTimezones } from '../../app/TimezoneProvider'
import { calculateOverlap, longestMaximumWindow } from '../../lib/overlap'
import { zonedDateTime } from '../../lib/timezone'

export function OverlapHours({ now }: { now: number }) {
  const { selected, workingHours, timeFormat } = useTimezones()
  const overlap = useMemo(() => calculateOverlap(selected, now, workingHours), [selected, now, workingHours])
  const window = longestMaximumWindow(overlap)
  const home = selected.find((item) => item.isHome) ?? selected[0]
  const homeStart = window ? zonedDateTime(now, 'UTC').startOf('day').plus({ hours: window.start }).setZone(home.timezone) : null
  const homeEnd = window ? zonedDateTime(now, 'UTC').startOf('day').plus({ hours: window.end }).setZone(home.timezone) : null

  return (
    <section id="overlap" className="overlap-panel" aria-labelledby="overlap-title">
      <div className="overlap-title">
        <Users aria-hidden="true" />
        <span><h2 id="overlap-title">Overlap Hours</h2><p>See when everyone’s online</p></span>
      </div>
      <div className="overlap-chart">
        <div className="overlap-names">
          {selected.map((item) => <span key={item.id}>{item.city}<small>{item.timezone.split('/').at(-1)?.replace('_', ' ')}</small></span>)}
        </div>
        <div className="overlap-cells" aria-label="24-hour availability chart">
          {overlap.map((hour) => <i key={hour.utcHour} style={{ '--strength': `${hour.availableCount / selected.length}` } as CSSProperties} title={`${hour.utcHour}:00 UTC · ${hour.availableCount} available`} />)}
        </div>
        <div className="overlap-axis"><span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>12am</span></div>
      </div>
      <div className="overlap-summary">
        <strong>{homeStart && homeEnd ? `${homeStart.toFormat(timeFormat === '12h' ? 'h a' : 'HH:mm')} – ${homeEnd.toFormat(timeFormat === '12h' ? 'h a' : 'HH:mm')}` : 'No overlap'}</strong>
        <span><Users /> {window?.count ?? 0} {window?.count === 1 ? 'location' : 'locations'} online</span>
      </div>
    </section>
  )
}
