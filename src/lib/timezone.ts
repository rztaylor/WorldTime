import { DateTime } from 'luxon'
import { catalogCountries, catalogTimezones, countryNamesForTimezone, timezoneChoicesForCountry } from '../data/catalog'
import { locations } from '../data/locations'
import type { LocationRecord, TimeFormat } from '../types/timezone'

export const zonedDateTime = (timestamp: number, timezone: string) =>
  DateTime.fromMillis(timestamp).setZone(timezone)

export const formatClock = (timestamp: number, timezone: string, format: TimeFormat) =>
  zonedDateTime(timestamp, timezone).toFormat(format === '12h' ? 'h:mm a' : 'HH:mm')

export const formatClockParts = (timestamp: number, timezone: string, format: TimeFormat) => {
  const time = zonedDateTime(timestamp, timezone)
  return format === '12h'
    ? { time: time.toFormat('h:mm'), period: time.toFormat('a') }
    : { time: time.toFormat('HH:mm'), period: '' }
}

const offsetLabelForMinutes = (minutes: number) => {
  if (minutes === 0) return 'UTC'
  const sign = minutes > 0 ? '+' : '−'
  const absolute = Math.abs(minutes)
  const hours = Math.floor(absolute / 60)
  const remainder = absolute % 60
  return `UTC${sign}${hours}${remainder ? `:${String(remainder).padStart(2, '0')}` : ''}`
}

export const offsetLabel = (timestamp: number, timezone: string) =>
  offsetLabelForMinutes(zonedDateTime(timestamp, timezone).offset)

export const zoneName = (timestamp: number, timezone: string) =>
  zonedDateTime(timestamp, timezone).offsetNameShort ?? timezone

const friendlyZoneNames: Record<string, string> = {
  UTC: 'UTC',
  'America/New_York': 'Eastern Time',
  'America/Chicago': 'Central Time',
  'America/Denver': 'Mountain Time',
  'America/Los_Angeles': 'Pacific Time',
  'America/Anchorage': 'Alaska Time',
  'Pacific/Honolulu': 'Hawaii Time',
  'Europe/London': 'United Kingdom Time',
  'Europe/Paris': 'Central European Time',
  'Europe/Helsinki': 'Eastern European Time',
}

export const friendlyZoneName = (timezone: string, timestamp: number) => {
  const override = friendlyZoneNames[timezone]
  if (override) return override
  const current = zonedDateTime(timestamp, timezone).setLocale('en-US')
  const longName = current.offsetNameLong
  if (!longName || isGmtLabel(longName)) return timezone.split('/').at(-1)?.replaceAll('_', ' ') ?? timezone
  if (/ (?:Daylight|Summer) Time$/.test(longName)) return longName.replace(/ (?:Daylight|Summer) Time$/, ' Time')
  if (/ Standard Time$/.test(longName)) {
    const januaryOffset = DateTime.fromObject({ year: current.year, month: 1, day: 15 }, { zone: timezone }).offset
    const julyOffset = DateTime.fromObject({ year: current.year, month: 7, day: 15 }, { zone: timezone }).offset
    if (januaryOffset !== julyOffset) return longName.replace(/ Standard Time$/, ' Time')
  }
  return longName
}

export const asNamedTimezone = (location: LocationRecord, timestamp: number): LocationRecord => ({
  ...location,
  id: `timezone-${location.timezone.toLocaleLowerCase().replaceAll('/', '-')}`,
  city: friendlyZoneName(location.timezone, timestamp),
  kind: 'timezone',
})

export const utcTimezone = (timestamp: number): LocationRecord => asNamedTimezone({
  id: 'utc',
  city: 'UTC',
  country: 'Coordinated Universal Time',
  countryCode: '',
  timezone: 'UTC',
  latitude: 0,
  longitude: 0,
  aliases: ['UTC'],
}, timestamp)

export const gmtTimezone = (): LocationRecord => ({
  id: 'timezone-etc-gmt',
  city: 'Greenwich Mean Time',
  country: 'United Kingdom',
  countryCode: 'GB',
  timezone: 'Etc/GMT',
  latitude: 51.4826,
  longitude: 0,
  aliases: ['GMT'],
  kind: 'timezone',
})

const isGmtLabel = (value: string) => /^GMT(?:[+-]\d{1,2}(?::?\d{2})?)?$/i.test(value.trim())

export const zoneAbbreviation = (timestamp: number, location: Pick<LocationRecord, 'timezone' | 'aliases' | 'kind'>) => {
  if (location.timezone === 'Etc/GMT') return 'GMT'
  const localeAbbreviation = ['en-US', 'en-GB']
    .map((locale) => zonedDateTime(timestamp, location.timezone).setLocale(locale).offsetNameShort)
    .find((name): name is string => Boolean(name && !isGmtLabel(name)))
  const abbreviation = !location.aliases?.length
    ? location.kind === 'timezone' ? localeAbbreviation ?? zoneName(timestamp, location.timezone) : zoneName(timestamp, location.timezone)
    : location.aliases.length === 1
      ? location.aliases[0]
      : location.aliases[zonedDateTime(timestamp, location.timezone).isInDST ? 1 : 0]
  return isGmtLabel(abbreviation) ? null : abbreviation
}

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
    standardOffset: offsetLabelForMinutes(Math.min(januaryOffset, julyOffset)),
    abbreviation: zoneAbbreviation(timestamp, location),
    observesDst: januaryOffset !== julyOffset,
    dstActive: current.isInDST,
  }
}

export const zoneDisplayNames = (timezone: string, timestamp: number) => {
  const current = zonedDateTime(timestamp, timezone).setLocale('en-US')
  const seasonal = [1, 7].map((month) => DateTime.fromObject({ year: current.year, month, day: 15 }, { zone: timezone }).setLocale('en-US'))
  const curatedAliases = locations.find((location) => location.timezone === timezone)?.aliases ?? []
  const localeAbbreviations = ['en-US', 'en-GB'].flatMap((locale) => [current, ...seasonal].map((time) => time.setLocale(locale).offsetNameShort))
  const rawAbbreviations = [...new Set([...curatedAliases, ...localeAbbreviations].filter(Boolean))] as string[]
  const names = [...new Set([current, ...seasonal].map((time) => time.offsetNameLong).filter(Boolean))] as string[]
  const rawCurrentName = current.offsetNameLong ?? timezone
  return {
    abbreviations: rawAbbreviations.filter((abbreviation) => !isGmtLabel(abbreviation)),
    friendlyName: friendlyZoneName(timezone, timestamp),
    currentName: isGmtLabel(rawCurrentName) ? timezone : rawCurrentName,
    nameSearchText: [friendlyZoneName(timezone, timestamp), ...names].join(' ').toLocaleLowerCase(),
  }
}

export function countryNamesForOffset(offset: number, timestamp: number) {
  const names = new Set<string>()
  for (const location of catalogTimezones) {
    if (zonedDateTime(timestamp, location.timezone).offset !== offset * 60) continue
    for (const country of countryNamesForTimezone(location.timezone)) names.add(country)
  }
  return names
}

export function locationsForOffset(offset: number, timestamp: number) {
  return catalogCountries
    .map((country) => timezoneChoicesForCountry(country.countryCode)
      .find((location) => zonedDateTime(timestamp, location.timezone).offset === offset * 60))
    .filter((location): location is LocationRecord => location !== undefined)
    .sort((a, b) => a.country.localeCompare(b.country))
}

export function locationForOffset(offset: number, timestamp: number): LocationRecord | null {
  return locations.find((location) => zonedDateTime(timestamp, location.timezone).offset === offset * 60)
    ?? catalogTimezones.find((location) => zonedDateTime(timestamp, location.timezone).offset === offset * 60)
    ?? null
}
