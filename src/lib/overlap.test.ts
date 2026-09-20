import { describe, expect, it } from 'vitest'
import { locations } from '../data/locations'
import { calculateOverlap, longestMaximumWindow } from './overlap'

describe('working-hour overlap', () => {
  it('counts locations within local working hours', () => {
    const selected = ['london', 'new-york'].map((id, index) => ({
      ...locations.find((location) => location.id === id)!,
      isHome: index === 0,
    }))
    const hours = calculateOverlap(selected, Date.UTC(2026, 0, 15), { start: 9, end: 17 })
    expect(Math.max(...hours.map((hour) => hour.availableCount))).toBe(2)
    expect(hours.find((hour) => hour.utcHour === 15)?.availableCount).toBe(2)
  })

  it('returns the longest maximum window', () => {
    expect(longestMaximumWindow([
      { utcHour: 0, availableCount: 0 },
      { utcHour: 1, availableCount: 2 },
      { utcHour: 2, availableCount: 2 },
      { utcHour: 3, availableCount: 1 },
    ])).toEqual({ start: 1, end: 3, count: 2 })
  })
})
