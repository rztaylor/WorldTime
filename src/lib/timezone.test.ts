import { describe, expect, it } from 'vitest'
import { countryNamesSharingOffset, describeZone, zoneAbbreviation, zoneDisplayNames } from './timezone'

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
    expect(zoneAbbreviation(Date.UTC(2026, 0, 15), london)).toBeNull()
    expect(zoneAbbreviation(Date.UTC(2026, 6, 15), london)).toBe('BST')
  })

  it('uses a fixed location alias throughout the year', () => {
    const delhi = { timezone: 'Asia/Kolkata', aliases: ['IST'] }
    expect(zoneAbbreviation(Date.UTC(2026, 0, 15), delhi)).toBe('IST')
    expect(zoneAbbreviation(Date.UTC(2026, 6, 15), delhi)).toBe('IST')
  })

  it('suppresses GMT offset fallbacks', () => {
    expect(zoneAbbreviation(Date.UTC(2026, 0, 15), { timezone: 'Pacific/Fiji' })).toBeNull()
    expect(zoneDisplayNames('Etc/GMT-12', Date.UTC(2026, 0, 15))).toMatchObject({
      abbreviations: [],
      currentName: 'Etc/GMT-12',
    })
  })

  it('uses a recognizable locale abbreviation for named timezones when available', () => {
    expect(zoneAbbreviation(Date.UTC(2026, 6, 15), { timezone: 'Europe/Warsaw', kind: 'timezone' })).toBe('CEST')
  })
})

describe('countryNamesSharingOffset', () => {
  it('matches countries on different IANA zones with the same current offset', () => {
    const names = countryNamesSharingOffset('Africa/Lagos', Date.UTC(2026, 0, 15))

    expect(names).toContain('Nigeria')
    expect(names).toContain('Chad')
    expect(names).toContain('Algeria')
    expect(names).not.toContain('United Kingdom')
  })

  it('follows daylight saving for the selected timezone', () => {
    const winter = countryNamesSharingOffset('Europe/London', Date.UTC(2026, 0, 15))
    const summer = countryNamesSharingOffset('Europe/London', Date.UTC(2026, 6, 15))

    expect(winter).toContain('Ghana')
    expect(winter).not.toContain('Nigeria')
    expect(summer).toContain('Nigeria')
    expect(summer).not.toContain('Ghana')
  })

  it('matches half-hour offsets', () => {
    const names = countryNamesSharingOffset('Asia/Kolkata', Date.UTC(2026, 0, 15))

    expect(names).toContain('India')
    expect(names).toContain('Sri Lanka')
    expect(names).not.toContain('Pakistan')
  })
})
