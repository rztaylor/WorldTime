/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { locations, locationByTimezone } from '../data/locations'
import { locationForTimezone } from '../data/catalog'
import { loadPreferences, savePreferences } from '../lib/storage'
import { MAX_SELECTED_TIMEZONES, type LocationRecord, type SelectedTimezone, type StoredPreferences, type Theme, type TimeFormat, type WorkingHours } from '../types/timezone'

interface TimezoneContextValue {
  selected: SelectedTimezone[]
  active: LocationRecord
  inspectedOffset: number | null
  returnOffset: number | null
  mapCountrySelected: boolean
  timeFormat: TimeFormat
  theme: Theme
  workingHours: WorkingHours
  nightHours: WorkingHours
  addLocation: (location: LocationRecord) => void
  selectLocation: (location: LocationRecord) => void
  selectLocationFromOffset: (location: LocationRecord) => void
  selectOffset: (offset: number) => void
  returnToOffset: () => void
  clearMapSelection: () => void
  removeLocation: (id: string) => void
  setHome: (id: string) => void
  reorder: (activeId: string, overId: string) => void
  move: (id: string, direction: -1 | 1) => void
  toggleTimeFormat: () => void
  cycleTheme: () => void
  setWorkingHours: (hours: WorkingHours) => void
  setNightHours: (hours: WorkingHours) => void
}

const TimezoneContext = createContext<TimezoneContextValue | null>(null)

function defaultLocation(): LocationRecord {
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
  return locationByTimezone(detected) ?? locations[0]
}

function initialPreferences(): StoredPreferences {
  const stored = loadPreferences()
  if (stored) return stored
  const home = defaultLocation()
  return {
    version: 1,
    selectedTimezones: [{ ...home, isHome: true }],
    activeTimezone: home.timezone,
    timeFormat: '12h',
    theme: 'system',
    workingHours: { start: 9, end: 17 },
    nightHours: { start: 22, end: 6 },
  }
}

export function TimezoneProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [inspectedLocation, setInspectedLocation] = useState<LocationRecord | null>(null)
  const [inspectedOffset, setInspectedOffset] = useState<number | null>(null)
  const [returnOffset, setReturnOffset] = useState<number | null>(null)
  const [mapCountrySelected, setMapCountrySelected] = useState(true)

  useEffect(() => savePreferences(preferences), [preferences])

  useEffect(() => {
    const dark = preferences.theme === 'dark' || (
      preferences.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
    )
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [preferences.theme])

  const update = (change: (current: StoredPreferences) => StoredPreferences) => setPreferences(change)

  const selectLocation = (location: LocationRecord) => {
    setInspectedOffset(null)
    setReturnOffset(null)
    setInspectedLocation(location)
    setMapCountrySelected(true)
    update((current) => ({
      ...current,
      activeTimezone: location.timezone,
    }))
  }

  const inspectLocation = (location: LocationRecord) => {
    setInspectedOffset(null)
    setInspectedLocation(location)
    setMapCountrySelected(true)
    update((current) => ({ ...current, activeTimezone: location.timezone }))
  }

  const addLocation = (location: LocationRecord) => {
    setInspectedOffset(null)
    setInspectedLocation(location)
    update((current) => {
      const exists = current.selectedTimezones.some(({ timezone }) => timezone === location.timezone)
      return {
        ...current,
        activeTimezone: location.timezone,
        selectedTimezones: exists || current.selectedTimezones.length >= MAX_SELECTED_TIMEZONES
          ? current.selectedTimezones
          : [...current.selectedTimezones, { ...location, isHome: false }],
      }
    })
  }

  const removeLocation = (id: string) => update((current) => {
    const target = current.selectedTimezones.find((item) => item.id === id)
    if (!target || current.selectedTimezones.length === 1) return current
    const remaining = current.selectedTimezones.filter((item) => item.id !== id)
    if (target.isHome) remaining[0] = { ...remaining[0], isHome: true }
    return {
      ...current,
      selectedTimezones: remaining,
      activeTimezone: current.activeTimezone === target.timezone ? remaining[0].timezone : current.activeTimezone,
    }
  })

  const setHome = (id: string) => update((current) => ({
    ...current,
    selectedTimezones: current.selectedTimezones.map((item) => ({ ...item, isHome: item.id === id })),
  }))

  const reorder = (activeId: string, overId: string) => update((current) => {
    const from = current.selectedTimezones.findIndex((item) => item.id === activeId)
    const to = current.selectedTimezones.findIndex((item) => item.id === overId)
    if (from < 0 || to < 0 || from === to) return current
    const next = [...current.selectedTimezones]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    return { ...current, selectedTimezones: next }
  })

  const move = (id: string, direction: -1 | 1) => update((current) => {
    const from = current.selectedTimezones.findIndex((item) => item.id === id)
    const to = from + direction
    if (from < 0 || to < 0 || to >= current.selectedTimezones.length) return current
    const next = [...current.selectedTimezones]
    ;[next[from], next[to]] = [next[to], next[from]]
    return { ...current, selectedTimezones: next }
  })

  const active = inspectedLocation
    ?? preferences.selectedTimezones.find(({ timezone }) => timezone === preferences.activeTimezone)
    ?? ({ ...(locationForTimezone(preferences.activeTimezone) ?? preferences.selectedTimezones[0]), isHome: false })
  const value: TimezoneContextValue = {
    selected: preferences.selectedTimezones,
    active,
    inspectedOffset,
    returnOffset,
    mapCountrySelected,
    timeFormat: preferences.timeFormat,
    theme: preferences.theme,
    workingHours: preferences.workingHours,
    nightHours: preferences.nightHours,
    addLocation,
    selectLocation,
    selectLocationFromOffset: inspectLocation,
    selectOffset: (offset) => {
      setInspectedOffset(offset)
      setReturnOffset(offset)
      setMapCountrySelected(false)
    },
    returnToOffset: () => {
      if (returnOffset !== null) setInspectedOffset(returnOffset)
    },
    clearMapSelection: () => setMapCountrySelected(false),
    removeLocation,
    setHome,
    reorder,
    move,
    toggleTimeFormat: () => update((current) => ({ ...current, timeFormat: current.timeFormat === '12h' ? '24h' : '12h' })),
    cycleTheme: () => update((current) => ({ ...current, theme: current.theme === 'system' ? 'light' : current.theme === 'light' ? 'dark' : 'system' })),
    setWorkingHours: (workingHours) => update((current) => ({ ...current, workingHours })),
    setNightHours: (nightHours) => update((current) => ({ ...current, nightHours })),
  }

  return <TimezoneContext.Provider value={value}>{children}</TimezoneContext.Provider>
}

export function useTimezones() {
  const context = useContext(TimezoneContext)
  if (!context) throw new Error('useTimezones must be used within TimezoneProvider')
  return context
}
