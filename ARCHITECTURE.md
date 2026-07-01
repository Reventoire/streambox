# ARCHITECTURE.md

# Streambox Architecture

## Overview

Streambox is a cross-platform media discovery and streaming client built with **Tauri v2**, **Rust**, **React**, **TypeScript**, and **Vite**.

The app is inspired by the Stremio-style ecosystem, with support for user-configured metadata providers, Stremio-compatible addons, Debrid providers, and future plugin-style extensibility.

Streambox should be designed as a clean, modular, cross-platform application. Desktop support is the first target, but Android compatibility is a long-term architectural requirement.

The application should never depend on hardcoded unofficial content sources. Integrations must be user-configurable and modular.

---

## Core Goals

Streambox should be:

* Fast
* Lightweight
* Cross-platform
* Modular
* Provider-agnostic
* Easy to extend
* Secure with user credentials
* Friendly to future Android support
* Maintainable by humans and AI-assisted tooling

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* TanStack Query
* Zustand

### Native Layer

* Tauri v2
* Rust

### Development Tooling

* pnpm
* Docker Compose
* Git
* VS Code or Google Antigravity

### Optional Development Services

* PostgreSQL
* Redis
* Local API services
* Mock provider services

---

## High-Level Architecture

The application should follow this conceptual flow:

```text
React UI
  ↓
Frontend Services
  ↓
Provider Interfaces
  ↓
Tauri Commands
  ↓
Rust Services
  ↓
Filesystem / OS / Secure Storage / Network / Cache
```

The frontend should not directly own business-critical provider logic. UI components should call services, hooks, stores, or Tauri commands.

The Rust layer should handle native and sensitive operations such as filesystem access, secure credential storage, download/cache management, and future platform-specific integrations.

---

## Separation of Responsibilities

### React UI

React is responsible for:

* Rendering pages
* Rendering components
* User interaction
* Navigation
* Local presentation state
* Calling frontend services
* Displaying loading, error, and empty states

React components should not contain complex provider logic.

---

### Frontend Services

Frontend services are responsible for:

* Calling Tauri commands
* Normalizing data for UI usage
* Providing clean APIs to hooks and components
* Abstracting provider-specific differences
* Preparing data for TanStack Query

Example frontend services:

```text
src/services/debrid/
src/services/stremio/
src/services/metadata/
src/services/player/
src/services/settings/
```

---

### Zustand Stores

Zustand should be used for application state that needs to persist across screens or affect multiple areas of the UI.

Good Zustand use cases:

* Current theme
* Sidebar state
* Auth/session status
* Selected provider
* Player state
* User settings
* App shell state

Avoid storing server/cache data in Zustand when TanStack Query is more appropriate.

---

### TanStack Query

TanStack Query should be used for async data such as:

* Metadata search
* Catalog responses
* Stremio addon responses
* Debrid availability checks
* User library sync
* Watch history
* Remote provider requests

Prefer query keys that are explicit and stable.

Example:

```ts
["metadata", "search", query]
["catalog", providerId, catalogType]
["debrid", providerId, "availability", hash]
```

---

### Rust / Tauri Layer

Rust is responsible for:

* Secure credential storage
* Filesystem access
* Local cache
* Native dialogs
* Downloads
* Platform-specific behavior
* Performance-sensitive tasks
* Future torrent/debrid orchestration
* Future Android-native integration concerns

Tauri commands should expose clear, typed operations to the frontend.

Avoid creating overly broad commands. Prefer focused commands with clear inputs and outputs.

Example command naming:

```text
get_app_settings
save_app_settings
list_configured_providers
test_debrid_connection
resolve_stream_source
clear_cache
```

---

## Suggested Project Structure

```text
streambox/
  src/
    assets/
    components/
      app/
      layout/
      media/
      player/
      settings/
      shared/
    hooks/
    layouts/
    pages/
      HomePage.tsx
      SearchPage.tsx
      LibraryPage.tsx
      MediaDetailsPage.tsx
      PlayerPage.tsx
      SettingsPage.tsx
    services/
      debrid/
      stremio/
      metadata/
      player/
      settings/
    stores/
    types/
    utils/
    main.tsx
    App.tsx

  src-tauri/
    src/
      commands/
      config/
      credentials/
      downloads/
      providers/
      storage/
      main.rs
      lib.rs
    tauri.conf.json
    Cargo.toml

  public/
  compose.yaml
  package.json
  pnpm-lock.yaml
  README.md
  ARCHITECTURE.md
  ROADMAP.md
  CONTRIBUTING.md
  FEATURES.md
```

---

## Provider Architecture

Streambox should use provider interfaces wherever possible.

A provider should be replaceable without rewriting UI code.

Possible provider categories:

```text
MetadataProvider
CatalogProvider
StremioAddonProvider
DebridProvider
PlayerProvider
StorageProvider
```

Provider implementations should hide API-specific details behind shared interfaces.

Example concept:

```ts
interface DebridProvider {
  id: string;
  name: string;
  testConnection(): Promise<boolean>;
  resolveMagnet(magnetUri: string): Promise<ResolvedStream[]>;
  getAvailability(infoHash: string): Promise<DebridAvailability>;
}
```

UI should depend on generic provider behavior, not specific provider names.

---

## Metadata Provider Preferences

Metadata providers are selected through user preferences, not hardcoded UI
assumptions. The preferred provider is tried first for search, details,
trending, popular, images, and external IDs. A configured fallback order keeps
mock metadata available during development and allows later providers such as
TheTVDB, OMDb, and Fanart.tv to be added without changing page components.

TMDB is a metadata and discovery provider only. It must not be used for stream
fetching, torrent discovery, Debrid resolution, scraping, or playback URLs.
TMDB API Read Access Tokens are user-provided settings and are currently stored
with local settings behind a credential service boundary; this should move to
Tauri secure storage before production use.

Provider responses must be normalized into Streambox `MediaItem` and
`MediaDetails` types before reaching React UI. TMDB IDs, Stremio IDs, IMDb IDs,
and TVDB IDs remain distinct. `imdb_id` can be used as a bridge when returned by
a trusted provider response, but Stremio IDs must not be assumed to be mappable
just because they can look IMDb-like.

---

## Data Model Principles

Use shared TypeScript types for frontend-facing data.

Important model categories:

```text
MediaItem
MediaDetails
Season
Episode
StreamSource
ResolvedStream
DebridProvider
StremioAddon
UserSettings
WatchProgress
LibraryItem
```

Provider-specific response formats should be normalized before reaching UI components.

---

## Routing

React Router should handle app navigation.

Recommended routes:

```text
/
 /search
 /library
 /history
 /favorites
 /media/:type/:id
 /media/:type/:id/season/:seasonNumber
 /player
 /settings
 /settings/providers
 /settings/debrid
 /settings/addons
 /settings/player
```

Routes should remain stable and human-readable.

---

## Error Handling

Errors should be handled intentionally.

Every async operation should have:

* Loading state
* Empty state
* Error state
* Retry path where appropriate

Errors should be useful to the user without exposing sensitive internal details.

Developer logs may contain more technical details, but secrets must never be logged.

---

## Security Rules

Never hardcode credentials, API keys, tokens, or secrets.

Sensitive values should be stored through secure Tauri-supported mechanisms whenever possible.

External input must be validated.

Provider responses should not be trusted blindly.

Avoid unsafe Rust unless absolutely necessary.

Do not log:

* API tokens
* Debrid tokens
* Authorization headers
* Session secrets
* Private URLs
* User credentials

---

## Android Compatibility Rules

Because Android support is a long-term goal:

* Avoid desktop-only assumptions in frontend code.
* Avoid fixed-width layouts.
* Prefer responsive components.
* Keep business logic separate from native platform code.
* Keep provider logic independent from OS-specific behavior.
* Use Tauri APIs carefully and check mobile support before relying on them.
* Design touch-friendly controls.
* Avoid hover-only interactions.
* Keep player controls usable on small screens.

---

## Performance Principles

Prioritize:

* Fast startup
* Lazy loading
* Virtualized lists for large catalogs
* Efficient image loading
* Minimal unnecessary state updates
* Background caching
* Non-blocking async work
* Small frontend bundles
* Efficient Rust commands

Avoid:

* Huge global state stores
* Large synchronous operations in React
* Re-render-heavy components
* Loading all catalog data at once
* Blocking the UI while resolving streams

---

## Testing Strategy

Testing should eventually include:

* Unit tests for utility functions
* Unit tests for provider normalization
* Integration tests for Tauri commands
* UI tests for major flows
* Mock provider tests
* Error-state tests

Provider integrations should be tested with mocked responses whenever possible.

---

## Design Philosophy

Streambox should feel like a polished media application, not a technical demo.

The user should be able to:

* Open the app
* Search or browse content
* View details
* Choose a source
* Start playback
* Resume later
* Configure providers without confusion

The architecture should support rapid iteration without becoming messy.
