import { describe, expect, it } from 'vitest'
import { locations } from '../data/locations'
import { calculateOverlap, hourKind, isHourInRange, longestMaximumWindow } from './overlap'

describe('working-hour overlap', () => {
  it('counts locations within local working hours', () => {
    const selected = ['london', 'new-york'].map((id, index) => ({
      ...locations.find((location) => location.id === id)!,
      isHome: index === 0,
    }))
    const hours = calculateOverlap(selected, Date.UTC(2026, 0, 15), { start: 9, end: 17 })
    expect(Math.max(...hours.map((hour) => hour.availableCount))).toBe(2)
    expect(hours.find((hour) => hour.hour === 15)?.availableCount).toBe(2)
  })

  it('returns the longest maximum window with a stable set of locations', () => {
    expect(longestMaximumWindow([
      { hour: 0, availableCount: 0, availableLocationIds: [] },
      { hour: 1, availableCount: 2, availableLocationIds: ['london', 'new-york'] },
      { hour: 2, availableCount: 2, availableLocationIds: ['london', 'new-york'] },
      { hour: 3, availableCount: 2, availableLocationIds: ['london', 'berlin'] },
      { hour: 4, availableCount: 1, availableLocationIds: ['london'] },
    ])).toEqual({ start: 1, end: 3, count: 2, locationIds: ['london', 'new-york'] })
  })

  it('uses the Home timezone as the reference day when provided', () => {
    const london = { ...locations.find((location) => location.id === 'london')!, isHome: true }
    const hours = calculateOverlap([london], Date.UTC(2026, 6, 15, 12), { start: 9, end: 17 }, london.timezone)
    expect(hours.slice(9, 17).every((hour) => hour.availableCount === 1)).toBe(true)
    expect(hours[8].availableCount).toBe(0)
  })

  it('classifies work, night, and other hours including an overnight range', () => {
    const work = { start: 9, end: 17 }
    const night = { start: 22, end: 6 }
    expect(hourKind(10, work, night)).toBe('work')
    expect(hourKind(19, work, night)).toBe('other')
    expect(hourKind(23, work, night)).toBe('night')
    expect(hourKind(4, work, night)).toBe('night')
    expect(isHourInRange(6, night)).toBe(false)
  })
})
