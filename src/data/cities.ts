import { getCountry } from 'countries-and-timezones'
import generatedCities from './generated-cities.json'
import { locations } from './locations'
import type { LocationRecord } from '../types/timezone'

const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase()
const curated = new Set(locations.map((city) => `${city.countryCode}:${normalize(city.city)}`))

export const cities: LocationRecord[] = [
  ...locations,
  ...generatedCities
    .filter(([, name, countryCode]) => !curated.has(`${countryCode}:${normalize(String(name))}`))
    .map(([id, name, countryCode, timezone, latitude, longitude]) => ({
      id: `geonames-${id}`,
      city: String(name),
      country: getCountry(String(countryCode))!.name,
      countryCode: String(countryCode),
      timezone: String(timezone),
      latitude: Number(latitude),
      longitude: Number(longitude),
    })),
]
