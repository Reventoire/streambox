# ROADMAP.md

# Streambox Roadmap

## Vision

Streambox is intended to become a polished, cross-platform media discovery and streaming client built with Tauri, Rust, React, and TypeScript.

The first goal is a working desktop application. The long-term goal is a maintainable app that can also run on Android with minimal architectural rewrites.

The roadmap is intentionally phased so the project can grow from a basic shell into a complete application.

---

## Phase 0 — Project Foundation

Status: In Progress

Goals:

* Create Tauri v2 project
* Use React + TypeScript
* Use pnpm
* Confirm desktop dev server works
* Confirm Tauri window launches
* Add basic project documentation
* Establish project structure
* Add formatting rules
* Add basic routing
* Add initial app shell

Tasks:

* Create `ARCHITECTURE.md`
* Create `ROADMAP.md`
* Create `CONTRIBUTING.md`
* Create `FEATURES.md`
* Add React Router
* Add TanStack Query
* Add Zustand
* Add initial folder structure
* Replace starter screen with Streambox shell
* Add sidebar navigation
* Add placeholder pages
* Add dark-first styling

Success criteria:

* App launches successfully with `pnpm tauri dev`
* Navigation works
* Project structure is clean
* The app has a recognizable Streambox identity

---

## Phase 1 — App Shell and Core UI

Status: Planned

Goals:

* Build the main desktop UI
* Create a responsive layout foundation
* Add primary navigation
* Add reusable components

Core screens:

* Home
* Search
* Library
* Favorites
* History
* Media Details
* Player
* Settings

Tasks:

* Create app layout
* Create sidebar
* Create top bar
* Create search input
* Create media card component
* Create media grid component
* Create loading states
* Create empty states
* Create error states
* Add basic theme variables
* Add responsive breakpoints

Success criteria:

* App looks and feels like a media application
* Pages are navigable
* Components are reusable
* Layout can adapt to future Android/mobile views

---

## Phase 2 — Local Settings and Persistence

Status: Planned

Goals:

* Allow user settings to persist locally
* Prepare for provider configuration
* Add secure handling for sensitive values

Tasks:

* Define settings model
* Create settings store
* Add Tauri commands for reading settings
* Add Tauri commands for saving settings
* Add settings page
* Add theme setting
* Add player preferences
* Add provider configuration screen
* Investigate secure credential storage through Tauri/Rust

Success criteria:

* Settings survive app restart
* Settings are not hardcoded
* Sensitive settings have a secure storage path planned or implemented

---

## Phase 3 — Metadata and Catalog Layer

Status: Planned

Goals:

* Add metadata provider abstraction
* Display real media data
* Support search and media details

Tasks:

* Define `MetadataProvider` interface
* Define normalized media types
* Add mock metadata provider
* Add real metadata provider integration if appropriate
* Add search results page
* Add media details page
* Add poster/backdrop handling
* Add loading skeletons
* Add provider error handling

Success criteria:

* User can search for media
* User can open a media details page
* UI does not depend directly on provider-specific response formats

---

## Phase 4 — Stremio Addon Compatibility Layer

Status: Planned

Goals:

* Support user-configured Stremio-compatible addons
* Fetch catalogs, metadata, and stream lists where supported
* Keep addon logic modular

Tasks:

* Define addon configuration model
* Add addon management page
* Add addon manifest fetching
* Add catalog fetching
* Add metadata fetching
* Add stream fetching
* Normalize addon responses
* Add validation for addon URLs
* Add error handling for unavailable addons

Success criteria:

* User can add a compatible addon
* App can read addon manifest
* App can display supported catalogs
* App can request streams for selected media
* UI remains provider-agnostic

---

## Phase 5 — Debrid Provider Layer

Status: Planned

Goals:

* Add Debrid provider abstraction
* Allow user-configured Debrid accounts
* Resolve supported stream sources through provider APIs

Tasks:

* Define `DebridProvider` interface
* Add Debrid settings page
* Add credential storage strategy
* Add connection test command
* Add availability checks
* Add stream resolution flow
* Add provider-specific error normalization
* Add support for multiple configured providers

Success criteria:

* User can configure a supported Debrid provider
* App can test provider connection
* App can resolve compatible stream sources
* Provider-specific logic is isolated

---

## Phase 6 — Playback

Status: Planned

Goals:

* Add basic playback support
* Support embedded and external player strategies
* Track progress

Tasks:

* Create player page
* Add video player component
* Add playback controls
* Add loading and buffering states
* Add external player option
* Add watch progress model
* Save progress locally
* Add continue watching row
* Handle playback errors gracefully

Success criteria:

* User can start playback from a resolved source
* Playback progress is saved
* User can resume content
* Player UI is usable and responsive

---

## Phase 7 — Library, Favorites, and History

Status: Planned

Goals:

* Add personal user organization features

Tasks:

* Add favorites
* Add watch history
* Add continue watching
* Add library page
* Add local persistence
* Add remove/clear actions
* Add filtering and sorting

Success criteria:

* User can favorite media
* User can view history
* User can resume partially watched content
* Data survives app restart

---

## Phase 8 — Caching and Performance

Status: Planned

Goals:

* Improve responsiveness
* Reduce repeated network calls
* Prepare for larger catalogs

Tasks:

* Add metadata caching
* Add image caching strategy
* Add provider response caching
* Add cache invalidation rules
* Add virtualized media grids
* Add background prefetching
* Add cache settings page
* Add clear cache action

Success criteria:

* App remains fast with large catalogs
* Repeated searches and catalog loads are faster
* User can manage cache

---

## Phase 9 — Plugin and Provider Extensibility

Status: Planned

Goals:

* Make providers easier to add
* Reduce coupling between core app and integrations

Tasks:

* Formalize provider interfaces
* Add provider registry
* Add provider capability flags
* Add provider health checks
* Add provider configuration schemas
* Document how to add a new provider

Success criteria:

* New providers can be added with minimal core changes
* UI can discover provider capabilities dynamically
* Provider-specific behavior remains isolated

---

## Phase 10 — Android Preparation

Status: Planned

Goals:

* Prepare the app for Android support

Tasks:

* Audit Tauri API usage for Android compatibility
* Audit layout responsiveness
* Replace desktop-only UI assumptions
* Improve touch targets
* Add mobile navigation pattern
* Test small-screen layouts
* Initialize Tauri Android support
* Document Android setup
* Run first Android dev build

Success criteria:

* App UI works at mobile screen sizes
* Tauri Android project initializes
* First Android build runs
* Major desktop assumptions are removed

---

## Phase 11 — Polish and Release Preparation

Status: Planned

Goals:

* Prepare for real-world usage

Tasks:

* Add app icon
* Add splash/loading polish
* Add updater strategy
* Add crash/error reporting strategy
* Add production build workflow
* Add release notes
* Add installer builds
* Add app signing research
* Improve accessibility
* Improve keyboard navigation

Success criteria:

* App can be built for release
* App feels polished
* Major flows are stable
* Known limitations are documented

---

## Long-Term Ideas

Possible future features:

* Multi-profile support
* Trakt-style sync
* More metadata providers
* More Debrid providers
* Local network media support
* Offline mode
* Subtitle provider support
* Subtitle styling
* Controller support
* Watch party mode
* Remote control mode
* Plugin marketplace
* Android TV support
* Smart TV exploration
* Cloud settings sync

---

## Roadmap Principle

Do not rush provider or playback implementation before the architecture is ready.

A clean foundation matters more than early feature count.
