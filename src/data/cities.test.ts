import { describe, expect, it } from 'vitest'
import { DateTime } from 'luxon'
import { cities } from './cities'

describe('bundled city catalog', () => {
  it('covers major cities and the capitals of all four UK nations', () => {
    const namesFor = (countryCode: string) => cities.filter((city) => city.countryCode === countryCode).map((city) => city.city)
    expect(namesFor('GB')).toEqual(expect.arrayContaining(['London', 'Birmingham', 'Manchester', 'Edinburgh', 'Cardiff', 'Belfast']))
    expect(namesFor('FR')).toEqual(expect.arrayContaining(['Paris', 'Marseille', 'Lyon', 'Toulouse']))
    expect(namesFor('ES')).toEqual(expect.arrayContaining(['Madrid', 'Barcelona', 'Valencia', 'Seville']))
    expect(namesFor('GB').length).toBeGreaterThan(8)
  })

  it('keeps records distinct and tied to valid IANA zones', () => {
    expect(cities.length).toBeGreaterThanOrEqual(300)
    expect(cities.length).toBeLessThanOrEqual(1000)
    expect(new Set(cities.map((city) => city.id)).size).toBe(cities.length)
    expect(new Set(cities.map((city) => `${city.countryCode}:${city.city.toLocaleLowerCase()}`)).size).toBe(cities.length)
    expect(cities.every((city) => DateTime.fromMillis(0, { zone: city.timezone }).isValid)).toBe(true)
  })
})
