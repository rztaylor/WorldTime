import { useEffect, useMemo, useRef, useState } from 'react'
import { Clock3, MapPin, Search } from 'lucide-react'
import { searchLocations } from '../../lib/search'
import { useTimezones } from '../../app/TimezoneProvider'

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { selectLocation } = useTimezones()
  const results = useMemo(() => searchLocations(searchQuery), [searchQuery])
  const searching = query.trim() !== searchQuery.trim()

  useEffect(() => () => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
  }, [])

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])

  const choose = (index: number, matches = results) => {
    const result = matches[index]
    if (!result) return
    selectLocation(result.location)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    setQuery('')
    setSearchQuery('')
    setOpen(false)
  }

  return (
    <div className="search-wrap">
      <Search className="search-icon" aria-hidden="true" />
      <input
        id="global-search"
        ref={inputRef}
        type="search"
        role="combobox"
        aria-label="Search cities, countries, or timezones"
        aria-expanded={open && !searching && results.length > 0}
        aria-controls="search-results"
        aria-activedescendant={open && !searching && results[highlighted] ? `result-${highlighted}` : undefined}
        placeholder="Search a country, city or timezone…"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          const value = event.target.value
          if (searchTimer.current) clearTimeout(searchTimer.current)
          setQuery(value)
          setHighlighted(0)
          setOpen(true)
          if (!value.trim()) setSearchQuery('')
          else searchTimer.current = setTimeout(() => setSearchQuery(value), 180)
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !searching) { event.preventDefault(); setHighlighted((value) => Math.min(value + 1, results.length - 1)) }
          if (event.key === 'ArrowUp' && !searching) { event.preventDefault(); setHighlighted((value) => Math.max(value - 1, 0)) }
          if (event.key === 'Enter') { event.preventDefault(); choose(highlighted, searching ? searchLocations(query) : results) }
        }}
      />
      <kbd>⌘ K</kbd>
      {open && query.trim() && (
        <div id="search-results" role="listbox" className="search-results">
          {searching ? <p role="status">Searching…</p> : results.length ? results.map((result, index) => (
            <button
              id={`result-${index}`}
              role="option"
              aria-label={`${result.location.kind === 'timezone' ? 'Timezone' : result.group}: ${result.location.city}, ${result.detail}`}
              aria-selected={highlighted === index}
              className={highlighted === index ? 'highlighted' : ''}
              key={`${result.group}-${result.location.id}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              <span className="search-result-name">
                {result.location.kind === 'timezone' ? <Clock3 aria-hidden="true" /> : <MapPin aria-hidden="true" />}
                <span><small>{result.location.kind === 'timezone' ? 'Timezone' : result.group}</small><strong>{result.location.city}</strong></span>
              </span>
              <span>{result.detail}</span>
            </button>
          )) : <p>No matching places. Try a major city or IANA timezone.</p>}
        </div>
      )}
    </div>
  )
}
