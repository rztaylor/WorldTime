import { countries, locations } from '../data/locations'
import { catalogCountries, catalogTimezones } from '../data/catalog'
import { asNamedTimezone, offsetLabel, utcTimezone, zoneAbbreviation, zoneDisplayNames } from './timezone'
import type { LocationRecord } from '../types/timezone'

export interface SearchResult {
  location: LocationRecord
  group: 'Cities' | 'Countries' | 'Timezones'
  detail: string
}

const normalize = (value: string) => value.toLocaleLowerCase().replace(/[−–—]/g, '-').trim()

export function searchLocations(query: string, timestamp = Date.now()): SearchResult[] {
  const needle = normalize(query)
  if (!needle) return []
  const results: SearchResult[] = []
  const seen = new Set<string>()
  const seenTimezoneDisplays = new Set<string>()
  const namedCandidates = [...locations, ...catalogTimezones]
    .map((location) => ({ location, display: zoneDisplayNames(location.timezone, timestamp) }))
  const isAbbreviationQuery = locations.some((location) => location.aliases?.some((alias) => normalize(alias) === needle))
    || namedCandidates.some(({ display }) => display.abbreviations.some((abbreviation) => normalize(abbreviation) === needle))

  const add = (location: LocationRecord, group: SearchResult['group'], detail: string) => {
    if (seen.has(location.id)) return
    seen.add(location.id)
    results.push({ location, group, detail })
  }

  const addNamedTimezone = (location: LocationRecord, display: ReturnType<typeof zoneDisplayNames>) => {
    const key = `${display.friendlyName}-${offsetLabel(timestamp, location.timezone)}`
    if (seenTimezoneDisplays.has(key)) return
    seenTimezoneDisplays.add(key)
    const timezone = asNamedTimezone(location, timestamp)
    const current = zoneAbbreviation(timestamp, timezone)
    const matched = display.abbreviations.find((abbreviation) => normalize(abbreviation) === needle)
    const abbreviation = matched && matched !== current ? `${matched} (seasonal) · ${current ? `${current} now` : 'currently inactive'}` : current
    add(timezone, 'Timezones', `${abbreviation ? `${abbreviation} · ` : ''}${offsetLabel(timestamp, location.timezone)}`)
  }

  const utc = utcTimezone(timestamp)
  if (['utc', 'coordinated universal time', 'gmt', 'utc+0', 'utc-0'].includes(needle)) {
    add(utc, 'Timezones', 'Coordinated Universal Time · UTC')
  }

  for (const location of locations) {
    if (normalize(location.city).includes(needle)) {
      add(location, 'Cities', [location.country, offsetLabel(timestamp, location.timezone)].join(' · '))
    }
  }
  if (!isAbbreviationQuery) {
    for (const country of countries) {
      if (normalize(country.name).includes(needle)) {
        const location = locations.find((item) => item.id === country.majorCityIds[0])
        if (location) add(location, 'Countries', country.timezones.join(' · '))
      }
    }
    for (const location of catalogCountries) {
      if (normalize(location.country).includes(needle)) add(location, 'Countries', location.timezone)
    }
  }
  for (const { location, display } of namedCandidates) {
    const matchesName = !isAbbreviationQuery && (display.nameSearchText.includes(needle)
      || (needle.includes('/') && normalize(location.timezone).includes(needle)))
    const matchesAbbreviation = display.abbreviations.some((abbreviation) => normalize(abbreviation) === needle)
    const offset = normalize(offsetLabel(timestamp, location.timezone))
    const matchesOffset = offset === needle || offset.replace('utc', 'gmt') === needle
    if (matchesName || matchesAbbreviation || matchesOffset) addNamedTimezone(location, display)
  }
  return results.slice(0, 12)
}
