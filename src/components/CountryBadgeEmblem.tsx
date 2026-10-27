import React from 'react';
import {
  Award,
  Camera,
  CheckCircle2,
  Clock,
  Compass,
  Globe,
  Lock,
  Moon,
  Plane,
  Zap,
} from 'lucide-react';
import { AviationMilestone, CountryBadge } from '../types/skybound';
import {
  CODE_TO_COUNTRY,
  getCountryFlagImageUrl,
  getCountryFlagSvgDataUrl,
} from '../data/allCountries';
import { getCountryPhotoUrl } from '../data/travelArtwork';

interface CountryBadgeCardProps {
  badge: CountryBadge;
  isSelected?: boolean;
  onSelect: (badge: CountryBadge) => void;
  onToggleVisited?: (countryCode: string) => void;
  lightMode?: boolean;
}

export const CountryBadgeCard: React.FC<CountryBadgeCardProps> = ({
  badge,
  isSelected = false,
  onSelect,
  onToggleVisited,
  lightMode = true,
}) => {
  const worldCountry = CODE_TO_COUNTRY.get(badge.countryCode);
  const flagImgUrl = getCountryFlagImageUrl(badge.countryCode);
  const flagSvgFallback = worldCountry ? getCountryFlagSvgDataUrl(worldCountry) : '';
  const countryPhotoUrl = getCountryPhotoUrl(badge.countryCode, badge.continent);

  const tierColors = {
    Gold: {
      ring: '#D97706',
      bg: 'rgba(245, 158, 11, 0.14)',
      label: 'Gold · Frequent',
    },
    Silver: {
      ring: '#0284C7',
      bg: 'rgba(14, 165, 233, 0.14)',
      label: 'Silver · Explorer',
    },
    Bronze: {
      ring: '#059669',
      bg: 'rgba(16, 185, 129, 0.14)',
      label: 'Bronze · Visited',
    },
  }[badge.tier];

  return (
    <div
      onClick={() => onSelect(badge)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(badge);
      }}
      className={`group cursor-pointer w-full text-left rounded-3xl overflow-hidden transition-all duration-200 ${
        lightMode ? 'liquid-glass-light' : 'liquid-glass'
      } ${
        isSelected
          ? 'ring-2 ring-sky-500 scale-[1.01]'
          : 'hover:border-sky-400/60 active:scale-[0.99]'
      } ${!badge.unlocked ? 'opacity-85 hover:opacity-100' : ''}`}
    >
      {/* Real Destination Photography Header Banner + Large Real National Flag Crest */}
      <div className="relative h-28 w-full overflow-hidden bg-slate-900">
        <img
          src={countryPhotoUrl}
          alt={badge.country}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            badge.unlocked ? '' : 'grayscale-[40%] contrast-95'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

        {/* Top-Right Visit Count or Lock */}
        <div className="absolute top-2.5 right-2.5">
          {badge.unlocked ? (
            <span className="px-2 py-0.5 rounded-lg bg-black/55 backdrop-blur-md border border-white/25 text-[10px] font-mono-tabular font-bold text-white">
              {badge.visitCount}x Visited
            </span>
          ) : (
            <span className="p-1.5 rounded-lg bg-black/45 backdrop-blur-md border border-white/20 inline-flex items-center justify-center text-white/80">
              <Lock className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Bottom-Left Prominent Real National Flag Emblem & Full Country Name */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-2.5">
          <div
            className="w-11 h-7.5 rounded-lg overflow-hidden border-2 border-white shadow-lg shrink-0 bg-slate-800"
            style={{
              boxShadow: badge.unlocked ? `0 0 0 2px ${tierColors.ring}` : undefined,
            }}
          >
            <img
              src={flagImgUrl}
              alt={`${badge.country} flag`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (flagSvgFallback && e.currentTarget.src !== flagSvgFallback) {
                  e.currentTarget.src = flagSvgFallback;
                }
              }}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-display font-bold text-sm text-white truncate drop-shadow-xs">
              {badge.country}
            </h4>
            <div className="text-[10px] text-sky-200 truncate">
              {worldCountry?.capital || badge.continent}
            </div>
          </div>
        </div>
      </div>

      {/* Card Body: Tier & One-Tap Stamp Action */}
      <div className="p-3">
        <div className="flex items-center justify-between gap-1 text-[11px]">
          <div
            className={`truncate ${
              lightMode ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            {badge.unlocked ? (
              <>
                <span className="font-bold text-emerald-600">
                  {tierColors.label.split(' · ')[0]}
                </span>
                <span aria-hidden="true"> · </span>
                <span>{badge.continent}</span>
              </>
            ) : (
              <>
                <span>Unvisited</span>
                <span aria-hidden="true"> · </span>
                <span>{badge.continent}</span>
              </>
            )}
          </div>

          {onToggleVisited && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisited(badge.countryCode);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors shrink-0 ${
                badge.unlocked
                  ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25'
                  : 'bg-sky-500/15 text-sky-700 hover:bg-sky-500/25'
              }`}
            >
              {badge.unlocked ? '✓ Stamped' : '+ Stamp'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface MilestoneCardProps {
  milestone: AviationMilestone;
  lightMode?: boolean;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, lightMode = true }) => {
  const pct = Math.min(100, Math.round((milestone.currentValue / milestone.targetValue) * 100));

  const renderIcon = () => {
    const props = { className: 'w-5 h-5', style: { color: milestone.accent } };
    switch (milestone.iconName) {
      case 'globe':
        return <Globe {...props} />;
      case 'moon':
        return <Moon {...props} />;
      case 'clock':
        return <Clock {...props} />;
      case 'compass':
        return <Compass {...props} />;
      case 'zap':
        return <Zap {...props} />;
      case 'plane':
        return <Plane {...props} />;
      case 'camera':
        return <Camera {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  return (
    <div
      className={`rounded-2xl p-4 transition-all ${
        lightMode ? 'liquid-glass-light' : 'liquid-glass'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: `${milestone.accent}18`,
            border: `1.5px solid ${milestone.accent}45`,
          }}
        >
          {renderIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={`font-display font-bold text-sm truncate ${
                lightMode ? 'text-slate-900' : 'text-white'
              }`}
            >
              {milestone.title}
            </h4>
            {milestone.unlocked ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Unlocked</span>
              </span>
            ) : (
              <span className="text-xs font-mono-tabular font-semibold text-slate-500 shrink-0">
                {pct}%
              </span>
            )}
          </div>

          <p
            className={`text-xs mt-1 leading-relaxed ${
              lightMode ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            {milestone.description}
          </p>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] font-mono-tabular mb-1.5">
              <span className={lightMode ? 'text-slate-700 font-semibold' : 'text-slate-200'}>
                {milestone.currentValue.toLocaleString()} / {milestone.targetValue.toLocaleString()}{' '}
                {milestone.unit}
              </span>
              <span className="text-slate-500">
                {milestone.category}
                {milestone.unlockedDate ? ` · ${milestone.unlockedDate}` : ''}
              </span>
            </div>
            <div
              className={`w-full h-2 rounded-full overflow-hidden ${
                lightMode ? 'bg-slate-200' : 'bg-slate-800'
              }`}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${pct}%`,
                  backgroundColor: milestone.accent,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
