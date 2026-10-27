import { Airport } from '../types/skybound';
import { ALL_WORLD_COUNTRIES } from './allCountries';

// Core major international airports + automatic airport entry for every single one of the 195 countries
const CORE_AIRPORTS: Airport[] = [
  { iata: 'JFK', name: 'John F. Kennedy Intl', city: 'New York', country: 'United States', countryCode: 'US', continent: 'North America', lat: 40.6413, lon: -73.7781 },
  { iata: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', country: 'United States', countryCode: 'US', continent: 'North America', lat: 37.6213, lon: -122.3790 },
  { iata: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'United States', countryCode: 'US', continent: 'North America', lat: 33.9416, lon: -118.4085 },
  { iata: 'LHR', name: 'London Heathrow', city: 'London', country: 'United Kingdom', countryCode: 'GB', continent: 'Europe', lat: 51.4700, lon: -0.4543 },
  { iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', countryCode: 'FR', continent: 'Europe', lat: 49.0097, lon: 2.5479 },
  { iata: 'LIS', name: 'Humberto Delgado', city: 'Lisbon', country: 'Portugal', countryCode: 'PT', continent: 'Europe', lat: 38.7756, lon: -9.1354 },
  { iata: 'KEF', name: 'Keflavík Intl', city: 'Reykjavik', country: 'Iceland', countryCode: 'IS', continent: 'Europe', lat: 63.9850, lon: -22.6056 },
  { iata: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', countryCode: 'CH', continent: 'Europe', lat: 47.4582, lon: 8.5555 },
  { iata: 'FCO', name: 'Leonardo da Vinci–Fiumicino', city: 'Rome', country: 'Italy', countryCode: 'IT', continent: 'Europe', lat: 41.8003, lon: 12.2389 },
  { iata: 'ATH', name: 'Athens Intl', city: 'Athens', country: 'Greece', countryCode: 'GR', continent: 'Europe', lat: 37.9364, lon: 23.9445 },
  { iata: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan', countryCode: 'JP', continent: 'Asia', lat: 35.5494, lon: 139.7798 },
  { iata: 'KIX', name: 'Kansai Intl', city: 'Osaka / Kyoto', country: 'Japan', countryCode: 'JP', continent: 'Asia', lat: 34.4320, lon: 135.2304 },
  { iata: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', countryCode: 'SG', continent: 'Asia', lat: 1.3644, lon: 103.9915 },
  { iata: 'ZQN', name: 'Queenstown Airport', city: 'Queenstown', country: 'New Zealand', countryCode: 'NZ', continent: 'Oceania', lat: -45.0211, lon: 168.7392 },
];

// Merge core hubs with every country in ALL_WORLD_COUNTRIES so all 195 countries are available for flights & stamps
const existingCodes = new Set(CORE_AIRPORTS.map((a) => a.iata));
const COUNTRY_AIRPORTS: Airport[] = ALL_WORLD_COUNTRIES.filter(
  (c) => !existingCodes.has(c.defaultIata)
).map((c) => ({
  iata: c.defaultIata,
  name: `${c.capital} International`,
  city: c.capital,
  country: c.name,
  countryCode: c.code,
  continent: c.continent,
  lat: c.lat,
  lon: c.lon,
}));

export const AIRPORTS: Airport[] = [...CORE_AIRPORTS, ...COUNTRY_AIRPORTS].sort((a, b) =>
  a.country.localeCompare(b.country)
);

// Haversine Great-Circle Distance Calculator
export function calculateGreatCircleKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(120, Math.round(R * c));
}

export function estimateFlightMinutes(distanceKm: number): number {
  const cruiseSpeedKmh = 835;
  const taxiAndClimbMinutes = 35;
  return Math.max(55, Math.round((distanceKm / cruiseSpeedKmh) * 60 + taxiAndClimbMinutes));
}

export function formatDistance(km: number, unit: 'km' | 'mi'): string {
  if (unit === 'mi') {
    return `${Math.round(km * 0.621371).toLocaleString()} mi`;
  }
  return `${Math.round(km).toLocaleString()} km`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}
