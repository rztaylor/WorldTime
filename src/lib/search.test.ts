import { describe, expect, it } from 'vitest'
import { searchLocations } from './search'

describe('searchLocations', () => {
  it('finds a major city', () => {
    expect(searchLocations('Tokyo')[0]?.location.timezone).toBe('Asia/Tokyo')
  })

  it('finds a country and an IANA timezone', () => {
    expect(searchLocations('Japan').some((result) => result.location.city === 'Tokyo')).toBe(true)
    expect(searchLocations('America/New_York').some((result) => result.location.kind === 'timezone' && result.location.timezone === 'America/New_York')).toBe(true)
  })

  it('searches the complete country and timezone catalog', () => {
    expect(searchLocations('Peru').some((result) => result.location.timezone === 'America/Lima')).toBe(true)
    expect(searchLocations('Pacific/Chatham').some((result) => result.location.timezone === 'Pacific/Chatham')).toBe(true)
  })

  it('supports common timezone abbreviations', () => {
    expect(searchLocations('JST').some((result) => result.location.kind === 'timezone' && result.location.timezone === 'Asia/Tokyo')).toBe(true)
  })

  it('returns only timezone matches for an ambiguous seasonal abbreviation', () => {
    const results = searchLocations('CST', Date.UTC(2026, 6, 15))
    expect(results.every((result) => result.location.kind === 'timezone')).toBe(true)
    expect(results.find((result) => result.location.city === 'Central Time')?.detail).toContain('CST (seasonal) · CDT now')
    expect(results.some((result) => result.location.city === 'China Standard Time')).toBe(true)
  })

  it('matches complete abbreviations without including longer unrelated ones', () => {
    const timestamp = Date.UTC(2026, 6, 15)
    expect(searchLocations('EST', timestamp).some((result) => result.location.city === 'Lisbon')).toBe(false)
    expect(searchLocations('AST', timestamp).some((result) => ['Sydney', 'Johannesburg'].includes(result.location.city))).toBe(false)
    expect(searchLocations('WEST', timestamp).find((result) => result.location.timezone === 'Europe/Lisbon')?.detail).toContain('WEST')
  })

  it('finds named zones through curated abbreviations absent from locale labels', () => {
    for (const [alias, timezone] of [['IST', 'Asia/Kolkata'], ['SAST', 'Africa/Johannesburg'], ['EAT', 'Africa/Nairobi']]) {
      expect(searchLocations(alias, Date.UTC(2026, 6, 15)).some((result) => result.location.kind === 'timezone' && result.location.timezone === timezone)).toBe(true)
    }
  })

  it('marks inactive abbreviations in both hemispheres', () => {
    expect(searchLocations('EST', Date.UTC(2026, 6, 15)).find((result) => result.location.timezone === 'America/New_York')?.detail).toContain('EST (seasonal)')
    expect(searchLocations('EDT', Date.UTC(2026, 0, 15)).find((result) => result.location.timezone === 'America/New_York')?.detail).toContain('EDT (seasonal)')
    expect(searchLocations('AEST', Date.UTC(2026, 0, 15)).find((result) => result.location.timezone === 'Australia/Sydney')?.detail).toContain('AEST (seasonal)')
    expect(searchLocations('AEDT', Date.UTC(2026, 6, 15)).find((result) => result.location.timezone === 'Australia/Sydney')?.detail).toContain('AEDT (seasonal)')
  })

  it('mixes city and timezone results only when both names match', () => {
    const results = searchLocations('Singapore')
    expect(results.some((result) => result.group === 'Cities' && result.location.city === 'Singapore')).toBe(true)
    expect(results.some((result) => result.location.kind === 'timezone' && result.location.city.includes('Singapore'))).toBe(true)
    expect(searchLocations('Tokyo').every((result) => result.group === 'Cities')).toBe(true)
  })

  it('finds named timezones by friendly and seasonal names', () => {
    const timestamp = Date.UTC(2026, 0, 15)
    const eastern = searchLocations('Eastern Time', timestamp).find((result) => result.location.kind === 'timezone')
    expect(eastern?.location).toMatchObject({ city: 'Eastern Time', timezone: 'America/New_York' })
    expect(searchLocations('EDT', timestamp).some((result) => result.location.kind === 'timezone' && result.location.timezone === 'America/New_York')).toBe(true)
  })

  it('offers UTC as a first-class timezone', () => {
    expect(searchLocations('UTC')[0]?.location).toMatchObject({ city: 'UTC', kind: 'timezone', timezone: 'UTC' })
  })
})
