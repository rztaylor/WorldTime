import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { LocateFixed, Minus, Plus } from 'lucide-react'
import { geoCentroid, geoEqualEarth } from 'd3-geo'
import type { GeoProjection } from 'd3-geo'
import world from 'world-atlas/countries-110m.json'
import { useTimezones } from '../../app/TimezoneProvider'
import { locationForCountryName } from '../../data/catalog'
import { countryNamesForOffset, countryNamesSharingOffset, formatClock } from '../../lib/timezone'

interface MapPosition {
  coordinates: [number, number]
  zoom: number
}

interface MapTransform {
  x: number
  zoom: number
}

interface MapSize {
  width: number
  height: number
}

const FALLBACK_SIZE: MapSize = { width: 800, height: 410 }
const BAND_COUNT = 25
// Decorative band lines drawn beyond ±12 so the grid reaches the panel edges.
const EXTRA_BAND_LINES = 12
// The UTC band grid is stylized: 25 bands span about 1.17× the projected world width.
const BAND_WIDTH_PER_SCALE = 32 / 126
const WORLD_WIDTH_FILL = 0.85
const WORLD_HEIGHT_FILL = 0.9
const MARKER_SCALE = 1.3
const INITIAL_POSITION: MapPosition = { coordinates: [8, 10], zoom: 1.2 }
const unitProjection = geoEqualEarth().scale(1).translate([0, 0])
const UNIT_WORLD_WIDTH = 2 * (unitProjection([180, 0])?.[0] ?? 2.7)
const UNIT_WORLD_HEIGHT = 2 * Math.abs(unitProjection([0, 90])?.[1] ?? 1.3)

function fittedProjection({ width, height }: MapSize): GeoProjection {
  const scale = Math.min(width * WORLD_WIDTH_FILL / UNIT_WORLD_WIDTH, height * WORLD_HEIGHT_FILL / UNIT_WORLD_HEIGHT)
  return geoEqualEarth().translate([width / 2, height / 2]).scale(scale)
}

function transformForPosition({ coordinates, zoom }: MapPosition, projection: GeoProjection, width: number): MapTransform {
  const [projectedX] = projection(coordinates) ?? [width / 2, 0]
  return { x: width / 2 - projectedX * zoom, zoom }
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState<MapSize>(FALLBACK_SIZE)
  useLayoutEffect(() => {
    const element = ref.current
    if (!element || typeof ResizeObserver === 'undefined') return
    const update = (width: number, height: number) => {
      if (width < 1 || height < 1) return
      setSize((current) => current.width === width && current.height === height ? current : { width, height })
    }
    const observer = new ResizeObserver(([entry]) => update(Math.round(entry.contentRect.width), Math.round(entry.contentRect.height)))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return [ref, size] as const
}

export function WorldMap({ now }: { now: number }) {
  const { active, inspectedOffset, mapCountrySelected, timeFormat, clearMapSelection, selectLocation, selectOffset } = useTimezones()
  const [canvasRef, size] = useElementSize<HTMLDivElement>()
  const { width, height } = size
  const sizeKey = `${width}x${height}`
  const projection = useMemo(() => fittedProjection(size), [size])
  const bandWidth = projection.scale() * BAND_WIDTH_PER_SCALE
  const bandStart = width / 2 - BAND_COUNT / 2 * bandWidth
  const [position, setPosition] = useState<MapPosition>(INITIAL_POSITION)
  // Live pan/zoom from the zoom group; falls back to the committed position after a resize remounts it.
  const [liveTransform, setLiveTransform] = useState<(MapTransform & { sizeKey: string }) | null>(null)
  const mapTransform = liveTransform?.sizeKey === sizeKey ? liveTransform : transformForPosition(position, projection, width)
  const activeTime = formatClock(now, active.timezone, timeFormat)
  const markerWidth = Math.max(96, active.country.length * 6.4 + 30, active.city.length * 5.3 + 30, activeTime.length * 5.3 + 30)
  const relatedCountries = useMemo(
    () => inspectedOffset === null
      ? countryNamesSharingOffset(active.timezone, now)
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
    setLiveTransform(null)
  }

  return (
    <section id="map" className="map-panel" aria-label="Interactive world timezone map">
      <div className="timezone-bands" aria-label="Select a UTC offset">
        {Array.from({ length: BAND_COUNT }, (_, index) => {
          const offset = index - 12
          const label = offset === 0 ? 'UTC' : `UTC${offset > 0 ? '+' : '−'}${Math.abs(offset)}`
          const left = (mapTransform.x + (bandStart + index * bandWidth) * mapTransform.zoom) / width * 100
          const bandPercent = bandWidth * mapTransform.zoom / width * 100
          return <button style={{ left: `${left}%`, width: `${bandPercent}%` }} className={inspectedOffset === offset ? 'active' : ''} key={index} onClick={() => selectOffset(offset)} aria-label={`Select ${label}`}>{offset === 0 ? 'UTC' : offset > 0 ? `+${offset}` : offset}</button>
        })}
      </div>
      <div className="map-canvas" ref={canvasRef}>
        <svg className="band-lines" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
          <g className="band-transform" transform={`translate(${mapTransform.x} 0) scale(${mapTransform.zoom} 1)`}>
            {Array.from({ length: BAND_COUNT + EXTRA_BAND_LINES * 2 }, (_, line) => {
              const index = line - EXTRA_BAND_LINES
              return <rect key={index} x={bandStart + index * bandWidth} width={bandWidth} height={height} />
            })}
          </g>
        </svg>
        <ComposableMap
          width={width}
          height={height}
          projection={projection}
          role="img"
          aria-label="World map. Select a country to inspect its timezone."
        >
          <ZoomableGroup
            key={sizeKey}
            center={position.coordinates}
            zoom={position.zoom}
            minZoom={1}
            maxZoom={4}
            onMove={({ x, zoom }) => {
              if (x !== undefined && zoom !== undefined) setLiveTransform({ x, zoom, sizeKey })
            }}
            onMoveEnd={({ coordinates, zoom }) => setPosition({ coordinates: coordinates as [number, number], zoom: zoom ?? position.zoom })}
          >
            <rect className="map-background" x={-width * 4} y={-height * 4} width={width * 9} height={height * 9} fill="transparent" onClick={clearMapSelection} />
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
                    <g className="active-marker" transform={`scale(${MARKER_SCALE / mapTransform.zoom})`}>
                      <rect x={9} y={-27} width={markerWidth} height={54} rx={4} />
                      <text className="marker-country" x={23} y={-10}>{active.country}</text>
                      <text className="marker-city" x={23} y={3}>{active.city}</text>
                      <text className="marker-time" x={23} y={17}>{activeTime}</text>
                      <circle cx={16} cy={-7} r={3} className="marker-dot" />
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
