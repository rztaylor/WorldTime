import { ArrowLeft, Check, ChevronRight, Plus, Sun } from 'lucide-react'
import { useTimezones } from '../../app/TimezoneProvider'
import { countries, locations } from '../../data/locations'
import { timezoneChoicesForCountry } from '../../data/catalog'
import { describeZone } from '../../lib/timezone'

export function TimezoneSidebar({ now }: { now: number }) {
  const { active, selected, addLocation, selectLocation } = useTimezones()
  const details = describeZone(active, now)
  const country = countries.find((item) => item.code === active.countryCode)
  const sameZone = locations.filter((item) => item.timezone === active.timezone)
  const countryCities = locations.filter((item) => item.countryCode === active.countryCode)
  const timezoneChoices = timezoneChoicesForCountry(active.countryCode)
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
        {country && country.timezones.length > 1 && <p className="section-hint">This country spans {country.timezones.length} represented timezones. Choose a city below.</p>}
      </section>

      {timezoneChoices.length > 1 && <section>
        <h2>Available timezones</h2>
        {timezoneChoices.map((choice) => (
          <button className={`list-row ${choice.timezone === active.timezone ? 'selected' : ''}`} key={choice.timezone} onClick={() => selectLocation(choice)}>
            <span>{choice.timezone.replaceAll('_', ' ')}</span><small>{describeZone(choice, now).offset}</small>
          </button>
        ))}
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
