import { describe, expect, it } from 'vitest'
import { hourKind, isHourInRange } from './overlap'

describe('schedule hour classification', () => {
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
