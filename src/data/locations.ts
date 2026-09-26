import type { CountryRecord, LocationRecord } from '../types/timezone'

export const locations: LocationRecord[] = [
  { id: 'london', city: 'London', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London', latitude: 51.5072, longitude: -0.1276, aliases: ['GMT', 'BST'] },
  { id: 'birmingham', city: 'Birmingham', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London', latitude: 52.48142, longitude: -1.89983 },
  { id: 'manchester', city: 'Manchester', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London', latitude: 53.48095, longitude: -2.23743 },
  { id: 'edinburgh', city: 'Edinburgh', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London', latitude: 55.95206, longitude: -3.19648 },
  { id: 'cardiff', city: 'Cardiff', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London', latitude: 51.48, longitude: -3.18 },
  { id: 'belfast', city: 'Belfast', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London', latitude: 54.59682, longitude: -5.92541 },
  { id: 'glasgow', city: 'Glasgow', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London', latitude: 55.86515, longitude: -4.25763 },
  { id: 'berlin', city: 'Berlin', country: 'Germany', countryCode: 'DE', timezone: 'Europe/Berlin', latitude: 52.52, longitude: 13.405, aliases: ['CET', 'CEST'] },
  { id: 'paris', city: 'Paris', country: 'France', countryCode: 'FR', timezone: 'Europe/Paris', latitude: 48.8566, longitude: 2.3522, aliases: ['CET', 'CEST'] },
  { id: 'marseille', city: 'Marseille', country: 'France', countryCode: 'FR', timezone: 'Europe/Paris', latitude: 43.29695, longitude: 5.38107 },
  { id: 'lyon', city: 'Lyon', country: 'France', countryCode: 'FR', timezone: 'Europe/Paris', latitude: 45.74906, longitude: 4.84789 },
  { id: 'toulouse', city: 'Toulouse', country: 'France', countryCode: 'FR', timezone: 'Europe/Paris', latitude: 43.60426, longitude: 1.44367 },
  { id: 'nice', city: 'Nice', country: 'France', countryCode: 'FR', timezone: 'Europe/Paris', latitude: 43.70313, longitude: 7.26608 },
  { id: 'rome', city: 'Rome', country: 'Italy', countryCode: 'IT', timezone: 'Europe/Rome', latitude: 41.9028, longitude: 12.4964, aliases: ['CET', 'CEST'] },
  { id: 'madrid', city: 'Madrid', country: 'Spain', countryCode: 'ES', timezone: 'Europe/Madrid', latitude: 40.4168, longitude: -3.7038, aliases: ['CET', 'CEST'] },
  { id: 'barcelona', city: 'Barcelona', country: 'Spain', countryCode: 'ES', timezone: 'Europe/Madrid', latitude: 41.38879, longitude: 2.15899 },
  { id: 'valencia', city: 'Valencia', country: 'Spain', countryCode: 'ES', timezone: 'Europe/Madrid', latitude: 39.47391, longitude: -0.37966 },
  { id: 'seville', city: 'Seville', country: 'Spain', countryCode: 'ES', timezone: 'Europe/Madrid', latitude: 37.38283, longitude: -5.97317 },
  { id: 'bilbao', city: 'Bilbao', country: 'Spain', countryCode: 'ES', timezone: 'Europe/Madrid', latitude: 43.26271, longitude: -2.92528 },
  { id: 'lisbon', city: 'Lisbon', country: 'Portugal', countryCode: 'PT', timezone: 'Europe/Lisbon', latitude: 38.7223, longitude: -9.1393, aliases: ['WET', 'WEST'] },
  { id: 'new-york', city: 'New York', country: 'United States of America', countryCode: 'US', timezone: 'America/New_York', latitude: 40.7128, longitude: -74.006, aliases: ['EST', 'EDT'] },
  { id: 'chicago', city: 'Chicago', country: 'United States of America', countryCode: 'US', timezone: 'America/Chicago', latitude: 41.8781, longitude: -87.6298, aliases: ['CST', 'CDT'] },
  { id: 'denver', city: 'Denver', country: 'United States of America', countryCode: 'US', timezone: 'America/Denver', latitude: 39.7392, longitude: -104.9903, aliases: ['MST', 'MDT'] },
  { id: 'los-angeles', city: 'Los Angeles', country: 'United States of America', countryCode: 'US', timezone: 'America/Los_Angeles', latitude: 34.0522, longitude: -118.2437, aliases: ['PST', 'PDT'] },
  { id: 'honolulu', city: 'Honolulu', country: 'United States of America', countryCode: 'US', timezone: 'Pacific/Honolulu', latitude: 21.3069, longitude: -157.8583, aliases: ['HST'] },
  { id: 'toronto', city: 'Toronto', country: 'Canada', countryCode: 'CA', timezone: 'America/Toronto', latitude: 43.6532, longitude: -79.3832, aliases: ['EST', 'EDT'] },
  { id: 'vancouver', city: 'Vancouver', country: 'Canada', countryCode: 'CA', timezone: 'America/Vancouver', latitude: 49.2827, longitude: -123.1207, aliases: ['PST', 'PDT'] },
  { id: 'mexico-city', city: 'Mexico City', country: 'Mexico', countryCode: 'MX', timezone: 'America/Mexico_City', latitude: 19.4326, longitude: -99.1332 },
  { id: 'sao-paulo', city: 'São Paulo', country: 'Brazil', countryCode: 'BR', timezone: 'America/Sao_Paulo', latitude: -23.5505, longitude: -46.6333 },
  { id: 'buenos-aires', city: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', timezone: 'America/Argentina/Buenos_Aires', latitude: -34.6037, longitude: -58.3816 },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', countryCode: 'JP', timezone: 'Asia/Tokyo', latitude: 35.6762, longitude: 139.6503, aliases: ['JST'] },
  { id: 'seoul', city: 'Seoul', country: 'South Korea', countryCode: 'KR', timezone: 'Asia/Seoul', latitude: 37.5665, longitude: 126.978, aliases: ['KST'] },
  { id: 'beijing', city: 'Beijing', country: 'China', countryCode: 'CN', timezone: 'Asia/Shanghai', latitude: 39.9042, longitude: 116.4074, aliases: ['CST'] },
  { id: 'hong-kong', city: 'Hong Kong', country: 'China', countryCode: 'CN', timezone: 'Asia/Hong_Kong', latitude: 22.3193, longitude: 114.1694, aliases: ['HKT'] },
  { id: 'singapore', city: 'Singapore', country: 'Singapore', countryCode: 'SG', timezone: 'Asia/Singapore', latitude: 1.3521, longitude: 103.8198, aliases: ['SGT'] },
  { id: 'delhi', city: 'Delhi', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', latitude: 28.6139, longitude: 77.209, aliases: ['IST'] },
  { id: 'dubai', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', timezone: 'Asia/Dubai', latitude: 25.2048, longitude: 55.2708, aliases: ['GST'] },
  { id: 'moscow', city: 'Moscow', country: 'Russia', countryCode: 'RU', timezone: 'Europe/Moscow', latitude: 55.7558, longitude: 37.6173, aliases: ['MSK'] },
  { id: 'istanbul', city: 'Istanbul', country: 'Türkiye', countryCode: 'TR', timezone: 'Europe/Istanbul', latitude: 41.0082, longitude: 28.9784 },
  { id: 'cairo', city: 'Cairo', country: 'Egypt', countryCode: 'EG', timezone: 'Africa/Cairo', latitude: 30.0444, longitude: 31.2357 },
  { id: 'johannesburg', city: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', timezone: 'Africa/Johannesburg', latitude: -26.2041, longitude: 28.0473, aliases: ['SAST'] },
  { id: 'nairobi', city: 'Nairobi', country: 'Kenya', countryCode: 'KE', timezone: 'Africa/Nairobi', latitude: -1.2921, longitude: 36.8219, aliases: ['EAT'] },
  { id: 'sydney', city: 'Sydney', country: 'Australia', countryCode: 'AU', timezone: 'Australia/Sydney', latitude: -33.8688, longitude: 151.2093, aliases: ['AEST', 'AEDT'] },
  { id: 'perth', city: 'Perth', country: 'Australia', countryCode: 'AU', timezone: 'Australia/Perth', latitude: -31.9523, longitude: 115.8613, aliases: ['AWST'] },
  { id: 'auckland', city: 'Auckland', country: 'New Zealand', countryCode: 'NZ', timezone: 'Pacific/Auckland', latitude: -36.8509, longitude: 174.7645, aliases: ['NZST', 'NZDT'] },
]

const countryNames: Record<string, string> = {
  US: 'United States of America', GB: 'United Kingdom', DE: 'Germany', FR: 'France', IT: 'Italy', ES: 'Spain', PT: 'Portugal', CA: 'Canada', MX: 'Mexico', BR: 'Brazil', AR: 'Argentina', JP: 'Japan', KR: 'South Korea', CN: 'China', SG: 'Singapore', IN: 'India', AE: 'United Arab Emirates', RU: 'Russia', TR: 'Türkiye', EG: 'Egypt', ZA: 'South Africa', KE: 'Kenya', AU: 'Australia', NZ: 'New Zealand',
}

export const countries: CountryRecord[] = Object.entries(
  locations.reduce<Record<string, LocationRecord[]>>((groups, location) => {
    ;(groups[location.countryCode] ??= []).push(location)
    return groups
  }, {}),
).map(([code, records]) => ({
  code,
  name: countryNames[code] ?? records[0].country,
  timezones: [...new Set(records.map((record) => record.timezone))],
  majorCityIds: records.map((record) => record.id),
}))

export const locationByTimezone = (timezone: string) =>
  locations.find((location) => location.timezone === timezone)

export const locationsForCountry = (countryName: string) =>
  locations.filter((location) => location.country === countryName)
