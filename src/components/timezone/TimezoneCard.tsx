import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronLeft, ChevronRight, GripVertical, Home, Star, X } from 'lucide-react'
import { useTimezones } from '../../app/TimezoneProvider'
import { dayRelation, formatClockParts, offsetLabel } from '../../lib/timezone'
import type { SelectedTimezone } from '../../types/timezone'

interface Props {
  timezone: SelectedTimezone
  now: number
  index: number
  total: number
}

export function SortableTimezoneCard({ timezone, now, index, total }: Props) {
  const { selected, active, timeFormat, removeLocation, setHome, selectLocation, move } = useTimezones()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: timezone.id })
  const home = selected.find((item) => item.isHome) ?? timezone
  const relation = dayRelation(now, timezone.timezone, home.timezone)
  const activeCard = active.timezone === timezone.timezone
  const clock = formatClockParts(now, timezone.timezone, timeFormat)

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`timezone-card ${timezone.isHome ? 'home-card' : ''} ${activeCard ? 'active-card' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={() => selectLocation(timezone)}
    >
      <div className="card-topline">
        <button className="drag-handle" {...attributes} {...listeners} aria-label={`Reorder ${timezone.city}`}><GripVertical /></button>
        <span>{timezone.isHome && <Home aria-label="Home timezone" />}{timezone.city}</span>
        <button className="remove-card" onClick={(event) => { event.stopPropagation(); removeLocation(timezone.id) }} disabled={total === 1} aria-label={`Remove ${timezone.city}`}><X /></button>
      </div>
      <div className="card-time"><strong>{clock.time}</strong>{clock.period && <span>{clock.period}</span>}</div>
      <div className="card-zone">{timezone.timezone.replaceAll('_', ' ')}</div>
      <div className="card-meta"><span>{offsetLabel(now, timezone.timezone)}</span>{relation !== 'Today' && <em>{relation}</em>}</div>
      <div className="card-actions">
        {!timezone.isHome && <button onClick={(event) => { event.stopPropagation(); setHome(timezone.id) }}><Star /> Set Home</button>}
        <span className="move-buttons">
          <button disabled={index === 0} onClick={(event) => { event.stopPropagation(); move(timezone.id, -1) }} aria-label={`Move ${timezone.city} left`}><ChevronLeft /></button>
          <button disabled={index === total - 1} onClick={(event) => { event.stopPropagation(); move(timezone.id, 1) }} aria-label={`Move ${timezone.city} right`}><ChevronRight /></button>
        </span>
      </div>
    </article>
  )
}
