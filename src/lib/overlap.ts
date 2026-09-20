import { DateTime } from 'luxon'
import type { SelectedTimezone, WorkingHours } from '../types/timezone'

export interface OverlapHour {
  hour: number
  availableCount: number
  availableLocationIds: string[]
}

export type HourKind = 'night' | 'other' | 'work'

export function isHourInRange(hour: number, hours: WorkingHours) {
  if (hours.start === hours.end) return false
  return hours.start < hours.end
    ? hour >= hours.start && hour < hours.end
    : hour >= hours.start || hour < hours.end
}

export function hourKind(hour: number, workingHours: WorkingHours, nightHours: WorkingHours): HourKind {
  if (isHourInRange(hour, workingHours)) return 'work'
  if (isHourInRange(hour, nightHours)) return 'night'
  return 'other'
}

export function calculateOverlap(
  locations: SelectedTimezone[],
  timestamp: number,
  workingHours: WorkingHours,
  referenceTimezone = 'UTC',
): OverlapHour[] {
  const referenceDay = DateTime.fromMillis(timestamp, { zone: referenceTimezone }).startOf('day')
  return Array.from({ length: 24 }, (_, hour) => {
    const instant = referenceDay.plus({ hours: hour })
    const availableLocationIds = locations.filter(({ timezone }) => {
      const localHour = instant.setZone(timezone).hour
      return isHourInRange(localHour, workingHours)
    }).map(({ id }) => id)
    return { hour, availableCount: availableLocationIds.length, availableLocationIds }
  })
}

export function longestMaximumWindow(hours: OverlapHour[]) {
  if (!hours.length) return null
  const maximum = Math.max(...hours.map((hour) => hour.availableCount))
  if (maximum === 0) return null
  let bestStart = 0
  let bestLength = 0
  let index = 0
  while (index < hours.length) {
    if (hours[index].availableCount !== maximum) {
      index += 1
      continue
    }
    const start = index
    const signature = hours[index].availableLocationIds.join('|')
    while (index < hours.length && hours[index].availableCount === maximum && hours[index].availableLocationIds.join('|') === signature) {
      index += 1
    }
    const length = index - start
    if (length > bestLength) {
      bestStart = start
      bestLength = length
    }
  }
  return {
    start: hours[bestStart].hour,
    end: hours[bestStart].hour + bestLength,
    count: maximum,
    locationIds: hours[bestStart].availableLocationIds,
  }
}
