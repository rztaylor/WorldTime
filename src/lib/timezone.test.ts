import { describe, expect, it } from 'vitest'
import { describeZone, zoneAbbreviation } from './timezone'

const london = {
  id: 'london',
  city: 'London',
  country: 'United Kingdom',
  countryCode: 'GB',
  timezone: 'Europe/London',
  latitude: 51.5074,
  longitude: -0.1278,
  aliases: ['GMT', 'BST'],
}

describe('describeZone', () => {
  it('distinguishes a daylight-saving offset from the standard offset', () => {
    const details = describeZone(london, Date.UTC(2026, 6, 15))

    expect(details).toMatchObject({
      offset: 'UTC+1',
      standardOffset: 'UTC',
      abbreviation: 'BST',
      observesDst: true,
      dstActive: true,
    })
  })
})

describe('zoneAbbreviation', () => {
  it('uses the location alias for the current daylight-saving state', () => {
    expect(zoneAbbreviation(Date.UTC(2026, 0, 15), london)).toBe('GMT')
    expect(zoneAbbreviation(Date.UTC(2026, 6, 15), london)).toBe('BST')
  })

  it('uses a fixed location alias throughout the year', () => {
    const delhi = { timezone: 'Asia/Kolkata', aliases: ['IST'] }
    expect(zoneAbbreviation(Date.UTC(2026, 0, 15), delhi)).toBe('IST')
    expect(zoneAbbreviation(Date.UTC(2026, 6, 15), delhi)).toBe('IST')
  })
})
