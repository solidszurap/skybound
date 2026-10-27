import React, { useRef, useState } from 'react';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Plane,
  Share2,
  Trash2,
  Upload,
} from 'lucide-react';
import { DistanceUnit, FlightJourney, FlightPhoto } from '../types/skybound';
import { formatDistance, formatDuration } from '../data/worldGeoData';
import { AirlineLogo } from './AirlineLogo';
import { getCountryFlagImageUrl } from '../data/allCountries';
import { getCountryPhotoUrl } from '../data/travelArtwork';

interface BoardingPassCardProps {
  flight: FlightJourney;
  unit: DistanceUnit;
  onAddPhoto: (flightId: string, photo: FlightPhoto) => void;
  onDeleteFlight: (flightId: string) => void;
  onShareFlightToSocial: (flight: FlightJourney) => void;
  onSelectCountry: (countryCode: string) => void;
  lightMode?: boolean;
}

export const BoardingPassCard: React.FC<BoardingPassCardProps> = ({
  flight,
  unit,
  onAddPhoto,
  onDeleteFlight,
  onShareFlightToSocial,
  onSelectCountry,
  lightMode = true,
}) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [captionInput, setCaptionInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onAddPhoto(flight.id, {
            id: `ph-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            url: reader.result,
            caption: captionInput.trim() || `${flight.destination.city} Journey Photo`,
            location: `${flight.destination.city}, ${flight.destination.country}`,
            takenAt: flight.date,
          });
          setCaptionInput('');
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const bannerPhotoUrl =
    flight.photos[0]?.url ||
    getCountryPhotoUrl(flight.destination.countryCode, flight.destination.continent);

  return (
    <div
      className={`rounded-3xl overflow-hidden transition-all duration-200 ${
        lightMode ? 'liquid-glass-light' : 'liquid-glass'
      }`}
    >
      {/* Real Destination / Uploaded Photo Header Banner + Official Airline Logo */}
      <div className="relative h-36 w-full overflow-hidden bg-slate-900">
        <img
          src={bannerPhotoUrl}
          alt={`${flight.destination.city}, ${flight.destination.country}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/15" />

        {/* Top-Right Virtual Collection Badge */}
        <div className="absolute top-3 right-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/55 backdrop-blur-md border border-white/20 text-[11px] font-mono-tabular">
          <span
            className={
              flight.status === 'Upcoming'
                ? 'text-amber-300 font-bold'
                : 'text-emerald-300 font-semibold'
            }
          >
            {flight.status}
          </span>
          <span aria-hidden="true" className="text-white/40">
            ·
          </span>
          <span className="text-white/95">{flight.date}</span>
        </div>

        {/* Airline Logo & Flight Details Bottom-Left */}
        <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <AirlineLogo
              airlineCode={flight.airlineCode}
              airlineName={flight.airline}
              size="md"
            />
            <div className="min-w-0">
              <div className="text-sm font-display font-bold text-white truncate drop-shadow-xs">
                {flight.airline}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono-tabular text-sky-200">
                <span className="font-bold text-sky-300">{flight.flightNumber}</span>
                <span aria-hidden="true">·</span>
                <span className="truncate text-slate-200">{flight.aircraft}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main IATA Route Header with Real National Flag Images */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-3 items-center gap-2">
          {/* Origin */}
          <button
            type="button"
            onClick={() => onSelectCountry(flight.origin.countryCode)}
            className="text-left group"
          >
            <div
              className={`font-display text-3xl font-extrabold tracking-tight group-hover:text-sky-600 transition-colors ${
                lightMode ? 'text-slate-900' : 'text-white'
              }`}
            >
              {flight.origin.iata}
            </div>
            <div
              className={`text-xs truncate mt-1 flex items-center gap-1.5 font-medium ${
                lightMode ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              <img
                src={getCountryFlagImageUrl(flight.origin.countryCode)}
                alt={flight.origin.country}
                referrerPolicy="no-referrer"
                className="w-4 h-3 rounded-[2px] object-cover border border-slate-300 shrink-0"
              />
              <span className="truncate">{flight.origin.city}</span>
            </div>
            <div
              className={`text-xs font-mono-tabular font-semibold mt-1 ${
                lightMode ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              {flight.departureTime}
            </div>
          </button>

          {/* Center Flight Trajectory */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-[11px] font-mono-tabular text-sky-600 font-bold">
              {formatDuration(flight.durationMinutes)}
            </div>
            <div className="w-full flex items-center gap-1.5 my-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0" />
              <div className="h-px flex-1 border-t border-dashed border-sky-500/60" />
              <Plane className="w-4 h-4 text-sky-600 shrink-0" />
              <div className="h-px flex-1 border-t border-dashed border-sky-500/60" />
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            </div>
            <div className="text-[11px] font-mono-tabular text-slate-500 font-medium">
              {formatDistance(flight.distanceKm, unit)}
            </div>
          </div>

          {/* Destination */}
          <button
            type="button"
            onClick={() => onSelectCountry(flight.destination.countryCode)}
            className="text-right group"
          >
            <div
              className={`font-display text-3xl font-extrabold tracking-tight group-hover:text-sky-600 transition-colors ${
                lightMode ? 'text-slate-900' : 'text-white'
              }`}
            >
              {flight.destination.iata}
            </div>
            <div
              className={`text-xs truncate mt-1 flex items-center justify-end gap-1.5 font-medium ${
                lightMode ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              <img
                src={getCountryFlagImageUrl(flight.destination.countryCode)}
                alt={flight.destination.country}
                referrerPolicy="no-referrer"
                className="w-4 h-3 rounded-[2px] object-cover border border-slate-300 shrink-0"
              />
              <span className="truncate">{flight.destination.city}</span>
            </div>
            <div
              className={`text-xs font-mono-tabular font-semibold mt-1 ${
                lightMode ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              {flight.arrivalTime}
            </div>
          </button>
        </div>

        {/* Perforated Virtual Boarding Pass Stub Divider */}
        <div className="relative my-3.5 flex items-center">
          <div
            className={`w-3 h-6 -ml-6 rounded-r-full border-r ${
              lightMode
                ? 'bg-[#F0F7FF] border-slate-200'
                : 'bg-[#070B14] border-white/15'
            }`}
          />
          <div
            className={`w-full border-t border-dashed ${
              lightMode ? 'border-slate-300' : 'border-white/15'
            }`}
          />
          <div
            className={`w-3 h-6 -mr-6 rounded-l-full border-l ${
              lightMode
                ? 'bg-[#F0F7FF] border-slate-200'
                : 'bg-[#070B14] border-white/15'
            }`}
          />
        </div>

        {/* Flight Log Telemetry Row: Aircraft · Cabin · Seat · Terminal · Gate */}
        <div className="grid grid-cols-4 gap-2 text-left">
          <div>
            <div className="text-[10px] font-medium text-slate-500">Cabin Class</div>
            <div
              className={`text-xs font-bold truncate mt-0.5 ${
                lightMode ? 'text-slate-900' : 'text-white'
              }`}
            >
              {flight.cabin}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-medium text-slate-500">Seat</div>
            <div
              className={`text-xs font-mono-tabular font-bold mt-0.5 ${
                lightMode ? 'text-slate-900' : 'text-white'
              }`}
            >
              {flight.seat}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-medium text-slate-500">Terminal</div>
            <div
              className={`text-xs font-mono-tabular font-bold mt-0.5 ${
                lightMode ? 'text-slate-900' : 'text-white'
              }`}
            >
              {flight.terminal}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-medium text-slate-500">Gate</div>
            <div className="text-xs font-mono-tabular font-bold text-amber-600 mt-0.5">
              {flight.gate}
            </div>
          </div>
        </div>

        {/* Personal Flight Log Notes */}
        {flight.notes && (
          <p
            className={`mt-3 text-xs leading-relaxed ${
              lightMode ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            {flight.notes}
          </p>
        )}

        {/* Action Bar: Upload Own Photos · Share · Toggle Gallery */}
        <div
          className={`mt-3.5 pt-3 border-t flex items-center justify-between gap-2 ${
            lightMode ? 'border-slate-200/80' : 'border-white/10'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[34px] px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Add Photos</span>
            </button>

            <button
              type="button"
              onClick={() => onShareFlightToSocial(flight)}
              className={`min-h-[34px] px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                lightMode
                  ? 'text-slate-700 hover:bg-slate-200/70'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Share</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className={`min-h-[34px] px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                lightMode
                  ? 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-900'
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-sky-600" />
              <span>Photos ({flight.photos.length})</span>
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onDeleteFlight(flight.id)}
              title="Delete flight log"
              className="min-h-[34px] min-w-[34px] rounded-xl text-rose-500 hover:bg-rose-500/10 flex items-center justify-center transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Journey Photo Gallery */}
      {expanded && flight.photos.length > 0 && (
        <div
          className={`px-5 pb-4 pt-3 border-t space-y-3 ${
            lightMode
              ? 'border-slate-200 bg-slate-50/70'
              : 'border-white/10 bg-black/25'
          }`}
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={captionInput}
              onChange={(e) => setCaptionInput(e.target.value)}
              placeholder="Caption for next uploaded photo..."
              className={`flex-1 h-8 px-2.5 rounded-xl border text-xs focus:outline-none focus:border-sky-500 ${
                lightMode
                  ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  : 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'
              }`}
            />
          </div>

          <div
            className={`grid gap-2.5 ${
              flight.photos.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {flight.photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-[4/3]"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                  <div className="text-xs font-bold text-white line-clamp-1">
                    {photo.caption}
                  </div>
                  <div className="text-[10px] text-slate-200 mt-0.5 truncate">
                    {photo.location} · {photo.takenAt}
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
