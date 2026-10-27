/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Camera,
  Check,
  Clock,
  Compass,
  Globe,
  MapPin,
  Moon,
  Plus,
  RotateCcw,
  Search,
  Share2,
  Sun,
  Ticket,
  Users,
} from 'lucide-react';
import {
  DestinationGuide,
  DistanceUnit,
  FlightJourney,
  FlightPhoto,
  SocialPost,
  TripItinerary,
} from './types/skybound';
import {
  computeBadgesAndMilestones,
  INITIAL_FLIGHTS,
  INITIAL_GUIDES,
  INITIAL_ITINERARIES,
  INITIAL_SOCIAL_POSTS,
} from './data/initialSkyboundData';
import { formatDistance } from './data/worldGeoData';
import {
  ALL_WORLD_COUNTRIES,
  getCountryFlagImageUrl,
} from './data/allCountries';
import { getCountryPhotoUrl } from './data/travelArtwork';
import { WorldMapGlobe } from './components/WorldMapGlobe';
import { CountryBadgeCard, MilestoneCard } from './components/CountryBadgeEmblem';
import { BoardingPassCard } from './components/BoardingPassCard';
import { AirlineLogo } from './components/AirlineLogo';
import { SkyboundLogo } from './components/SkyboundLogo';
import { FlightLoggerModal } from './components/FlightLoggerModal';
import { PassportCardStudioModal } from './components/PassportCardStudioModal';
import { ItinerariesAndGuidesView } from './components/ItinerariesAndGuidesView';
import { SocialCommunityView } from './components/SocialCommunityView';

type ActiveTab = 'passport' | 'wallet' | 'badges' | 'guides' | 'social';

// v5 storage keys start the app in a clean Factory Reset (0 flights, 0 countries visited)
const STORAGE_KEYS = {
  FLIGHTS: 'skybound_flights_v5',
  MANUAL_COUNTRIES: 'skybound_manual_countries_v5',
  ITINERARIES: 'skybound_itineraries_v5',
  GUIDES: 'skybound_guides_v5',
  SOCIAL: 'skybound_social_v5',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('passport');
  const [unit, setUnit] = useState<DistanceUnit>('km');
  const [lightMode, setLightMode] = useState<boolean>(false);

  const [flights, setFlights] = useState<FlightJourney[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FLIGHTS);
      return saved ? JSON.parse(saved) : INITIAL_FLIGHTS;
    } catch {
      return INITIAL_FLIGHTS;
    }
  });

  const [manualVisitedCodes, setManualVisitedCodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MANUAL_COUNTRIES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [itineraries, setItineraries] = useState<TripItinerary[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITINERARIES);
      return saved ? JSON.parse(saved) : INITIAL_ITINERARIES;
    } catch {
      return INITIAL_ITINERARIES;
    }
  });

  const [guides, setGuides] = useState<DestinationGuide[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GUIDES);
      return saved ? JSON.parse(saved) : INITIAL_GUIDES;
    } catch {
      return INITIAL_GUIDES;
    }
  });

  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOCIAL);
      return saved ? JSON.parse(saved) : INITIAL_SOCIAL_POSTS;
    } catch {
      return INITIAL_SOCIAL_POSTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FLIGHTS, JSON.stringify(flights));
    } catch {
      // ignore
    }
  }, [flights]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MANUAL_COUNTRIES, JSON.stringify(manualVisitedCodes));
    } catch {
      // ignore
    }
  }, [manualVisitedCodes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITINERARIES, JSON.stringify(itineraries));
    } catch {
      // ignore
    }
  }, [itineraries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(guides));
    } catch {
      // ignore
    }
  }, [guides]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOCIAL, JSON.stringify(socialPosts));
    } catch {
      // ignore
    }
  }, [socialPosts]);

  // Filters & Selection
  const [flightFilter, setFlightFilter] = useState<'all' | 'completed' | 'upcoming'>('all');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [continentFilter, setContinentFilter] = useState<string>('All');
  const [countrySearchQuery, setCountrySearchQuery] = useState<string>('');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);

  // Modals & Notification Banner
  const [isLoggerOpen, setIsLoggerOpen] = useState<boolean>(false);
  const [isPassportStudioOpen, setIsPassportStudioOpen] = useState<boolean>(false);
  const [unlockToast, setUnlockToast] = useState<{
    message: string;
    countryCode?: string;
  } | null>(null);

  // Compute Country Badges for all 195 countries, Regional Sets, and Aviation Milestones
  const { countryBadges, regionalCollections, milestones } = useMemo(
    () => computeBadgesAndMilestones(flights, manualVisitedCodes),
    [flights, manualVisitedCodes]
  );

  const visitedCountryCodes = useMemo(
    () => new Set(countryBadges.filter((b) => b.unlocked).map((b) => b.countryCode)),
    [countryBadges]
  );

  const filteredFlights = useMemo(() => {
    if (flightFilter === 'completed') return flights.filter((f) => f.status === 'Completed');
    if (flightFilter === 'upcoming') return flights.filter((f) => f.status === 'Upcoming');
    return flights;
  }, [flights, flightFilter]);

  const filteredBadges = useMemo(() => {
    const q = countrySearchQuery.trim().toLowerCase();
    return countryBadges.filter((b) => {
      if (badgeFilter === 'unlocked' && !b.unlocked) return false;
      if (badgeFilter === 'locked' && b.unlocked) return false;
      if (continentFilter !== 'All' && b.continent !== continentFilter) return false;
      if (
        q &&
        !b.country.toLowerCase().includes(q) &&
        !b.countryCode.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [countryBadges, badgeFilter, continentFilter, countrySearchQuery]);

  const selectedCountryBadge = useMemo(() => {
    if (!selectedCountryCode) return null;
    return countryBadges.find((b) => b.countryCode === selectedCountryCode) || null;
  }, [countryBadges, selectedCountryCode]);

  const selectedCountryFlights = useMemo(() => {
    if (!selectedCountryBadge) return [];
    return flights.filter(
      (f) =>
        f.origin.countryCode === selectedCountryBadge.countryCode ||
        f.destination.countryCode === selectedCountryBadge.countryCode
    );
  }, [flights, selectedCountryBadge]);

  // Lifetime Telemetry Metrics (All 0 on Factory Reset)
  const totalDistanceKm = useMemo(
    () => filteredFlights.reduce((sum, f) => sum + f.distanceKm, 0),
    [filteredFlights]
  );
  const totalMinutes = useMemo(
    () => filteredFlights.reduce((sum, f) => sum + f.durationMinutes, 0),
    [filteredFlights]
  );
  const totalHours = totalMinutes === 0 ? '0' : (totalMinutes / 60).toFixed(1);
  const earthCircumnavigations =
    totalDistanceKm === 0 ? '0.00' : (totalDistanceKm / 40075).toFixed(2);
  const unlockedBadgesCount = countryBadges.filter((b) => b.unlocked).length;
  const unlockedMilestonesCount = milestones.filter((m) => m.unlocked).length;

  const allPhotos = useMemo(
    () =>
      flights.flatMap((f) =>
        f.photos.map((p) => ({
          ...p,
          flightNumber: f.flightNumber,
          airlineCode: f.airlineCode,
          route: `${f.origin.iata} → ${f.destination.iata}`,
          countryCode: f.destination.countryCode,
        }))
      ),
    [flights]
  );

  const triggerToast = (message: string, countryCode?: string) => {
    setUnlockToast({ message, countryCode });
    setTimeout(() => setUnlockToast(null), 5000);
  };

  // Toggle any of the 195 countries as visited/stamped
  const handleToggleCountryVisited = (countryCode: string) => {
    const info = ALL_WORLD_COUNTRIES.find((c) => c.code === countryCode);
    const hasFlight = flights.some(
      (f) => f.origin.countryCode === countryCode || f.destination.countryCode === countryCode
    );

    if (hasFlight) {
      triggerToast(
        `${info?.name || countryCode} is unlocked via your logged flights!`,
        countryCode
      );
      return;
    }

    setManualVisitedCodes((prev) => {
      const exists = prev.includes(countryCode);
      if (exists) {
        triggerToast(`Removed manual stamp for ${info?.name || countryCode}.`, countryCode);
        return prev.filter((c) => c !== countryCode);
      } else {
        triggerToast(
          `Unlocked ${info?.name || countryCode} Flag Badge in your Passport!`,
          countryCode
        );
        return [...prev, countryCode];
      }
    });
  };

  const handleSaveFlight = (newFlight: FlightJourney, shareToFeed: boolean) => {
    const wasCountryVisited = visitedCountryCodes.has(newFlight.destination.countryCode);
    setFlights((prev) => [newFlight, ...prev]);
    setSelectedCountryCode(newFlight.destination.countryCode);

    if (shareToFeed) {
      const newPost: SocialPost = {
        id: `sp-${Date.now()}`,
        authorName: 'You (Skybound Explorer)',
        authorHandle: '@skybound_explorer',
        authorRole: 'Skybound Explorer',
        authorCountriesCount: wasCountryVisited ? unlockedBadgesCount : unlockedBadgesCount + 1,
        originIata: newFlight.origin.iata,
        destinationIata: newFlight.destination.iata,
        originCity: newFlight.origin.city,
        destinationCity: newFlight.destination.city,
        countryUnlocked: newFlight.destination.country,
        countryCode: newFlight.destination.countryCode,
        badgeEarned: `${newFlight.destination.country} Flag Crest`,
        flightNumber: newFlight.flightNumber,
        airline: newFlight.airline,
        distanceKm: newFlight.distanceKm,
        durationMinutes: newFlight.durationMinutes,
        aircraft: newFlight.aircraft,
        caption:
          newFlight.notes ||
          `Logged flight ${newFlight.flightNumber} from ${newFlight.origin.city} to ${newFlight.destination.city}.`,
        photos: newFlight.photos,
        likes: 1,
        likedByMe: true,
        bookmarkedByMe: false,
        timestamp: 'Just now',
        comments: [],
      };
      setSocialPosts((prev) => [newPost, ...prev]);
    }

    if (!wasCountryVisited) {
      triggerToast(
        `New Country Flag Badge Unlocked: ${newFlight.destination.country} + ${formatDistance(
          newFlight.distanceKm,
          unit
        )} logged!`,
        newFlight.destination.countryCode
      );
    } else {
      triggerToast(
        `Logged ${newFlight.flightNumber} (${newFlight.origin.iata} → ${newFlight.destination.iata}) · Virtual Pass added!`,
        newFlight.destination.countryCode
      );
    }
  };

  const handleAddPhotoToFlight = (flightId: string, photo: FlightPhoto) => {
    setFlights((prev) =>
      prev.map((f) => (f.id === flightId ? { ...f, photos: [photo, ...f.photos] } : f))
    );
    triggerToast('Photo memory attached to your flight journey!');
  };

  const handleDeleteFlight = (flightId: string) => {
    setFlights((prev) => prev.filter((f) => f.id !== flightId));
    triggerToast('Flight journey removed from log.');
  };

  const handleShareFlightToSocial = (flight: FlightJourney) => {
    const newPost: SocialPost = {
      id: `sp-${Date.now()}`,
      authorName: 'You (Skybound Explorer)',
      authorHandle: '@skybound_explorer',
      authorRole: 'Skybound Explorer',
      authorCountriesCount: unlockedBadgesCount,
      originIata: flight.origin.iata,
      destinationIata: flight.destination.iata,
      originCity: flight.origin.city,
      destinationCity: flight.destination.city,
      countryUnlocked: flight.destination.country,
      countryCode: flight.destination.countryCode,
      badgeEarned: `${flight.destination.country} Flag Badge`,
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      distanceKm: flight.distanceKm,
      durationMinutes: flight.durationMinutes,
      aircraft: flight.aircraft,
      caption:
        flight.notes ||
        `Touchdown in ${flight.destination.city} aboard ${flight.airline} ${flight.flightNumber}.`,
      photos: flight.photos,
      likes: 1,
      likedByMe: true,
      bookmarkedByMe: false,
      timestamp: 'Just now',
      comments: [],
    };
    setSocialPosts((prev) => [newPost, ...prev]);
    setActiveTab('social');
    triggerToast(`Shared ${flight.origin.iata} → ${flight.destination.iata} to Traveler Community!`);
  };

  const handleFactoryReset = () => {
    setFlights([]);
    setManualVisitedCodes([]);
    setItineraries([]);
    setSelectedCountryCode(null);
    triggerToast('Factory reset complete — all flight stats & countries reset to 0.');
  };

  const tabMeta: Record<ActiveTab, { subtitle: string; title: string }> = {
    passport: {
      subtitle: 'EXPLORER PASSPORT',
      title: 'Explorer World Map',
    },
    wallet: {
      subtitle: 'VIRTUAL COLLECTION',
      title: 'Journeys & Passes',
    },
    badges: {
      subtitle: '195 SOVEREIGN NATIONS',
      title: 'Country Flag Badges',
    },
    guides: {
      subtitle: 'GLOBAL DISCOVERY',
      title: 'City Guides & Trips',
    },
    social: {
      subtitle: 'GLOBAL FLYER FEED',
      title: 'Traveler Community',
    },
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        lightMode ? 'bg-[#E2F0FD] text-slate-900' : 'bg-[#050811] text-slate-100'
      }`}
    >
      {/* Responsive App Container across Mobile, Tablet, and Desktop */}
      <div
        className={`w-full max-w-5xl mx-auto min-h-screen relative sm:shadow-2xl sm:border-x flex flex-col ${
          lightMode
            ? 'bg-[#F0F7FF] border-white/80'
            : 'bg-[#070B14] border-white/10'
        }`}
        style={{
          backgroundImage: lightMode
            ? 'radial-gradient(circle at 15% 8%, rgba(56, 189, 248, 0.22), transparent 45%), radial-gradient(circle at 85% 4%, rgba(251, 191, 36, 0.14), transparent 40%), linear-gradient(180deg, #F0F7FF 0%, #E6F2FE 100%)'
            : 'radial-gradient(circle at 20% 0%, rgba(14, 165, 233, 0.16), transparent 45%), radial-gradient(circle at 85% 10%, rgba(245, 158, 11, 0.10), transparent 40%)',
        }}
      >
        {/* Sticky SKYBOUND Branded Header — Fits Cleanly on Every Screen Without Truncation (...) */}
        <header
          className={`sticky top-0 z-30 px-4 sm:px-6 py-3.5 border-b ${
            lightMode
              ? 'bg-white/85 border-sky-200/70 backdrop-blur-2xl'
              : 'bg-[#070B14]/85 border-white/10 backdrop-blur-2xl'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: Official SKYBOUND App Logo + Full Un-Truncated Title */}
            <div className="flex items-center gap-3">
              <SkyboundLogo size="md" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-extrabold text-xs tracking-wider text-sky-600">
                    SKYBOUND
                  </span>
                  <span className="text-[10px] text-slate-400" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-[10px] font-mono-tabular font-semibold text-slate-500">
                    {tabMeta[activeTab].subtitle}
                  </span>
                </div>
                <h1
                  className={`font-display text-lg sm:text-xl font-extrabold tracking-tight leading-snug ${
                    lightMode ? 'text-slate-950' : 'text-white'
                  }`}
                >
                  {tabMeta[activeTab].title}
                </h1>
              </div>
            </div>

            {/* Right: Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setUnit((u) => (u === 'km' ? 'mi' : 'km'))}
                className={`h-9 px-2.5 rounded-full text-[11px] font-mono-tabular font-bold transition-colors ${
                  lightMode
                    ? 'liquid-glass-subtle-light text-sky-700'
                    : 'liquid-glass-subtle text-sky-300'
                }`}
              >
                {unit.toUpperCase()}
              </button>

              <button
                type="button"
                onClick={() => setIsPassportStudioOpen(true)}
                aria-label="Share Passport Card"
                className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors ${
                  lightMode
                    ? 'liquid-glass-subtle-light text-amber-600'
                    : 'liquid-glass-subtle text-amber-400'
                }`}
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setLightMode((m) => !m)}
                aria-label="Toggle color theme"
                className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors ${
                  lightMode
                    ? 'liquid-glass-subtle-light text-slate-700'
                    : 'liquid-glass-subtle text-slate-200'
                }`}
              >
                {lightMode ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-sky-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsLoggerOpen(true)}
                className="h-9 px-3.5 sm:px-4 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/25 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Log Flight</span>
              </button>
            </div>
          </div>
        </header>

        {/* Celebratory Toast Notification */}
        {unlockToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[440px] liquid-glass-pill rounded-2xl px-4 py-3 border border-sky-400/50 shadow-2xl flex items-center gap-3">
            {unlockToast.countryCode ? (
              <img
                src={getCountryFlagImageUrl(unlockToast.countryCode)}
                alt="Flag"
                referrerPolicy="no-referrer"
                className="w-8 h-5 rounded-sm object-cover border border-white shadow-xs shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
            )}
            <div className="text-xs font-bold text-slate-900 leading-snug">
              {unlockToast.message}
            </div>
          </div>
        )}

        {/* Main Responsive App Content */}
        <main className="flex-1 px-4 sm:px-6 pt-4 pb-36 space-y-6">
          {/* =========================================================
              TAB 1: EXPLORER PASSPORT & REAL WORLD MAP / GLOBE
             ========================================================= */}
          {activeTab === 'passport' && (
            <div className="space-y-6">
              {/* Onboarding Blue Box — Disappears Automatically After First Flight Is Logged */}
              {flights.length === 0 && (
                <div
                  className={`rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border ${
                    lightMode
                      ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white border-sky-400/40 shadow-lg shadow-sky-600/15'
                      : 'bg-gradient-to-r from-sky-900/90 to-slate-900 text-white border-sky-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <SkyboundLogo size="lg" className="border border-white/30" />
                    <div>
                      <div className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-sky-200">
                        WELCOME TO SKYBOUND
                      </div>
                      <h2 className="font-display font-extrabold text-base sm:text-lg leading-snug mt-0.5">
                        Start Your Skybound Flight Log
                      </h2>
                      <p className="text-xs text-sky-100/95 mt-0.5 leading-relaxed">
                        Log your first flight journey with flying details and your own photos to
                        unlock country flag badges and collect virtual passes.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLoggerOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-white text-sky-700 hover:bg-sky-50 font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shrink-0 transition-colors"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Log First Journey</span>
                  </button>
                </div>
              )}

              {/* Responsive 2x2 / 4-Column Telemetry Widgets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  className={`rounded-3xl p-3.5 sm:p-4 ${
                    lightMode ? 'liquid-glass-light' : 'liquid-glass'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Countries Visited</span>
                    <Globe className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span
                      className={`font-display font-extrabold text-2xl font-mono-tabular ${
                        lightMode ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {unlockedBadgesCount}
                    </span>
                    <span className="text-[11px] text-sky-600 font-bold font-mono-tabular">
                      / 195
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {Math.round((unlockedBadgesCount / 195) * 100)}% of World
                  </div>
                </div>

                <div
                  className={`rounded-3xl p-3.5 sm:p-4 ${
                    lightMode ? 'liquid-glass-light' : 'liquid-glass'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Distance Flown</span>
                    <Compass className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div
                    className={`font-display font-extrabold text-2xl font-mono-tabular mt-1 ${
                      lightMode ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {formatDistance(totalDistanceKm, unit)}
                  </div>
                  <div className="text-[10px] text-amber-600 font-semibold font-mono-tabular mt-0.5">
                    {earthCircumnavigations}x Around Earth
                  </div>
                </div>

                <div
                  className={`rounded-3xl p-3.5 sm:p-4 ${
                    lightMode ? 'liquid-glass-light' : 'liquid-glass'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Flight Hours</span>
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div
                    className={`font-display font-extrabold text-2xl font-mono-tabular mt-1 ${
                      lightMode ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {totalHours}h
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold font-mono-tabular mt-0.5">
                    {(Number(totalHours) / 24).toFixed(1)} Days Airborne
                  </div>
                </div>

                <div
                  className={`rounded-3xl p-3.5 sm:p-4 ${
                    lightMode ? 'liquid-glass-light' : 'liquid-glass'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Passport Seals</span>
                    <Award className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div
                    className={`font-display font-extrabold text-2xl font-mono-tabular mt-1 ${
                      lightMode ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {unlockedBadgesCount + unlockedMilestonesCount}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {unlockedBadgesCount} Flags · {unlockedMilestonesCount} Trophies
                  </div>
                </div>
              </div>

              {/* Interactive 3D Globe & 2D World Map */}
              <WorldMapGlobe
                flights={filteredFlights}
                visitedCountryCodes={visitedCountryCodes}
                selectedCountryCode={selectedCountryCode}
                onSelectCountry={(code) => setSelectedCountryCode(code)}
                onToggleCountryVisited={handleToggleCountryVisited}
                unit={unit}
                lightMode={lightMode}
              />

              {/* Selected Country Matched Photography & Passport Inspector Sheet */}
              {selectedCountryBadge && (
                <div
                  className={`rounded-3xl overflow-hidden ${
                    lightMode ? 'liquid-glass-light' : 'liquid-glass'
                  }`}
                >
                  <div className="relative h-44 sm:h-52 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={
                        selectedCountryFlights[0]?.photos[0]?.url ||
                        getCountryPhotoUrl(
                          selectedCountryBadge.countryCode,
                          selectedCountryBadge.continent
                        )
                      }
                      alt={selectedCountryBadge.country}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent p-4 sm:p-5 flex items-end justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={getCountryFlagImageUrl(selectedCountryBadge.countryCode)}
                          alt={`${selectedCountryBadge.country} flag`}
                          referrerPolicy="no-referrer"
                          className="w-12 h-8 rounded-md object-cover border-2 border-white shadow-md shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-[10px] font-mono-tabular font-bold text-sky-300 tracking-wider uppercase">
                            {selectedCountryBadge.unlocked
                              ? `UNLOCKED PASSPORT STAMP · ${selectedCountryBadge.tier} TIER`
                              : 'UNVISITED NATION'}
                          </div>
                          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white leading-tight">
                            {selectedCountryBadge.country}
                          </h3>
                          <div className="text-xs text-slate-200">
                            {selectedCountryBadge.continent} ·{' '}
                            {selectedCountryBadge.citiesVisited.join(', ')}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleCountryVisited(selectedCountryBadge.countryCode)
                        }
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shrink-0 ${
                          selectedCountryBadge.unlocked
                            ? 'bg-emerald-500 text-white'
                            : 'bg-sky-500 text-white hover:bg-sky-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>
                          {selectedCountryBadge.unlocked ? 'Stamped' : '+ Stamp'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Logged Flights for Selected Country */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-display font-bold ${
                          lightMode ? 'text-slate-700' : 'text-slate-300'
                        }`}
                      >
                        Logged Journeys to/from {selectedCountryBadge.country} (
                        {selectedCountryFlights.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('badges')}
                        className="text-xs font-bold text-sky-600"
                      >
                        All 195 Flags →
                      </button>
                    </div>

                    {selectedCountryFlights.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedCountryFlights.map((fl) => (
                          <button
                            key={fl.id}
                            type="button"
                            onClick={() => setActiveTab('wallet')}
                            className={`w-full text-left p-3 rounded-2xl border transition-colors flex items-center justify-between gap-2 ${
                              lightMode
                                ? 'bg-white/80 hover:bg-white border-slate-200/90'
                                : 'bg-white/5 hover:bg-white/10 border-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <AirlineLogo
                                airlineCode={fl.airlineCode}
                                airlineName={fl.airline}
                                size="sm"
                              />
                              <div className="min-w-0">
                                <div
                                  className={`font-display font-bold text-sm ${
                                    lightMode ? 'text-slate-900' : 'text-white'
                                  }`}
                                >
                                  {fl.origin.iata} → {fl.destination.iata}
                                </div>
                                <div className="text-[11px] text-slate-500 font-mono-tabular truncate">
                                  {fl.airline} · {fl.flightNumber}
                                </div>
                              </div>
                            </div>
                            <div className="text-right font-mono-tabular shrink-0">
                              <div className="text-xs text-sky-600 font-bold">
                                {formatDistance(fl.distanceKm, unit)}
                              </div>
                              <div className="text-[10px] text-slate-500">{fl.date}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div
                        className={`p-3 rounded-2xl border text-xs text-center ${
                          lightMode
                            ? 'bg-white/60 border-slate-200 text-slate-600'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        Tap &ldquo;+ Stamp&rdquo; above or log a flight journey to{' '}
                        {selectedCountryBadge.country} to unlock its flag badge.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Country Flag Badges Preview */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2
                    className={`font-display font-bold text-base ${
                      lightMode ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Country Flag Badges ({unlockedBadgesCount}/195)
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('badges')}
                    className="text-xs font-bold text-sky-600"
                  >
                    Browse All 195 →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {countryBadges.slice(0, 8).map((badge) => (
                    <CountryBadgeCard
                      key={badge.countryCode}
                      badge={badge}
                      isSelected={selectedCountryCode === badge.countryCode}
                      onSelect={(b) => setSelectedCountryCode(b.countryCode)}
                      onToggleVisited={handleToggleCountryVisited}
                      lightMode={lightMode}
                    />
                  ))}
                </div>
              </section>

              {/* Personal Uploaded Trip Memories Grid */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2
                    className={`font-display font-bold text-base ${
                      lightMode ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Your Uploaded Journey Photos ({allPhotos.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsLoggerOpen(true)}
                    className="text-xs font-bold text-sky-600 flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>+ Log & Upload</span>
                  </button>
                </div>

                {allPhotos.length === 0 ? (
                  <div
                    className={`rounded-3xl p-6 text-center space-y-2.5 ${
                      lightMode ? 'liquid-glass-light' : 'liquid-glass'
                    }`}
                  >
                    <Camera className="w-8 h-8 text-sky-600 mx-auto" />
                    <h3
                      className={`font-display font-bold text-sm ${
                        lightMode ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      No Journey Photos Uploaded Yet
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Log a flight journey and upload your window-seat or destination photos to
                      build your personal visual travel archive.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsLoggerOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Log Flight & Upload Photos</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    {allPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => setSelectedCountryCode(photo.countryCode)}
                        className="group cursor-pointer relative rounded-3xl overflow-hidden border border-white shadow-md aspect-[4/3] bg-slate-900"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-3 flex flex-col justify-end">
                          <div className="flex items-center justify-between text-[10px] font-mono-tabular text-sky-200">
                            <span className="inline-flex items-center gap-1">
                              <img
                                src={getCountryFlagImageUrl(photo.countryCode)}
                                alt={photo.countryCode}
                                referrerPolicy="no-referrer"
                                className="w-3.5 h-2.5 rounded-[2px] object-cover border border-white/60"
                              />
                              <span>{photo.route}</span>
                            </span>
                            <span>{photo.flightNumber}</span>
                          </div>
                          <h4 className="font-display font-bold text-xs text-white mt-0.5 line-clamp-1">
                            {photo.caption}
                          </h4>
                          <div className="text-[10px] text-slate-200 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                            <span className="truncate">{photo.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* =========================================================
              TAB 2: FLIGHT JOURNEYS & VIRTUAL BOARDING PASS COLLECTION
             ========================================================= */}
          {activeTab === 'wallet' && (
            <div className="space-y-4">
              {/* Filter Bar */}
              <div
                className={`grid grid-cols-3 gap-1 p-1 rounded-2xl ${
                  lightMode ? 'liquid-glass-subtle-light' : 'liquid-glass-subtle'
                }`}
              >
                {(
                  [
                    { id: 'all', label: `All (${flights.length})` },
                    { id: 'completed', label: 'Flown' },
                    { id: 'upcoming', label: 'Upcoming' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFlightFilter(f.id)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      flightFilter === f.id
                        ? 'bg-sky-600 text-white shadow-xs'
                        : lightMode
                        ? 'text-slate-700 hover:text-slate-950'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-slate-400">
                  Virtual Boarding Pass Archive
                </p>
                {flights.length > 0 && (
                  <button
                    type="button"
                    onClick={handleFactoryReset}
                    className={`min-h-[32px] px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 ${
                      lightMode
                        ? 'liquid-glass-subtle-light text-slate-700'
                        : 'liquid-glass-subtle text-slate-300'
                    }`}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to 0</span>
                  </button>
                )}
              </div>

              {filteredFlights.length === 0 ? (
                <div
                  className={`rounded-3xl p-8 text-center space-y-3 ${
                    lightMode ? 'liquid-glass-light' : 'liquid-glass'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/15 text-sky-600 flex items-center justify-center mx-auto">
                    <Ticket className="w-7 h-7" />
                  </div>
                  <h3
                    className={`font-display font-extrabold text-base ${
                      lightMode ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Your Virtual Boarding Pass Collection is Empty
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Log your flights with departure & arrival airports, airline, aircraft, seat,
                    and your own photos to collect virtual boarding passes.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsLoggerOpen(true)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-display font-bold text-xs shadow-md shadow-sky-600/20 transition-colors"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Log Your First Flight Journey</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredFlights.map((flight) => (
                    <BoardingPassCard
                      key={flight.id}
                      flight={flight}
                      unit={unit}
                      onAddPhoto={handleAddPhotoToFlight}
                      onDeleteFlight={handleDeleteFlight}
                      onShareFlightToSocial={handleShareFlightToSocial}
                      onSelectCountry={(code) => {
                        setSelectedCountryCode(code);
                        setActiveTab('passport');
                      }}
                      lightMode={lightMode}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 3: ALL 195 COUNTRY FLAG BADGES & AVIATION MILESTONES
             ========================================================= */}
          {activeTab === 'badges' && (
            <div className="space-y-6">
              <section className="space-y-3">
                {/* Search Bar */}
                <div
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl ${
                    lightMode ? 'liquid-glass-subtle-light' : 'liquid-glass-subtle'
                  }`}
                >
                  <Search className="w-4 h-4 text-sky-600 shrink-0" />
                  <input
                    type="text"
                    value={countrySearchQuery}
                    onChange={(e) => setCountrySearchQuery(e.target.value)}
                    placeholder="Search all 195 world countries..."
                    className="w-full bg-transparent text-xs font-medium focus:outline-none"
                  />
                </div>

                {/* Visited / Unvisited Segmented Control */}
                <div
                  className={`grid grid-cols-3 gap-1 p-1 rounded-2xl ${
                    lightMode ? 'liquid-glass-subtle-light' : 'liquid-glass-subtle'
                  }`}
                >
                  {(
                    [
                      { id: 'all', label: `All (${countryBadges.length})` },
                      { id: 'unlocked', label: `Visited (${unlockedBadgesCount})` },
                      {
                        id: 'locked',
                        label: `Locked (${countryBadges.length - unlockedBadgesCount})`,
                      },
                    ] as const
                  ).map((bf) => (
                    <button
                      key={bf.id}
                      type="button"
                      onClick={() => setBadgeFilter(bf.id)}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        badgeFilter === bf.id
                          ? 'bg-sky-600 text-white'
                          : lightMode
                          ? 'text-slate-700 hover:text-slate-950'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {bf.label}
                    </button>
                  ))}
                </div>

                {/* Continent Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {(
                    [
                      'All',
                      'Europe',
                      'Asia',
                      'North America',
                      'South America',
                      'Africa',
                      'Oceania',
                    ] as const
                  ).map((cont) => (
                    <button
                      key={cont}
                      type="button"
                      onClick={() => setContinentFilter(cont)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        continentFilter === cont
                          ? 'bg-sky-600 text-white shadow-xs'
                          : lightMode
                          ? 'bg-white/75 text-slate-700 hover:bg-white border border-slate-200/80'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {cont}
                    </button>
                  ))}
                </div>

                {/* Responsive Grid of All 195 Country Flag Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {filteredBadges.map((badge) => (
                    <CountryBadgeCard
                      key={badge.countryCode}
                      badge={badge}
                      isSelected={selectedCountryCode === badge.countryCode}
                      onSelect={(b) => {
                        setSelectedCountryCode(b.countryCode);
                        setActiveTab('passport');
                      }}
                      onToggleVisited={handleToggleCountryVisited}
                      lightMode={lightMode}
                    />
                  ))}
                </div>
              </section>

              {/* Section 2: Regional Stamp Collections */}
              <section className="space-y-3">
                <h3
                  className={`font-display font-bold text-base ${
                    lightMode ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Regional Passport Collections
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {regionalCollections.map((col) => (
                    <div
                      key={col.id}
                      className={`rounded-3xl p-4 space-y-2.5 ${
                        lightMode ? 'liquid-glass-light' : 'liquid-glass'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`font-display font-bold text-sm ${
                            lightMode ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {col.title}
                        </h4>
                        <span className="font-mono-tabular text-xs font-bold text-sky-600">
                          {col.unlockedCount}/{col.requiredCountries.length}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{col.subtitle}</p>

                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {col.requiredCountries.map((rc) => {
                          const isEarned = visitedCountryCodes.has(rc.code);
                          return (
                            <span
                              key={rc.code}
                              className={`text-[11px] font-mono-tabular px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                                isEarned
                                  ? lightMode
                                    ? 'bg-sky-500/15 border-sky-400/50 text-sky-800 font-bold'
                                    : 'bg-sky-500/20 border-sky-400/50 text-sky-300 font-bold'
                                  : lightMode
                                  ? 'bg-slate-100 border-slate-200 text-slate-500'
                                  : 'bg-white/5 border-white/10 text-slate-400'
                              }`}
                            >
                              <img
                                src={getCountryFlagImageUrl(rc.code)}
                                alt={rc.name}
                                referrerPolicy="no-referrer"
                                className="w-4 h-3 rounded-[2px] object-cover border border-slate-300"
                              />
                              <span>{rc.name}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 3: Aviation Milestones & Trophies */}
              <section className="space-y-3">
                <h3
                  className={`font-display font-bold text-base ${
                    lightMode ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Aviation Milestones ({unlockedMilestonesCount}/{milestones.length} Unlocked)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {milestones.map((ms) => (
                    <MilestoneCard key={ms.id} milestone={ms} lightMode={lightMode} />
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* =========================================================
              TAB 4: POPULAR CITY GUIDES & TRAVEL ITINERARIES
             ========================================================= */}
          {activeTab === 'guides' && (
            <ItinerariesAndGuidesView
              itineraries={itineraries}
              guides={guides}
              onCreateItinerary={(newTrip) => {
                setItineraries((prev) => [newTrip, ...prev]);
                triggerToast(
                  `Created new trip itinerary for ${newTrip.destinationCity}!`,
                  newTrip.countryCode
                );
              }}
              onToggleActivity={(itinId, actId) => {
                setItineraries((prev) =>
                  prev.map((it) =>
                    it.id === itinId
                      ? {
                          ...it,
                          activities: it.activities.map((a) =>
                            a.id === actId ? { ...a, completed: !a.completed } : a
                          ),
                        }
                      : it
                  )
                );
              }}
              onAddActivity={(itinId, newAct) => {
                setItineraries((prev) =>
                  prev.map((it) =>
                    it.id === itinId
                      ? {
                          ...it,
                          activities: [
                            ...it.activities,
                            { ...newAct, id: `act-${Date.now()}` },
                          ],
                        }
                      : it
                  )
                );
                triggerToast('Added new stop to trip itinerary!');
              }}
              onToggleBookmarkGuide={(guideId) => {
                setGuides((prev) =>
                  prev.map((g) => (g.id === guideId ? { ...g, bookmarked: !g.bookmarked } : g))
                );
              }}
              lightMode={lightMode}
            />
          )}

          {/* =========================================================
              TAB 5: SOCIAL COMMUNITY & SHAREABLE PASSPORT CARDS
             ========================================================= */}
          {activeTab === 'social' && (
            <SocialCommunityView
              posts={socialPosts}
              flights={flights}
              unit={unit}
              onToggleLike={(postId) => {
                setSocialPosts((prev) =>
                  prev.map((p) =>
                    p.id === postId
                      ? {
                          ...p,
                          likedByMe: !p.likedByMe,
                          likes: p.likedByMe ? p.likes - 1 : p.likes + 1,
                        }
                      : p
                  )
                );
              }}
              onToggleBookmark={(postId) => {
                setSocialPosts((prev) =>
                  prev.map((p) =>
                    p.id === postId ? { ...p, bookmarkedByMe: !p.bookmarkedByMe } : p
                  )
                );
              }}
              onAddComment={(postId, commentText) => {
                setSocialPosts((prev) =>
                  prev.map((p) =>
                    p.id === postId
                      ? {
                          ...p,
                          comments: [
                            ...p.comments,
                            {
                              id: `cm-${Date.now()}`,
                              authorName: 'You',
                              authorHandle: '@skybound_explorer',
                              text: commentText,
                              timestamp: 'Just now',
                            },
                          ],
                        }
                      : p
                  )
                );
              }}
              onCreatePostFromFlight={(flightId, caption) => {
                const fl = flights.find((f) => f.id === flightId) || flights[0];
                if (!fl) return;
                const newPost: SocialPost = {
                  id: `sp-${Date.now()}`,
                  authorName: 'You (Skybound Explorer)',
                  authorHandle: '@skybound_explorer',
                  authorRole: 'Skybound Explorer',
                  authorCountriesCount: unlockedBadgesCount,
                  originIata: fl.origin.iata,
                  destinationIata: fl.destination.iata,
                  originCity: fl.origin.city,
                  destinationCity: fl.destination.city,
                  countryUnlocked: fl.destination.country,
                  countryCode: fl.destination.countryCode,
                  badgeEarned: `${fl.destination.country} Flag Crest`,
                  flightNumber: fl.flightNumber,
                  airline: fl.airline,
                  distanceKm: fl.distanceKm,
                  durationMinutes: fl.durationMinutes,
                  aircraft: fl.aircraft,
                  caption,
                  photos: fl.photos,
                  likes: 1,
                  likedByMe: true,
                  bookmarkedByMe: false,
                  timestamp: 'Just now',
                  comments: [],
                };
                setSocialPosts((prev) => [newPost, ...prev]);
                triggerToast('Published your flight journey to the Community Feed!');
              }}
              onOpenPassportStudio={() => setIsPassportStudioOpen(true)}
              lightMode={lightMode}
            />
          )}
        </main>

        {/* Permanent Floating Bottom Liquid Glass Tab Bar Selector with Generous Padding */}
        <nav
          aria-label="App Navigation Bar"
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-24px)] max-w-[540px] px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-[34px] grid grid-cols-5 gap-2 sm:gap-3 shadow-2xl border backdrop-blur-2xl ${
            lightMode
              ? 'liquid-glass-pill'
              : 'bg-[#091224]/92 border-sky-400/25 shadow-black/80'
          }`}
        >
          {[
            { id: 'passport', label: 'Passport', icon: Globe },
            { id: 'wallet', label: 'Journeys', icon: Ticket },
            { id: 'badges', label: 'Badges', icon: Award },
            { id: 'guides', label: 'Guides', icon: Compass },
            { id: 'social', label: 'Social', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`min-h-[54px] py-2 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive
                    ? lightMode
                      ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/25'
                      : 'bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-extrabold shadow-md shadow-sky-500/30'
                    : lightMode
                    ? 'text-slate-700 hover:text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span className="text-[11px] tracking-tight whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Flight Logger & Photo Uploader Modal */}
      <FlightLoggerModal
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        onSaveFlight={handleSaveFlight}
        unit={unit}
        lightMode={lightMode}
      />

      {/* Exportable Passport Stat Card Studio Modal */}
      <PassportCardStudioModal
        isOpen={isPassportStudioOpen}
        onClose={() => setIsPassportStudioOpen(false)}
        flights={flights}
        countryBadges={countryBadges}
        milestones={milestones}
        unit={unit}
        onToggleUnit={() => setUnit((u) => (u === 'km' ? 'mi' : 'km'))}
        onShareCardToCommunity={(summaryText) => {
          const latestFlight = flights[0];
          const newPost: SocialPost = {
            id: `sp-${Date.now()}`,
            authorName: 'You (Skybound Explorer)',
            authorHandle: '@skybound_explorer',
            authorRole: 'Skybound Explorer',
            authorCountriesCount: unlockedBadgesCount,
            originIata: latestFlight?.origin.iata || 'SKY',
            destinationIata: latestFlight?.destination.iata || 'BND',
            originCity: latestFlight?.origin.city || 'Global',
            destinationCity: latestFlight?.destination.city || 'Passport',
            countryUnlocked: 'All-Time Passport',
            countryCode: latestFlight?.destination.countryCode || 'US',
            badgeEarned: `${unlockedBadgesCount} Country Flag Badges & ${unlockedMilestonesCount} Milestones`,
            flightNumber: `${flights.length} FLIGHTS`,
            airline: 'Skybound Passport Summary',
            distanceKm: totalDistanceKm,
            durationMinutes: totalMinutes,
            aircraft: 'Multi-Fleet',
            caption: summaryText,
            photos: latestFlight?.photos || [],
            likes: 1,
            likedByMe: true,
            bookmarkedByMe: false,
            timestamp: 'Just now',
            comments: [],
          };
          setSocialPosts((prev) => [newPost, ...prev]);
          setActiveTab('social');
          triggerToast('Posted your Passport Summary Card to the Traveler Community!');
        }}
      />
    </div>
  );
}
