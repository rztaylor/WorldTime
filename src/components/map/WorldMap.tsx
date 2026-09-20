import { useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { LocateFixed, Minus, Plus } from 'lucide-react'
import { geoCentroid } from 'd3-geo'
import world from 'world-atlas/countries-110m.json'
import { useTimezones } from '../../app/TimezoneProvider'
import {
  countryNamesForTimezone,
  locationForCountryName,
} from '../../data/catalog'
import { countryNamesForOffset, locationForOffset } from '../../lib/timezone'

interface MapPosition {
  coordinates: [number, number]
  zoom: number
}

export function WorldMap({ now }: { now: number }) {
  const { active, selectLocation } = useTimezones()
  const [position, setPosition] = useState<MapPosition>({ coordinates: [8, 10], zoom: 1 })
  const [selectedOffset, setSelectedOffset] = useState<number | null>(null)
  const markerWidth = Math.max(96, active.country.length * 6.4 + 30, active.city.length * 5.3 + 30)
  const relatedCountries = useMemo(
    () => selectedOffset === null
      ? countryNamesForTimezone(active.timezone)
      : countryNamesForOffset(selectedOffset, now),
    [active.timezone, now, selectedOffset],
  )

  const selectCountry = (name: string, coordinates: [number, number]) => {
    const location = locationForCountryName(name, coordinates)
    if (!location) return
    setSelectedOffset(null)
    selectLocation(location)
  }

  const selectOffset = (offset: number) => {
    const location = locationForOffset(offset, now)
    if (!location) return
    setSelectedOffset(offset)
    selectLocation(location)
  }

  return (
    <section id="map" className="map-panel" aria-label="Interactive world timezone map">
      <div className="timezone-bands" aria-label="Select a UTC offset">
        {Array.from({ length: 25 }, (_, index) => {
          const offset = index - 12
          const label = offset === 0 ? 'UTC' : `UTC${offset > 0 ? '+' : '−'}${Math.abs(offset)}`
          return <button className={selectedOffset === offset ? 'active' : ''} key={index} onClick={() => selectOffset(offset)} aria-label={`Select ${label}`}>{offset === 0 ? 'UTC' : offset > 0 ? `+${offset}` : offset}</button>
        })}
      </div>
      <div className="map-canvas">
        <svg className="band-lines" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
          {Array.from({ length: 25 }, (_, index) => <rect key={index} x={index * 40} width="40" height="500" className={index % 2 ? 'band-even' : 'band-odd'} />)}
        </svg>
        <ComposableMap width={800} height={410} projectionConfig={{ scale: 126 }} role="img" aria-label="World map. Select a country to inspect its timezone.">
          <ZoomableGroup
            center={position.coordinates}
            zoom={position.zoom}
            minZoom={1}
            maxZoom={4}
            onMoveEnd={({ coordinates, zoom }) => setPosition({ coordinates: coordinates as [number, number], zoom: zoom ?? position.zoom })}
          >
            <Geographies geography={world as never}>
              {({ geographies }) => geographies.map((geo) => {
                const name = String(geo.properties?.name ?? '')
                const coordinates = geoCentroid(geo as never) as [number, number]
                const location = locationForCountryName(name, coordinates)
                const supported = location !== null
                const selected = location?.countryCode === active.countryCode
                const related = relatedCountries.has(name)
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={supported ? 0 : -1}
                    role={supported ? 'button' : undefined}
                    aria-label={supported ? `${name}. Press Enter to select.` : name}
                    className={selected ? 'country selected-country' : related ? 'country related-country' : supported ? 'country supported-country' : 'country'}
                    onClick={() => supported && selectCountry(name, coordinates)}
                    onKeyDown={(event) => {
                      if (supported && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault()
                        selectCountry(name, coordinates)
                      }
                    }}
                  />
                )
              })}
            </Geographies>
            {(active.longitude !== 0 || active.latitude !== 0) && <Marker coordinates={[active.longitude, active.latitude]}>
              <g className="active-marker">
                <circle r={5} />
                <rect x={9} y={-21} width={markerWidth} height={42} rx={4} />
                <text className="marker-country" x={23} y={-3}>{active.country}</text>
                <text className="marker-city" x={23} y={11}>{active.city}</text>
                <circle cx={16} cy={0} r={3} className="marker-dot" />
              </g>
            </Marker>}
          </ZoomableGroup>
        </ComposableMap>
      </div>
      <div className="map-controls" aria-label="Map controls">
        <button onClick={() => setPosition((current) => ({ ...current, zoom: Math.min(4, current.zoom * 1.35) }))} aria-label="Zoom in"><Plus /></button>
        <button onClick={() => setPosition((current) => ({ ...current, zoom: Math.max(1, current.zoom / 1.35) }))} aria-label="Zoom out"><Minus /></button>
        <button onClick={() => setPosition({ coordinates: [8, 10], zoom: 1 })} aria-label="Reset map"><LocateFixed /></button>
      </div>
      <div className="region-labels" aria-hidden="true"><span>← AMERICAS</span><span>EUROPE / AFRICA</span><span>ASIA / PACIFIC →</span></div>
      <div className="map-legend"><span><i className="selected" /> Selected</span><span><i className="related" /> Same timezone</span><span><i /> Other</span></div>
    </section>
  )
}
