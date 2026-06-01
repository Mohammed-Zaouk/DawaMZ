# DawaMZ — Mobile App

> Find the nearest open pharmacy in Morocco — right now.

This is the **mobile version** of DawaMZ, a multilingual pharmacy finder available across two platforms:

| Platform              | Repo                                                              | Status                |
| --------------------- | ----------------------------------------------------------------- | --------------------- |
| 📱 Mobile (this repo) | [dawamz-app](https://github.com/your-username/dawamz-app)         | Live on Android & iOS |
| 🌐 Web (React + Vite) | [dawamz-website](https://github.com/your-username/dawamz-website) | Live at dawamz.com    |

Both platforms share the same Supabase backend — same data, same schedule logic, same multilingual content.

The mobile app handles the full native experience: GPS-based nearest pharmacy detection, interactive maps with turn-by-turn routing, offline-friendly UI, and dark mode — while the web version focuses on discoverability and SEO.

**Live:** [Google Play Store](https://play.google.com/store/apps/details?id=your.app.id)

---

## Stack

![Expo](https://img.shields.io/badge/Expo-SDK%2052-000020?style=flat-square&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![MapLibre](https://img.shields.io/badge/MapLibre-Maps-396CB2?style=flat-square&logo=maplibre&logoColor=white)
![MapTiler](https://img.shields.io/badge/MapTiler-Tiles-E84E4E?style=flat-square)

| Layer         | Choice                                          |
| ------------- | ----------------------------------------------- |
| Framework     | React Native + Expo (SDK 52)                    |
| Language      | TypeScript                                      |
| Backend / DB  | Supabase (PostgreSQL + RLS)                     |
| Maps          | MapLibre GL (`@maplibre/maplibre-react-native`) |
| Map Tiles     | MapTiler (light & dark styles)                  |
| Tile Fallback | OpenStreetMap via demotiles.maplibre.org        |
| Routing       | OSRM (open-source routing engine)               |
| Navigation    | Expo Router v3                                  |
| Icons         | `@expo/vector-icons` (Ionicons)                 |
| Distribution  | EAS Build + Google Play / App Store             |

---

## Features

- **GPS nearest-pharmacy detection** — finds the closest open pharmacy to your current location automatically
- **Interactive map** — powered by MapTiler with light/dark tile styles that match the app theme
- **Turn-by-turn route overlay** — OSRM-computed polyline drawn directly on the map; falls back to Google Maps if no route is found
- **Real-time open/closed status** — computed from weekly schedules, lunch breaks, night shifts, and on-call duty periods
- **Multilingual** — Arabic (RTL), French, and English
- **Tap-to-call & copy address** — one-tap actions from the pharmacy map footer
- **Tile fallback** — silently switches to OpenStreetMap if MapTiler tiles fail to load
- **Dark mode** — full theme support across all screens

---

## Getting Started

```bash
git clone https://github.com/your-username/dawamz-app.git
cd dawamz-app
npm install
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS) or press `a` / `i` to open in an emulator.

### Environment Variables

Create a `.env` file at the root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_MAPTILER_API_KEY=your_maptiler_api_key
```

> None of these values should ever be committed. The `.gitignore` already excludes all `.env` files.

---

## Project Structure

```
app/
├── (tabs)/
│   ├── menu/
│   │   ├── _layout.tsx
│   │   ├── about.tsx
│   │   ├── city_suggestion.tsx
│   │   ├── index.tsx
│   │   ├── language.tsx
│   │   ├── pharmacy_suggestion.tsx
│   │   ├── privacy.tsx
│   │   └── terms.tsx
│   ├── search/
│   │   ├── _layout.tsx
│   │   ├── cities.tsx
│   │   ├── pharmacies.tsx
│   │   └── search_index.tsx
│   ├── _layout.tsx
│   └── index.tsx
├── maps/
│   ├── _layout.tsx
│   ├── auto-map.tsx             # GPS nearest pharmacy map
│   └── pharmacy-location.tsx    # Specific pharmacy map
└── onboarding/
    └── _layout.tsx

assets/
└── images/
    └── logo/

components/                      # Shared UI components
context/
├── LanguageContext.tsx
└── ThemeContext.tsx

data/                            # Static/seed data
scripts/
├── seedCities.ts
├── seedPharmacies.ts
└── seedRegions.ts

services/
└── supabase.ts

utils/
├── location/
│   ├── calculateDistance.ts
│   ├── getLocation.ts
│   ├── getRoute.ts              # useOSRM hook
│   └── nearest-open-pharmacy.ts
├── getLanguage.ts
└── isOpen.ts                    # Schedule open/closed logic

app.json
eas.json
```

---

## Building for Distribution

Install EAS CLI and log in:

```bash
npm install -g eas-cli
eas login
eas build:configure
```

**Internal test build (APK):**

```bash
eas build --platform android --profile preview
```

**Production build (AAB for Play Store):**

```bash
eas build --platform android --profile production
```

**Submit to Play Store:**

```bash
eas submit --platform android --profile production
```

Recommended `eas.json` setup:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

---

## Database

Managed on Supabase with Row Level Security enabled on all tables. The public can only read pharmacy and city data.

Key tables: `regions`, `cities`, `pharmacies`, `pharmacy_suggestions`

---

## License

MIT
