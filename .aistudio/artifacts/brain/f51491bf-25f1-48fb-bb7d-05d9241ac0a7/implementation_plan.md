# Skybound — iOS Flight Tracker, Explorer Passport & Travel Journal

**Skybound** is a flight journey tracker, explorer passport, and social travel companion designed with a native iOS structure and subtle **Liquid Glass** translucent depth. It brings together flight logging, a toggleable 2D map and 3D globe, collectible country badges and aviation milestones, a boarding pass wallet, travel itineraries and city guides, photo memories, and a social community with exportable Flighty-style passport summary cards.

## User Review & Critical Decisions

> [!IMPORTANT]
> The plan has been updated based on your feedback:

- **Updated App Identity (`Skybound`)**: Renamed the application to **Skybound**, focusing the brand identity on aviation, world exploration, and travel memories while treating iOS Liquid Glass strictly as the underlying UI material and surface styling.
- **Added Collectible Country Badges & Aviation Milestones**:
  - **Country Badges**: Unlocking each visited country awards a bespoke collectible Country Badge with regional emblem art, unlock date, visit tier (*First Touchdown*, *Repeat Explorer*, *Local Regular* based on visit count), and regional set completions (e.g., *East Asia Trail*, *Nordic Circle*, *Mediterranean Coast*, *Transatlantic Club*).
  - **Aviation & Distance Milestones**: Tracks lifetime achievement badges with progress meters—such as *Around the World* (40,075 km), *To the Moon* (384,400 km progress), *100+ Hours in the Sky*, *5 Continents Unlocked*, *Ultra Long-Haul* (single flight > 12h), *Widebody Collector* (A350, B787, B777), and *Night Owl Flyer*.
- **Confirmed Core Capabilities**:
  - **Dual 2D Map & 3D Globe** toggleable in the Explorer Passport view.
  - **Community Feed & Exportable Flighty-Style Stat Cards** (including unlocked badges & milestones on the shareable card).
  - **Instant Local Persistence** pre-loaded with realistic multi-continent flights, photos, boarding passes, badges, and itineraries.

---

## 1. Overview & Core Concept

- **What It Does**:
  - **Explorer Passport, 2D/3D Map & Country Badges**: Visualizes every country visited, world percentage, continents unlocked, total distance (km/mi), and flight hours on a toggleable 2D vector world map and 3D interactive globe. Every visited country unlocks a collectible **Country Badge** alongside **Aviation Milestones** (distance rings, earth orbits, aircraft achievements, and continent streaks).
  - **Flight Logger & Boarding Pass Wallet**: Logs past or upcoming flights (airline, flight number, origin/destination airports with automatic great-circle distance and flight time calculation, seat, cabin class, aircraft model, and uploaded trip photos) and stores Apple Wallet-style boarding passes with scannable QR codes and gate/terminal telemetry.
  - **Itineraries & Destination Guides**: Provides structured day-by-day trip itineraries (flights, stays, dining, sights) paired with curated destination guides for visited and upcoming cities.
  - **Photo Memories & Journey Albums**: Lets travelers upload photos from their device and attach them to specific flights and countries, organizing them into visual journey galleries.
  - **Social Community & Shareable Stat Cards**: Connects travelers via an in-app community feed (route maps, photo stories, milestone celebrations, likes, and comments) and a **Passport Card Studio** to export Flighty-style summary cards as PNG images.
- **Target Audience / Persona**: Frequent flyers, world explorers, and visual travelers who love tracking their flight telemetry, collecting country badges and milestones, and keeping boarding passes and travel photos in one place.
- **Key Value**: Turns every flight and boarding pass into a lasting visual memory, collectible country badge, and interactive world map.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Explorer Passport, Map/Globe & Badges Showcase**:
   - Open the **Passport** tab to interact with the **3D Spinning Globe** or **2D World Map**, overlaid with floating translucent telemetry cards for Countries Visited, Total Distance, Hours Traveled, and Milestones Unlocked.
   - Scroll down or switch segments within the Passport to browse your **Country Badges Book** (showing earned badges after each visited country, visit count tier, first touchdown date, and locked silhouettes for bucket-list countries) and **Aviation Milestones** (progress bars toward Earth Circumnavigations, Distance to the Moon, 100 Hours Airborne, and Regional Collections).
   - Tap any country on the map/globe or tap its Country Badge to open a detail sheet displaying that country's badge emblem, flights flown there, cities visited, and uploaded trip photos.
2. **Logging a Flight, Uploading Photos & Unlocking Milestones**:
   - Tap **+ Log Flight** to open the flight logging sheet.
   - Pick origin and destination airports (auto-calculating great-circle distance, flight duration, and route trajectory), fill in airline, flight number, date, cabin class, seat, and aircraft, and upload trip photos.
   - Saving a flight updates the map/globe, adds a boarding pass to the wallet, and immediately awards a **New Country Badge** (if visiting a country for the first time) or advances **Milestone Progress** with a celebratory unlock banner.
3. **Boarding Pass Wallet, Itineraries & Guides**:
   - Open the **Trips & Wallet** tab to flip through stacked Apple Wallet-style boarding passes (filtered by *Upcoming* or *Past*), inspect terminal/gate/seat/aircraft specs, or switch to **Itineraries & Guides** to manage day-by-day trip schedules and read insider city guides.
4. **Social Community & Passport Stat Card Studio**:
   - Visit the **Social** tab to explore fellow travelers' flight logs, photo carousels, and newly unlocked country badges, or share your own flight story.
   - Open the **Share Passport Card** modal to customize and download a Flighty-style Passport Summary Card featuring your route map, total countries, distance, flight hours, and top unlocked badges.

### Visual Identity & Theme (iOS Structure with Liquid Glass Styling)
- **Aesthetic Direction**: Modern iOS travel and aviation app structure (*Flighty* + *Apple Wallet* + *Polarsteps*) enhanced with tactile **Liquid Glass** materials—translucent frosted sheets, subtle specular rim highlights, and crisp typographic hierarchy that keeps maps, photos, and badges front and center.
- **Color Palette & Mood**:
  - **60% Dominant Canvas (`--background`)**: Deep Horizon Midnight (`#080D1A` to `#0F172A`) for rich contrast behind flight arcs and badge emblems, plus an optional Daylight Cloud (`#F2F5FA`) theme toggle.
  - **30% Structural Surfaces (`--surface`)**: iOS Liquid Glass translucent layers (`rgba(255, 255, 255, 0.08)` in dark mode / `rgba(255, 255, 255, 0.72)` in light mode with `backdrop-filter: blur(24px) saturate(180%)`), subtle 1px specular border rims (`rgba(255, 255, 255, 0.18)`), and clean hairline dividers.
  - **10% Accent Budget (`--primary`, `--accent`)**: Skybound Azure (`#38BDF8`) for active routes and primary actions, Milestone Gold (`#F59E0B`) for unlocked country badges and achievement rings, and Emerald (`#34D399`) for completed flights and verified gates.
- **Typography & Hierarchy**:
  - **Display / Airport IATA Codes & Headlines**: `Outfit` (bold, high-legibility geometric display for `JFK → HND` route headers and milestone titles).
  - **Body & Travel Guides**: `Plus Jakarta Sans` (clean, comfortable reading for itineraries, city guides, and social stories).
  - **Telemetry & Numerals**: `JetBrains Mono` with `tabular-nums` for distances, flight hours, gate numbers, seat assignments, and milestone counters.
- **Component Styling & Layout**:
  - **Responsive iOS & Desktop Adaptive Layout**: Features a responsive multi-column desktop workspace (`1440px` baseline with an iOS sidebar/tab dock, large interactive 2D/3D map viewport, and side-by-side passport/wallet inspector) plus a one-click **iOS Mobile Frame Toggle** (`430px` viewport with bottom thumb-zone tab bar) so users can experience both full-screen exploration and authentic iPhone ergonomics.
  - **Zero-Pill Metadata Discipline**: Static flight metadata (dates, aircraft types, durations, seat classes) uses clean inline typography with `·` separators, while interactive filters and buttons use tactile $\ge 44\times44\text{px}$ touch targets.

### Interactive Feedback & Motion
- **Micro-Interactions**: $\le 180\text{ms}$ smooth spring transitions (`cubic-bezier(0.16, 1, 0.3, 1)`) using compositor-safe `transform` and `opacity`.
- **Badge & Milestone Unlock Feedback**: Interactive progress rings, badge inspection modals, and instant visual updates when logging a new country or crossing a distance threshold.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Unified 2D Vector Map & 3D Orthographic Globe Engine**
  - *Chosen Approach*: Power both the 2D World Map and 3D Interactive Globe from a shared high-DPI Canvas/SVG projection engine with country boundary polygons, global airport coordinates, great-circle flight arcs, and interactive country hit-testing.
  - *Why*: Guarantees instant switching between 2D and 3D views, smooth drag-to-rotate globe physics, and seamless compatibility with translucent Liquid Glass overlays.
- **Decision 2 — Automated Badge & Milestone Evaluation Engine**
  - *Chosen Approach*: Dynamically compute Country Badges (including visit tiers and regional sets) and Aviation Milestones (distance toward Earth/Moon, flight hours, continents, aircraft diversity, longest flight) directly from the user's flight log.
  - *Why*: Ensures that whenever a user logs a new flight, their country badge collection, milestone percentages, and shareable passport stats update automatically and accurately.
- **Decision 3 — Local-First Persistence with Client-Side Photo Upload & PNG Card Export**
  - *Chosen Approach*: Store flights, uploaded photos, boarding passes, itinerary items, and social posts in `localStorage` seeded with rich multi-continent sample journeys, and render exportable Passport Stat Cards on an HTML5 Canvas for instant `.png` downloads.
  - *Why*: Zero-configuration persistence that retains uploaded photos and logged flights across sessions.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                        Skybound Application State Store                        │
│ (Flights, Boarding Passes, Country Badges, Milestones, Photos, Trips, Social)  │
└───────────────┬───────────────────────┬────────────────────────┬───────────────┘
                │                       │                        │
                ▼                       ▼                        ▼
┌────────────────────────────┐ ┌─────────────────────┐ ┌─────────────────────────┐
│ 1. Explorer Passport,      │ │ 2. Flights, Photos  │ │ 3. Itineraries, Guides  │
│    Map/Globe & Badges      │ │    & Boarding Pass  │ │    & Social Community   │
├────────────────────────────┤ ├─────────────────────┤ ├─────────────────────────┤
│ • 2D Map / 3D Globe Toggle │ │ • Apple Wallet      │ │ • Day-by-Day Itinerary  │
│ • Country Badges Grid      │ │   Boarding Passes   │ │   Planner & Checklist   │
│   (Tiers, Dates & Stamps)  │ │   with QR & Gates   │ │ • Curated City Guides   │
│ • Aviation Milestones      │ │ • Flight Logger +   │ │ • Traveler Social Feed  │
│   (Earth Orbit, Moon,      │ │   Photo Uploader    │ │   (Stories, Badges,     │
│   Continents, Hours, Jets) │ │ • Journey Photo     │ │   Likes & Comments)     │
│ • Country Inspector Sheet  │ │   Masonry Gallery   │ │ • Flighty-Style Stat    │
│   with Flights & Memories  │ │                     │ │   Card PNG Exporter     │
└────────────────────────────┘ └─────────────────────┘ └─────────────────────────┘
```

### Data Model & State
- **`Airport`**: IATA code, city, country, ISO code, continent, flag/emblem key, latitude, and longitude.
- **`FlightJourney`**: ID, flight number, airline, origin/destination `Airport`, departure/arrival dates, great-circle distance (km/mi), duration (hours/minutes), aircraft model, cabin class, seat, terminal, gate, PNR code, status (`Completed` / `Upcoming`), notes, and uploaded `FlightPhoto[]`.
- **`CountryBadge`**: ISO country code, country name, continent, custom SVG badge crest style, first visited date, total visits count, badge tier (`Bronze — 1st Visit`, `Silver — Repeat Explorer`, `Gold — Local Regular`), cities visited, and associated flight IDs.
- **`Milestone`**: ID, title (e.g., *Circumnavigator*, *Lunar Distance*, *Century Club: 100h*, *Five Continents*, *Supersonic Long-Haul*, *Widebody Fleet*), category (`Distance`, `Duration`, `Geography`, `Aircraft`), current value, target value, unit, unlocked boolean, unlocked date, and icon motif.
- **`Itinerary & CityGuide`**: Trip title, destination, start/end dates, daily schedule items, and city guide recommendations (transit, dining, neighborhoods, local tips).
- **`SocialPost`**: Traveler profile, route summary, unlocked badge callout, story text, photos, likes, and comments.

### Interactive Component & State Mapping
- **Passport, Map/Globe & Badges View**:
  - *Interactions*: Switch between `3D Globe` and `2D Map`; drag to spin globe or pan/zoom map; filter by year (`All Time`, `2026`, `2025`); switch Passport sub-tabs between `Country Badges`, `Milestones & Trophies`, and `Flight Log`; click any Country Badge or Milestone to open a detailed modal with progress breakdown, qualifying flights, and trip photos.
- **Flight Logger & Photo Upload Sheet**:
  - *Interactions*: Select origin and destination airports with instant distance/duration calculation; enter flight details; upload multiple photos from device; submit to create the flight, generate its boarding pass, and trigger any newly earned Country Badge or Milestone notification.
- **Boarding Pass Wallet & Trips View**:
  - *Interactions*: Browse stacked boarding passes; tap to expand full perforated pass with QR code, gate/terminal info, and attached photos; switch to `Itineraries & Guides` to add/check off daily trip activities or read destination guides.
- **Social Feed & Passport Card Exporter**:
  - *Interactions*: Like, bookmark, and comment on community posts; share a logged flight and earned badge to the feed; open the **Passport Stat Card Studio**, customize theme and metrics (including badges earned), and download a crisp `.png` summary card.
