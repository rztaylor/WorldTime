import type { WorkingHours } from '../types/timezone'

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
