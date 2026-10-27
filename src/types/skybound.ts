export type DistanceUnit = 'km' | 'mi';
export type CabinClass = 'Economy' | 'Premium Economy' | 'Business' | 'First';
export type FlightStatus = 'Completed' | 'Upcoming';
export type BadgeTier = 'Bronze' | 'Silver' | 'Gold';

export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
  countryCode: string; // ISO-2 e.g. 'JP', 'IS', 'PT'
  continent: 'North America' | 'South America' | 'Europe' | 'Asia' | 'Africa' | 'Oceania';
  lat: number;
  lon: number;
}

export interface FlightPhoto {
  id: string;
  url: string;
  caption: string;
  location: string;
  takenAt: string;
}

export interface FlightJourney {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  origin: Airport;
  destination: Airport;
  date: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  arrivalTime: string; // HH:mm
  distanceKm: number;
  durationMinutes: number;
  aircraft: string;
  cabin: CabinClass;
  seat: string;
  terminal: string;
  gate: string;
  pnr: string;
  status: FlightStatus;
  notes: string;
  photos: FlightPhoto[];
}

export interface CountryBadge {
  countryCode: string;
  country: string;
  continent: string;
  unlocked: boolean;
  visitCount: number;
  tier: BadgeTier;
  firstVisitedDate?: string;
  lastVisitedDate?: string;
  citiesVisited: string[];
  totalDistanceKm: number;
  flightIds: string[];
  badgeTitle: string;
  accentColor: string;
  emblemType: 'mountain' | 'temple' | 'compass' | 'wave' | 'aurora' | 'sun' | 'crown' | 'star';
}

export interface RegionalCollection {
  id: string;
  title: string;
  subtitle: string;
  requiredCountries: { code: string; name: string }[];
  unlockedCount: number;
  completed: boolean;
}

export interface AviationMilestone {
  id: string;
  title: string;
  description: string;
  category: 'Distance' | 'Duration' | 'Geography' | 'Aircraft' | 'Memories';
  currentValue: number;
  targetValue: number;
  unit: string;
  unlocked: boolean;
  unlockedDate?: string;
  accent: string;
  iconName: 'globe' | 'moon' | 'clock' | 'compass' | 'zap' | 'plane' | 'award' | 'camera';
}

export interface ItineraryActivity {
  id: string;
  day: number;
  time: string;
  title: string;
  location: string;
  category: 'Flight' | 'Stay' | 'Dining' | 'Explore' | 'Transit';
  notes: string;
  completed: boolean;
  photoUrl?: string;
}

export interface TripItinerary {
  id: string;
  title: string;
  destinationCity: string;
  country: string;
  countryCode: string;
  startDate: string;
  endDate: string;
  coverUrl: string;
  linkedFlightId?: string;
  activities: ItineraryActivity[];
}

export interface DestinationGuide {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  tagline: string;
  coverUrl: string;
  bestSeason: string;
  airportTransit: string;
  currency: string;
  highlights: { title: string; category: string; detail: string; photoUrl?: string }[];
  localTip: string;
  bookmarked: boolean;
}

export interface SocialComment {
  id: string;
  authorName: string;
  authorHandle: string;
  text: string;
  timestamp: string;
}

export interface SocialPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorRole: string;
  authorAvatarUrl?: string;
  authorCountriesCount: number;
  originIata: string;
  destinationIata: string;
  originCity: string;
  destinationCity: string;
  countryUnlocked?: string;
  countryCode?: string;
  badgeEarned?: string;
  flightNumber: string;
  airline: string;
  distanceKm: number;
  durationMinutes: number;
  aircraft: string;
  caption: string;
  photos: FlightPhoto[];
  likes: number;
  likedByMe: boolean;
  bookmarkedByMe: boolean;
  timestamp: string;
  comments: SocialComment[];
}

export type PassportCardThemeId = 'midnight' | 'stratosphere' | 'gold' | 'aurora';
