import { useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { LocateFixed, Minus, Plus } from 'lucide-react'
import { geoCentroid, geoEqualEarth } from 'd3-geo'
import world from 'world-atlas/countries-110m.json'
import { useTimezones } from '../../app/TimezoneProvider'
import {
  countryNamesForTimezone,
  locationForCountryName,
} from '../../data/catalog'
import { countryNamesForOffset } from '../../lib/timezone'

interface MapPosition {
  coordinates: [number, number]
  zoom: number
}

interface MapTransform {
  x: number
  zoom: number
}

const MAP_WIDTH = 800
const MAP_HEIGHT = 410
const BAND_COUNT = 25
const BAND_WIDTH = MAP_WIDTH / BAND_COUNT
const INITIAL_POSITION: MapPosition = { coordinates: [8, 10], zoom: 1.2 }
const projection = geoEqualEarth().translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]).scale(126)

function transformForPosition({ coordinates, zoom }: MapPosition): MapTransform {
  const [projectedX] = projection(coordinates) ?? [MAP_WIDTH / 2, MAP_HEIGHT / 2]
  return { x: MAP_WIDTH / 2 - projectedX * zoom, zoom }
}

export function WorldMap({ now }: { now: number }) {
  const { active, inspectedOffset, mapCountrySelected, clearMapSelection, selectLocation, selectOffset } = useTimezones()
  const [position, setPosition] = useState<MapPosition>(INITIAL_POSITION)
  const [mapTransform, setMapTransform] = useState<MapTransform>(() => transformForPosition(INITIAL_POSITION))
  const markerWidth = Math.max(96, active.country.length * 6.4 + 30, active.city.length * 5.3 + 30)
  const relatedCountries = useMemo(
    () => inspectedOffset === null
      ? countryNamesForTimezone(active.timezone)
      : countryNamesForOffset(inspectedOffset, now),
    [active.timezone, inspectedOffset, now],
  )

  const selectCountry = (name: string, coordinates: [number, number]) => {
    const location = locationForCountryName(name, coordinates)
    if (!location) return
    selectLocation(location)
  }

  const moveMap = (next: MapPosition) => {
    setPosition(next)
    setMapTransform(transformForPosition(next))
  }

  return (
    <section id="map" className="map-panel" aria-label="Interactive world timezone map">
      <div className="timezone-bands" aria-label="Select a UTC offset">
        <span className="offset-rail-label">Current offsets · includes daylight saving</span>
        {Array.from({ length: BAND_COUNT }, (_, index) => {
          const offset = index - 12
          const label = offset === 0 ? 'UTC' : `UTC${offset > 0 ? '+' : '−'}${Math.abs(offset)}`
          const left = (mapTransform.x + index * BAND_WIDTH * mapTransform.zoom) / MAP_WIDTH * 100
          const width = BAND_WIDTH * mapTransform.zoom / MAP_WIDTH * 100
          return <button style={{ left: `${left}%`, width: `${width}%` }} className={inspectedOffset === offset ? 'active' : ''} key={index} onClick={() => selectOffset(offset)} aria-label={`Select ${label}`}>{offset === 0 ? 'UTC' : offset > 0 ? `+${offset}` : offset}</button>
        })}
      </div>
      <div className="map-canvas">
        <svg className="band-lines" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
          <g className="band-transform" transform={`translate(${mapTransform.x} 0) scale(${mapTransform.zoom} 1)`}>
            {Array.from({ length: BAND_COUNT }, (_, index) => <rect key={index} x={index * BAND_WIDTH} width={BAND_WIDTH} height={MAP_HEIGHT} className={index % 2 ? 'band-even' : 'band-odd'} />)}
          </g>
        </svg>
        <ComposableMap
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          projectionConfig={{ scale: 126 }}
          role="img"
          aria-label="World map. Select a country to inspect its timezone."
        >
          <ZoomableGroup
            center={position.coordinates}
            zoom={position.zoom}
            minZoom={1}
            maxZoom={4}
            onMove={({ x, zoom }) => {
              if (x !== undefined && zoom !== undefined) setMapTransform({ x, zoom })
            }}
            onMoveEnd={({ coordinates, zoom }) => setPosition({ coordinates: coordinates as [number, number], zoom: zoom ?? position.zoom })}
          >
            <rect className="map-background" x={-MAP_WIDTH * 4} y={-MAP_HEIGHT * 4} width={MAP_WIDTH * 9} height={MAP_HEIGHT * 9} fill="transparent" onClick={clearMapSelection} />
            <Geographies geography={world as never}>
              {({ geographies }) => {
                const selectedGeography = mapCountrySelected && inspectedOffset === null
                  ? geographies.find((geo) => {
                      const name = String(geo.properties?.name ?? '')
                      return locationForCountryName(name, geoCentroid(geo as never) as [number, number])?.countryCode === active.countryCode
                    })
                  : undefined

                return <>
                  {geographies.map((geo) => {
                    const name = String(geo.properties?.name ?? '')
                    const coordinates = geoCentroid(geo as never) as [number, number]
                    const location = locationForCountryName(name, coordinates)
                    const supported = location !== null
                    const selected = mapCountrySelected && inspectedOffset === null && location?.countryCode === active.countryCode
                    const related = relatedCountries.has(name)
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        tabIndex={supported ? 0 : -1}
                        role={supported ? 'button' : undefined}
                        aria-label={supported ? `${name}. Press Enter to select.` : name}
                        className={selected ? 'country selected-country' : related ? 'country related-country' : supported ? 'country supported-country' : 'country'}
                        onClick={(event) => {
                          event.stopPropagation()
                          if (supported) selectCountry(name, coordinates)
                        }}
                        onKeyDown={(event) => {
                          if (supported && (event.key === 'Enter' || event.key === ' ')) {
                            event.preventDefault()
                            selectCountry(name, coordinates)
                          }
                        }}
                      />
                    )
                  })}
                  {selectedGeography && <Marker coordinates={geoCentroid(selectedGeography as never) as [number, number]}>
                    <g className="active-marker">
                      <rect x={9} y={-21} width={markerWidth} height={42} rx={4} />
                      <text className="marker-country" x={23} y={-3}>{active.country}</text>
                      <text className="marker-city" x={23} y={11}>{active.city}</text>
                      <circle cx={16} cy={0} r={3} className="marker-dot" />
                    </g>
                  </Marker>}
                </>
              }}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
      <div className="map-controls" aria-label="Map controls">
        <button onClick={() => moveMap({ ...position, zoom: Math.min(4, position.zoom * 1.35) })} aria-label="Zoom in"><Plus /></button>
        <button onClick={() => moveMap({ ...position, zoom: Math.max(1, position.zoom / 1.35) })} aria-label="Zoom out"><Minus /></button>
        <button onClick={() => moveMap(INITIAL_POSITION)} aria-label="Reset map"><LocateFixed /></button>
      </div>
      <div className="region-labels" aria-hidden="true"><span>← AMERICAS</span><span>EUROPE / AFRICA</span><span>ASIA / PACIFIC →</span></div>
      <div className="map-legend"><span><i className="selected" /> Selected</span><span><i className="related" /> Same timezone</span><span><i /> Other</span></div>
    </section>
  )
}
