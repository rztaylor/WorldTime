import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { ArrowLeftRight, CheckCircle2, Plus } from 'lucide-react'
import { useTimezones } from '../../app/TimezoneProvider'
import { SortableTimezoneCard } from './TimezoneCard'

export function TimezoneStrip({ now }: { now: number }) {
  const { selected, reorder } = useTimezones()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const dragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) reorder(String(active.id), String(over.id))
  }

  return (
    <section id="timezones" className="timezone-strip" aria-labelledby="timezone-strip-title">
      <div className="strip-toolbar">
        <h2 id="timezone-strip-title"><ArrowLeftRight /> Drag to reorder</h2>
        <p><CheckCircle2 /> All times are saved to your browser</p>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}>
        <SortableContext items={selected.map((item) => item.id)} strategy={horizontalListSortingStrategy}>
          <div className="card-row">
            {selected.map((timezone, index) => <SortableTimezoneCard key={timezone.id} timezone={timezone} now={now} index={index} total={selected.length} />)}
            <button className="add-card" onClick={() => document.getElementById('global-search')?.focus()}>
              <Plus /><strong>Add City</strong><span>Search or select<br />from the map</span>
            </button>
          </div>
        </SortableContext>
      </DndContext>
    </section>
  )
}
