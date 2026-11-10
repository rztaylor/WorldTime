import { describe, expect, it } from 'vitest'
import { capitalLocationForCountry, catalogCountries, displayTimezoneForCountryName, locationForCountryName } from './catalog'

describe('country map timezone', () => {
  it.each([
    ['Mongolia', 'Asia/Ulaanbaatar', 'Ulaanbaatar'],
    ['Papua New Guinea', 'Pacific/Port_Moresby', 'Port Moresby'],
    ['Greenland', 'America/Nuuk', 'Nuuk'],
    ['Chile', 'America/Santiago', 'Santiago'],
    ['Uzbekistan', 'Asia/Tashkent', 'Tashkent'],
    ['Cyprus', 'Asia/Nicosia', 'Nicosia'],
  ])('shows %s on its capital timezone', (name, timezone, city) => {
    expect(locationForCountryName(name, [0, 0])).toMatchObject({ timezone, city })
    expect(displayTimezoneForCountryName(name)).toBe(timezone)
  })

  it('keeps the first listed zone when the capital has no zone of its own', () => {
    expect(displayTimezoneForCountryName('Kazakhstan')).toBe('Asia/Almaty')
  })

  it('uses the capital zone for country search records', () => {
    expect(catalogCountries.find((country) => country.countryCode === 'MN')?.timezone).toBe('Asia/Ulaanbaatar')
  })

  it('finds capitals spelled differently from their zone', () => {
    expect(capitalLocationForCountry('MN', 'Asia/Hovd')).toMatchObject({ city: 'Ulan Bator', timezone: 'Asia/Ulaanbaatar' })
  })
})
