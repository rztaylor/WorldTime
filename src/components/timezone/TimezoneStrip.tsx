import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useTimezones } from '../../app/TimezoneProvider'
import { SortableTimezoneCard } from './TimezoneCard'

export function TimezoneStrip({ now, hiddenOnMobile = false }: { now: number; hiddenOnMobile?: boolean }) {
  const { selected, reorder } = useTimezones()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const dragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) reorder(String(active.id), String(over.id))
  }

  return (
    <section id="timezones" className={`timezone-strip${hiddenOnMobile ? ' mobile-hidden' : ''}`} aria-label="Compared timezones">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}>
        <SortableContext items={selected.map((item) => item.id)} strategy={rectSortingStrategy}>
          <div className="card-row">
            {selected.map((timezone, index) => <SortableTimezoneCard key={timezone.id} timezone={timezone} now={now} index={index} total={selected.length} />)}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  )
}
