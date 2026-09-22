import { useMemo, useState } from 'react'
import { ArrowLeft, Check, ChevronRight, Clock3, MapPin, Plus, Search, Sun } from 'lucide-react'
import { useTimezones } from '../../app/TimezoneProvider'
import { locations } from '../../data/locations'
import { capitalLocationForCountry, timezoneChoicesForCountry } from '../../data/catalog'
import { asNamedTimezone, describeZone, locationsForOffset, zoneDisplayNames } from '../../lib/timezone'
import { MAX_SELECTED_TIMEZONES } from '../../types/timezone'

export function TimezoneSidebar({ now }: { now: number }) {
  const { active, inspectedOffset, returnOffset, selected, addLocation, returnToOffset, selectLocation, selectLocationFromOffset } = useTimezones()
  const [timezoneFilter, setTimezoneFilter] = useState({ countryCode: '', query: '' })
  const timezoneQuery = timezoneFilter.countryCode === active.countryCode ? timezoneFilter.query : ''
  const details = describeZone(active, now)
  const sameZone = useMemo(() => locations.filter((item) => item.timezone === active.timezone), [active.timezone])
  const countryCities = useMemo(() => locations.filter((item) => item.countryCode === active.countryCode), [active.countryCode])
  const capital = useMemo(() => capitalLocationForCountry(active.countryCode, active.timezone), [active.countryCode, active.timezone])
  const cities = useMemo(() => capital && !countryCities.some((city) => city.city.toLocaleLowerCase() === capital.city.toLocaleLowerCase())
    ? [capital, ...countryCities]
    : countryCities, [capital, countryCities])
  const selectDrilldown = returnOffset === null ? selectLocation : selectLocationFromOffset
  const timezoneChoices = timezoneChoicesForCountry(active.countryCode)
  const choices = useMemo(() => {
    const preferred = new Map(countryCities.map((city, index) => [city.timezone, index]))
    const zones = timezoneChoices
      .map((choice) => ({ choice: asNamedTimezone(choice, now), display: zoneDisplayNames(choice.timezone, now) }))
      .sort((a, b) => (preferred.get(a.choice.timezone) ?? 100) - (preferred.get(b.choice.timezone) ?? 100) || a.choice.timezone.localeCompare(b.choice.timezone))
    const query = timezoneQuery.trim().toLocaleLowerCase()
    const abbreviationQuery = zones.some(({ display }) => display.abbreviations.some((abbreviation) => abbreviation.toLocaleLowerCase() === query))
      || cities.some((city) => city.aliases?.some((alias) => alias.toLocaleLowerCase() === query))
    const cityMatches = cities.filter((city) => !query || city.city.toLocaleLowerCase().includes(query))
    const represented = new Set(cities.map((city) => city.timezone))
    const seenNames = new Set<string>()
    const zoneMatches = zones.filter(({ choice, display }) => {
      if (query && !(abbreviationQuery
        ? display.abbreviations.some((abbreviation) => abbreviation.toLocaleLowerCase() === query)
        : display.nameSearchText.includes(query) || (query.includes('/') && choice.timezone.toLocaleLowerCase().includes(query)))) return false
      if (!query && represented.has(choice.timezone)) return false
      const key = `${display.friendlyName}-${describeZone(choice, now).offset}`
      if (seenNames.has(key)) return false
      seenNames.add(key)
      return true
    })
    return {
      cities: cityMatches.slice(0, query ? 12 : 8),
      zones: zoneMatches.slice(0, query ? 12 : Math.max(0, 8 - cityMatches.length)),
    }
  }, [cities, countryCities, now, timezoneChoices, timezoneQuery])
  const isAdded = selected.some((item) => item.timezone === active.timezone)
  const comparisonFull = !isAdded && selected.length >= MAX_SELECTED_TIMEZONES

  if (inspectedOffset !== null) {
    const offset = inspectedOffset === 0 ? 'UTC' : `UTC${inspectedOffset > 0 ? '+' : '−'}${Math.abs(inspectedOffset)}`
    const matchingCountries = locationsForOffset(inspectedOffset, now)
    return (
      <aside className="timezone-sidebar" aria-label="Selected timezone details">
        <button className="back-link" onClick={() => document.getElementById('global-search')?.focus()}><ArrowLeft /> All Timezones</button>
        <div className="zone-display zone-offset">{offset}</div>
        <h1>Countries at {offset}</h1>
        <p className="zone-title">{matchingCountries.length} countries currently share this offset.</p>
        <p className="section-hint">Current offset, including daylight saving changes. Choose a country to inspect its timezone and cities.</p>
        <section>
          <h2>Countries</h2>
          {matchingCountries.map((country) => (
            <button className="list-row offset-country" key={country.countryCode} onClick={() => selectLocationFromOffset(country)}>
              <span>{country.country}</span><ChevronRight />
            </button>
          ))}
        </section>
      </aside>
    )
  }

  return (
    <aside className="timezone-sidebar" aria-label="Selected timezone details">
      <button className="back-link" onClick={() => returnOffset === null ? document.getElementById('global-search')?.focus() : returnToOffset()}>
        <ArrowLeft /> {returnOffset === null ? 'All Timezones' : `Back to ${returnOffset === 0 ? 'UTC' : `UTC${returnOffset > 0 ? '+' : '−'}${Math.abs(returnOffset)}`}`}
      </button>
      <div className="zone-display">
        <span className="zone-city">{active.city}</span>
        <span className="zone-country">{active.country}</span>
      </div>
      <p className="zone-title">{active.timezone.replaceAll('_', ' ').replace('/', ' / ')}</p>
      <p className="zone-meta">{details.offset} now{details.abbreviation && <> · {details.abbreviation}</>}</p>
      {details.dstActive && <p className="dst-note"><Sun /> Daylight saving is currently in effect.</p>}
      <button className="add-selection" disabled={isAdded || comparisonFull} onClick={() => addLocation(active)}>
        {isAdded ? <Check /> : <Plus />}{isAdded ? 'Added to comparison' : comparisonFull ? 'Comparison full · 10 maximum' : 'Add to comparison'}
      </button>

      {(timezoneChoices.length > 1 || cities.length > 0 || sameZone.length > 1) && <section>
        <h2>Places &amp; timezones</h2>
        {timezoneChoices.length > 1 && <>
          <p className="section-hint">Choose a common place or search all {timezoneChoices.length} timezone regions.</p>
          <label className="timezone-filter"><Search /><span className="sr-only">Filter places and timezones</span><input value={timezoneQuery} onChange={(event) => setTimezoneFilter({ countryCode: active.countryCode, query: event.target.value })} placeholder="PST, Eastern, Los Angeles…" /></label>
        </>}
        {choices.cities.map((city) => (
          <button className={`list-row compact-choice ${city.id === active.id ? 'selected' : ''}`} key={city.id} onClick={() => selectDrilldown(city)}>
            <MapPin aria-hidden="true" /><span className="city-name">{city.city}{capital?.id === city.id && <em>Capital</em>}</span><small>{describeZone(city, now).offset}</small>
          </button>
        ))}
        {choices.zones.map(({ choice }) => (
          <button className={`list-row compact-choice ${choice.id === active.id ? 'selected' : ''}`} key={choice.id} onClick={() => selectDrilldown(choice)}>
            <Clock3 aria-hidden="true" /><span className="city-name">{choice.city}</span><small>{describeZone(choice, now).offset}</small>
          </button>
        ))}
        {!choices.cities.length && !choices.zones.length && <p className="section-hint">No matching places or timezones.</p>}
      </section>}
    </aside>
  )
}
