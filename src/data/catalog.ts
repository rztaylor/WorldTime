import {
  getAllCountries,
  getAllTimezones,
  getCountriesForTimezone,
  getCountry,
  type Country,
} from 'countries-and-timezones'
import { locationByTimezone, locations } from './locations'
import type { LocationRecord } from '../types/timezone'

const atlasToCatalogName: Record<string, string> = {
  'W. Sahara': 'Western Sahara',
  'Dem. Rep. Congo': 'Democratic Republic of the Congo',
  'Dominican Rep.': 'Dominican Republic',
  'Falkland Is.': 'Falkland Islands',
  'Fr. S. Antarctic Lands': 'French Southern Territories',
  "Côte d'Ivoire": 'Ivory Coast',
  'Central African Rep.': 'Central African Republic',
  Congo: 'Republic of the Congo',
  'Eq. Guinea': 'Equatorial Guinea',
  eSwatini: 'Eswatini',
  Turkey: 'Türkiye',
  'Solomon Is.': 'Solomon Islands',
  'Bosnia and Herz.': 'Bosnia and Herzegovina',
  Macedonia: 'North Macedonia',
  'S. Sudan': 'South Sudan',
  'N. Cyprus': 'Cyprus',
  Somaliland: 'Somalia',
  Kosovo: 'Serbia',
}

const catalogToAtlasName = Object.fromEntries(
  Object.entries(atlasToCatalogName).map(([atlas, catalog]) => [catalog, atlas]),
)

const allCountries = Object.values(getAllCountries())
const allTimezones = Object.values(getAllTimezones())

const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase()

function countryForName(name: string): Country | undefined {
  const catalogName = atlasToCatalogName[name] ?? name
  const normalized = normalize(catalogName)
  return allCountries.find((country) => normalize(country.name) === normalized)
}

function recordForCountry(country: Country, timezone: string, coordinates: [number, number] = [0, 0]): LocationRecord {
  const curated = locationByTimezone(timezone)
  if (curated && curated.countryCode === country.id) return curated
  return {
    id: `${country.id.toLocaleLowerCase()}-${timezone.toLocaleLowerCase().replaceAll('/', '-')}`,
    city: timezone.split('/').at(-1)?.replaceAll('_', ' ') ?? country.name,
    country: catalogToAtlasName[country.name] ?? country.name,
    countryCode: country.id,
    timezone,
    longitude: coordinates[0],
    latitude: coordinates[1],
  }
}

export function locationForCountryName(name: string, coordinates: [number, number]): LocationRecord | null {
  const curated = locations.find((location) => location.country === name)
  if (curated) return { ...curated, longitude: coordinates[0], latitude: coordinates[1] }
  const country = countryForName(name)
  return country?.timezones[0] ? recordForCountry(country, country.timezones[0], coordinates) : null
}

export function locationForTimezone(timezone: string): LocationRecord | null {
  const curated = locationByTimezone(timezone)
  if (curated) return curated
  const country = getCountriesForTimezone(timezone)[0]
  return country ? recordForCountry(country, timezone) : null
}

export function timezoneChoicesForCountry(countryCode: string): LocationRecord[] {
  const country = getCountry(countryCode)
  if (!country) return []
  return country.timezones.map((timezone) => recordForCountry(country, timezone))
}

export function countryNamesForTimezone(timezone: string) {
  return new Set(getCountriesForTimezone(timezone).map((country) => catalogToAtlasName[country.name] ?? country.name))
}

export const catalogCountries = allCountries
  .filter((country) => country.timezones.length > 0)
  .map((country) => recordForCountry(country, country.timezones[0]))

export const catalogTimezones = allTimezones
  .filter((timezone) => !timezone.aliasOf)
  .map((timezone) => {
    const country = getCountriesForTimezone(timezone.name)[0]
    return country ? recordForCountry(country, timezone.name) : null
  })
  .filter((record): record is LocationRecord => record !== null)
