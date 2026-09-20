import { countries, locations } from '../data/locations'
import { catalogCountries, catalogTimezones } from '../data/catalog'
import { offsetLabel } from './timezone'
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

  const add = (location: LocationRecord, group: SearchResult['group'], detail: string) => {
    if (seen.has(location.id)) return
    seen.add(location.id)
    results.push({ location, group, detail })
  }

  for (const location of locations) {
    const aliases = location.aliases?.join(' ') ?? ''
    if (normalize(location.city).includes(needle) || normalize(aliases).includes(needle)) {
      add(location, 'Cities', `${location.country} · ${offsetLabel(timestamp, location.timezone)}`)
    }
  }
  for (const country of countries) {
    if (normalize(country.name).includes(needle)) {
      const location = locations.find((item) => item.id === country.majorCityIds[0])
      if (location) add(location, 'Countries', country.timezones.join(' · '))
    }
  }
  for (const location of catalogCountries) {
    if (normalize(location.country).includes(needle)) add(location, 'Countries', location.timezone)
  }
  for (const location of locations) {
    const searchableOffset = normalize(offsetLabel(timestamp, location.timezone)).replace('utc', 'gmt')
    const rawOffset = normalize(offsetLabel(timestamp, location.timezone))
    if (normalize(location.timezone).includes(needle) || rawOffset === needle || searchableOffset === needle) {
      add(location, 'Timezones', location.timezone)
    }
  }
  for (const location of catalogTimezones) {
    if (normalize(location.timezone).includes(needle)) add(location, 'Timezones', location.country)
  }
  return results.slice(0, 12)
}
