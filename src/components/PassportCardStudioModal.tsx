import React, { useState } from 'react';
import { Award, Check, Download, Share2, Sparkles, X } from 'lucide-react';
import {
  AviationMilestone,
  CountryBadge,
  DistanceUnit,
  FlightJourney,
  PassportCardThemeId,
} from '../types/skybound';
import { formatDistance } from '../data/worldGeoData';
import { getCountryFlagImageUrl } from '../data/allCountries';

interface PassportCardStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  flights: FlightJourney[];
  countryBadges: CountryBadge[];
  milestones: AviationMilestone[];
  unit: DistanceUnit;
  onToggleUnit: () => void;
  onShareCardToCommunity: (summaryText: string) => void;
}

const THEMES: Record<
  PassportCardThemeId,
  {
    name: string;
    bgTop: string;
    bgBottom: string;
    accent: string;
    secondary: string;
    border: string;
  }
> = {
  midnight: {
    name: 'Obsidian Midnight',
    bgTop: '#0B132B',
    bgBottom: '#050814',
    accent: '#38BDF8',
    secondary: '#F59E0B',
    border: 'rgba(56, 189, 248, 0.35)',
  },
  stratosphere: {
    name: 'Stratosphere Azure',
    bgTop: '#0C4A6E',
    bgBottom: '#082F49',
    accent: '#7DD3FC',
    secondary: '#34D399',
    border: 'rgba(125, 211, 252, 0.4)',
  },
  gold: {
    name: 'Milestone Gold',
    bgTop: '#271A0C',
    bgBottom: '#0F0A05',
    accent: '#FBBF24',
    secondary: '#F97316',
    border: 'rgba(251, 191, 36, 0.4)',
  },
  aurora: {
    name: 'Sub-Arctic Aurora',
    bgTop: '#06392F',
    bgBottom: '#04171A',
    accent: '#34D399',
    secondary: '#2DD4BF',
    border: 'rgba(52, 211, 153, 0.4)',
  },
};

export const PassportCardStudioModal: React.FC<PassportCardStudioModalProps> = ({
  isOpen,
  onClose,
  flights,
  countryBadges,
  milestones,
  unit,
  onToggleUnit,
  onShareCardToCommunity,
}) => {
  const [themeId, setThemeId] = useState<PassportCardThemeId>('midnight');
  const [travelerName, setTravelerName] = useState<string>('ALEXANDER VANCE');
  const [passportYear, setPassportYear] = useState<'ALL-TIME' | '2026'>('ALL-TIME');
  const [includeBadges, setIncludeBadges] = useState<boolean>(true);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const theme = THEMES[themeId];
  const unlockedBadges = countryBadges.filter((b) => b.unlocked);
  const unlockedMilestones = milestones.filter((m) => m.unlocked);
  const totalDistanceKm = flights.reduce((sum, f) => sum + f.distanceKm, 0);
  const totalMinutes = flights.reduce((sum, f) => sum + f.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const earthOrbits = (totalDistanceKm / 40075).toFixed(2);
  const uniqueAirports = new Set(
    flights.flatMap((f) => [f.origin.iata, f.destination.iata])
  ).size;

  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    const w = 1080;
    const h = 1350;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, theme.bgTop);
    grad.addColorStop(1, theme.bgBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 3;
    ctx.strokeRect(44, 44, w - 88, h - 88);

    ctx.fillStyle = theme.accent;
    ctx.font = '700 26px "JetBrains Mono", monospace';
    ctx.fillText(`SKYBOUND EXPLORER PASSPORT · ${passportYear}`, 88, 118);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 58px "Outfit", sans-serif';
    ctx.fillText(travelerName.toUpperCase(), 88, 190);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `OFFICIAL FLIGHT LOG & COUNTRY REGISTRY · ${unlockedBadges.length} NATIONS UNLOCKED`,
      88,
      235
    );

    const stats = [
      { label: 'COUNTRIES VISITED', value: `${unlockedBadges.length}`, sub: `${Math.round((unlockedBadges.length / 195) * 100)}% of World` },
      { label: 'TOTAL DISTANCE', value: formatDistance(totalDistanceKm, unit), sub: `${earthOrbits}x Around Earth` },
      { label: 'HOURS AIRBORNE', value: `${totalHours} hrs`, sub: `${(Number(totalHours) / 24).toFixed(1)} Days in Sky` },
      { label: 'FLIGHTS & AIRPORTS', value: `${flights.length} Flights`, sub: `${uniqueAirports} Global Airports` },
    ];

    stats.forEach((st, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const bx = 88 + col * 462;
      const by = 315 + row * 210;

      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(bx, by, 440, 185);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.strokeRect(bx, by, 440, 185);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 20px "JetBrains Mono", monospace';
      ctx.fillText(st.label, bx + 28, by + 48);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 48px "Outfit", sans-serif';
      ctx.fillText(st.value, bx + 28, by + 112);

      ctx.fillStyle = theme.accent;
      ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(st.sub, bx + 28, by + 154);
    });

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 26px "Outfit", sans-serif';
    ctx.fillText('UNLOCKED COUNTRY FLAG BADGES', 88, 785);

    unlockedBadges.slice(0, 8).forEach((badge, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const bx = 88 + col * 230;
      const by = 815 + row * 125;

      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.fillRect(bx, by, 212, 105);
      ctx.strokeStyle = badge.accentColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, 212, 105);

      ctx.fillStyle = badge.accentColor;
      ctx.font = '700 22px "JetBrains Mono", monospace';
      ctx.fillText(`${badge.tier.toUpperCase()} STAMP`, bx + 18, by + 42);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 24px "Outfit", sans-serif';
      ctx.fillText(badge.country, bx + 18, by + 78);
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Skybound-Passport-${travelerName.replace(/\s+/g, '-')}.png`;
    link.href = dataUrl;
    link.click();

    setDownloadStatus('Downloaded high-resolution PNG!');
    setTimeout(() => setDownloadStatus(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="liquid-glass w-full max-w-[460px] rounded-[32px] border border-white/20 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Passport Stat Card Studio
              </h3>
              <p className="text-[11px] text-slate-300">
                Export your shareable Explorer Passport card
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[36px] min-w-[36px] rounded-full text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Live High-Contrast Passport Card Preview with Real Flags */}
          <div
            className="w-full rounded-3xl p-5 shadow-2xl relative overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${theme.bgTop} 0%, ${theme.bgBottom} 100%)`,
              border: `1.5px solid ${theme.border}`,
            }}
          >
            <div className="flex items-center justify-between text-[10px] font-mono-tabular">
              <span style={{ color: theme.accent }} className="font-bold tracking-wider">
                SKYBOUND PASSPORT · {passportYear}
              </span>
              <span className="text-slate-400">ID #SB-8841</span>
            </div>

            <div className="mt-1.5 flex items-baseline justify-between gap-2">
              <h2 className="font-display font-extrabold text-xl text-white tracking-tight truncate">
                {travelerName || 'EXPLORER'}
              </h2>
              <span className="text-xs font-mono-tabular text-amber-400 shrink-0">
                {unlockedBadges.length} Nations
              </span>
            </div>

            {/* 4-Metric Grid */}
            <div className="grid grid-cols-2 gap-2.5 mt-3.5">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[10px] font-mono-tabular text-slate-400">
                  COUNTRIES VISITED
                </div>
                <div className="font-display font-extrabold text-xl text-white mt-0.5">
                  {unlockedBadges.length}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: theme.accent }}>
                  {Math.round((unlockedBadges.length / 195) * 100)}% of World
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[10px] font-mono-tabular text-slate-400">
                  TOTAL DISTANCE
                </div>
                <div className="font-display font-extrabold text-xl text-white mt-0.5">
                  {formatDistance(totalDistanceKm, unit)}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: theme.accent }}>
                  {earthOrbits}x Around Earth
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[10px] font-mono-tabular text-slate-400">
                  TIME IN THE SKY
                </div>
                <div className="font-display font-extrabold text-xl text-white mt-0.5">
                  {totalHours} hrs
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: theme.accent }}>
                  {(Number(totalHours) / 24).toFixed(1)} Days Airborne
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[10px] font-mono-tabular text-slate-400">
                  LOGGED ROUTES
                </div>
                <div className="font-display font-extrabold text-xl text-white mt-0.5">
                  {flights.length} Flights
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: theme.accent }}>
                  {uniqueAirports} Airports Flown
                </div>
              </div>
            </div>

            {/* Country Badges Showcase Strip with Real FlagCDN Flags */}
            {includeBadges && (
              <div className="mt-3.5 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-[11px] text-slate-300 mb-2">
                  <span className="font-semibold">Earned Country Flag Badges</span>
                  <span className="font-mono-tabular text-amber-400">
                    {unlockedMilestones.length} Milestones
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {unlockedBadges.slice(0, 8).map((b) => (
                    <div
                      key={b.countryCode}
                      className="px-2 py-2 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center gap-1"
                    >
                      <img
                        src={getCountryFlagImageUrl(b.countryCode)}
                        alt={b.country}
                        referrerPolicy="no-referrer"
                        className="w-7 h-4.5 rounded-[2px] object-cover border border-white/60 shadow-2xs"
                      />
                      <div className="text-[10px] font-semibold text-white truncate w-full">
                        {b.country}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customization Controls */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Passport Holder
                </label>
                <input
                  type="text"
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-white/5 border border-white/15 text-xs font-semibold text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Distance Unit
                </label>
                <button
                  type="button"
                  onClick={onToggleUnit}
                  className="w-full h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-tabular font-semibold text-white"
                >
                  {unit.toUpperCase()} (Tap to switch)
                </button>
              </div>
            </div>

            {/* Theme Finish */}
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(THEMES) as PassportCardThemeId[]).map((id) => {
                const t = THEMES[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setThemeId(id)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl border text-left text-xs font-medium flex items-center gap-2 transition-all ${
                      themeId === id
                        ? 'border-sky-400 bg-sky-500/15 text-white'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/30"
                      style={{ backgroundColor: t.accent }}
                    />
                    <span className="truncate">{t.name}</span>
                  </button>
                );
              })}
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => setIncludeBadges((b) => !b)}
                className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-colors ${
                  includeBadges
                    ? 'bg-sky-500 border-sky-400 text-slate-950'
                    : 'bg-white/5 border-white/25'
                }`}
              >
                {includeBadges && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span className="text-xs text-slate-200 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Show Country Flag Badges on card</span>
              </span>
            </label>

            {downloadStatus && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-200 font-medium">
                {downloadStatus}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="min-h-[42px] px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/25 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download .PNG</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onShareCardToCommunity(
                    `Updated my Skybound Explorer Passport: ${unlockedBadges.length} countries unlocked, ${formatDistance(
                      totalDistanceKm,
                      unit
                    )} flown (${earthOrbits}x around Earth), and ${unlockedMilestones.length} aviation milestones earned!`
                  );
                  onClose();
                }}
                className="min-h-[42px] px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Share to Feed</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
