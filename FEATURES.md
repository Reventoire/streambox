# Streambox Features

This document tracks the status of all planned features.

## Legend
- ✅ Complete
- 🔄 In Progress / Partial
- ⬜ Planned
- ❌ Not Planned

---

## Phase 1: App Shell

| Feature | Status | Notes |
|---|---|---|
| Dark-first design system | ✅ | CSS variables, glassmorphism |
| Sidebar navigation | ✅ | Home, Search, Library, Favorites, History, Settings |
| Topbar with search | ✅ | |
| React Router integration | ✅ | All routes active |
| Reusable layout components | ✅ | AppLayout, Sidebar, Topbar |
| Placeholder pages for all routes | ✅ | All six routes |
| Responsive / mobile-compatible layout | ✅ | No desktop-only fixed assumptions |

---

## Phase 2A: Mock Discovery and Media Browsing

| Feature | Status | Notes |
|---|---|---|
| Normalized media types | ✅ | MediaItem, MediaDetails, Season, Episode, Genre, WatchProgress |
| Mock media service | ✅ | 12 items; simulated async delay |
| TanStack Query integration | ✅ | Hooks: useTrendingMovies, useSearchMedia, etc. |
| Home page hero + content rows | ✅ | Hero banner, Continue Watching, Trending, Popular, Recent |
| Horizontal scrollable media rows | ✅ | Touch-friendly MediaRow component |
| Search page with filtering | ✅ | Real-time mock search by title, genre, description |
| Media details page | ✅ | Backdrop, poster, metadata, genres, season/episode placeholders |
| MediaCard → detail navigation | ✅ | react-router-dom useNavigate |
| Reusable media components | ✅ | MediaCard, MediaGrid, MediaRow, Badge, PageHeader |
| EmptyState / LoadingState / ErrorState | ✅ | |

---

## Phase 2B: Settings Persistence + Provider Shell

| Feature | Status | Notes |
|---|---|---|
| App settings types | ✅ | ThemeMode, PlayerSettings, PrivacySettings, etc. |
| Local settings persistence | 🔄 | Using localStorage; Tauri secure storage pending |
| Zustand settings store | ✅ | loadSettings, updateSettings, resetSettings |
| Settings page — General section | ✅ | Theme, language |
| Settings page — Player section | ✅ | Auto-play next, external player |
| Settings page — Privacy section | ✅ | History tracking, crash reports |
| Settings page — Metadata Providers | ✅ | Provider select |
| Settings page — Stremio Addon shell | 🔄 | Add/remove/toggle UI only; no manifest loading |
| Settings page — Debrid Provider shell | 🔄 | Add/remove/toggle UI only; no credential flow |
| Reusable settings components | ✅ | SettingsSection, SettingsRow, Toggle, Select, ProviderCard |
| Theme switching (dark/light/system) | ✅ | Persisted and applied on load |
| Reset settings action | ✅ | Clears localStorage, restores defaults |
| Tauri secure storage backend | ⬜ | Future phase |

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
| Real provider credentials | Planned | Not accepted or stored yet |

---

## Phase 3: Real Provider Integration (Planned)

| Feature | Status | Notes |
|---|---|---|
| Stremio addon manifest loading | ⬜ | |
| Stremio catalog browsing | ⬜ | |
| Stremio stream fetching | ⬜ | |
| Real-Debrid integration | ⬜ | |
| AllDebrid integration | ⬜ | |
| Torrent stream discovery | ⬜ | |
| External player launch (Tauri) | ⬜ | |

---

## Phase 4: Playback (Planned)

| Feature | Status | Notes |
|---|---|---|
| Embedded player | ⬜ | |
| HLS/DASH support | ⬜ | |
| Subtitle selection | ⬜ | |
| Audio track selection | ⬜ | |
| Resume from position | ⬜ | |
| Progress tracking | ⬜ | |

---

## Phase 5: Library & User State (Planned)

| Feature | Status | Notes |
|---|---|---|
| Favorites | ⬜ | |
| Continue Watching (persisted) | ⬜ | |
| Watch History | ⬜ | |
| User library | ⬜ | |

---

## Platform Support

| Platform | Status |
|---|---|
| Windows (desktop) | ✅ |
| macOS (desktop) | ⬜ Planned |
| Linux (desktop) | ⬜ Planned |
| Android | ⬜ Future |
