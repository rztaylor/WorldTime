import { useMemo, useState } from 'react'
import { ArrowLeft, Check, ChevronRight, Plus, Search, Sun } from 'lucide-react'
import { useTimezones } from '../../app/TimezoneProvider'
import { locations } from '../../data/locations'
import { timezoneChoicesForCountry } from '../../data/catalog'
import { describeZone, zoneDisplayNames } from '../../lib/timezone'

export function TimezoneSidebar({ now }: { now: number }) {
  const { active, selected, addLocation, selectLocation } = useTimezones()
  const [timezoneFilter, setTimezoneFilter] = useState({ countryCode: '', query: '' })
  const timezoneQuery = timezoneFilter.countryCode === active.countryCode ? timezoneFilter.query : ''
  const details = describeZone(active, now)
  const sameZone = locations.filter((item) => item.timezone === active.timezone)
  const countryCities = locations.filter((item) => item.countryCode === active.countryCode)
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

  return (
    <aside className="timezone-sidebar" aria-label="Selected timezone details">
      <button className="back-link" onClick={() => document.getElementById('global-search')?.focus()}><ArrowLeft /> All Timezones</button>
      <div className="zone-display">{active.timezone.replaceAll('_', ' ').replace('/', ' / ')}</div>
      <h1>{active.city}</h1>
      <p className="zone-title">{active.country}</p>
      <p className="zone-meta">{details.offset}</p>
      <button className="add-selection" disabled={isAdded} onClick={() => addLocation(active)}>
        {isAdded ? <Check /> : <Plus />}{isAdded ? 'Added to comparison' : 'Add to comparison'}
      </button>
      {details.observesDst && <p className="dst-note"><Sun /> Daylight saving is {details.dstActive ? 'currently in effect' : 'not currently in effect'}.</p>}

      <section>
        <h2>Country</h2>
        <button className="list-row selected" onClick={() => selectLocation(active)}>
          <span>{active.country}</span><ChevronRight />
        </button>
        {timezoneChoices.length > 1 && <p className="section-hint">This country spans {timezoneChoices.length} represented timezones. Choose or filter below.</p>}
      </section>

      {timezoneChoices.length > 1 && <section>
        <h2>Available timezones</h2>
        <label className="timezone-filter"><Search /><span className="sr-only">Filter timezones</span><input value={timezoneQuery} onChange={(event) => setTimezoneFilter({ countryCode: active.countryCode, query: event.target.value })} placeholder="PST, Eastern, Los Angeles…" /></label>
        {timezoneOptions.map(({ choice, display }) => (
          <button className={`list-row timezone-option ${choice.timezone === active.timezone ? 'selected' : ''}`} key={choice.timezone} onClick={() => selectLocation(choice)}>
            <span className="timezone-row-copy"><strong>{choice.timezone.replaceAll('_', ' ')}</strong><small>{display.abbreviations.join(' / ')} · {display.currentName}</small></span><small>{describeZone(choice, now).offset}</small>
          </button>
        ))}
        {!timezoneOptions.length && <p className="section-hint">No matching timezones.</p>}
        {!timezoneQuery && timezoneChoices.length > timezoneOptions.length && <p className="section-hint">Showing common timezones. Search all {timezoneChoices.length}.</p>}
      </section>}

      {(countryCities.length > 0 || sameZone.length > 1) && <section>
        <h2>Major cities</h2>
        {(countryCities.length ? countryCities : sameZone).map((city) => (
          <button className={`list-row ${city.timezone === active.timezone ? 'selected' : ''}`} key={city.id} onClick={() => selectLocation(city)}>
            <span>{city.city}</span><small>{describeZone(city, now).offset}</small>
          </button>
        ))}
      </section>}
    </aside>
  )
}
