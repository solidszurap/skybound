import React, { useMemo, useRef, useState } from 'react';
import { Camera, Check, Plane, Plus, Search, Upload, X } from 'lucide-react';
import {
  CabinClass,
  DistanceUnit,
  FlightJourney,
  FlightPhoto,
  FlightStatus,
} from '../types/skybound';
import {
  AIRPORTS,
  calculateGreatCircleKm,
  estimateFlightMinutes,
  formatDistance,
  formatDuration,
} from '../data/worldGeoData';
import { getCountryPhotoUrl } from '../data/travelArtwork';
import { AirlineLogo } from './AirlineLogo';
import { getCountryFlagImageUrl } from '../data/allCountries';

interface FlightLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveFlight: (flight: FlightJourney, shareToFeed: boolean) => void;
  unit: DistanceUnit;
  lightMode?: boolean;
}

export interface AirlinePreset {
  code: string;
  name: string;
  region: 'Europe' | 'Americas' | 'Asia-Pacific' | 'Middle East & Africa';
}

export const AIRLINE_PRESETS: AirlinePreset[] = [
  // Europe
  { code: 'LH', name: 'Lufthansa', region: 'Europe' },
  { code: 'BA', name: 'British Airways', region: 'Europe' },
  { code: 'AF', name: 'Air France', region: 'Europe' },
  { code: 'KL', name: 'KLM Royal Dutch Airlines', region: 'Europe' },
  { code: 'LX', name: 'SWISS', region: 'Europe' },
  { code: 'TK', name: 'Turkish Airlines', region: 'Europe' },
  { code: 'IB', name: 'Iberia', region: 'Europe' },
  { code: 'TP', name: 'TAP Air Portugal', region: 'Europe' },
  { code: 'AZ', name: 'ITA Airways', region: 'Europe' },
  { code: 'VS', name: 'Virgin Atlantic', region: 'Europe' },
  { code: 'SK', name: 'SAS Scandinavian Airlines', region: 'Europe' },
  { code: 'AY', name: 'Finnair', region: 'Europe' },
  { code: 'LO', name: 'LOT Polish Airlines', region: 'Europe' },
  { code: 'OS', name: 'Austrian Airlines', region: 'Europe' },
  { code: 'SN', name: 'Brussels Airlines', region: 'Europe' },
  { code: 'EI', name: 'Aer Lingus', region: 'Europe' },
  { code: 'A3', name: 'Aegean Airlines', region: 'Europe' },
  { code: 'FI', name: 'Icelandair', region: 'Europe' },
  { code: 'FR', name: 'Ryanair', region: 'Europe' },
  { code: 'U2', name: 'easyJet', region: 'Europe' },
  { code: 'W6', name: 'Wizz Air', region: 'Europe' },
  { code: 'VY', name: 'Vueling', region: 'Europe' },
  { code: 'DY', name: 'Norwegian', region: 'Europe' },
  { code: 'EW', name: 'Eurowings', region: 'Europe' },
  { code: 'PC', name: 'Pegasus Airlines', region: 'Europe' },
  { code: 'UX', name: 'Air Europa', region: 'Europe' },
  { code: 'BT', name: 'airBaltic', region: 'Europe' },
  { code: 'LS', name: 'Jet2.com', region: 'Europe' },
  { code: 'DE', name: 'Condor', region: 'Europe' },
  { code: 'RO', name: 'TAROM', region: 'Europe' },
  { code: 'JU', name: 'Air Serbia', region: 'Europe' },
  { code: 'OU', name: 'Croatia Airlines', region: 'Europe' },
  { code: 'FB', name: 'Bulgaria Air', region: 'Europe' },
  { code: 'LG', name: 'Luxair', region: 'Europe' },
  { code: 'KM', name: 'KM Malta Airlines', region: 'Europe' },

  // Americas
  { code: 'DL', name: 'Delta Air Lines', region: 'Americas' },
  { code: 'UA', name: 'United Airlines', region: 'Americas' },
  { code: 'AA', name: 'American Airlines', region: 'Americas' },
  { code: 'AC', name: 'Air Canada', region: 'Americas' },
  { code: 'WN', name: 'Southwest Airlines', region: 'Americas' },
  { code: 'B6', name: 'JetBlue Airways', region: 'Americas' },
  { code: 'AS', name: 'Alaska Airlines', region: 'Americas' },
  { code: 'WS', name: 'WestJet', region: 'Americas' },
  { code: 'HA', name: 'Hawaiian Airlines', region: 'Americas' },
  { code: 'NK', name: 'Spirit Airlines', region: 'Americas' },
  { code: 'F9', name: 'Frontier Airlines', region: 'Americas' },
  { code: 'TS', name: 'Air Transat', region: 'Americas' },
  { code: 'PD', name: 'Porter Airlines', region: 'Americas' },
  { code: 'AM', name: 'Aeroméxico', region: 'Americas' },
  { code: 'LA', name: 'LATAM Airlines', region: 'Americas' },
  { code: 'AV', name: 'Avianca', region: 'Americas' },
  { code: 'CM', name: 'Copa Airlines', region: 'Americas' },
  { code: 'AD', name: 'Azul Airlines', region: 'Americas' },
  { code: 'G3', name: 'GOL Linhas Aéreas', region: 'Americas' },
  { code: 'AR', name: 'Aerolíneas Argentinas', region: 'Americas' },

  // Asia-Pacific
  { code: 'SQ', name: 'Singapore Airlines', region: 'Asia-Pacific' },
  { code: 'NH', name: 'All Nippon Airways', region: 'Asia-Pacific' },
  { code: 'JL', name: 'Japan Airlines', region: 'Asia-Pacific' },
  { code: 'CX', name: 'Cathay Pacific', region: 'Asia-Pacific' },
  { code: 'KE', name: 'Korean Air', region: 'Asia-Pacific' },
  { code: 'OZ', name: 'Asiana Airlines', region: 'Asia-Pacific' },
  { code: 'BR', name: 'EVA Air', region: 'Asia-Pacific' },
  { code: 'CI', name: 'China Airlines', region: 'Asia-Pacific' },
  { code: 'JX', name: 'STARLUX Airlines', region: 'Asia-Pacific' },
  { code: 'QF', name: 'Qantas', region: 'Asia-Pacific' },
  { code: 'NZ', name: 'Air New Zealand', region: 'Asia-Pacific' },
  { code: 'TG', name: 'Thai Airways', region: 'Asia-Pacific' },
  { code: 'MH', name: 'Malaysia Airlines', region: 'Asia-Pacific' },
  { code: 'GA', name: 'Garuda Indonesia', region: 'Asia-Pacific' },
  { code: 'VN', name: 'Vietnam Airlines', region: 'Asia-Pacific' },
  { code: 'PR', name: 'Philippine Airlines', region: 'Asia-Pacific' },
  { code: 'AI', name: 'Air India', region: 'Asia-Pacific' },
  { code: '6E', name: 'IndiGo', region: 'Asia-Pacific' },
  { code: 'AK', name: 'AirAsia', region: 'Asia-Pacific' },
  { code: 'TR', name: 'Scoot', region: 'Asia-Pacific' },
  { code: 'JQ', name: 'Jetstar', region: 'Asia-Pacific' },
  { code: 'CA', name: 'Air China', region: 'Asia-Pacific' },
  { code: 'CZ', name: 'China Southern', region: 'Asia-Pacific' },
  { code: 'MU', name: 'China Eastern', region: 'Asia-Pacific' },
  { code: 'HU', name: 'Hainan Airlines', region: 'Asia-Pacific' },
  { code: 'PG', name: 'Bangkok Airways', region: 'Asia-Pacific' },
  { code: 'UL', name: 'SriLankan Airlines', region: 'Asia-Pacific' },
  { code: 'VJ', name: 'VietJet Air', region: 'Asia-Pacific' },
  { code: 'VA', name: 'Virgin Australia', region: 'Asia-Pacific' },
  { code: 'FJ', name: 'Fiji Airways', region: 'Asia-Pacific' },

  // Middle East & Africa
  { code: 'EK', name: 'Emirates', region: 'Middle East & Africa' },
  { code: 'QR', name: 'Qatar Airways', region: 'Middle East & Africa' },
  { code: 'EY', name: 'Etihad Airways', region: 'Middle East & Africa' },
  { code: 'SV', name: 'Saudia', region: 'Middle East & Africa' },
  { code: 'FZ', name: 'flydubai', region: 'Middle East & Africa' },
  { code: 'G9', name: 'Air Arabia', region: 'Middle East & Africa' },
  { code: 'WY', name: 'Oman Air', region: 'Middle East & Africa' },
  { code: 'GF', name: 'Gulf Air', region: 'Middle East & Africa' },
  { code: 'RJ', name: 'Royal Jordanian', region: 'Middle East & Africa' },
  { code: 'KU', name: 'Kuwait Airways', region: 'Middle East & Africa' },
  { code: 'ME', name: 'Middle East Airlines', region: 'Middle East & Africa' },
  { code: 'LY', name: 'El Al', region: 'Middle East & Africa' },
  { code: 'ET', name: 'Ethiopian Airlines', region: 'Middle East & Africa' },
  { code: 'AT', name: 'Royal Air Maroc', region: 'Middle East & Africa' },
  { code: 'MS', name: 'EgyptAir', region: 'Middle East & Africa' },
  { code: 'KQ', name: 'Kenya Airways', region: 'Middle East & Africa' },
  { code: 'SA', name: 'South African Airways', region: 'Middle East & Africa' },
  { code: 'MK', name: 'Air Mauritius', region: 'Middle East & Africa' },
];

const AIRCRAFT_PRESETS = [
  'Airbus A350-900',
  'Airbus A350-1000',
  'Boeing 787-9 Dreamliner',
  'Boeing 787-10 Dreamliner',
  'Boeing 777-300ER',
  'Boeing 747-8 Intercontinental',
  'Airbus A380-800',
  'Airbus A330-900neo',
  'Airbus A321neo',
  'Airbus A320neo',
  'Airbus A220-300',
  'Boeing 737 MAX 8',
  'Boeing 737-800',
  'Embraer E195-E2',
];

export const FlightLoggerModal: React.FC<FlightLoggerModalProps> = ({
  isOpen,
  onClose,
  onSaveFlight,
  unit,
  lightMode = false,
}) => {
  const [originIata, setOriginIata] = useState<string>('LHR');
  const [destinationIata, setDestinationIata] = useState<string>('HND');
  const [airline, setAirline] = useState<string>('All Nippon Airways');
  const [airlineCode, setAirlineCode] = useState<string>('NH');
  const [airlineSearch, setAirlineSearch] = useState<string>('');
  const [airlineRegion, setAirlineRegion] = useState<
    'All' | 'Europe' | 'Americas' | 'Asia-Pacific' | 'Middle East & Africa'
  >('All');
  const [flightNumber, setFlightNumber] = useState<string>('NH 212');
  const [date, setDate] = useState<string>('2026-10-27');
  const [departureTime, setDepartureTime] = useState<string>('19:00');
  const [arrivalTime, setArrivalTime] = useState<string>('15:45');
  const [cabin, setCabin] = useState<CabinClass>('Economy');
  const [seat, setSeat] = useState<string>('14A');
  const [terminal, setTerminal] = useState<string>('T2');
  const [gate, setGate] = useState<string>('B36');
  const [aircraft, setAircraft] = useState<string>('Boeing 777-300ER');
  const [status, setStatus] = useState<FlightStatus>('Completed');
  const [notes, setNotes] = useState<string>('');
  const [photoCaption, setPhotoCaption] = useState<string>('');
  const [photos, setPhotos] = useState<FlightPhoto[]>([]);
  const [shareToFeed, setShareToFeed] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const originAirport = useMemo(
    () => AIRPORTS.find((a) => a.iata === originIata) || AIRPORTS[0],
    [originIata]
  );
  const destinationAirport = useMemo(
    () => AIRPORTS.find((a) => a.iata === destinationIata) || AIRPORTS[1],
    [destinationIata]
  );

  const filteredAirlines = useMemo(() => {
    const q = airlineSearch.trim().toLowerCase();
    return AIRLINE_PRESETS.filter((item) => {
      if (airlineRegion !== 'All' && item.region !== airlineRegion) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q)
      );
    });
  }, [airlineSearch, airlineRegion]);

  const computedDistanceKm = useMemo(
    () =>
      calculateGreatCircleKm(
        originAirport.lat,
        originAirport.lon,
        destinationAirport.lat,
        destinationAirport.lon
      ),
    [originAirport, destinationAirport]
  );

  const computedDurationMinutes = useMemo(
    () => estimateFlightMinutes(computedDistanceKm),
    [computedDistanceKm]
  );

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotos((prev) => [
            ...prev,
            {
              id: `up-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              url: reader.result as string,
              caption:
                photoCaption.trim() || `${destinationAirport.city} Journey Photo`,
              location: `${destinationAirport.city}, ${destinationAirport.country}`,
              takenAt: date,
            },
          ]);
          setPhotoCaption('');
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (originIata === destinationIata) {
      setErrorMsg('Origin and destination airports must be different.');
      return;
    }

    const newFlight: FlightJourney = {
      id: `fl-${Date.now()}`,
      flightNumber: flightNumber.trim() || `${airlineCode} 101`,
      airline: airline.trim() || 'Global Airways',
      airlineCode: (airlineCode.trim() || 'SB').toUpperCase().slice(0, 3),
      origin: originAirport,
      destination: destinationAirport,
      date,
      departureTime,
      arrivalTime,
      distanceKm: computedDistanceKm,
      durationMinutes: computedDurationMinutes,
      aircraft,
      cabin,
      seat: seat.trim() || '14A',
      terminal: terminal.trim() || 'T1',
      gate: gate.trim() || 'A12',
      pnr: Math.random().toString(36).substring(2, 8).toUpperCase(),
      status,
      notes: notes.trim(),
      photos,
    };

    onSaveFlight(newFlight, shareToFeed);
    setNotes('');
    setPhotos([]);
    onClose();
  };

  const destBannerPhoto =
    photos[0]?.url ||
    getCountryPhotoUrl(destinationAirport.countryCode, destinationAirport.continent);

  const inputClass = lightMode
    ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-sky-500'
    : 'bg-slate-900/90 border-white/15 text-white placeholder:text-slate-500 focus:border-sky-400';

  const labelClass = lightMode
    ? 'block text-xs font-bold text-slate-700 mb-1'
    : 'block text-xs font-bold text-slate-300 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div
        className={`w-full max-w-[480px] rounded-[32px] border overflow-hidden shadow-2xl ${
          lightMode
            ? 'liquid-glass-light border-white'
            : 'liquid-glass border-white/15'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-5 py-3.5 border-b flex items-center justify-between ${
            lightMode
              ? 'border-slate-200/80 bg-white/80'
              : 'border-white/10 bg-slate-950/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <AirlineLogo airlineCode={airlineCode} airlineName={airline} size="md" />
            <div>
              <h3
                className={`font-display font-bold text-base ${
                  lightMode ? 'text-slate-900' : 'text-white'
                }`}
              >
                Log Flight Journey
              </h3>
              <p className="text-[11px] text-slate-400">
                Flight telemetry, photos &amp; virtual boarding pass
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`min-h-[36px] min-w-[36px] rounded-full flex items-center justify-center transition-colors ${
              lightMode
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[82vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-400/40 text-xs text-rose-400 font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Live Route Preview Banner */}
          <div className="relative rounded-2xl overflow-hidden h-32 bg-slate-900 border border-white/20 shadow-sm">
            <img
              src={destBannerPhoto}
              alt={destinationAirport.country}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/15 p-3.5 flex items-end justify-between gap-2">
              <div>
                <div className="font-display font-extrabold text-xl text-white tracking-tight flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5">
                    <img
                      src={getCountryFlagImageUrl(originAirport.countryCode)}
                      alt={originAirport.country}
                      referrerPolicy="no-referrer"
                      className="w-5 h-3.5 rounded-[2px] object-cover border border-white/80"
                    />
                    <span>{originAirport.iata}</span>
                  </span>
                  <Plane className="w-4 h-4 text-sky-400" />
                  <span className="inline-flex items-center gap-1.5">
                    <img
                      src={getCountryFlagImageUrl(destinationAirport.countryCode)}
                      alt={destinationAirport.country}
                      referrerPolicy="no-referrer"
                      className="w-5 h-3.5 rounded-[2px] object-cover border border-white/80"
                    />
                    <span>{destinationAirport.iata}</span>
                  </span>
                </div>
                <div className="text-[11px] text-slate-200 mt-0.5">
                  {originAirport.city} → {destinationAirport.city}, {destinationAirport.country}
                </div>
              </div>
              <div className="text-right font-mono-tabular shrink-0">
                <div className="text-xs font-bold text-sky-300">
                  {formatDistance(computedDistanceKm, unit)}
                </div>
                <div className="text-[10px] text-slate-300">
                  {formatDuration(computedDurationMinutes)}
                </div>
              </div>
            </div>
          </div>

          {/* Departure & Arrival Airports */}
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Departure Airport</label>
              <select
                value={originIata}
                onChange={(e) => {
                  setOriginIata(e.target.value);
                  setErrorMsg(null);
                }}
                className={`w-full h-10 px-3 rounded-xl border text-xs font-medium focus:outline-none ${inputClass}`}
              >
                {AIRPORTS.map((ap) => (
                  <option key={`${ap.countryCode}-${ap.iata}`} value={ap.iata}>
                    {ap.country} — {ap.city} ({ap.iata})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Arrival Airport</label>
              <select
                value={destinationIata}
                onChange={(e) => {
                  setDestinationIata(e.target.value);
                  setErrorMsg(null);
                }}
                className={`w-full h-10 px-3 rounded-xl border text-xs font-medium focus:outline-none ${inputClass}`}
              >
                {AIRPORTS.map((ap) => (
                  <option key={`${ap.countryCode}-${ap.iata}`} value={ap.iata}>
                    {ap.country} — {ap.city} ({ap.iata})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Global Airline Selector with Region Tabs, Search & Custom Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className={labelClass}>Airline ({AIRLINE_PRESETS.length}+ Carriers)</label>
              <span className="text-[11px] font-mono-tabular text-sky-400 font-semibold">
                {airline} ({airlineCode})
              </span>
            </div>

            {/* Search & Region Filter */}
            <div className="flex items-center gap-2">
              <div
                className={`flex-1 flex items-center gap-1.5 h-9 px-2.5 rounded-xl border ${inputClass}`}
              >
                <Search className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <input
                  type="text"
                  value={airlineSearch}
                  onChange={(e) => setAirlineSearch(e.target.value)}
                  placeholder="Search airline or IATA code (e.g., Wizz, Ryanair, KE, SQ)..."
                  className="w-full bg-transparent text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Region Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
              {(
                [
                  'All',
                  'Europe',
                  'Americas',
                  'Asia-Pacific',
                  'Middle East & Africa',
                ] as const
              ).map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setAirlineRegion(reg)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    airlineRegion === reg
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : lightMode
                      ? 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/70'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            {/* Horizontal Scrollable Airline Cards */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5">
              {filteredAirlines.map((preset) => (
                <button
                  key={preset.code}
                  type="button"
                  onClick={() => {
                    setAirlineCode(preset.code);
                    setAirline(preset.name);
                    setFlightNumber(`${preset.code} ${Math.floor(100 + Math.random() * 800)}`);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
                    airlineCode === preset.code
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                      : lightMode
                      ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:border-white/25'
                  }`}
                >
                  <AirlineLogo airlineCode={preset.code} airlineName={preset.name} size="sm" />
                  <div className="text-left">
                    <div
                      className={`text-xs font-bold leading-tight ${
                        lightMode ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {preset.name}
                    </div>
                    <div className="text-[10px] font-mono-tabular text-slate-400">
                      {preset.code}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Airline Name & IATA Code Override */}
            <div className="grid grid-cols-3 gap-2 pt-0.5">
              <div className="col-span-2">
                <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                  Airline Name
                </label>
                <input
                  type="text"
                  value={airline}
                  onChange={(e) => setAirline(e.target.value)}
                  className={`w-full h-9 px-2.5 rounded-xl border text-xs focus:outline-none ${inputClass}`}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                  IATA Code
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={airlineCode}
                  onChange={(e) => setAirlineCode(e.target.value.toUpperCase())}
                  className={`w-full h-9 px-2.5 rounded-xl border text-xs font-mono-tabular uppercase focus:outline-none ${inputClass}`}
                />
              </div>
            </div>
          </div>

          {/* Flight Details Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className={labelClass}>Flight Number</label>
              <input
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                required
                className={`w-full h-10 px-3 rounded-xl border text-xs font-mono-tabular focus:outline-none ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Flight Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full h-10 px-3 rounded-xl border text-xs font-mono-tabular focus:outline-none ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Departure Time</label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className={`w-full h-10 px-3 rounded-xl border text-xs font-mono-tabular focus:outline-none ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Arrival Time</label>
              <input
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className={`w-full h-10 px-3 rounded-xl border text-xs font-mono-tabular focus:outline-none ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Aircraft</label>
              <select
                value={aircraft}
                onChange={(e) => setAircraft(e.target.value)}
                className={`w-full h-10 px-2.5 rounded-xl border text-xs focus:outline-none ${inputClass}`}
              >
                {AIRCRAFT_PRESETS.map((ac) => (
                  <option key={ac} value={ac}>
                    {ac}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Cabin Class</label>
              <select
                value={cabin}
                onChange={(e) => setCabin(e.target.value as CabinClass)}
                className={`w-full h-10 px-2.5 rounded-xl border text-xs focus:outline-none ${inputClass}`}
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business</option>
                <option value="First">First Class</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className={labelClass}>Seat</label>
              <input
                type="text"
                value={seat}
                onChange={(e) => setSeat(e.target.value.toUpperCase())}
                className={`w-full h-9 px-2.5 rounded-xl border text-xs font-mono-tabular focus:outline-none ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Terminal</label>
              <input
                type="text"
                value={terminal}
                onChange={(e) => setTerminal(e.target.value.toUpperCase())}
                className={`w-full h-9 px-2.5 rounded-xl border text-xs font-mono-tabular focus:outline-none ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Gate</label>
              <input
                type="text"
                value={gate}
                onChange={(e) => setGate(e.target.value.toUpperCase())}
                className={`w-full h-9 px-2.5 rounded-xl border text-xs font-mono-tabular focus:outline-none ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FlightStatus)}
                className={`w-full h-9 px-2 rounded-xl border text-xs focus:outline-none ${inputClass}`}
              >
                <option value="Completed">Flown</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          {/* Flight Notes */}
          <div>
            <label className={labelClass}>Flight Notes &amp; Memories</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Window seat views, approach path, or trip highlights..."
              className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${inputClass}`}
            />
          </div>

          {/* Own Photo Uploader */}
          <div
            className={`p-3.5 rounded-2xl border space-y-2.5 ${
              lightMode
                ? 'bg-sky-50/80 border-sky-200/80'
                : 'bg-sky-500/10 border-sky-400/25'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className={`text-xs font-bold flex items-center gap-1.5 ${
                  lightMode ? 'text-slate-800' : 'text-white'
                }`}
              >
                <Camera className="w-4 h-4 text-sky-400" />
                <span>Journey Photos ({photos.length})</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[34px] px-3 py-1 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photos</span>
              </button>
            </div>

            <input
              type="text"
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              placeholder="Optional caption before uploading photo..."
              className={`w-full h-8 px-2.5 rounded-xl border text-xs focus:outline-none ${inputClass}`}
            />

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {photos.map((ph) => (
                  <div
                    key={ph.id}
                    className="relative rounded-xl overflow-hidden border border-white/20 aspect-[4/3]"
                  >
                    <img
                      src={ph.url}
                      alt={ph.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotos((prev) => prev.filter((item) => item.id !== ph.id))}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Share to Community Checkbox & Submit */}
          <div className="space-y-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => setShareToFeed((s) => !s)}
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                  shareToFeed
                    ? 'bg-sky-500 border-sky-400 text-slate-950'
                    : lightMode
                    ? 'bg-white border-slate-300'
                    : 'bg-white/5 border-white/25'
                }`}
              >
                {shareToFeed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <span
                className={`text-xs font-medium ${
                  lightMode ? 'text-slate-700' : 'text-slate-300'
                }`}
              >
                Also share this flight journey to the Community Feed
              </span>
            </label>

            <button
              type="submit"
              className="w-full min-h-[44px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/25 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Save Flight Journey</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
