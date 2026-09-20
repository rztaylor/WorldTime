import { beforeEach, describe, expect, it } from 'vitest'
import { locations } from '../data/locations'
import type { StoredPreferences } from '../types/timezone'
import { loadPreferences, savePreferences, STORAGE_KEY } from './storage'

const preferences: StoredPreferences = {
  version: 1,
  selectedTimezones: [{ ...locations[0], isHome: true }],
  activeTimezone: locations[0].timezone,
  timeFormat: '12h',
  theme: 'system',
  workingHours: { start: 9, end: 17 },
  nightHours: { start: 22, end: 6 },
}

describe('preference storage', () => {
  beforeEach(() => localStorage.clear())

  it('persists schedule ranges', () => {
    savePreferences({ ...preferences, nightHours: { start: 21, end: 5 } })
    expect(loadPreferences()?.nightHours).toEqual({ start: 21, end: 5 })
  })

  it('adds default night hours to older version-one preferences', () => {
    const olderPreferences: Partial<StoredPreferences> = { ...preferences }
    delete olderPreferences.nightHours
    localStorage.setItem(STORAGE_KEY, JSON.stringify(olderPreferences))
    expect(loadPreferences()?.nightHours).toEqual({ start: 22, end: 6 })
  })
})
