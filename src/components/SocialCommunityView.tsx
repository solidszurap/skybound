import React, { useState } from 'react';
import {
  Award,
  Bookmark,
  Heart,
  MessageCircle,
  Plane,
  Plus,
  Send,
  Share2,
  Sparkles,
} from 'lucide-react';
import {
  DistanceUnit,
  FlightJourney,
  SocialPost,
} from '../types/skybound';
import { formatDistance, formatDuration } from '../data/worldGeoData';
import { getCountryFlagImageUrl } from '../data/allCountries';
import { TRAVEL_ARTWORK } from '../data/travelArtwork';

interface SocialCommunityViewProps {
  posts: SocialPost[];
  flights: FlightJourney[];
  unit: DistanceUnit;
  onToggleLike: (postId: string) => void;
  onToggleBookmark: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onCreatePostFromFlight: (flightId: string, caption: string) => void;
  onOpenPassportStudio: () => void;
  lightMode?: boolean;
}

export const SocialCommunityView: React.FC<SocialCommunityViewProps> = ({
  posts,
  flights,
  unit,
  onToggleLike,
  onToggleBookmark,
  onAddComment,
  onCreatePostFromFlight,
  onOpenPassportStudio,
  lightMode = true,
}) => {
  const [selectedFlightId, setSelectedFlightId] = useState<string>(flights[0]?.id || '');
  const [postCaption, setPostCaption] = useState<string>('');
  const [showComposer, setShowComposer] = useState<boolean>(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlightId || !postCaption.trim()) return;
    onCreatePostFromFlight(selectedFlightId, postCaption.trim());
    setPostCaption('');
    setShowComposer(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Strip: Share Story + Export Flighty-Style Stat Card */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => setShowComposer((s) => !s)}
          className={`min-h-[42px] px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            lightMode
              ? 'liquid-glass-subtle-light text-sky-800 hover:border-sky-400'
              : 'liquid-glass-subtle text-sky-300'
          }`}
        >
          <Plus className="w-4 h-4 text-sky-600" />
          <span>{showComposer ? 'Close Composer' : 'Post Flight Story'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenPassportStudio}
          className="min-h-[42px] px-3.5 py-2 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Passport Stat Card</span>
        </button>
      </div>

      {/* Collapsible Story Composer Sheet */}
      {showComposer && (
        <form
          onSubmit={handlePublish}
          className={`rounded-3xl p-4 space-y-3 ${
            lightMode ? 'liquid-glass-light' : 'liquid-glass'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <h3
              className={`font-display font-bold text-sm ${
                lightMode ? 'text-slate-900' : 'text-white'
              }`}
            >
              Share a Logged Flight Memory
            </h3>
          </div>

          {flights.length === 0 ? (
            <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-600 leading-relaxed">
              Log your first flight journey using the <strong>Log Flight</strong> button in the
              top bar to share your route and photos with the community.
            </div>
          ) : (
            <>
              <select
                value={selectedFlightId || flights[0]?.id || ''}
                onChange={(e) => setSelectedFlightId(e.target.value)}
                className={`w-full h-10 px-3 rounded-xl border text-xs font-medium ${
                  lightMode
                    ? 'bg-white border-slate-300 text-slate-900'
                    : 'bg-slate-900/90 border-white/15 text-white'
                }`}
              >
                {flights.map((fl) => (
                  <option key={fl.id} value={fl.id}>
                    {fl.origin.iata} → {fl.destination.iata} ({fl.flightNumber} ·{' '}
                    {fl.destination.country})
                  </option>
                ))}
              </select>

              <textarea
                rows={3}
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
                placeholder="Share approach views, unlocked Country Flag Badge highlights, or favorite spots..."
                required
                className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-sky-500 ${
                  lightMode
                    ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                    : 'bg-white/5 border-white/15 text-white placeholder:text-slate-500'
                }`}
              />

              <button
                type="submit"
                className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish to Traveler Feed</span>
              </button>
            </>
          )}
        </form>
      )}

      {/* Horizontal Top Flyers Strip with Real Portraits */}
      <div
        className={`rounded-3xl p-3.5 ${
          lightMode ? 'liquid-glass-light' : 'liquid-glass'
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <span
            className={`font-display font-bold text-xs ${
              lightMode ? 'text-slate-800' : 'text-slate-200'
            }`}
          >
            Top Global Passport Explorers
          </span>
          <span className="text-[11px] font-mono-tabular text-sky-600 font-semibold">
            2026 Leaderboard
          </span>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {[
            {
              rank: '#1',
              name: 'Elena R.',
              avatar: TRAVEL_ARTWORK.avatar_elena,
              badges: 34,
            },
            {
              rank: '#2',
              name: 'Claire D.',
              avatar: TRAVEL_ARTWORK.avatar_claire,
              badges: 28,
            },
            {
              rank: '#3',
              name: 'Soren L.',
              avatar: TRAVEL_ARTWORK.avatar_soren,
              badges: 22,
            },
            {
              rank: '#4',
              name: 'Mateo S.',
              avatar: TRAVEL_ARTWORK.avatar_mateo,
              badges: 19,
            },
          ].map((flyer) => (
            <div
              key={flyer.rank}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl shrink-0 border ${
                lightMode
                  ? 'bg-white/75 border-slate-200/80'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <img
                src={flyer.avatar}
                alt={flyer.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-white shadow-2xs"
              />
              <div>
                <div
                  className={`font-display font-bold text-xs leading-tight ${
                    lightMode ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {flyer.rank} {flyer.name}
                </div>
                <div className="text-[10px] font-mono-tabular text-sky-600 font-semibold">
                  {flyer.badges} Flag Badges
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Posts Stream */}
      <div className="space-y-4">
        {posts.map((post, idx) => {
          const avatarUrl =
            post.authorAvatarUrl ||
            [
              TRAVEL_ARTWORK.avatar_elena,
              TRAVEL_ARTWORK.avatar_soren,
              TRAVEL_ARTWORK.avatar_mateo,
              TRAVEL_ARTWORK.avatar_claire,
            ][idx % 4];

          return (
            <article
              key={post.id}
              className={`rounded-3xl p-4 space-y-3.5 ${
                lightMode ? 'liquid-glass-light' : 'liquid-glass'
              }`}
            >
              {/* Author Header & Route Telemetry */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={avatarUrl}
                    alt={post.authorName}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-display font-bold text-sm truncate ${
                          lightMode ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {post.authorName}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                      <span className="truncate">{post.authorRole}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-sky-600 font-bold font-mono-tabular shrink-0">
                        {post.authorCountriesCount} Flags
                      </span>
                    </div>
                  </div>
                </div>

                {/* Route Summary Strip */}
                <div className="text-right font-mono-tabular shrink-0">
                  <div
                    className={`font-display font-extrabold text-base flex items-center justify-end gap-1 ${
                      lightMode ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    <span>{post.originIata}</span>
                    <Plane className="w-3.5 h-3.5 text-sky-600" />
                    <span>{post.destinationIata}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {post.flightNumber} · {formatDistance(post.distanceKm, unit)}
                  </div>
                </div>
              </div>

              {/* Unlocked Country Flag Badge Callout with Real Flag */}
              {post.badgeEarned && (
                <div className="px-3 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-amber-800 font-medium min-w-0">
                    <Award className="w-4 h-4 text-amber-600 shrink-0" />
                    {post.countryCode && post.countryCode.length === 2 && (
                      <img
                        src={getCountryFlagImageUrl(post.countryCode)}
                        alt={post.countryUnlocked || post.countryCode}
                        referrerPolicy="no-referrer"
                        className="w-4 h-3 rounded-[2px] object-cover border border-amber-600/40 shrink-0"
                      />
                    )}
                    <span className="truncate">
                      Unlocked{' '}
                      <strong className="font-display font-bold text-slate-900">
                        {post.badgeEarned}
                      </strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-tabular text-amber-700 font-bold shrink-0">
                    PASSPORT STAMP
                  </span>
                </div>
              )}

              {/* Story Caption */}
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  lightMode ? 'text-slate-700' : 'text-slate-200'
                }`}
              >
                {post.caption}
              </p>

              {/* Real Photo Gallery */}
              {post.photos.length > 0 && (
                <div
                  className={`grid gap-2.5 ${
                    post.photos.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {post.photos.map((ph) => (
                    <div
                      key={ph.id}
                      className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-900"
                    >
                      <img
                        src={ph.url}
                        alt={ph.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2.5">
                        <div className="text-[11px] font-display font-bold text-white line-clamp-1">
                          {ph.caption}
                        </div>
                        <div className="text-[10px] text-slate-200 truncate">
                          {ph.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Interaction Bar */}
              <div
                className={`pt-2.5 border-t flex items-center justify-between ${
                  lightMode ? 'border-slate-200/80' : 'border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleLike(post.id)}
                    className={`min-h-[34px] px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      post.likedByMe
                        ? 'bg-rose-500/15 text-rose-600 border border-rose-400/40'
                        : lightMode
                        ? 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/70'
                        : 'bg-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        post.likedByMe ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                    <span className="font-mono-tabular">{post.likes}</span>
                  </button>

                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="font-mono-tabular">{post.comments.length}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleBookmark(post.id)}
                  className={`min-h-[34px] px-3 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                    post.bookmarkedByMe
                      ? 'bg-amber-400/25 text-amber-800 border border-amber-400/50'
                      : lightMode
                      ? 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/70'
                      : 'bg-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{post.bookmarkedByMe ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              {/* Comments Thread & Input */}
              <div className="space-y-1.5 pt-0.5">
                {post.comments.map((c) => (
                  <div
                    key={c.id}
                    className={`px-3 py-1.5 rounded-xl text-xs flex items-baseline justify-between gap-2 ${
                      lightMode ? 'bg-slate-100 text-slate-800' : 'bg-white/5 text-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-display font-bold mr-1.5">{c.authorName}</span>
                      <span>{c.text}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{c.timestamp}</span>
                  </div>
                ))}

                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    placeholder="Reply to flight story..."
                    className={`flex-1 h-9 px-3 rounded-xl border text-xs focus:outline-none focus:border-sky-500 ${
                      lightMode
                        ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                        : 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const txt = (commentInputs[post.id] || '').trim();
                      if (!txt) return;
                      onAddComment(post.id, txt);
                      setCommentInputs((prev) => ({ ...prev, [post.id]: '' }));
                    }}
                    className="min-h-[36px] px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
