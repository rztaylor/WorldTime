import { describe, expect, it } from 'vitest'
import { searchLocations } from './search'

describe('searchLocations', () => {
  it('finds a major city', () => {
    expect(searchLocations('Tokyo')[0]?.location.timezone).toBe('Asia/Tokyo')
  })

  it('finds a country and an IANA timezone', () => {
    expect(searchLocations('Japan').some((result) => result.location.city === 'Tokyo')).toBe(true)
    expect(searchLocations('America/New_York').some((result) => result.location.city === 'New York')).toBe(true)
  })

  it('searches the complete country and timezone catalog', () => {
    expect(searchLocations('Peru').some((result) => result.location.timezone === 'America/Lima')).toBe(true)
    expect(searchLocations('Pacific/Chatham').some((result) => result.location.timezone === 'Pacific/Chatham')).toBe(true)
  })

  it('supports common timezone abbreviations', () => {
    expect(searchLocations('JST').some((result) => result.location.city === 'Tokyo')).toBe(true)
  })
})
