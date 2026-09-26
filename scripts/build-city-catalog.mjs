// Regenerate with: node scripts/build-city-catalog.mjs /path/to/cities15000.zip
// Source: GeoNames cities15000, CC BY 4.0 (https://download.geonames.org/export/dump/).
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { getCountry, getTimezone } from 'countries-and-timezones'

const source = process.argv[2]
if (!source) throw new Error('Pass the GeoNames cities15000.zip path.')

const rows = execFileSync('unzip', ['-p', source, 'cities15000.txt'], { maxBuffer: 64 * 1024 * 1024 })
  .toString('utf8')
  .trimEnd()
  .split('\n')
  .map((line) => {
    const fields = line.split('\t')
    const countryCode = fields[8]
    const zone = getTimezone(fields[17])
    if (!getCountry(countryCode) || !zone) return null
    return {
      id: Number(fields[0]),
      name: countryCode === 'ES' && fields[1] === 'Sevilla' ? 'Seville' : fields[1],
      countryCode,
      timezone: zone.aliasOf ?? zone.name,
      latitude: Number(fields[4]),
      longitude: Number(fields[5]),
      feature: fields[7],
      population: Number(fields[14]),
    }
  })
  .filter((row) => row && row.name && Number.isFinite(row.population))

const byPopulation = (a, b) => b.population - a.population || a.id - b.id
const selected = new Map()
const counts = new Map()
const keys = new Set()
const add = (row) => {
  const key = `${row.countryCode}:${row.name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()}`
  if (keys.has(key) || (counts.get(row.countryCode) ?? 0) >= 40) return
  keys.add(key)
  selected.set(row.id, row)
  counts.set(row.countryCode, (counts.get(row.countryCode) ?? 0) + 1)
}

// Cover national capitals, then prominent administrative seats, then population centres.
for (const row of rows.filter((row) => row.feature === 'PPLC').sort(byPopulation)) add(row)
const countryCodes = [...new Set(rows.map((row) => row.countryCode))].sort()
for (const countryCode of countryCodes) {
  for (const row of rows.filter((candidate) => candidate.countryCode === countryCode && candidate.feature === 'PPLA').sort(byPopulation).slice(0, 1)) add(row)
  const largest = rows.filter((candidate) => candidate.countryCode === countryCode).sort(byPopulation)
  for (const row of largest.slice(0, largest[0]?.population >= 1_000_000 ? 6 : 1)) add(row)
}
for (const row of [...rows].sort(byPopulation)) {
  if (selected.size >= 950) break
  add(row)
}

const cities = [...selected.values()]
  .sort((a, b) => a.countryCode.localeCompare(b.countryCode) || byPopulation(a, b))
  .map(({ id, name, countryCode, timezone, latitude, longitude, population }) => [id, name, countryCode, timezone, latitude, longitude, population])
writeFileSync(new URL('../src/data/generated-cities.json', import.meta.url), `${JSON.stringify(cities)}\n`)
console.log(`Wrote ${cities.length} GeoNames cities across ${countryCodes.length} countries.`)
