# Streambox Features

This document tracks the status of all planned features.

## Legend
- Complete
- Partial
- Planned
- Not Planned

---

## Phase 1: App Shell

| Feature | Status | Notes |
|---|---|---|
| Dark-first design system | Complete | CSS variables, glassmorphism |
| Sidebar navigation | Complete | Home, Search, Library, Favorites, History, Settings |
| Topbar with search | Complete | |
| React Router integration | Complete | All routes active |
| Reusable layout components | Complete | AppLayout, Sidebar, Topbar |
| Placeholder pages for all routes | Complete | All six routes |
| Responsive / mobile-compatible layout | Complete | No desktop-only fixed assumptions |

---

## Phase 2A: Mock Discovery and Media Browsing

| Feature | Status | Notes |
|---|---|---|
| Normalized media types | Complete | MediaItem, MediaDetails, Season, Episode, Genre, WatchProgress |
| Mock media service | Complete | 12 items; simulated async delay |
| TanStack Query integration | Complete | Hooks: useTrendingMovies, useSearchMedia, etc. |
| Home page hero + content rows | Complete | Hero banner, Continue Watching, Trending, Popular, Recent |
| Horizontal scrollable media rows | Complete | Touch-friendly MediaRow component |
| Search page with filtering | Complete | Real-time mock search by title, genre, description |
| Media details page | Complete | Backdrop, poster, metadata, genres, season/episode placeholders |
| MediaCard to detail navigation | Complete | react-router-dom navigation |
| Reusable media components | Complete | MediaCard, MediaGrid, MediaRow, Badge, PageHeader |
| EmptyState / LoadingState / ErrorState | Complete | |

---

## Phase 2B: Settings Persistence + Provider Shell

| Feature | Status | Notes |
|---|---|---|
| App settings types | Complete | ThemeMode, PlayerSettings, PrivacySettings, etc. |
| Local settings persistence | Partial | Using localStorage; Tauri secure storage pending |
| Zustand settings store | Complete | loadSettings, updateSettings, resetSettings |
| Settings page - General section | Complete | Theme, language |
| Settings page - Player section | Complete | Auto-play next, external player |
| Settings page - Privacy section | Complete | History tracking, crash reports |
| Settings page - Metadata Providers | Complete | Provider select |
| Settings page - Stremio Addon shell | Partial | Manifest fetch, preview, save, and toggle UI only |
| Settings page - Debrid Provider shell | Partial | Add/remove/toggle UI only; no credential flow |
| Reusable settings components | Complete | SettingsSection, SettingsRow, Toggle, Select, ProviderCard |
| Theme switching (dark/light/system) | Complete | Persisted and applied on load |
| Reset settings action | Complete | Clears localStorage, restores defaults |
| Tauri secure storage backend | Planned | Future phase |

---

## Phase 2C: Provider Abstractions with Mock Providers

| Feature | Status | Notes |
|---|---|---|
| Provider domain types | Partial | ProviderId, ProviderType, ProviderStatus, capabilities, health, config, manifest |
| Provider interfaces | Partial | BaseProvider, Metadata, Catalog, Stream, Debrid, Stremio-compatible addon |
| Provider registry | Partial | Register, unregister, list, lookup by type/capability |
| Mock providers | Partial | Local-only metadata, catalog, stream, Debrid, and Stremio addon providers |
| Provider health checks | Partial | Mock providers report healthy status |
| Settings provider cards | Partial | Mock cards show type, status, capabilities, and placeholder config state |
| Stremio addon manifest support | Partial | URL validation, manifest fetch, preview, local save, provider registration |
| Stremio catalog support | Partial | Saved addon catalog listing, URL construction, response validation, normalized MediaGrid browsing |
| Metadata provider preference | Partial | Preferred provider, fallback order, addon fallback, and enrichment settings |
| TMDB metadata provider | Partial | User token, connection test, search, details, trending, popular, images, external IDs |
| Real provider credentials | Planned | Not accepted or stored yet |

---

## Phase 3: Real Provider Integration (Planned)

| Feature | Status | Notes |
|---|---|---|
| Stremio addon manifest loading | Partial | Manifest fetching only; no metadata, stream, torrent, or Debrid integration |
| Stremio catalog browsing | Partial | Catalog fetching from saved addons only; normalized preview results |
| Stremio metadata support | Planned | |
| Stremio stream fetching | Planned | |
| TMDB provider | Partial | Metadata and discovery only; no streams or playback URLs |
| TheTVDB provider | Planned | |
| OMDb provider | Planned | |
| Fanart.tv provider | Planned | |
| Real-Debrid integration | Planned | |
| AllDebrid integration | Planned | |
| Torrent stream discovery | Planned | |
| External player launch (Tauri) | Planned | |

---

## Phase 4: Playback (Planned)

| Feature | Status | Notes |
|---|---|---|
| Embedded player | Planned | |
| HLS/DASH support | Planned | |
| Subtitle selection | Planned | |
| Audio track selection | Planned | |
| Resume from position | Planned | |
| Progress tracking | Planned | |

---

## Phase 5: Library & User State (Planned)

| Feature | Status | Notes |
|---|---|---|
| Favorites | Planned | |
| Continue Watching (persisted) | Planned | |
| Watch History | Planned | |
| User library | Planned | |

---

## Platform Support

| Platform | Status |
|---|---|
| Windows (desktop) | Complete |
| macOS (desktop) | Planned |
| Linux (desktop) | Planned |
| Android | Future |
