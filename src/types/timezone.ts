export type TimeFormat = '12h' | '24h'
export type Theme = 'light' | 'dark' | 'system'

export const MAX_SELECTED_TIMEZONES = 10

export interface LocationRecord {
  id: string
  city: string
  country: string
  countryCode: string
  timezone: string
  latitude: number
  longitude: number
  aliases?: string[]
  kind?: 'city' | 'timezone'
}

export interface CountryRecord {
  code: string
  name: string
  timezones: string[]
  majorCityIds: string[]
}

export interface SelectedTimezone extends LocationRecord {
  isHome: boolean
}

export interface WorkingHours {
  start: number
  end: number
}

export interface StoredPreferences {
  version: 1
  selectedTimezones: SelectedTimezone[]
  activeTimezone: string
  timeFormat: TimeFormat
  theme: Theme
  workingHours: WorkingHours
  nightHours: WorkingHours
}
