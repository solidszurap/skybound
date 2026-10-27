import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Globe,
  Map as MapIcon,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
} from 'lucide-react';
import {
  geoCentroid,
  geoContains,
  geoGraticule10,
  geoNaturalEarth1,
  geoOrthographic,
  geoPath,
} from 'd3-geo';
import { feature } from 'topojson-client';
import worldAtlasData from 'world-atlas/countries-110m.json';
import { DistanceUnit, FlightJourney } from '../types/skybound';
import {
  ALL_WORLD_COUNTRIES,
  CODE_TO_COUNTRY,
  getCountryFlagImageUrl,
  NUMERIC_TO_COUNTRY,
  WorldCountryInfo,
} from '../data/allCountries';

interface WorldMapGlobeProps {
  flights: FlightJourney[];
  visitedCountryCodes: Set<string>;
  selectedCountryCode: string | null;
  onSelectCountry: (countryCode: string) => void;
  onToggleCountryVisited: (countryCode: string) => void;
  unit: DistanceUnit;
  lightMode?: boolean;
}

// Match TopoJSON feature to our 195-country catalog by numeric ID or name fallback
function resolveCountryFromFeature(feat: any): WorldCountryInfo | undefined {
  const rawId = String(feat.id || '').padStart(3, '0');
  const byNum = NUMERIC_TO_COUNTRY.get(rawId);
  if (byNum) return byNum;

  const propName = (feat.properties?.name || '').toLowerCase();
  if (!propName) return undefined;
  return ALL_WORLD_COUNTRIES.find(
    (c) =>
      c.name.toLowerCase() === propName ||
      propName.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(propName)
  );
}

export const WorldMapGlobe: React.FC<WorldMapGlobeProps> = ({
  visitedCountryCodes,
  selectedCountryCode,
  onSelectCountry,
  onToggleCountryVisited,
  lightMode = true,
}) => {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [autoSpin, setAutoSpin] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<[number, number]>([-12, -28]);
  const [pan2D, setPan2D] = useState<[number, number]>([0, 0]);
  const [hoveredCountry, setHoveredCountry] = useState<WorldCountryInfo | null>(null);
  const [quickSearch, setQuickSearch] = useState<string>('');
  const [flagLoadTick, setFlagLoadTick] = useState<number>(0);
  const [resizeTick, setResizeTick] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flagImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    rotLon: number;
    rotLat: number;
    panX: number;
    panY: number;
  }>({
    x: 0,
    y: 0,
    rotLon: -12,
    rotLat: -28,
    panX: 0,
    panY: 0,
  });

  // Preload real FlagCDN images for visited & selected countries so canvas draws real flags
  useEffect(() => {
    const codesToLoad = new Set<string>(visitedCountryCodes);
    if (selectedCountryCode) codesToLoad.add(selectedCountryCode);

    codesToLoad.forEach((code) => {
      if (flagImagesRef.current.has(code)) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = getCountryFlagImageUrl(code);
      img.onload = () => {
        flagImagesRef.current.set(code, img);
        setFlagLoadTick((t) => t + 1);
      };
    });
  }, [visitedCountryCodes, selectedCountryCode]);

  // Observe container resize so the canvas reacts to any screen size change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      setResizeTick((t) => t + 1);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // Extract real GeoJSON country features from world-atlas TopoJSON
  const geoFeatures = useMemo(() => {
    const topo = worldAtlasData as any;
    const fc = feature(topo, topo.objects.countries) as any;
    return (fc.features || []).map((f: any) => ({
      feature: f,
      country: resolveCountryFromFeature(f),
      centroid: geoCentroid(f),
    }));
  }, []);

  const graticule = useMemo(() => geoGraticule10(), []);

  // Center globe/map when a country is selected externally
  useEffect(() => {
    if (!selectedCountryCode) return;
    const info = CODE_TO_COUNTRY.get(selectedCountryCode);
    if (info) {
      setRotation([-info.lon, -Math.max(-60, Math.min(65, info.lat))]);
      setAutoSpin(false);
    }
  }, [selectedCountryCode]);

  // Optional gentle spin loop
  useEffect(() => {
    if (!autoSpin || viewMode !== '3d') return;
    let animId: number;
    const step = () => {
      if (!isDraggingRef.current) {
        setRotation(([lon, lat]) => [((lon - 0.18 + 540) % 360) - 180, lat]);
      }
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [autoSpin, viewMode]);

  // Render real world map / 3D globe via d3-geo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 440;
    const height = rect.height || 390;

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const baseScale3D = Math.min(width, height) * 0.41 * zoom;
    const baseScale2D = Math.min(width / 5.4, height / 2.8) * zoom;

    const projection =
      viewMode === '3d'
        ? geoOrthographic()
            .scale(baseScale3D)
            .translate([cx, cy])
            .rotate([rotation[0], rotation[1], 0])
            .clipAngle(90)
        : geoNaturalEarth1()
            .scale(baseScale2D)
            .translate([cx + pan2D[0], cy + pan2D[1]]);

    const pathGenerator = geoPath(projection, ctx);

    // 1. Ocean Sphere / Map Backdrop
    if (viewMode === '3d') {
      const haloGrad = ctx.createRadialGradient(
        cx,
        cy,
        baseScale3D * 0.85,
        cx,
        cy,
        baseScale3D * 1.15
      );
      haloGrad.addColorStop(
        0,
        lightMode ? 'rgba(56, 189, 248, 0.28)' : 'rgba(14, 165, 233, 0.25)'
      );
      haloGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseScale3D * 1.15, 0, Math.PI * 2);
      ctx.fill();

      const oceanGrad = ctx.createRadialGradient(
        cx - baseScale3D * 0.28,
        cy - baseScale3D * 0.28,
        baseScale3D * 0.1,
        cx,
        cy,
        baseScale3D
      );
      if (lightMode) {
        oceanGrad.addColorStop(0, '#BAE6FD');
        oceanGrad.addColorStop(0.65, '#7DD3FC');
        oceanGrad.addColorStop(1, '#38BDF8');
      } else {
        oceanGrad.addColorStop(0, '#0F2942');
        oceanGrad.addColorStop(0.7, '#09192B');
        oceanGrad.addColorStop(1, '#050E1A');
      }

      ctx.beginPath();
      pathGenerator({ type: 'Sphere' });
      ctx.fillStyle = oceanGrad;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = lightMode ? 'rgba(2, 132, 199, 0.35)' : 'rgba(56, 189, 248, 0.4)';
      ctx.stroke();
    } else {
      ctx.beginPath();
      pathGenerator({ type: 'Sphere' });
      ctx.fillStyle = lightMode ? '#BAE6FD' : '#09192B';
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = lightMode ? 'rgba(2, 132, 199, 0.3)' : 'rgba(56, 189, 248, 0.3)';
      ctx.stroke();
    }

    // 2. Subtle Latitude / Longitude Graticule
    ctx.beginPath();
    pathGenerator(graticule);
    ctx.strokeStyle = lightMode ? 'rgba(255, 255, 255, 0.45)' : 'rgba(148, 163, 184, 0.12)';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // 3. Real Country Polygons from world-atlas
    geoFeatures.forEach(({ feature: feat, country }) => {
      const code = country?.code;
      const isVisited = code ? visitedCountryCodes.has(code) : false;
      const isSelected = code && selectedCountryCode === code;
      const isHovered = code && hoveredCountry?.code === code;

      ctx.beginPath();
      pathGenerator(feat);

      if (isSelected) {
        ctx.fillStyle = '#F59E0B';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.6;
      } else if (isHovered) {
        ctx.fillStyle = isVisited ? '#0284C7' : lightMode ? '#93C5FD' : '#334155';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;
      } else if (isVisited) {
        ctx.fillStyle = lightMode ? '#0EA5E9' : '#38BDF8';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 0.9;
      } else {
        ctx.fillStyle = lightMode ? '#F8FAFC' : '#1E293B';
        ctx.strokeStyle = lightMode ? '#CBD5E1' : '#334155';
        ctx.lineWidth = 0.6;
      }
      ctx.fill();
      ctx.stroke();
    });

    // 4. Draw Real Graphical Flag Pins on Visited Countries & Selected Country
    ALL_WORLD_COUNTRIES.forEach((c) => {
      const isVisited = visitedCountryCodes.has(c.code);
      const isSelected = selectedCountryCode === c.code;
      if (!isVisited && !isSelected) return;

      if (viewMode === '3d') {
        const centerLon = -rotation[0];
        const centerLat = -rotation[1];
        const toRad = (d: number) => (d * Math.PI) / 180;
        const cosAngle =
          Math.sin(toRad(centerLat)) * Math.sin(toRad(c.lat)) +
          Math.cos(toRad(centerLat)) *
            Math.cos(toRad(c.lat)) *
            Math.cos(toRad(c.lon - centerLon));
        if (cosAngle < 0.08) return;
      }

      const projected = projection([c.lon, c.lat]);
      if (!projected) return;
      const [px, py] = projected;

      // Outer Glow Halo
      ctx.fillStyle = isSelected ? 'rgba(245, 158, 11, 0.42)' : 'rgba(14, 165, 233, 0.28)';
      ctx.beginPath();
      ctx.arc(px, py, isSelected ? 13 : 10, 0, Math.PI * 2);
      ctx.fill();

      // Circular Flag Pin
      const r = isSelected ? 8.5 : 7;
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const loadedFlagImg = flagImagesRef.current.get(c.code);
      if (loadedFlagImg && loadedFlagImg.complete && loadedFlagImg.naturalWidth > 0) {
        ctx.drawImage(loadedFlagImg, px - r * 1.35, py - r, r * 2.7, r * 2);
      } else {
        // National flag color stripes fallback while image loads
        const [c1, c2, c3] = c.flagColors;
        ctx.fillStyle = c1;
        ctx.fillRect(px - r, py - r, r * 2, (r * 2) / 3);
        ctx.fillStyle = c2;
        ctx.fillRect(px - r, py - r / 3, r * 2, (r * 2) / 3);
        ctx.fillStyle = c3 || c1;
        ctx.fillRect(px - r, py + r / 3, r * 2, (r * 2) / 3);
      }
      ctx.restore();

      // Crisp White / Gold Ring Border
      ctx.strokeStyle = isSelected ? '#F59E0B' : '#FFFFFF';
      ctx.lineWidth = isSelected ? 2.2 : 1.6;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.restore();
  }, [
    geoFeatures,
    graticule,
    visitedCountryCodes,
    selectedCountryCode,
    hoveredCountry,
    viewMode,
    rotation,
    zoom,
    pan2D,
    lightMode,
    flagLoadTick,
    resizeTick,
  ]);

  // Inverse coordinate lookup to find which country is under the cursor/tap
  const findCountryAtPoint = (localX: number, localY: number): WorldCountryInfo | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 440;
    const height = rect.height || 390;
    const cx = width / 2;
    const cy = height / 2;
    const baseScale3D = Math.min(width, height) * 0.41 * zoom;
    const baseScale2D = Math.min(width / 5.4, height / 2.8) * zoom;

    const projection =
      viewMode === '3d'
        ? geoOrthographic()
            .scale(baseScale3D)
            .translate([cx, cy])
            .rotate([rotation[0], rotation[1], 0])
            .clipAngle(90)
        : geoNaturalEarth1()
            .scale(baseScale2D)
            .translate([cx + pan2D[0], cy + pan2D[1]]);

    if (!projection.invert) return null;
    const coords = projection.invert([localX, localY]);
    if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return null;

    for (const item of geoFeatures) {
      if (item.country && geoContains(item.feature, coords)) {
        return item.country;
      }
    }

    let closest: WorldCountryInfo | null = null;
    let minDeg = 3.5;
    for (const c of ALL_WORLD_COUNTRIES) {
      const dist = Math.hypot(c.lon - coords[0], c.lat - coords[1]);
      if (dist < minDeg) {
        minDeg = dist;
        closest = c;
      }
    }
    return closest;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotLon: rotation[0],
      rotLat: rotation[1],
      panX: pan2D[0],
      panY: pan2D[1],
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        setAutoSpin(false);
      }
      if (viewMode === '3d') {
        const newLon = ((dragStartRef.current.rotLon + dx * 0.42 + 540) % 360) - 180;
        const newLat = Math.max(-75, Math.min(75, dragStartRef.current.rotLat - dy * 0.42));
        setRotation([newLon, newLat]);
      } else {
        setPan2D([dragStartRef.current.panX + dx, dragStartRef.current.panY + dy]);
      }
      return;
    }

    const found = findCountryAtPoint(localX, localY);
    setHoveredCountry(found);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const moved =
      Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y) > 6;
    isDraggingRef.current = false;

    if (!moved && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      const found = findCountryAtPoint(localX, localY);
      if (found) {
        onSelectCountry(found.code);
      }
    }
  };

  const searchResults = useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    if (!q) return [];
    return ALL_WORLD_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [quickSearch]);

  const activeCountryObj = selectedCountryCode ? CODE_TO_COUNTRY.get(selectedCountryCode) : null;

  return (
    <div
      className={`relative w-full h-[390px] sm:h-[460px] lg:h-[510px] rounded-[28px] overflow-hidden border shadow-lg transition-all ${
        lightMode
          ? 'bg-gradient-to-b from-[#D8EEFE] via-[#EDF8FF] to-[#D8EEFE] border-sky-200/90'
          : 'bg-[#06101E] border-white/15'
      }`}
    >
      {/* Interactive Real World Map & Globe Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          isDraggingRef.current = false;
          setHoveredCountry(null);
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing block touch-none"
      />

      {/* Top Bar: Country Search (Left) + 3D/2D iOS Segmented Control (Right) */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-20">
        {/* Quick Country Jump Search Input */}
        <div className="relative flex-1 max-w-[220px]">
          <div className="liquid-glass-pill rounded-2xl px-3 py-1.5 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Find any of 195 countries..."
              className="w-full bg-transparent text-xs font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="absolute left-0 mt-1.5 w-64 rounded-2xl liquid-glass-pill p-1.5 shadow-xl z-30 space-y-1">
              {searchResults.map((c) => {
                const isVis = visitedCountryCodes.has(c.code);
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onSelectCountry(c.code);
                      setQuickSearch('');
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-sky-500/15 text-left flex items-center justify-between text-xs text-slate-900 transition-colors"
                  >
                    <span className="flex items-center gap-2 truncate font-semibold">
                      <img
                        src={getCountryFlagImageUrl(c.code)}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="w-5 h-3.5 rounded-[2px] object-cover border border-slate-300 shrink-0"
                      />
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span className="text-[10px] font-mono-tabular text-sky-700 font-bold shrink-0">
                      {isVis ? '✓ Visited' : c.continent}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3D Globe / 2D Map iOS Segmented Control */}
        <div className="flex items-center gap-1 p-1 rounded-2xl liquid-glass-pill shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`min-h-[32px] px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap ${
              viewMode === '3d'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('2d')}
            className={`min-h-[32px] px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap ${
              viewMode === '2d'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>2D Map</span>
          </button>
        </div>
      </div>

      {/* Selected Country Quick Stamp Pill (Above Bottom Dock) — Real Flag Image, No ISO Text */}
      {activeCountryObj && (
        <div className="absolute bottom-14 inset-x-3 liquid-glass-pill rounded-2xl px-3.5 py-2 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={getCountryFlagImageUrl(activeCountryObj.code)}
              alt={activeCountryObj.name}
              referrerPolicy="no-referrer"
              className="w-8 h-5.5 rounded-[3px] object-cover border border-slate-300 shadow-2xs shrink-0"
            />
            <div className="min-w-0">
              <div className="font-display font-bold text-xs text-slate-900 truncate">
                {activeCountryObj.name}
              </div>
              <div className="text-[10px] text-slate-600 truncate">
                {activeCountryObj.capital} · {activeCountryObj.continent}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onToggleCountryVisited(activeCountryObj.code)}
            className={`min-h-[30px] px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shrink-0 ${
              visitedCountryCodes.has(activeCountryObj.code)
                ? 'bg-emerald-600 text-white'
                : 'bg-sky-600 text-white hover:bg-sky-500'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>
              {visitedCountryCodes.has(activeCountryObj.code) ? 'Stamped' : '+ Stamp'}
            </span>
          </button>
        </div>
      )}

      {/* Bottom Unified Control Dock */}
      <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between gap-1 px-2.5 py-1 rounded-2xl liquid-glass-pill overflow-x-auto z-10">
        {viewMode === '3d' && (
          <button
            type="button"
            onClick={() => setAutoSpin((s) => !s)}
            className="min-h-[30px] px-2 rounded-xl text-[11px] font-bold text-slate-800 hover:bg-sky-500/15 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
          >
            {autoSpin ? (
              <Pause className="w-3 h-3 text-sky-600" />
            ) : (
              <Play className="w-3 h-3 text-sky-600" />
            )}
            <span>{autoSpin ? 'Pause' : 'Spin'}</span>
          </button>
        )}

        {/* Continent Camera Presets */}
        {[
          { label: 'Europe', lon: -12, lat: -48, pan: [0, 40] as [number, number] },
          { label: 'Asia', lon: -105, lat: -28, pan: [-120, 20] as [number, number] },
          { label: 'Americas', lon: 80, lat: -22, pan: [110, 10] as [number, number] },
          { label: 'Africa', lon: -20, lat: -5, pan: [-10, -20] as [number, number] },
          { label: 'Oceania', lon: -145, lat: 26, pan: [-180, -80] as [number, number] },
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setAutoSpin(false);
              setRotation([preset.lon, preset.lat]);
              setPan2D(preset.pan);
            }}
            className="min-h-[30px] px-2 rounded-xl text-[11px] font-semibold text-slate-700 hover:text-slate-950 hover:bg-sky-500/15 transition-colors whitespace-nowrap shrink-0"
          >
            {preset.label}
          </button>
        ))}

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.25).toFixed(2)))}
            className="min-h-[28px] min-w-[28px] rounded-lg text-slate-700 hover:bg-sky-500/15 flex items-center justify-center transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setZoom((z) => Math.min(2.8, +(z + 0.25).toFixed(2)))}
            className="min-h-[28px] min-w-[28px] rounded-lg text-slate-700 hover:bg-sky-500/15 flex items-center justify-center transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Reset view"
            onClick={() => {
              setZoom(1);
              setRotation([-12, -28]);
              setPan2D([0, 0]);
            }}
            className="min-h-[28px] min-w-[28px] rounded-lg text-slate-700 hover:bg-sky-500/15 flex items-center justify-center transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
