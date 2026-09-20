import type { StoredPreferences } from '../types/timezone'

export const STORAGE_KEY = 'timezone-map.preferences.v1'

export function loadPreferences(): StoredPreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1) return null
    const preferences = value as StoredPreferences
    if (!Array.isArray(preferences.selectedTimezones) || !preferences.selectedTimezones.length) return null
    return preferences
  } catch {
    return null
  }
}

export function savePreferences(preferences: StoredPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch {
    // Storage can be unavailable in private or locked-down browser contexts.
  }
}
