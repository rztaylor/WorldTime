import { useMemo, useState } from 'react'
import { ArrowLeft, Check, ChevronRight, Plus, Search, Sun } from 'lucide-react'
import { useTimezones } from '../../app/TimezoneProvider'
import { locations } from '../../data/locations'
import { capitalLocationForCountry, timezoneChoicesForCountry } from '../../data/catalog'
import { describeZone, locationsForOffset, zoneDisplayNames } from '../../lib/timezone'

export function TimezoneSidebar({ now }: { now: number }) {
  const { active, inspectedOffset, returnOffset, selected, addLocation, returnToOffset, selectLocation, selectLocationFromOffset } = useTimezones()
  const [timezoneFilter, setTimezoneFilter] = useState({ countryCode: '', query: '' })
  const timezoneQuery = timezoneFilter.countryCode === active.countryCode ? timezoneFilter.query : ''
  const details = describeZone(active, now)
  const sameZone = locations.filter((item) => item.timezone === active.timezone)
  const countryCities = locations.filter((item) => item.countryCode === active.countryCode)
  const capital = capitalLocationForCountry(active.countryCode, active.timezone)
  const cities = capital && !countryCities.some((city) => city.city.toLocaleLowerCase() === capital.city.toLocaleLowerCase())
    ? [capital, ...countryCities]
    : countryCities
  const selectDrilldown = returnOffset === null ? selectLocation : selectLocationFromOffset
  const timezoneChoices = timezoneChoicesForCountry(active.countryCode)
  const timezoneOptions = useMemo(() => {
    const preferred = new Map(countryCities.map((city, index) => [city.timezone, index]))
    const options = timezoneChoices
      .map((choice) => ({ choice, display: zoneDisplayNames(choice.timezone, now) }))
      .sort((a, b) => (preferred.get(a.choice.timezone) ?? 100) - (preferred.get(b.choice.timezone) ?? 100) || a.choice.timezone.localeCompare(b.choice.timezone))
    const query = timezoneQuery.trim().toLocaleLowerCase()
    return (query ? options.filter(({ display }) => display.searchText.includes(query)) : options).slice(0, query ? 12 : 8)
  }, [countryCities, now, timezoneChoices, timezoneQuery])
  const isAdded = selected.some((item) => item.timezone === active.timezone)

  if (inspectedOffset !== null) {
    const offset = inspectedOffset === 0 ? 'UTC' : `UTC${inspectedOffset > 0 ? '+' : '−'}${Math.abs(inspectedOffset)}`
    const matchingCountries = locationsForOffset(inspectedOffset, now)
    return (
      <aside className="timezone-sidebar" aria-label="Selected timezone details">
        <button className="back-link" onClick={() => document.getElementById('global-search')?.focus()}><ArrowLeft /> All Timezones</button>
        <div className="zone-display">{offset}</div>
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
      <div className="zone-display">{active.timezone.replaceAll('_', ' ').replace('/', ' / ')}</div>
      <h1>{active.city}</h1>
      <p className="zone-title">{active.country}</p>
      <p className="zone-meta">{details.offset} now · {details.abbreviation}</p>
      {details.observesDst && <p className="zone-meta">Standard offset: {details.standardOffset}</p>}
      <button className="add-selection" disabled={isAdded} onClick={() => addLocation(active)}>
        {isAdded ? <Check /> : <Plus />}{isAdded ? 'Added to comparison' : 'Add to comparison'}
      </button>
      {details.observesDst && <p className="dst-note"><Sun /> Daylight saving is {details.dstActive ? 'currently in effect' : 'not currently in effect'}.</p>}

      {timezoneChoices.length > 1 && <section>
        <h2>Available timezones</h2>
        <p className="section-hint">This country spans {timezoneChoices.length} represented timezones. Choose or filter below.</p>
        <label className="timezone-filter"><Search /><span className="sr-only">Filter timezones</span><input value={timezoneQuery} onChange={(event) => setTimezoneFilter({ countryCode: active.countryCode, query: event.target.value })} placeholder="PST, Eastern, Los Angeles…" /></label>
        {timezoneOptions.map(({ choice, display }) => (
          <button className={`list-row timezone-option ${choice.timezone === active.timezone ? 'selected' : ''}`} key={choice.timezone} onClick={() => selectDrilldown(choice)}>
            <span className="timezone-row-copy"><strong>{choice.timezone.replaceAll('_', ' ')}</strong><small>{display.abbreviations.join(' / ')} · {display.currentName}</small></span><small>{describeZone(choice, now).offset}</small>
          </button>
        ))}
        {!timezoneOptions.length && <p className="section-hint">No matching timezones.</p>}
        {!timezoneQuery && timezoneChoices.length > timezoneOptions.length && <p className="section-hint">Showing common timezones. Search all {timezoneChoices.length}.</p>}
      </section>}

      {(cities.length > 0 || sameZone.length > 1) && <section>
        <h2>Cities</h2>
        {(cities.length ? cities : sameZone).map((city) => (
          <button className={`list-row ${city.id === active.id ? 'selected' : ''}`} key={city.id} onClick={() => selectDrilldown(city)}>
            <span className="city-name">{city.city}{capital?.id === city.id && <em>Capital</em>}</span><small>{describeZone(city, now).offset}</small>
          </button>
        ))}
      </section>}
    </aside>
  )
}
