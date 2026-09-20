import { describe, expect, it } from 'vitest'
import { describeZone } from './timezone'

describe('describeZone', () => {
  it('distinguishes a daylight-saving offset from the standard offset', () => {
    const details = describeZone({
      id: 'london',
      city: 'London',
      country: 'United Kingdom',
      countryCode: 'GB',
      timezone: 'Europe/London',
      latitude: 51.5074,
      longitude: -0.1278,
    }, Date.UTC(2026, 6, 15))

    expect(details).toMatchObject({
      offset: 'UTC+1',
      standardOffset: 'UTC',
      observesDst: true,
      dstActive: true,
    })
  })
})
