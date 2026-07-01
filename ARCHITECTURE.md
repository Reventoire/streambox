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
* Tauri Commands
* Rust services for storage, credentials, playback orchestration, downloads, and platform-specific behavior

### Playback Layer

* Mock player backend during early development
* mpv external process or sidecar as the first real desktop playback experiment
* libmpv as the preferred long-term native desktop playback engine
* Platform-specific Android playback backend later, hidden behind the same player abstraction

### Development Tooling

* pnpm
* Docker Compose
* Git
* VS Code or Google Antigravity
* Prettier for frontend formatting
* ESLint for frontend linting
* rustfmt for Rust formatting
* Clippy for Rust linting
* Vitest or another lightweight test runner for frontend unit tests when testing is introduced
* Cargo test for Rust unit and integration tests

### Optional Development Services

* PostgreSQL
* Redis
* Local API services
* Mock provider services
* Mock Stremio-compatible addon service
* Mock Debrid provider service
* Local media/test stream service for playback development

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
Filesystem / OS / Secure Storage / Network / Cache / Playback Engine
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
* Playback orchestration through a player backend abstraction
* External mpv process or sidecar management
* Future libmpv integration for desktop playback
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
create_playback_session
player_play
player_pause
player_seek
player_stop
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
      player/
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

## Player Architecture

Playback must be designed behind a provider-neutral player abstraction.

The React UI must never depend directly on mpv, libmpv, HTML video, native platform players, or any specific playback engine. React components should call typed frontend services, hooks, or stores. Those services should communicate with Tauri commands, which then delegate to Rust-side player backends.

Conceptual flow:

```text
React Player UI
  ↓
playerService / player hooks
  ↓
Tauri player commands
  ↓
Rust PlayerManager
  ↓
Player backend implementation
      ├── MockPlayerBackend
      ├── ExternalMpvBackend
      ├── LibMpvBackend
      └── AndroidPlayerBackend
```

The player layer should support switching playback backends without rewriting the UI.

The preferred long-term desktop playback engine is **libmpv**, because it is mature, codec-flexible, scriptable, subtitle-capable, and already widely used in media applications. However, true libmpv embedding is more complex than launching an external player because it involves native rendering concerns.

Streambox should therefore approach mpv integration in stages:

1. Keep the current mock player while app architecture is still evolving.
2. Add a formal player backend interface.
3. Add an `ExternalMpvBackend` proof of concept using an installed `mpv` binary or bundled Tauri sidecar.
4. Add IPC-based mpv control for play, pause, seek, volume, subtitles, audio tracks, and progress events.
5. Evaluate deeper `LibMpvBackend` integration after provider resolution, playback state, and desktop UX are stable.
6. Keep Android playback behind the same abstraction and avoid assuming that the desktop libmpv implementation will work unchanged on mobile.

The first real mpv milestone should prefer an external mpv process or sidecar over direct libmpv embedding. This lowers integration risk and gives the project real playback behavior sooner.

True libmpv integration should be treated as a dedicated research and implementation phase. It may require:

* Bundling or locating native mpv/libmpv binaries per platform.
* Handling dynamic library loading.
* Managing native rendering surfaces.
* Handling platform-specific window/surface behavior.
* Building safe Rust wrappers around unsafe FFI boundaries.
* Designing event forwarding from Rust to React.
* Ensuring the UI remains responsive while playback events are processed.

### Player Backend Responsibilities

All player backends should expose a consistent capability-based interface.

Expected operations:

```text
load_source
play
pause
toggle_playback
stop
seek
set_volume
set_muted
set_playback_speed
select_audio_track
select_subtitle_track
disable_subtitles
get_state
```

Expected events:

```text
playback_started
playback_paused
playback_resumed
playback_stopped
playback_finished
position_changed
duration_changed
buffering_started
buffering_finished
tracks_changed
error
```

Expected normalized player types:

```text
PlayerBackendType
PlayerCapability
PlayerStatus
PlayerState
PlayerSource
PlayerSourceType
PlaybackSession
PlaybackCommand
PlaybackEvent
PlaybackProgress
AudioTrack
SubtitleTrack
VideoTrack
PlayerError
```

mpv-specific terms, command formats, and IPC details should not leak into React components. If mpv exposes a property or event, translate it into a Streambox-normalized player type first.

### ExternalMpvBackend

The `ExternalMpvBackend` should be the first real playback backend.

It may:

* Detect an installed mpv binary.
* Launch mpv as a child process.
* Optionally use a Tauri sidecar for bundled desktop builds.
* Pass local files or resolved stream URLs to mpv.
* Use mpv IPC for control and progress events.
* Fall back gracefully if mpv is missing.

This backend is useful because it validates real playback, subtitles, seeking, and stream handling without requiring native embedding.

### LibMpvBackend

The `LibMpvBackend` is the preferred long-term desktop playback engine, but it should only be implemented after the external mpv flow and the player abstraction are stable.

It should:

* Live entirely behind the Rust player backend interface.
* Keep unsafe/native integration isolated in a small Rust module.
* Avoid exposing raw libmpv handles outside the backend.
* Translate libmpv events into normalized Streambox events.
* Support subtitles, audio tracks, seeking, progress, errors, and stream metadata.
* Be optional or feature-gated if platform packaging becomes complex.

The rest of the application must continue to work even if libmpv is unavailable.

### Android Playback Strategy

Android playback should remain abstracted behind `AndroidPlayerBackend`.

Do not assume the desktop mpv/libmpv backend will work unchanged on Android. Android playback should be researched separately when the app reaches the Android preparation phase.

The frontend should not care whether playback is handled by mock playback, mpv, libmpv, a native Android player, or another future backend.

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
PlayerState
PlayerSource
PlaybackSession
PlaybackProgress
AudioTrack
SubtitleTrack
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
 /player/:sessionId
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
* Resolved playback URLs
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
* Keep playback engine decisions abstracted so Android can use a different backend if needed.
* Avoid coupling media playback UI to desktop-only mpv/libmpv behavior.

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
* Non-blocking playback event handling
* Efficient player progress updates without excessive React re-renders

Avoid:

* Huge global state stores
* Large synchronous operations in React
* Re-render-heavy components
* Loading all catalog data at once
* Blocking the UI while resolving streams

---


## Tooling Standards

The project should use tools that reinforce consistency without adding unnecessary complexity.

Recommended baseline tooling:

```text
Frontend formatting: Prettier
Frontend linting: ESLint
Frontend tests: Vitest or equivalent lightweight runner
Rust formatting: rustfmt
Rust linting: Clippy
Rust tests: cargo test
Git line endings: .gitattributes
Development services: Docker Compose
```

Formatting and linting should be automated where possible.

Recommended future scripts:

```json
{
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "lint": "eslint .",
  "test": "vitest",
  "tauri:dev": "tauri dev",
  "tauri:build": "tauri build"
}
```

Recommended Rust checks:

```bash
cargo fmt
cargo clippy
cargo test
```

A `.gitattributes` file should be used to keep line endings consistent across Windows, Linux, and CI environments:

```gitattributes
* text=auto
*.ts text eol=lf
*.tsx text eol=lf
*.css text eol=lf
*.json text eol=lf
*.md text eol=lf
*.rs text eol=lf
```

Avoid introducing heavy tooling before it solves a real project need. The default path should remain simple enough for one developer to maintain.

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
* Start playback through the best available backend
* Control playback reliably
* Resume later
* Configure providers without confusion

The architecture should support rapid iteration without becoming messy.
