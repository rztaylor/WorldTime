import { DateTime } from 'luxon'
import type { SelectedTimezone, WorkingHours } from '../types/timezone'

export interface OverlapHour {
  utcHour: number
  availableCount: number
}

export function calculateOverlap(
  locations: SelectedTimezone[],
  timestamp: number,
  workingHours: WorkingHours,
): OverlapHour[] {
  const utcDay = DateTime.fromMillis(timestamp, { zone: 'utc' }).startOf('day')
  return Array.from({ length: 24 }, (_, utcHour) => {
    const instant = utcDay.plus({ hours: utcHour })
    const availableCount = locations.filter(({ timezone }) => {
      const localHour = instant.setZone(timezone).hour
      return localHour >= workingHours.start && localHour < workingHours.end
    }).length
    return { utcHour, availableCount }
  })
}

export function longestMaximumWindow(hours: OverlapHour[]) {
  if (!hours.length) return null
  const maximum = Math.max(...hours.map((hour) => hour.availableCount))
  if (maximum === 0) return null
  let bestStart = 0
  let bestLength = 0
  let start = 0
  for (let index = 0; index <= hours.length; index += 1) {
    if (index < hours.length && hours[index].availableCount === maximum) continue
    const length = index - start
    if (length > bestLength) {
      bestStart = start
      bestLength = length
    }
    start = index + 1
  }
  return { start: hours[bestStart].utcHour, end: hours[bestStart].utcHour + bestLength, count: maximum }
}
