import type { StoredPreferences } from '../types/timezone'
import { MAX_SELECTED_TIMEZONES } from '../types/timezone'

export const STORAGE_KEY = 'timezone-map.preferences.v1'

export function loadPreferences(): StoredPreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1) return null
    const preferences = value as StoredPreferences
    if (!Array.isArray(preferences.selectedTimezones) || !preferences.selectedTimezones.length) return null
    const selectedTimezones = preferences.selectedTimezones.slice(0, MAX_SELECTED_TIMEZONES)
    if (!selectedTimezones.some(({ isHome }) => isHome)) selectedTimezones[0] = { ...selectedTimezones[0], isHome: true }
    return {
      ...preferences,
      selectedTimezones,
      workingHours: validHours(preferences.workingHours) ? preferences.workingHours : { start: 9, end: 17 },
      nightHours: validHours(preferences.nightHours) ? preferences.nightHours : { start: 22, end: 6 },
    }
  } catch {
    return null
  }
}

function validHours(value: unknown): value is StoredPreferences['workingHours'] {
  if (!value || typeof value !== 'object') return false
  const hours = value as { start?: unknown; end?: unknown }
  return Number.isInteger(hours.start) && Number.isInteger(hours.end)
    && Number(hours.start) >= 0 && Number(hours.start) < 24
    && Number(hours.end) >= 0 && Number(hours.end) < 24
    && hours.start !== hours.end
}

export function savePreferences(preferences: StoredPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch {
    // Storage can be unavailable in private or locked-down browser contexts.
  }
}
