import { ArrowLeft, ChevronRight, Sun } from 'lucide-react'
import { useTimezones } from '../../app/TimezoneProvider'
import { countries, locations } from '../../data/locations'
import { describeZone } from '../../lib/timezone'

export function TimezoneSidebar({ now }: { now: number }) {
  const { active, addLocation, selectLocation } = useTimezones()
  const details = describeZone(active, now)
  const country = countries.find((item) => item.code === active.countryCode)
  const sameZone = locations.filter((item) => item.timezone === active.timezone)
  const countryCities = locations.filter((item) => item.countryCode === active.countryCode)

  return (
    <aside className="timezone-sidebar" aria-label="Selected timezone details">
      <button className="back-link" onClick={() => document.getElementById('global-search')?.focus()}><ArrowLeft /> All Timezones</button>
      <div className="offset-display">{details.offset}</div>
      <h1>{active.city}</h1>
      <p className="zone-title">{active.timezone.replace('_', ' ')}</p>
      <p className="zone-meta">{details.abbreviation} · {details.offset.replace('UTC', 'GMT')}</p>
      {details.observesDst && <p className="dst-note"><Sun /> Daylight saving is {details.dstActive ? 'currently in effect' : 'not currently in effect'}.</p>}

      <section>
        <h2>Country</h2>
        <button className="list-row selected" onClick={() => selectLocation(active)}>
          <span>{active.country}</span><ChevronRight />
        </button>
        {country && country.timezones.length > 1 && <p className="section-hint">This country spans {country.timezones.length} represented timezones. Choose a city below.</p>}
      </section>

      <section>
        <h2>Major cities</h2>
        {(countryCities.length ? countryCities : sameZone).map((city) => (
          <button className="list-row" key={city.id} onClick={() => addLocation(city)}>
            <span>{city.city}</span><small>{describeZone(city, now).offset}</small>
          </button>
        ))}
      </section>
    </aside>
  )
}
