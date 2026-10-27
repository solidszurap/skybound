import {
  AviationMilestone,
  CountryBadge,
  DestinationGuide,
  FlightJourney,
  RegionalCollection,
  SocialPost,
  TripItinerary,
} from '../types/skybound';
import { TRAVEL_ARTWORK } from './travelArtwork';
import { ALL_WORLD_COUNTRIES } from './allCountries';

// Factory reset initial state: 0 flights, 0 countries visited, 0 personal itineraries
export const INITIAL_FLIGHTS: FlightJourney[] = [];

export const INITIAL_ITINERARIES: TripItinerary[] = [];

export function computeBadgesAndMilestones(
  flights: FlightJourney[],
  manualVisitedCodes: string[] = []
): {
  countryBadges: CountryBadge[];
  regionalCollections: RegionalCollection[];
  milestones: AviationMilestone[];
} {
  const countryMap = new Map<
    string,
    {
      countryCode: string;
      country: string;
      continent: string;
      visitCount: number;
      firstDate: string;
      lastDate: string;
      cities: Set<string>;
      distanceKm: number;
      flightIds: Set<string>;
    }
  >();

  const registerTouchdown = (
    code: string,
    country: string,
    continent: string,
    city: string,
    date: string,
    distanceKm: number,
    flightId: string
  ) => {
    const existing = countryMap.get(code);
    if (!existing) {
      countryMap.set(code, {
        countryCode: code,
        country,
        continent,
        visitCount: 1,
        firstDate: date,
        lastDate: date,
        cities: new Set([city]),
        distanceKm,
        flightIds: new Set(flightId ? [flightId] : []),
      });
    } else {
      existing.visitCount += 1;
      if (date < existing.firstDate) existing.firstDate = date;
      if (date > existing.lastDate) existing.lastDate = date;
      existing.cities.add(city);
      existing.distanceKm += distanceKm;
      if (flightId) existing.flightIds.add(flightId);
    }
  };

  flights.forEach((f) => {
    registerTouchdown(
      f.origin.countryCode,
      f.origin.country,
      f.origin.continent,
      f.origin.city,
      f.date,
      Math.round(f.distanceKm * 0.5),
      f.id
    );
    registerTouchdown(
      f.destination.countryCode,
      f.destination.country,
      f.destination.continent,
      f.destination.city,
      f.date,
      f.distanceKm,
      f.id
    );
  });

  manualVisitedCodes.forEach((code) => {
    if (!countryMap.has(code)) {
      const info = ALL_WORLD_COUNTRIES.find((c) => c.code === code);
      if (info) {
        registerTouchdown(
          info.code,
          info.name,
          info.continent,
          info.capital,
          '2026-10-27',
          0,
          ''
        );
      }
    }
  });

  const countryBadges: CountryBadge[] = ALL_WORLD_COUNTRIES.map((worldCountry) => {
    const visited = countryMap.get(worldCountry.code);
    const count = visited ? visited.visitCount : 0;
    const tier = count >= 4 ? 'Gold' : count >= 2 ? 'Silver' : 'Bronze';

    return {
      countryCode: worldCountry.code,
      country: worldCountry.name,
      continent: worldCountry.continent,
      unlocked: Boolean(visited),
      visitCount: count,
      tier,
      firstVisitedDate: visited?.firstDate,
      lastVisitedDate: visited?.lastDate,
      citiesVisited: visited ? Array.from(visited.cities) : [worldCountry.capital],
      totalDistanceKm: visited ? visited.distanceKm : 0,
      flightIds: visited ? Array.from(visited.flightIds) : [],
      badgeTitle: `${worldCountry.name} Passport Stamp`,
      accentColor:
        worldCountry.flagColors[0] === '#FFFFFF'
          ? worldCountry.flagColors[1]
          : worldCountry.flagColors[0],
      emblemType: 'compass',
    };
  }).sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    if (b.visitCount !== a.visitCount) return b.visitCount - a.visitCount;
    return a.country.localeCompare(b.country);
  });

  const rawCollections: Omit<RegionalCollection, 'unlockedCount' | 'completed'>[] = [
    {
      id: 'col-europe',
      title: 'European Grand Tour',
      subtitle: 'Touch down across Western, Alpine & Mediterranean Europe',
      requiredCountries: [
        { code: 'FR', name: 'France' },
        { code: 'IT', name: 'Italy' },
        { code: 'ES', name: 'Spain' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'CH', name: 'Switzerland' },
        { code: 'PT', name: 'Portugal' },
      ],
    },
    {
      id: 'col-asia-pacific',
      title: 'Asia-Pacific Horizons',
      subtitle: 'Connect major aviation hubs across East & Southeast Asia',
      requiredCountries: [
        { code: 'JP', name: 'Japan' },
        { code: 'KR', name: 'South Korea' },
        { code: 'SG', name: 'Singapore' },
        { code: 'TH', name: 'Thailand' },
        { code: 'AU', name: 'Australia' },
      ],
    },
    {
      id: 'col-americas',
      title: 'Pan-American Meridian',
      subtitle: 'Journey across North, Central, and South America',
      requiredCountries: [
        { code: 'US', name: 'United States' },
        { code: 'CA', name: 'Canada' },
        { code: 'MX', name: 'Mexico' },
        { code: 'BR', name: 'Brazil' },
        { code: 'PE', name: 'Peru' },
      ],
    },
  ];

  const regionalCollections: RegionalCollection[] = rawCollections.map((col) => {
    const unlockedCount = col.requiredCountries.filter((c) => countryMap.has(c.code)).length;
    return {
      ...col,
      unlockedCount,
      completed: unlockedCount === col.requiredCountries.length,
    };
  });

  const totalDistanceKm = flights.reduce((sum, f) => sum + f.distanceKm, 0);
  const totalHours = Math.round(flights.reduce((sum, f) => sum + f.durationMinutes, 0) / 60);
  const unlockedCountriesCount = countryMap.size;
  const continentsSet = new Set(Array.from(countryMap.values()).map((c) => c.continent));
  const longestFlightKm = flights.reduce((max, f) => Math.max(max, f.distanceKm), 0);
  const totalPhotos = flights.reduce((sum, f) => sum + f.photos.length, 0);

  const widebodyTypes = new Set<string>();
  flights.forEach((f) => {
    if (f.aircraft.includes('777')) widebodyTypes.add('B777');
    if (f.aircraft.includes('787')) widebodyTypes.add('B787');
    if (f.aircraft.includes('350')) widebodyTypes.add('A350');
  });

  const milestones: AviationMilestone[] = [
    {
      id: 'ms-first-wing',
      title: 'First Horizon Logged',
      description: 'Log your first flight journey and unlock your first Country Flag Badge.',
      category: 'Geography',
      currentValue: flights.length,
      targetValue: 1,
      unit: 'flight',
      unlocked: flights.length >= 1,
      accent: '#0284C7',
      iconName: 'plane',
    },
    {
      id: 'ms-ten-nations',
      title: 'Decade of Nations',
      description: 'Unlock 10 country flag badges in your Skybound Explorer Passport.',
      category: 'Geography',
      currentValue: unlockedCountriesCount,
      targetValue: 10,
      unit: 'countries',
      unlocked: unlockedCountriesCount >= 10,
      accent: '#EA580C',
      iconName: 'award',
    },
    {
      id: 'ms-earth-orbit',
      title: 'Earth Circumnavigator',
      description: 'Fly 40,075 km — the full equatorial circumference of Earth.',
      category: 'Distance',
      currentValue: totalDistanceKm,
      targetValue: 40075,
      unit: 'km',
      unlocked: totalDistanceKm >= 40075,
      accent: '#0284C7',
      iconName: 'globe',
    },
    {
      id: 'ms-ultra-longhaul',
      title: 'Ultra Long-Haul Wing',
      description: 'Complete a single non-stop transoceanic flight exceeding 10,000 km.',
      category: 'Distance',
      currentValue: longestFlightKm,
      targetValue: 10000,
      unit: 'km',
      unlocked: longestFlightKm >= 10000,
      accent: '#D97706',
      iconName: 'zap',
    },
    {
      id: 'ms-widebody-trio',
      title: 'Widebody Connoisseur',
      description: 'Fly aboard the modern heavy trio: Airbus A350, Boeing 787, and Boeing 777.',
      category: 'Aircraft',
      currentValue: widebodyTypes.size,
      targetValue: 3,
      unit: 'jets',
      unlocked: widebodyTypes.size >= 3,
      accent: '#059669',
      iconName: 'plane',
    },
    {
      id: 'ms-four-continents',
      title: 'Four Continents Club',
      description: 'Log touchdowns across at least 4 distinct continents.',
      category: 'Geography',
      currentValue: continentsSet.size,
      targetValue: 4,
      unit: 'continents',
      unlocked: continentsSet.size >= 4,
      accent: '#7C3AED',
      iconName: 'compass',
    },
    {
      id: 'ms-century-hours',
      title: 'Century in the Stratosphere',
      description: 'Accumulate 100 total hours airborne across your flight log.',
      category: 'Duration',
      currentValue: totalHours,
      targetValue: 100,
      unit: 'hrs',
      unlocked: totalHours >= 100,
      accent: '#DB2777',
      iconName: 'clock',
    },
    {
      id: 'ms-visual-chronicler',
      title: 'Visual Sky Chronicler',
      description: 'Attach 8 or more personal journey photos to your logged flights.',
      category: 'Memories',
      currentValue: totalPhotos,
      targetValue: 8,
      unit: 'photos',
      unlocked: totalPhotos >= 8,
      accent: '#0D9488',
      iconName: 'camera',
    },
  ];

  return { countryBadges, regionalCollections, milestones };
}

// 24 Curated Popular World City Destination Guides with Matched Photography
export const INITIAL_GUIDES: DestinationGuide[] = [
  {
    id: 'gd-tokyo',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    tagline: 'Precision rail, neon-lit Shinjuku alleys, and serene Meiji cedar shrines.',
    coverUrl: TRAVEL_ARTWORK.tokyo_twilight,
    bestSeason: 'Mar–May & Oct–Nov',
    airportTransit: 'Tokyo Monorail from HND Terminal 3 reaches Hamamatsucho in 13 mins (¥500).',
    currency: 'Japanese Yen (¥ / JPY)',
    highlights: [
      {
        title: 'Shibuya Sky & Roppongi Hills',
        category: 'Skyline View',
        detail: 'Open-air 229m rooftop helipad with 360° views toward Tokyo Tower and Mount Fuji at dusk.',
        photoUrl: TRAVEL_ARTWORK.tokyo_twilight,
      },
      {
        title: 'Shinjuku Omoide Yokocho & Golden Gai',
        category: 'Nightlife',
        detail: 'Lantern-lit narrow alleys packed with intimate yakitori counters and vinyl listening bars.',
        photoUrl: TRAVEL_ARTWORK.tokyo_neon,
      },
      {
        title: 'Meiji Jingu & Kyoto Shinkansen Day Trip',
        category: 'Heritage',
        detail: 'Forested Shinto sanctuary in Harajuku and high-speed bullet train access to historic torii gates.',
        photoUrl: TRAVEL_ARTWORK.kyoto_torii,
      },
    ],
    localTip: 'Use a digital Suica or Pasmo IC transit card on your phone for instant tap access across every metro gate, vending machine, and konbini.',
    bookmarked: false,
  },
  {
    id: 'gd-paris',
    city: 'Paris',
    country: 'France',
    countryCode: 'FR',
    tagline: 'Haussmann boulevards, golden-hour Seine bridges, and timeless Left Bank bistros.',
    coverUrl: TRAVEL_ARTWORK.paris_sunset,
    bestSeason: 'Apr–Jun & Sep–Nov',
    airportTransit: 'RER B train from CDG Terminal 2 reaches Châtelet–Les Halles in 38 mins (€11.80).',
    currency: 'Euro (€ / EUR)',
    highlights: [
      {
        title: 'Champ de Mars & Pont Alexandre III',
        category: 'Landmark',
        detail: 'Gilded Beaux-Arts bridge framing the Eiffel Tower hourly sparkle along the Seine.',
        photoUrl: TRAVEL_ARTWORK.paris_sunset,
      },
      {
        title: 'Le Marais & Place des Vosges',
        category: 'Neighborhood',
        detail: '17th-century red-brick arcades, specialty patisseries, and hidden courtyard galleries.',
        photoUrl: TRAVEL_ARTWORK.cabin_window,
      },
    ],
    localTip: 'Use the official Île-de-France Mobilités app for contactless Navigo metro and RER tickets.',
    bookmarked: false,
  },
  {
    id: 'gd-nyc',
    city: 'New York City',
    country: 'United States',
    countryCode: 'US',
    tagline: 'Art Deco skyscrapers, Hudson River sunsets, and world-class dining across five boroughs.',
    coverUrl: TRAVEL_ARTWORK.new_york_skyline,
    bestSeason: 'Apr–Jun & Sep–Nov',
    airportTransit: 'JFK AirTrain to Jamaica Station + LIRR reaches Grand Central Madison or Penn Station in 35 mins.',
    currency: 'US Dollar ($ / USD)',
    highlights: [
      {
        title: 'Top of the Rock & Midtown Skyline',
        category: 'Observation',
        detail: 'Unobstructed open-air views of the Empire State Building, One World Trade, and Central Park.',
        photoUrl: TRAVEL_ARTWORK.new_york_skyline,
      },
      {
        title: 'West Village & High Line Park',
        category: 'Neighborhood',
        detail: 'Elevated rail trail gardens leading down to brownstone jazz clubs and Hudson piers.',
        photoUrl: TRAVEL_ARTWORK.wing_sunset,
      },
    ],
    localTip: 'Tap any contactless card or phone at OMNY turnstiles on the NYC Subway—after 12 taps in 7 days, the rest of the week rides free.',
    bookmarked: false,
  },
  {
    id: 'gd-london',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    tagline: 'Royal parks, Thames waterfront icons, and historic West End neighborhoods.',
    coverUrl: TRAVEL_ARTWORK.london_thames,
    bestSeason: 'May–Sep',
    airportTransit: 'Elizabeth Line or Heathrow Express from LHR Terminal 5 reaches Paddington & Bond Street in 15–28 mins.',
    currency: 'British Pound (£ / GBP)',
    highlights: [
      {
        title: 'Westminster, Big Ben & South Bank',
        category: 'Iconic Walk',
        detail: 'Stroll along the River Thames from Westminster Bridge past the London Eye to Tate Modern.',
        photoUrl: TRAVEL_ARTWORK.london_thames,
      },
      {
        title: 'Borough Market & Shoreditch',
        category: 'Culinary',
        detail: 'Victorian railway arches serving artisanal British cheeses, Monmouth coffee, and global street food.',
        photoUrl: TRAVEL_ARTWORK.cabin_window,
      },
    ],
    localTip: 'Request a window seat on the right side (K seats) when landing at Heathrow on westerly operations for a full aerial view of central London.',
    bookmarked: false,
  },
  {
    id: 'gd-rome',
    city: 'Rome',
    country: 'Italy',
    countryCode: 'IT',
    tagline: 'Sunlit travertine piazzas, espresso bars, and two millennia of living history.',
    coverUrl: TRAVEL_ARTWORK.rome_colosseum,
    bestSeason: 'Apr–Jun & Sep–Nov',
    airportTransit: 'Leonardo Express non-stop train connects FCO Airport to Roma Termini in 32 mins (€14).',
    currency: 'Euro (€ / EUR)',
    highlights: [
      {
        title: 'Colosseum & Roman Forum',
        category: 'Antiquity',
        detail: 'Walk the ancient Via Sacra at golden hour as warm sunlight illuminates the Flavian Amphitheatre.',
        photoUrl: TRAVEL_ARTWORK.rome_colosseum,
      },
      {
        title: 'Trastevere & Pantheon Piazzas',
        category: 'Culinary',
        detail: 'Ivy-draped cobblestone lanes, wood-roasted Sant’Eustachio espresso, and classic cacio e pepe.',
        photoUrl: TRAVEL_ARTWORK.lisbon_coast,
      },
    ],
    localTip: 'Tap any contactless card on Rome’s ATAC buses and metro turnstiles—no paper ticket validation needed.',
    bookmarked: false,
  },
  {
    id: 'gd-barcelona',
    city: 'Barcelona',
    country: 'Spain',
    countryCode: 'ES',
    tagline: 'Gaudí modernist masterpieces, Gothic Quarter tapas bars, and Mediterranean beaches.',
    coverUrl: TRAVEL_ARTWORK.barcelona_sagrada,
    bestSeason: 'May–Jun & Sep–Oct',
    airportTransit: 'Aerobús Express runs every 5 mins from BCN Terminals 1 & 2 to Plaça de Catalunya in 35 mins.',
    currency: 'Euro (€ / EUR)',
    highlights: [
      {
        title: 'Basílica de la Sagrada Família & Eixample',
        category: 'Architecture',
        detail: 'Gaudí’s soaring stained-glass forest and octagonal modernist boulevard blocks.',
        photoUrl: TRAVEL_ARTWORK.barcelona_sagrada,
      },
      {
        title: 'El Born & Barceloneta Waterfront',
        category: 'Neighborhood',
        detail: 'Medieval stone alleys, vermuterias, and sunset walks along the Mediterranean boardwalk.',
        photoUrl: TRAVEL_ARTWORK.lisbon_coast,
      },
    ],
    localTip: 'Book late-afternoon tickets to Sagrada Família (around 16:30) when the western sun turns the nave vibrant amber and crimson.',
    bookmarked: false,
  },
  {
    id: 'gd-dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    tagline: 'Futuristic desert towers, Arabian Gulf marinas, and golden dune horizons.',
    coverUrl: TRAVEL_ARTWORK.dubai_skyline,
    bestSeason: 'Nov–Mar',
    airportTransit: 'Dubai Metro Red Line runs directly from DXB Terminals 1 & 3 to Burj Khalifa/Downtown in 24 mins.',
    currency: 'UAE Dirham (AED)',
    highlights: [
      {
        title: 'Burj Khalifa & Downtown Boulevard',
        category: 'Architecture',
        detail: 'Soar to the 148th-floor sky lounge overlooking the choreographed Dubai Fountain lake.',
        photoUrl: TRAVEL_ARTWORK.dubai_skyline,
      },
      {
        title: 'Arabian Desert Conservation Reserve',
        category: 'Expedition',
        detail: 'Sunset dune drive across terracotta sands with stargazing and Bedouin dining.',
        photoUrl: TRAVEL_ARTWORK.dubai_desert,
      },
    ],
    localTip: 'DXB Terminal 3 offers automated Smart Gates—scan your passport once on arrival for 5-second immigration clearance.',
    bookmarked: false,
  },
  {
    id: 'gd-singapore',
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    tagline: 'Biophilic cloud forests, hawker food heritage, and the world’s best airport.',
    coverUrl: TRAVEL_ARTWORK.singapore_gardens,
    bestSeason: 'Year-Round (Feb–Apr driest)',
    airportTransit: 'MRT East-West Line or Grab from Changi (SIN) reaches Marina Bay in 20 mins.',
    currency: 'Singapore Dollar ($ / SGD)',
    highlights: [
      {
        title: 'Gardens by the Bay & Marina Bay Sands',
        category: 'Skyline',
        detail: 'Vertical Supertree gardens, mist-filled Cloud Forest dome, and rooftop infinity views.',
        photoUrl: TRAVEL_ARTWORK.singapore_gardens,
      },
      {
        title: 'Jewel Changi Rain Vortex & Maxwell Food Centre',
        category: 'Culinary & Aviation',
        detail: '40-meter indoor waterfall at the airport and Michelin-recognized Tian Tian Hainanese chicken rice.',
        photoUrl: TRAVEL_ARTWORK.wing_sunset,
      },
    ],
    localTip: 'Check in up to 24 hours early at Jewel Changi Early Check-In Lounge so you can explore the waterfall baggage-free.',
    bookmarked: false,
  },
  {
    id: 'gd-seoul',
    city: 'Seoul',
    country: 'South Korea',
    countryCode: 'KR',
    tagline: 'Joseon Dynasty royal palaces, Bukchon hanok rooftops, and 24-hour night markets.',
    coverUrl: TRAVEL_ARTWORK.seoul_palace,
    bestSeason: 'Apr–May & Sep–Nov',
    airportTransit: 'AREX Express Train from Incheon (ICN) reaches Seoul Station non-stop in 43 mins.',
    currency: 'South Korean Won (₩ / KRW)',
    highlights: [
      {
        title: 'Gyeongbokgung Palace & Bukchon Hanok Village',
        category: 'Heritage',
        detail: 'Royal guard ceremonies framed by Bugaksan mountain and traditional curved-tile alleyways.',
        photoUrl: TRAVEL_ARTWORK.seoul_palace,
      },
      {
        title: 'Seongsu-dong & Hongdae Creative District',
        category: 'Culture',
        detail: 'Converted brick warehouse roasteries, flagship design studios, and Han River parks.',
        photoUrl: TRAVEL_ARTWORK.tokyo_neon,
      },
    ],
    localTip: 'Download Naver Map or KakaoMap before landing—they provide turn-by-turn walking and subway exit guidance across Korea.',
    bookmarked: false,
  },
  {
    id: 'gd-bangkok',
    city: 'Bangkok',
    country: 'Thailand',
    countryCode: 'TH',
    tagline: 'Gilded Chao Phraya river temples, vibrant tuk-tuk night markets, and rooftop sky bars.',
    coverUrl: TRAVEL_ARTWORK.bangkok_temples,
    bestSeason: 'Nov–Feb',
    airportTransit: 'Airport Rail Link from Suvarnabhumi (BKK) connects to Phaya Thai BTS Skytrain in 26 mins.',
    currency: 'Thai Baht (฿ / THB)',
    highlights: [
      {
        title: 'Wat Arun & Grand Palace Riverfront',
        category: 'Temples',
        detail: 'Porcelain-encrusted Temple of Dawn glowing across the Chao Phraya River at sunset.',
        photoUrl: TRAVEL_ARTWORK.bangkok_temples,
      },
      {
        title: 'Yaowarat Chinatown & Talad Noi',
        category: 'Street Food',
        detail: 'Wok-fired seafood stalls, mango sticky rice, and riverside warehouse art cafes.',
        photoUrl: TRAVEL_ARTWORK.bali_terraces,
      },
    ],
    localTip: 'Hop on the orange-flag Chao Phraya Express Boat for scenic river transit without Bangkok traffic.',
    bookmarked: false,
  },
  {
    id: 'gd-istanbul',
    city: 'Istanbul',
    country: 'Turkey',
    countryCode: 'TR',
    tagline: 'Where Europe and Asia meet across the Bosphorus strait beneath imperial domes.',
    coverUrl: TRAVEL_ARTWORK.istanbul_bosphorus,
    bestSeason: 'Apr–Jun & Sep–Nov',
    airportTransit: 'M11 Metro and Havaist coaches link Istanbul Airport (IST) to Gayrettepe and Sultanahmet in 35–45 mins.',
    currency: 'Turkish Lira (₺ / TRY)',
    highlights: [
      {
        title: 'Hagia Sophia, Blue Mosque & Topkapı',
        category: 'History',
        detail: 'Byzantine and Ottoman architectural icons overlooking the Golden Horn and Marmara Sea.',
        photoUrl: TRAVEL_ARTWORK.istanbul_bosphorus,
      },
      {
        title: 'Karaköy to Kadıköy Bosphorus Ferry',
        category: 'Cross-Continental',
        detail: 'Sip Turkish tea on deck while crossing from Europe to the Anatolian food market in 20 mins.',
        photoUrl: TRAVEL_ARTWORK.lisbon_coast,
      },
    ],
    localTip: 'Pick up an Istanbulkart at the airport metro kiosk—one card works for ferries, trams, funiculars, and metro lines.',
    bookmarked: false,
  },
  {
    id: 'gd-amsterdam',
    city: 'Amsterdam',
    country: 'Netherlands',
    countryCode: 'NL',
    tagline: 'UNESCO Golden Age canal rings, world-renowned art museums, and cycling culture.',
    coverUrl: TRAVEL_ARTWORK.amsterdam_canals,
    bestSeason: 'Apr–Sep',
    airportTransit: 'NS Intercity train from Schiphol Airport (AMS) plaza reaches Amsterdam Centraal in 14 mins.',
    currency: 'Euro (€ / EUR)',
    highlights: [
      {
        title: 'Jordaan & Prinsengracht Canals',
        category: 'Neighborhood',
        detail: 'Tree-lined brick bridges, historic gable houses, and cosy brown cafes along the water.',
        photoUrl: TRAVEL_ARTWORK.amsterdam_canals,
      },
      {
        title: 'Museumplein: Rijksmuseum & Van Gogh',
        category: 'Art & Culture',
        detail: 'Rembrandt’s Night Watch and Van Gogh’s Sunflowers steps from Vondelpark.',
        photoUrl: TRAVEL_ARTWORK.cabin_window,
      },
    ],
    localTip: 'Dutch trains, trams, and metro all use OVpay—simply tap your contactless debit or credit card when boarding and exiting.',
    bookmarked: false,
  },
  {
    id: 'gd-lisbon',
    city: 'Lisbon',
    country: 'Portugal',
    countryCode: 'PT',
    tagline: 'Seven sunlit hills of azulejo tiles, vintage streetcars, and Atlantic breezes.',
    coverUrl: TRAVEL_ARTWORK.lisbon_tram,
    bestSeason: 'Apr–Jun & Sep–Oct',
    airportTransit: 'LIS Airport is inside the city boundary—Aeroporto Metro station takes 20 mins to downtown.',
    currency: 'Euro (€ / EUR)',
    highlights: [
      {
        title: 'Alfama & Historic Tram 28E',
        category: 'Heritage',
        detail: 'Ride the classic Remodelado yellow streetcar past Moorish castle walls and tiled alleys.',
        photoUrl: TRAVEL_ARTWORK.lisbon_tram,
      },
      {
        title: 'Miradouro de Santa Luzia & Tagus Coast',
        category: 'Viewpoint',
        detail: 'Bougainvillea-draped pergola overlooking terracotta rooftops and the blue Tagus estuary.',
        photoUrl: TRAVEL_ARTWORK.lisbon_coast,
      },
    ],
    localTip: 'Board Tram 28E before 08:30 AM at Prazeres (the western terminus) rather than Martim Moniz for a guaranteed wooden window seat.',
    bookmarked: false,
  },
  {
    id: 'gd-athens-santorini',
    city: 'Athens & Santorini',
    country: 'Greece',
    countryCode: 'GR',
    tagline: 'Marble Acropolis temples and whitewashed Aegean caldera cliffs.',
    coverUrl: TRAVEL_ARTWORK.santorini_domes,
    bestSeason: 'May–Jun & Sep–Oct',
    airportTransit: 'Metro Line 3 from Athens Airport (ATH) reaches Syntagma Square in 40 mins; 40-min island hop to JTR.',
    currency: 'Euro (€ / EUR)',
    highlights: [
      {
        title: 'Fira to Oia Caldera Rim Trail',
        category: 'Coastal Hike',
        detail: '10 km volcanic cliff path connecting Imerovigli and Oia with endless Aegean views.',
        photoUrl: TRAVEL_ARTWORK.santorini_domes,
      },
      {
        title: 'Acropolis & Plaka Rooftops',
        category: 'Antiquity',
        detail: 'Evening stroll beneath the illuminated Parthenon through neoclassical lanes.',
        photoUrl: TRAVEL_ARTWORK.rome_colosseum,
      },
    ],
    localTip: 'Book a morning flight out of Athens on the left side of the aircraft for aerial views across the Cyclades.',
    bookmarked: false,
  },
  {
    id: 'gd-zurich-zermatt',
    city: 'Zurich & Zermatt',
    country: 'Switzerland',
    countryCode: 'CH',
    tagline: 'Clockwork alpine railways, turquoise lakes, and Matterhorn sunrises.',
    coverUrl: TRAVEL_ARTWORK.swiss_alps,
    bestSeason: 'Jun–Sep (Alpine Trails) · Dec–Mar (Ski)',
    airportTransit: 'Zurich Airport (ZRH) has a mainline SBB railway station directly underneath the arrival concourse.',
    currency: 'Swiss Franc (CHF)',
    highlights: [
      {
        title: 'Gornergrat & Riffelsee',
        category: 'Alpine Peak',
        detail: 'High-altitude cogwheel railway and mirror tarn reflecting the Matterhorn.',
        photoUrl: TRAVEL_ARTWORK.swiss_alps,
      },
      {
        title: 'Lake Zurich & Old Town (Niederdorf)',
        category: 'Waterfront',
        detail: 'Crystal-clear Limmat river baths, medieval guild halls, and panoramic lake steamers.',
        photoUrl: TRAVEL_ARTWORK.swiss_lake,
      },
    ],
    localTip: 'Download the SBB Mobile app—it syncs platform changes, mountain cableways, and lake steamers down to the minute.',
    bookmarked: false,
  },
  {
    id: 'gd-vienna',
    city: 'Vienna',
    country: 'Austria',
    countryCode: 'AT',
    tagline: 'Imperial Habsburg palaces, grand coffeehouse culture, and symphony halls.',
    coverUrl: TRAVEL_ARTWORK.vienna_palace,
    bestSeason: 'Apr–Jun & Sep–Dec',
    airportTransit: 'City Airport Train (CAT) from Vienna Airport (VIE) reaches Wien Mitte in 16 mins.',
    currency: 'Euro (€ / EUR)',
    highlights: [
      {
        title: 'Schönbrunn & Belvedere Palaces',
        category: 'Imperial',
        detail: 'Baroque gardens, Klimt’s Golden Adele, and hilltop Gloriette views over Vienna.',
        photoUrl: TRAVEL_ARTWORK.vienna_palace,
      },
      {
        title: 'Innere Stadt & Historic Coffeehouses',
        category: 'Culture',
        detail: 'Marble-table cafes serving Wiener Melange and Sachertorte beside St. Stephen’s Cathedral.',
        photoUrl: TRAVEL_ARTWORK.prague_bridges,
      },
    ],
    localTip: 'The S7 suburban train from VIE Airport costs just €4.40 and reaches Wien Mitte in 25 minutes.',
    bookmarked: false,
  },
  {
    id: 'gd-prague',
    city: 'Prague',
    country: 'Czechia',
    countryCode: 'CZ',
    tagline: 'Gothic Vltava bridges, astronomical clock towers, and hilltop castle spires.',
    coverUrl: TRAVEL_ARTWORK.prague_bridges,
    bestSeason: 'Apr–Jun & Sep–Oct',
    airportTransit: 'Trolleybus 59 from PRG Airport connects to Nádraží Veleslavín Metro Line A in 15 mins.',
    currency: 'Czech Koruna (Kč / CZK)',
    highlights: [
      {
        title: 'Charles Bridge & Malá Strana at Dawn',
        category: 'Landmark',
        detail: 'Cross the 14th-century stone bridge at sunrise as mist rises off the Vltava River.',
        photoUrl: TRAVEL_ARTWORK.prague_bridges,
      },
      {
        title: 'Prague Castle & Letná Park Gardens',
        category: 'Viewpoint',
        detail: 'Elevated park terrace with sweeping views of all 18 bridges across the river.',
        photoUrl: TRAVEL_ARTWORK.vienna_palace,
      },
    ],
    localTip: 'Use the PID Lítačka app to activate 30-minute or 24-hour Prague transit passes directly on your phone.',
    bookmarked: false,
  },
  {
    id: 'gd-reykjavik',
    city: 'Reykjavik',
    country: 'Iceland',
    countryCode: 'IS',
    tagline: 'Nordic harbour culture, geothermal ocean lagoons, and dancing northern lights.',
    coverUrl: TRAVEL_ARTWORK.iceland_aurora,
    bestSeason: 'Jun–Aug (Midnight Sun) · Sep–Mar (Aurora)',
    airportTransit: 'Flybus departs KEF 35 mins after every flight landing, reaching downtown Reykjavik in 45 mins.',
    currency: 'Icelandic Króna (ISK)',
    highlights: [
      {
        title: 'Sky Lagoon & Aurora Lookout',
        category: 'Geothermal',
        detail: '75-meter oceanfront geothermal infinity edge looking out toward the North Atlantic.',
        photoUrl: TRAVEL_ARTWORK.iceland_aurora,
      },
      {
        title: 'Golden Circle & South Coast Waterfalls',
        category: 'Day Expedition',
        detail: 'Easy day drive from Reykjavik to Skógafoss, Gullfoss, and black basalt beaches.',
        photoUrl: TRAVEL_ARTWORK.iceland_highlands,
      },
    ],
    localTip: 'Check vedur.is for cloud cover layers—clear low and mid-level clouds matter more than raw KP index when hunting the Northern Lights.',
    bookmarked: false,
  },
  {
    id: 'gd-sydney',
    city: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    tagline: 'Sun-drenched harbour sails, coastal cliff walks, and Pacific surf beaches.',
    coverUrl: TRAVEL_ARTWORK.sydney_harbour,
    bestSeason: 'Oct–Apr',
    airportTransit: 'Airport Link train from SYD International Terminal reaches Circular Quay in 22 mins.',
    currency: 'Australian Dollar ($ / AUD)',
    highlights: [
      {
        title: 'Circular Quay, Opera House & Harbour Bridge',
        category: 'Harbour',
        detail: 'Take the public emerald-and-gold Manly Ferry across the harbour at sunset.',
        photoUrl: TRAVEL_ARTWORK.sydney_harbour,
      },
      {
        title: 'Bondi to Coogee Coastal Clifftop Walk',
        category: 'Coastal Trail',
        detail: '6 km sandstone cliff trail passing Bondi Icebergs ocean pool and turquoise coves.',
        photoUrl: TRAVEL_ARTWORK.queenstown_alps,
      },
    ],
    localTip: 'Tap your contactless card on the public F1 Manly Ferry at Wharf 3 for the best Opera House photo angle.',
    bookmarked: false,
  },
  {
    id: 'gd-queenstown',
    city: 'Queenstown',
    country: 'New Zealand',
    countryCode: 'NZ',
    tagline: 'Glacial fjords, razor-sharp Southern Alps peaks, and scenic approaches.',
    coverUrl: TRAVEL_ARTWORK.queenstown_alps,
    bestSeason: 'Dec–Mar (Hiking) · Jun–Sep (Ski)',
    airportTransit: 'Orbus Route 1 runs every 15 mins from ZQN terminal along Lake Wakatipu to town ($2 NZD).',
    currency: 'New Zealand Dollar ($ / NZD)',
    highlights: [
      {
        title: 'Lake Wakatipu & The Remarkables',
        category: 'Alpine Panorama',
        detail: 'Mirror-still glacial waters framed by jagged 2,300-meter mountain peaks.',
        photoUrl: TRAVEL_ARTWORK.queenstown_alps,
      },
      {
        title: 'Milford Sound & Fiordland Flight',
        category: 'Aviation',
        detail: 'Scenic bush-plane crossing over Southern Alps glaciers to Mitre Peak.',
        photoUrl: TRAVEL_ARTWORK.alpine_lake_canoe,
      },
    ],
    localTip: 'Pick Seat A (left side) when flying into Queenstown for the dramatic banking approach alongside the Remarkables.',
    bookmarked: false,
  },
  {
    id: 'gd-rio',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    countryCode: 'BR',
    tagline: 'Granite sugarloaf peaks, golden Atlantic beaches, and lush Tijuca rainforest.',
    coverUrl: TRAVEL_ARTWORK.rio_christ,
    bestSeason: 'Dec–Mar & May–Oct',
    airportTransit: 'VLT light rail and executive buses connect GIG & SDU airports to Copacabana and Ipanema.',
    currency: 'Brazilian Real (R$ / BRL)',
    highlights: [
      {
        title: 'Corcovado & Sugarloaf Cable Car',
        category: 'Panorama',
        detail: '360-degree sunset views over Guanabara Bay, Botafogo yachts, and Copacabana crescent.',
        photoUrl: TRAVEL_ARTWORK.rio_christ,
      },
      {
        title: 'Ipanema Posto 9 & Arpoador Rock',
        category: 'Coastline',
        detail: 'Applaud the Atlantic sunset from the granite headland between Ipanema and Copacabana.',
        photoUrl: TRAVEL_ARTWORK.lisbon_coast,
      },
    ],
    localTip: 'Domestic flights into Santos Dumont (SDU) offer one of the world’s most scenic harbour approaches right past Sugarloaf Mountain.',
    bookmarked: false,
  },
  {
    id: 'gd-capetown',
    city: 'Cape Town',
    country: 'South Africa',
    countryCode: 'ZA',
    tagline: 'Sheer Table Mountain cliffs plunging into two oceans and coastal vineyards.',
    coverUrl: TRAVEL_ARTWORK.cape_town_ocean,
    bestSeason: 'Nov–Apr',
    airportTransit: 'Uber or airport shuttle from Cape Town International (CPT) reaches the V&A Waterfront in 22 mins.',
    currency: 'South African Rand (R / ZAR)',
    highlights: [
      {
        title: 'Table Mountain Aerial Cableway & Lion’s Head',
        category: 'Mountain',
        detail: 'Rotating cable car ascent to the flat sandstone summit 1,085m above Camps Bay.',
        photoUrl: TRAVEL_ARTWORK.cape_town_ocean,
      },
      {
        title: 'Chapman’s Peak Drive & Cape Point',
        category: 'Coastal Road',
        detail: '114 curves carved into vertical red granite cliffs above the Atlantic surf.',
        photoUrl: TRAVEL_ARTWORK.queenstown_alps,
      },
    ],
    localTip: 'Take the first Table Mountain cable car of the morning (08:00) before the afternoon coastal “tablecloth” cloud rolls in.',
    bookmarked: false,
  },
  {
    id: 'gd-marrakech',
    city: 'Marrakech',
    country: 'Morocco',
    countryCode: 'MA',
    tagline: 'Rose-hued medina walls, zellige courtyard riads, and High Atlas horizons.',
    coverUrl: TRAVEL_ARTWORK.marrakech_medina,
    bestSeason: 'Mar–May & Oct–Nov',
    airportTransit: 'RAK Menara Airport is just 6 km from the Medina—15 minutes by shuttle or petit taxi.',
    currency: 'Moroccan Dirham (MAD)',
    highlights: [
      {
        title: 'Jardin Majorelle & Bahia Palace',
        category: 'Architecture',
        detail: 'Cobalt-blue botanical courtyards and intricately carved cedarwood palaces.',
        photoUrl: TRAVEL_ARTWORK.marrakech_medina,
      },
      {
        title: 'Koutoubia & Jemaa el-Fnaa Rooftops',
        category: 'Culture',
        detail: 'Watch dusk settle over the terracotta medina with mint tea as the Atlas Mountains glow.',
        photoUrl: TRAVEL_ARTWORK.dubai_desert,
      },
    ],
    localTip: 'RAK Airport’s geometric lattice terminal is one of North Africa’s most photogenic modern aviation hubs.',
    bookmarked: false,
  },
  {
    id: 'gd-mexico-city',
    city: 'Mexico City',
    country: 'Mexico',
    countryCode: 'MX',
    tagline: 'Jacaranda-lined Roma boulevards, Aztec heritage, and world-leading gastronomy.',
    coverUrl: TRAVEL_ARTWORK.mexico_city_bellas,
    bestSeason: 'Oct–May',
    airportTransit: 'MEX Benito Juárez Airport is 20–30 mins from Roma Norte, Condesa, and Centro Histórico.',
    currency: 'Mexican Peso ($ / MXN)',
    highlights: [
      {
        title: 'Palacio de Bellas Artes & Centro Histórico',
        category: 'Architecture',
        detail: 'Art Nouveau marble dome, Diego Rivera murals, and the monumental Zócalo plaza.',
        photoUrl: TRAVEL_ARTWORK.mexico_city_bellas,
      },
      {
        title: 'Roma Norte, Condesa & Chapultepec Castle',
        category: 'Neighborhood',
        detail: 'Leafy Art Deco avenues, specialty panaderías, and hilltop castle views.',
        photoUrl: TRAVEL_ARTWORK.barcelona_sagrada,
      },
    ],
    localTip: 'Sit by a window when landing at MEX—the final descent glides directly over Paseo de la Reforma and Chapultepec Park.',
    bookmarked: false,
  },
];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'sp-1',
    authorName: 'Elena Rostova',
    authorHandle: '@elenaflys',
    authorRole: 'A350 First Officer & Explorer',
    authorAvatarUrl: TRAVEL_ARTWORK.avatar_elena,
    authorCountriesCount: 34,
    originIata: 'JFK',
    destinationIata: 'HND',
    originCity: 'New York',
    destinationCity: 'Tokyo',
    countryUnlocked: 'Japan',
    countryCode: 'JP',
    badgeEarned: 'Japan Flag Crest',
    flightNumber: 'NH 110',
    airline: 'All Nippon Airways',
    distanceKm: 10885,
    durationMinutes: 855,
    aircraft: 'Boeing 777-300ER',
    caption: '13 hours and 45 minutes over the Bering Strait into Tokyo Haneda. Nothing beats watching Tokyo Tower light up at dusk before taking the Shinkansen down to Kyoto.',
    photos: [
      {
        id: 'sp-ph-1',
        url: TRAVEL_ARTWORK.tokyo_twilight,
        caption: 'Twilight over Tokyo Tower and Minato skyline',
        location: 'Tokyo, Japan',
        takenAt: '2026-04-13',
      },
      {
        id: 'sp-ph-1b',
        url: TRAVEL_ARTWORK.kyoto_torii,
        caption: 'Historic pagoda and autumn maples in Kyoto',
        location: 'Kyoto, Japan',
        takenAt: '2026-04-16',
      },
    ],
    likes: 148,
    likedByMe: false,
    bookmarkedByMe: false,
    timestamp: '2 hours ago',
    comments: [
      {
        id: 'cm-1',
        authorName: 'Marcus Vance',
        authorHandle: '@mvance_air',
        text: 'That NH 110 polar routing is pure magic. Seat 5A has the best view!',
        timestamp: '1 hour ago',
      },
    ],
  },
  {
    id: 'sp-2',
    authorName: 'Soren Lindqvist',
    authorHandle: '@sorennorth',
    authorRole: 'Nordic Photographer',
    authorAvatarUrl: TRAVEL_ARTWORK.avatar_soren,
    authorCountriesCount: 22,
    originIata: 'JFK',
    destinationIata: 'KEF',
    originCity: 'New York',
    destinationCity: 'Reykjavik',
    countryUnlocked: 'Iceland',
    countryCode: 'IS',
    badgeEarned: 'Iceland Flag Crest',
    flightNumber: 'FI 614',
    airline: 'Icelandair',
    distanceKm: 4166,
    durationMinutes: 345,
    aircraft: 'Boeing 737 MAX 9',
    caption: 'Unlocked my Iceland Country Flag Badge and the Earth Circumnavigator milestone on the same flight! Caught ribbons of emerald aurora over the volcanic highlands.',
    photos: [
      {
        id: 'sp-ph-2',
        url: TRAVEL_ARTWORK.iceland_aurora,
        caption: 'Aurora ribbons over Kirkjufell fjord',
        location: 'Snæfellsnes, Iceland',
        takenAt: '2026-07-20',
      },
      {
        id: 'sp-ph-2b',
        url: TRAVEL_ARTWORK.iceland_highlands,
        caption: 'Waterfalls along the South Coast Ring Road',
        location: 'Skógafoss, Iceland',
        takenAt: '2026-07-21',
      },
    ],
    likes: 219,
    likedByMe: false,
    bookmarkedByMe: false,
    timestamp: 'Yesterday',
    comments: [],
  },
];
