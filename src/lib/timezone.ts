import { DateTime } from 'luxon'
import type { LocationRecord, TimeFormat } from '../types/timezone'

export const zonedDateTime = (timestamp: number, timezone: string) =>
  DateTime.fromMillis(timestamp).setZone(timezone)

export const formatClock = (timestamp: number, timezone: string, format: TimeFormat) =>
  zonedDateTime(timestamp, timezone).toFormat(format === '12h' ? 'h:mm a' : 'HH:mm')

export const offsetLabel = (timestamp: number, timezone: string) => {
  const minutes = zonedDateTime(timestamp, timezone).offset
  if (minutes === 0) return 'UTC'
  const sign = minutes > 0 ? '+' : '−'
  const absolute = Math.abs(minutes)
  const hours = Math.floor(absolute / 60)
  const remainder = absolute % 60
  return `UTC${sign}${hours}${remainder ? `:${String(remainder).padStart(2, '0')}` : ''}`
}

export const zoneName = (timestamp: number, timezone: string) =>
  zonedDateTime(timestamp, timezone).offsetNameShort ?? timezone

export const dayRelation = (timestamp: number, timezone: string, homeTimezone: string) => {
  const date = zonedDateTime(timestamp, timezone).startOf('day')
  const homeDate = zonedDateTime(timestamp, homeTimezone).startOf('day')
  const days = Math.round(date.diff(homeDate, 'days').days)
  return days > 0 ? 'Tomorrow' : days < 0 ? 'Yesterday' : 'Today'
}

export const describeZone = (location: LocationRecord, timestamp: number) => {
  const current = zonedDateTime(timestamp, location.timezone)
  const januaryOffset = DateTime.fromObject({ year: current.year, month: 1, day: 15 }, { zone: location.timezone }).offset
  const julyOffset = DateTime.fromObject({ year: current.year, month: 7, day: 15 }, { zone: location.timezone }).offset
  return {
    offset: offsetLabel(timestamp, location.timezone),
    abbreviation: zoneName(timestamp, location.timezone),
    observesDst: januaryOffset !== julyOffset,
    dstActive: current.isInDST,
  }
}
