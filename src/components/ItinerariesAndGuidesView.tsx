import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  CheckCircle2,
  Circle,
  Compass,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Train,
} from 'lucide-react';
import {
  DestinationGuide,
  ItineraryActivity,
  TripItinerary,
} from '../types/skybound';
import { ALL_WORLD_COUNTRIES, getCountryFlagImageUrl } from '../data/allCountries';
import { getCountryPhotoUrl } from '../data/travelArtwork';

interface ItinerariesAndGuidesViewProps {
  itineraries: TripItinerary[];
  guides: DestinationGuide[];
  onCreateItinerary?: (itinerary: TripItinerary) => void;
  onToggleActivity: (itineraryId: string, activityId: string) => void;
  onAddActivity: (itineraryId: string, activity: Omit<ItineraryActivity, 'id'>) => void;
  onToggleBookmarkGuide: (guideId: string) => void;
  lightMode?: boolean;
}

export const ItinerariesAndGuidesView: React.FC<ItinerariesAndGuidesViewProps> = ({
  itineraries,
  guides,
  onCreateItinerary,
  onToggleActivity,
  onAddActivity,
  onToggleBookmarkGuide,
  lightMode = true,
}) => {
  const [subTab, setSubTab] = useState<'guides' | 'itineraries'>('guides');
  const [selectedItineraryId, setSelectedItineraryId] = useState<string>(
    itineraries[0]?.id || ''
  );
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [citySearch, setCitySearch] = useState<string>('');

  // New Trip Itinerary Creator State
  const [tripTitle, setTripTitle] = useState<string>('');
  const [tripCountryCode, setTripCountryCode] = useState<string>('JP');
  const [tripCity, setTripCity] = useState<string>('Tokyo');
  const [tripStartDate, setTripStartDate] = useState<string>('2026-11-10');
  const [tripEndDate, setTripEndDate] = useState<string>('2026-11-17');

  // New Activity State
  const [newDay, setNewDay] = useState<number>(1);
  const [newTime, setNewTime] = useState<string>('10:00');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newCategory, setNewCategory] = useState<ItineraryActivity['category']>('Explore');

  const activeItinerary =
    itineraries.find((it) => it.id === selectedItineraryId) || itineraries[0];

  const filteredGuides = guides.filter((g) => {
    const q = citySearch.trim().toLowerCase();
    if (!q) return true;
    return (
      g.city.toLowerCase().includes(q) ||
      g.country.toLowerCase().includes(q) ||
      g.tagline.toLowerCase().includes(q)
    );
  });

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateItinerary || !tripTitle.trim()) return;
    const countryObj =
      ALL_WORLD_COUNTRIES.find((c) => c.code === tripCountryCode) ||
      ALL_WORLD_COUNTRIES[0];
    const newTrip: TripItinerary = {
      id: `itin-${Date.now()}`,
      title: tripTitle.trim(),
      destinationCity: tripCity.trim() || countryObj.capital,
      country: countryObj.name,
      countryCode: countryObj.code,
      startDate: tripStartDate,
      endDate: tripEndDate,
      coverUrl: getCountryPhotoUrl(countryObj.code, countryObj.continent),
      activities: [],
    };
    onCreateItinerary(newTrip);
    setSelectedItineraryId(newTrip.id);
    setTripTitle('');
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItinerary || !newTitle.trim()) return;
    onAddActivity(activeItinerary.id, {
      day: newDay,
      time: newTime,
      title: newTitle.trim(),
      location: newLocation.trim() || activeItinerary.destinationCity,
      category: newCategory,
      notes: '',
      completed: false,
      photoUrl: activeItinerary.coverUrl,
    });
    setNewTitle('');
    setNewLocation('');
  };

  return (
    <div className="space-y-4">
      {/* Segmented Control: Popular City Guides vs Trip Itineraries */}
      <div
        className={`grid grid-cols-2 gap-1 p-1 rounded-2xl ${
          lightMode ? 'liquid-glass-subtle-light' : 'liquid-glass-subtle'
        }`}
      >
        <button
          type="button"
          onClick={() => setSubTab('guides')}
          className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            subTab === 'guides'
              ? 'bg-sky-600 text-white shadow-xs'
              : lightMode
              ? 'text-slate-700 hover:text-slate-950'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Popular City Guides ({guides.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('itineraries')}
          className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            subTab === 'itineraries'
              ? 'bg-sky-600 text-white shadow-xs'
              : lightMode
              ? 'text-slate-700 hover:text-slate-950'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>My Itineraries ({itineraries.length})</span>
        </button>
      </div>

      {subTab === 'itineraries' ? (
        <div className="space-y-4">
          {/* Create Personal Trip Itinerary Form */}
          <form
            onSubmit={handleCreateTrip}
            className={`rounded-3xl p-4 space-y-3 ${
              lightMode ? 'liquid-glass-light' : 'liquid-glass'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`font-display font-bold text-sm flex items-center gap-1.5 ${
                  lightMode ? 'text-slate-900' : 'text-white'
                }`}
              >
                <Plus className="w-4 h-4 text-sky-600" />
                <span>Plan a New Trip Itinerary</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={tripCountryCode}
                onChange={(e) => {
                  const code = e.target.value;
                  setTripCountryCode(code);
                  const found = ALL_WORLD_COUNTRIES.find((c) => c.code === code);
                  if (found) setTripCity(found.capital);
                }}
                className={`h-9 px-2.5 rounded-xl border text-xs font-medium ${
                  lightMode
                    ? 'bg-white border-slate-300 text-slate-900'
                    : 'bg-slate-900 border-white/15 text-white'
                }`}
              >
                {ALL_WORLD_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={tripCity}
                onChange={(e) => setTripCity(e.target.value)}
                placeholder="Destination city..."
                className={`h-9 px-2.5 rounded-xl border text-xs ${
                  lightMode
                    ? 'bg-white border-slate-300 text-slate-900'
                    : 'bg-white/5 border-white/15 text-white'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={tripStartDate}
                onChange={(e) => setTripStartDate(e.target.value)}
                className={`h-9 px-2.5 rounded-xl border text-xs font-mono-tabular ${
                  lightMode
                    ? 'bg-white border-slate-300 text-slate-900'
                    : 'bg-white/5 border-white/15 text-white'
                }`}
              />
              <input
                type="date"
                value={tripEndDate}
                onChange={(e) => setTripEndDate(e.target.value)}
                className={`h-9 px-2.5 rounded-xl border text-xs font-mono-tabular ${
                  lightMode
                    ? 'bg-white border-slate-300 text-slate-900'
                    : 'bg-white/5 border-white/15 text-white'
                }`}
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={tripTitle}
                onChange={(e) => setTripTitle(e.target.value)}
                placeholder="Trip title (e.g., Tokyo & Kyoto Spring Adventure)..."
                required
                className={`flex-1 h-9 px-3 rounded-xl border text-xs ${
                  lightMode
                    ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    : 'bg-white/5 border-white/15 text-white placeholder:text-slate-500'
                }`}
              />
              <button
                type="submit"
                className="min-h-[36px] px-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create</span>
              </button>
            </div>
          </form>

          {itineraries.length === 0 ? (
            <div
              className={`rounded-3xl p-6 text-center space-y-2 ${
                lightMode ? 'liquid-glass-light' : 'liquid-glass'
              }`}
            >
              <Calendar className="w-8 h-8 text-sky-600 mx-auto" />
              <h4
                className={`font-display font-bold text-sm ${
                  lightMode ? 'text-slate-900' : 'text-white'
                }`}
              >
                No Trip Itineraries Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Create your first trip itinerary above to organize day-by-day flight times,
                hotel check-ins, and city stops.
              </p>
            </div>
          ) : (
            activeItinerary && (
              <>
                {/* Horizontal Carousel of Trips */}
                <div className="flex items-center gap-3 overflow-x-auto pb-1.5 -mx-1 px-1">
                  {itineraries.map((trip) => {
                    const isSelected = trip.id === activeItinerary.id;
                    const doneCount = trip.activities.filter((a) => a.completed).length;
                    return (
                      <button
                        key={trip.id}
                        type="button"
                        onClick={() => {
                          setSelectedItineraryId(trip.id);
                          setSelectedDay('all');
                        }}
                        className={`w-64 shrink-0 text-left rounded-3xl overflow-hidden transition-all ${
                          lightMode ? 'liquid-glass-light' : 'liquid-glass'
                        } ${
                          isSelected
                            ? 'ring-2 ring-sky-500'
                            : 'opacity-85 hover:opacity-100'
                        }`}
                      >
                        <div className="relative h-28 w-full bg-slate-900">
                          <img
                            src={trip.coverUrl}
                            alt={trip.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 flex flex-col justify-end">
                            <div className="text-[11px] font-mono-tabular text-sky-200 flex items-center gap-1.5">
                              <img
                                src={getCountryFlagImageUrl(trip.countryCode)}
                                alt={trip.country}
                                referrerPolicy="no-referrer"
                                className="w-4 h-3 rounded-[2px] object-cover border border-white/60 shrink-0"
                              />
                              <span className="truncate">
                                {trip.destinationCity} · {trip.startDate}
                              </span>
                            </div>
                            <h3 className="font-display font-bold text-sm text-white truncate mt-0.5">
                              {trip.title}
                            </h3>
                          </div>
                        </div>
                        <div className="px-3.5 py-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                          <span>{trip.activities.length} stops</span>
                          <span className="font-mono-tabular text-emerald-600 font-bold">
                            {doneCount}/{trip.activities.length} done
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Trip Day-by-Day Card */}
                <div
                  className={`rounded-3xl overflow-hidden ${
                    lightMode ? 'liquid-glass-light' : 'liquid-glass'
                  }`}
                >
                  <div className="relative h-44 w-full bg-slate-900">
                    <img
                      src={activeItinerary.coverUrl}
                      alt={activeItinerary.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent p-4 flex flex-col justify-end">
                      <div className="flex items-center gap-2 text-xs font-mono-tabular text-sky-300">
                        <img
                          src={getCountryFlagImageUrl(activeItinerary.countryCode)}
                          alt={activeItinerary.country}
                          referrerPolicy="no-referrer"
                          className="w-5 h-3.5 rounded-[2px] object-cover border border-white/70"
                        />
                        <span>
                          {activeItinerary.startDate} → {activeItinerary.endDate}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-xl text-white mt-0.5 leading-snug">
                        {activeItinerary.title}
                      </h3>

                      <div className="flex items-center gap-1.5 mt-2.5">
                        {(['all', 1, 2, 3] as const).map((d) => (
                          <button
                            key={String(d)}
                            type="button"
                            onClick={() => setSelectedDay(d)}
                            className={`min-h-[30px] px-3 py-1 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                              selectedDay === d
                                ? 'bg-sky-500 text-white shadow-xs'
                                : 'bg-white/15 backdrop-blur-md text-white hover:bg-white/25 border border-white/20'
                            }`}
                          >
                            {d === 'all' ? 'All Days' : `Day ${d}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div
                      className={`divide-y ${
                        lightMode ? 'divide-slate-200/80' : 'divide-white/10'
                      }`}
                    >
                      {activeItinerary.activities
                        .filter((act) => selectedDay === 'all' || act.day === selectedDay)
                        .map((act) => (
                          <div key={act.id} className="py-3.5 flex items-start gap-3 group">
                            <button
                              type="button"
                              onClick={() => onToggleActivity(activeItinerary.id, act.id)}
                              className="min-h-[34px] min-w-[34px] -ml-1 rounded-xl flex items-center justify-center text-sky-600 hover:bg-sky-500/10 transition-colors shrink-0"
                            >
                              {act.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-400" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono-tabular text-slate-500">
                                <span className="text-sky-600 font-bold">Day {act.day}</span>
                                <span aria-hidden="true">·</span>
                                <span>{act.time}</span>
                                <span aria-hidden="true">·</span>
                                <span>{act.category}</span>
                                <span aria-hidden="true">·</span>
                                <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                                  <MapPin className="w-3 h-3 text-amber-500" />
                                  {act.location}
                                </span>
                              </div>

                              <h4
                                className={`font-display font-bold text-sm mt-1 ${
                                  act.completed
                                    ? 'line-through text-slate-400'
                                    : lightMode
                                    ? 'text-slate-900'
                                    : 'text-white'
                                }`}
                              >
                                {act.title}
                              </h4>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Quick Add Stop Form */}
                    <form
                      onSubmit={handleCreateActivity}
                      className={`mt-3 pt-3.5 border-t space-y-2.5 ${
                        lightMode ? 'border-slate-200' : 'border-white/10'
                      }`}
                    >
                      <div
                        className={`text-xs font-display font-bold flex items-center gap-1.5 ${
                          lightMode ? 'text-slate-800' : 'text-slate-200'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5 text-sky-600" />
                        <span>Add Stop to {activeItinerary.destinationCity}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={newDay}
                          onChange={(e) => setNewDay(Number(e.target.value))}
                          className={`h-9 px-2.5 rounded-xl border text-xs font-medium ${
                            lightMode
                              ? 'bg-white border-slate-300 text-slate-900'
                              : 'bg-slate-900/80 border-white/15 text-white'
                          }`}
                        >
                          <option value={1}>Day 1</option>
                          <option value={2}>Day 2</option>
                          <option value={3}>Day 3</option>
                        </select>
                        <input
                          type="time"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className={`h-9 px-2.5 rounded-xl border text-xs font-mono-tabular ${
                            lightMode
                              ? 'bg-white border-slate-300 text-slate-900'
                              : 'bg-white/5 border-white/15 text-white'
                          }`}
                        />
                        <select
                          value={newCategory}
                          onChange={(e) =>
                            setNewCategory(e.target.value as ItineraryActivity['category'])
                          }
                          className={`h-9 px-2.5 rounded-xl border text-xs font-medium ${
                            lightMode
                              ? 'bg-white border-slate-300 text-slate-900'
                              : 'bg-slate-900/80 border-white/15 text-white'
                          }`}
                        >
                          <option value="Explore">Explore</option>
                          <option value="Dining">Dining</option>
                          <option value="Transit">Transit</option>
                          <option value="Stay">Stay</option>
                          <option value="Flight">Flight</option>
                        </select>
                      </div>

                      <input
                        type="text"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="Neighborhood or landmark..."
                        className={`w-full h-9 px-3 rounded-xl border text-xs ${
                          lightMode
                            ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                            : 'bg-white/5 border-white/15 text-white placeholder:text-slate-500'
                        }`}
                      />

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Activity title..."
                          required
                          className={`flex-1 h-9 px-3 rounded-xl border text-xs ${
                            lightMode
                              ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                              : 'bg-white/5 border-white/15 text-white placeholder:text-slate-500'
                          }`}
                        />
                        <button
                          type="submit"
                          className="min-h-[36px] px-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      ) : (
        /* 24 Popular World City Destination Guides */
        <div className="space-y-4">
          {/* Search Input */}
          <div
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl ${
              lightMode ? 'liquid-glass-subtle-light' : 'liquid-glass-subtle'
            }`}
          >
            <Search className="w-4 h-4 text-sky-600 shrink-0" />
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder="Search 22 popular cities (Tokyo, Paris, NYC, Barcelona, Seoul...)"
              className="w-full bg-transparent text-xs font-medium focus:outline-none"
            />
          </div>

          {/* Quick City Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              type="button"
              onClick={() => setCitySearch('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                citySearch === ''
                  ? 'bg-sky-600 text-white shadow-xs'
                  : lightMode
                  ? 'bg-white/80 text-slate-700 border border-slate-200/80'
                  : 'bg-white/10 text-slate-300'
              }`}
            >
              All Cities ({guides.length})
            </button>
            {guides.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() =>
                  setCitySearch((prev) => (prev === g.city ? '' : g.city))
                }
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                  citySearch === g.city
                    ? 'bg-sky-600 text-white shadow-xs'
                    : lightMode
                    ? 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200/80'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                <img
                  src={getCountryFlagImageUrl(g.countryCode)}
                  alt={g.country}
                  referrerPolicy="no-referrer"
                  className="w-4 h-3 rounded-[2px] object-cover border border-white/60 shrink-0"
                />
                <span>{g.city}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className={`rounded-3xl overflow-hidden flex flex-col ${
                lightMode ? 'liquid-glass-light' : 'liquid-glass'
              }`}
            >
              <div className="relative h-52 w-full bg-slate-900">
                <img
                  src={guide.coverUrl}
                  alt={guide.city}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 flex flex-col justify-end">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono-tabular text-sky-200 flex items-center gap-1.5">
                        <img
                          src={getCountryFlagImageUrl(guide.countryCode)}
                          alt={guide.country}
                          referrerPolicy="no-referrer"
                          className="w-5 h-3.5 rounded-[2px] object-cover border border-white/80 shrink-0"
                        />
                        <span>
                          {guide.country} · {guide.bestSeason}
                        </span>
                      </span>
                      <h3 className="font-display font-bold text-2xl text-white mt-0.5">
                        {guide.city}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleBookmarkGuide(guide.id)}
                      className={`min-h-[36px] px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        guide.bookmarked
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-black/50 text-white hover:bg-black/70 border border-white/20'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{guide.bookmarked ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                    {guide.tagline}
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-3.5">
                <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-start gap-2.5">
                  <Train className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div
                    className={`text-xs leading-relaxed ${
                      lightMode ? 'text-slate-700' : 'text-slate-200'
                    }`}
                  >
                    <span className="font-bold">Airport Transit: </span>
                    {guide.airportTransit}
                  </div>
                </div>

                <div
                  className={`divide-y ${
                    lightMode ? 'divide-slate-200/80' : 'divide-white/10'
                  }`}
                >
                  {guide.highlights.map((hl, idx) => (
                    <div key={idx} className="py-2.5 flex items-start gap-3">
                      {hl.photoUrl && (
                        <img
                          src={hl.photoUrl}
                          alt={hl.title}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-2xl object-cover border border-white shadow-xs shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span
                            className={`font-display font-bold truncate ${
                              lightMode ? 'text-slate-900' : 'text-white'
                            }`}
                          >
                            {hl.title}
                          </span>
                          <span className="text-[11px] text-amber-600 font-bold font-mono-tabular shrink-0">
                            {hl.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {hl.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className={`pt-2.5 border-t flex items-start gap-2 text-xs ${
                    lightMode
                      ? 'border-slate-200/80 text-slate-700'
                      : 'border-white/10 text-slate-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-600">Flyer Insider Tip: </span>
                    {guide.localTip}
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
};
