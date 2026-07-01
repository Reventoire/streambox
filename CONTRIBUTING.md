# CONTRIBUTING.md

# Contributing to Streambox

## Overview

Streambox is a Tauri v2 desktop application built with Rust, React, TypeScript, Vite, and pnpm.

The project is designed to become a modular, cross-platform media discovery and streaming client with future Android support.

Contributions should prioritize maintainability, clean architecture, security, and long-term extensibility.

---

## Development Requirements

Install the following before working on the project:

* Git
* Node.js LTS
* pnpm
* Rust via rustup
* Tauri prerequisites for Windows
* Microsoft C++ Build Tools
* WebView2 Runtime
* Docker Desktop, optional but recommended
* VS Code or Google Antigravity

---

## Getting Started

Clone the repository:

```bash
git clone <repo-url>
cd streambox
```

Install dependencies:

```bash
pnpm install
```

Run the desktop app in development mode:

```bash
pnpm tauri dev
```

Build the app:

```bash
pnpm tauri build
```

---

## Recommended Commands

Install frontend dependencies:

```bash
pnpm install
```

Start Tauri development mode:

```bash
pnpm tauri dev
```

Run frontend dev server only:

```bash
pnpm dev
```

Build frontend:

```bash
pnpm build
```

Build Tauri app:

```bash
pnpm tauri build
```

Start Docker services:

```bash
docker compose up -d
```

Stop Docker services:

```bash
docker compose down
```

---

## Project Structure

Use the following structure where possible:

```text
src/
  components/
  hooks/
  layouts/
  pages/
  services/
  stores/
  types/
  utils/

src-tauri/
  src/
    commands/
    config/
    credentials/
    downloads/
    providers/
    storage/
```

Keep files focused and small.

Avoid placing business logic directly inside React components.

---

## Code Style

Write code that is:

* Strongly typed
* Modular
* Readable
* Explicit
* Easy to refactor
* Easy to test

Avoid:

* Giant components
* Giant functions
* Duplicated logic
* Hardcoded provider behavior
* Hardcoded credentials
* Magic numbers
* Silent error handling
* Unnecessary dependencies

---

## TypeScript Guidelines

Use TypeScript strictly and intentionally.

Prefer:

* Explicit interfaces for domain models
* Reusable types
* Narrow function inputs
* Clear return types for service functions
* Provider-neutral normalized models

Avoid:

* `any`
* Large untyped API responses spreading through the app
* Provider-specific response shapes leaking into UI components

Provider responses should be normalized before reaching the UI.

---

## React Guidelines

React components should focus on presentation and interaction.

Good component responsibilities:

* Render UI
* Accept typed props
* Call hooks
* Display loading states
* Display error states
* Trigger user actions

Bad component responsibilities:

* Direct API calls to providers
* Complex business rules
* Credential handling
* Filesystem operations
* Large state machines

---

## Rust Guidelines

Rust code should be idiomatic, safe, and focused.

Rust should handle:

* Secure storage
* Local filesystem
* Native APIs
* Downloads
* Cache
* Platform-specific behavior
* Tauri commands
* Performance-sensitive operations

Avoid unsafe Rust unless there is a clear, documented reason.

Do not log secrets or private user data.

---

## Tauri Command Guidelines

Tauri commands should be focused and typed.

Prefer commands such as:

```text
get_app_settings
save_app_settings
test_debrid_connection
list_configured_addons
resolve_stream_source
clear_cache
```

Avoid broad commands such as:

```text
handle_everything
process_request
do_provider_action
```

Every command should have clear input and output types.

---

## State Management

Use Zustand for durable app-level state.

Use TanStack Query for async server/provider/cache data.

Do not put everything into global state.

Use local React state for component-only behavior.

---

## Error Handling

All errors should be handled intentionally.

Every async user flow should have:

* Loading state
* Error state
* Empty state
* Recovery or retry option where possible

Never silently ignore errors.

Never expose sensitive technical details to the user.

---

## Security Rules

Never commit:

* API keys
* Tokens
* Passwords
* Private URLs
* User credentials
* Real Debrid credentials
* Secret config files

Use environment files only for local development.

Sensitive values should eventually be stored through secure Tauri/Rust storage.

Do not log authorization headers or provider tokens.

---

## Provider Rules

Providers must be modular.

Do not hardcode provider behavior into UI components.

Provider integrations should implement shared interfaces where possible.

The app should support user-configured providers.

The app should avoid depending on one single provider as a core architectural assumption.

---

## Android Compatibility

When adding features, consider future Android support.

Avoid:

* Hover-only UI
* Tiny click targets
* Desktop-only layout assumptions
* Hardcoded window sizes
* Platform-specific APIs without abstraction

Prefer:

* Responsive layout
* Touch-friendly controls
* Provider-neutral services
* Platform abstraction
* Clear separation between UI and native code

---

## Commit Guidelines

Use clear commit messages.

Recommended style:

```text
feat: add media card component
fix: handle empty search results
refactor: split provider service
docs: update architecture notes
chore: update dependencies
```

---

## Pull Request Guidelines

Before opening a pull request:

* Confirm the app runs
* Confirm the feature matches the architecture
* Check for unnecessary dependencies
* Check for hardcoded secrets
* Check for duplicated logic
* Update docs if behavior changed

A good pull request should explain:

* What changed
* Why it changed
* How it was tested
* Any known limitations

---

## AI-Assisted Development Rules

AI-generated code must still follow the architecture.

When using AI tools:

* Ask for small focused changes
* Preserve existing structure
* Review generated code
* Reject unnecessary rewrites
* Avoid accepting code that introduces hidden coupling
* Ensure Android compatibility is considered
* Ensure provider logic remains modular

AI should not remove existing functionality unless explicitly requested.

---

## Project Philosophy

Streambox should grow carefully.

A small clean feature is better than a large messy one.

The goal is not only to make the app work, but to make it easy to keep improving.

---

# FEATURES.md

# Streambox Features

## Feature Status Legend

```text
Not Started — Feature has not been implemented.
Planned — Feature is part of the roadmap.
In Progress — Feature is actively being built.
Partial — Feature exists but is incomplete.
Done — Feature is implemented and usable.
Deferred — Feature is intentionally postponed.
Research — Feature needs investigation before implementation.
```

---

## Core Application

| Feature                 | Status      | Notes                                |
| ----------------------- | ----------- | ------------------------------------ |
| Tauri desktop app       | In Progress | Initial app created with Tauri v2.   |
| React frontend          | In Progress | React + TypeScript selected.         |
| Vite build system       | In Progress | Provided by default Tauri template.  |
| pnpm package management | In Progress | Project uses pnpm.                   |
| App shell               | Planned     | Main layout, sidebar, top bar.       |
| Routing                 | Planned     | Use React Router.                    |
| Global app state        | Planned     | Use Zustand.                         |
| Async data cache        | Planned     | Use TanStack Query.                  |
| Dark theme              | Planned     | Dark-first design.                   |
| Responsive layout       | Planned     | Required for future Android support. |

---

## Navigation

| Feature            | Status  | Notes                                             |
| ------------------ | ------- | ------------------------------------------------- |
| Home page          | Planned | Main discovery screen.                            |
| Search page        | Planned | Search metadata and provider catalogs.            |
| Library page       | Planned | User-saved media.                                 |
| Favorites page     | Planned | Favorited movies and shows.                       |
| History page       | Planned | Watched and partially watched media.              |
| Media details page | Planned | Metadata, seasons, episodes, sources.             |
| Player page        | Planned | Embedded or controlled playback.                  |
| Settings page      | Planned | Providers, Debrid, playback, cache, app settings. |

---

## Metadata

| Feature                     | Status  | Notes                                                |
| --------------------------- | ------- | ---------------------------------------------------- |
| Metadata provider interface | Planned | Provider-neutral abstraction.                        |
| Movie search                | Planned | Search by title.                                     |
| TV search                   | Planned | Search by title.                                     |
| Media details               | Planned | Posters, backdrop, description, cast, year, runtime. |
| Season browsing             | Planned | TV season list.                                      |
| Episode browsing            | Planned | Episode list and metadata.                           |
| Metadata caching            | Planned | Reduce duplicate provider requests.                  |
| Multiple metadata providers | Planned | Long-term extensibility goal.                        |

---

## Stremio-Compatible Addons

| Feature             | Status  | Notes                                   |
| ------------------- | ------- | --------------------------------------- |
| Addon configuration | Planned | User-configured addon URLs.             |
| Manifest loading    | Planned | Read addon capabilities.                |
| Catalog support     | Planned | Display addon catalogs.                 |
| Metadata support    | Planned | Use addon metadata where available.     |
| Stream support      | Planned | Fetch stream lists from addons.         |
| Addon validation    | Planned | Validate addon URLs and responses.      |
| Addon management UI | Planned | Add, remove, enable, disable addons.    |
| Multiple addons     | Planned | Support more than one configured addon. |

---

## Debrid Providers

| Feature                      | Status   | Notes                                            |
| ---------------------------- | -------- | ------------------------------------------------ |
| Debrid provider interface    | Planned  | Provider-neutral abstraction.                    |
| Provider settings UI         | Planned  | Configure accounts and options.                  |
| Secure credential storage    | Research | Should use secure Tauri/Rust storage.            |
| Connection test              | Planned  | Validate provider credentials.                   |
| Availability check           | Planned  | Check if a source is available through provider. |
| Stream resolution            | Planned  | Resolve playable links where supported.          |
| Multiple Debrid providers    | Planned  | Support more than one configured provider.       |
| Provider error normalization | Planned  | Convert provider errors to user-friendly errors. |

---

## Playback

| Feature                 | Status   | Notes                                  |
| ----------------------- | -------- | -------------------------------------- |
| Embedded video player   | Planned  | Initial playback strategy.             |
| External player support | Planned  | Allow opening streams externally.      |
| Playback controls       | Planned  | Play, pause, seek, volume, fullscreen. |
| Subtitle support        | Planned  | Later phase.                           |
| Subtitle styling        | Deferred | Later polish feature.                  |
| Watch progress          | Planned  | Save progress locally.                 |
| Continue Watching       | Planned  | Resume partially watched media.        |
| Playback error handling | Planned  | Clear user-facing recovery states.     |

---

## User Library

| Feature               | Status  | Notes                            |
| --------------------- | ------- | -------------------------------- |
| Favorites             | Planned | Save movies and shows.           |
| Watch history         | Planned | Track watched items.             |
| Continue Watching     | Planned | Track unfinished media.          |
| Manual library items  | Planned | User-saved media list.           |
| Remove from library   | Planned | Allow cleanup.                   |
| Clear history         | Planned | Privacy and maintenance feature. |
| Sorting and filtering | Planned | Improve usability.               |

---

## Settings

| Feature            | Status   | Notes                                 |
| ------------------ | -------- | ------------------------------------- |
| General settings   | Planned  | Theme, startup, behavior.             |
| Provider settings  | Planned  | Metadata, addons, Debrid.             |
| Player settings    | Planned  | Embedded/external player preferences. |
| Cache settings     | Planned  | Clear cache, cache size, retention.   |
| Privacy settings   | Planned  | History and credential handling.      |
| Developer settings | Deferred | Logs, diagnostics, debug tools.       |

---

## Cache and Storage

| Feature                   | Status   | Notes                                  |
| ------------------------- | -------- | -------------------------------------- |
| Local app settings        | Planned  | Save app preferences.                  |
| Secure credential storage | Research | Required before real credential usage. |
| Metadata cache            | Planned  | Improve performance.                   |
| Image cache               | Planned  | Improve browsing performance.          |
| Provider response cache   | Planned  | Reduce repeated requests.              |
| Cache clearing            | Planned  | User control over storage.             |
| Storage migration system  | Deferred | Needed if local schema grows.          |

---

## UI and Experience

| Feature                        | Status   | Notes                                   |
| ------------------------------ | -------- | --------------------------------------- |
| Media cards                    | Planned  | Poster, title, year, type.              |
| Media grids                    | Planned  | Browse catalogs/search results.         |
| Loading skeletons              | Planned  | Better perceived performance.           |
| Empty states                   | Planned  | Helpful no-content screens.             |
| Error states                   | Planned  | Friendly and recoverable.               |
| Smooth transitions             | Planned  | Add polish without harming performance. |
| Keyboard navigation            | Planned  | Desktop usability.                      |
| Touch-friendly layout          | Planned  | Android preparation.                    |
| Controller-friendly navigation | Research | Future TV-style support.                |

---

## Android and Mobile

| Feature                      | Status   | Notes                              |
| ---------------------------- | -------- | ---------------------------------- |
| Responsive UI audit          | Planned  | Required before Android work.      |
| Touch navigation             | Planned  | Mobile-friendly interactions.      |
| Mobile settings layout       | Planned  | Avoid desktop-only settings.       |
| Tauri Android initialization | Planned  | Later phase.                       |
| Android dev build            | Planned  | First mobile milestone.            |
| Android player testing       | Research | Need platform-specific validation. |
| Android secure storage       | Research | Must be handled carefully.         |
| Android TV support           | Deferred | Possible long-term direction.      |

---

## Developer Experience

| Feature                    | Status  | Notes                                             |
| -------------------------- | ------- | ------------------------------------------------- |
| Architecture documentation | Done    | `ARCHITECTURE.md`.                                |
| Roadmap documentation      | Done    | `ROADMAP.md`.                                     |
| Contribution guide         | Done    | `CONTRIBUTING.md`.                                |
| Feature tracking           | Done    | `FEATURES.md`.                                    |
| Formatting setup           | Planned | Prettier and Rust formatting.                     |
| Linting setup              | Planned | ESLint and Clippy.                                |
| Testing setup              | Planned | Add frontend and Rust tests later.                |
| Mock providers             | Planned | Useful for development without real integrations. |
| Docker Compose services    | Planned | Postgres, Redis, mock APIs if needed.             |

---

## Compliance and Safety

| Feature                   | Status  | Notes                                                |
| ------------------------- | ------- | ---------------------------------------------------- |
| User-configured providers | Planned | Avoid hardcoded unofficial sources.                  |
| Credential safety         | Planned | Never log secrets.                                   |
| Provider validation       | Planned | Validate URLs and responses.                         |
| Clear user settings       | Planned | Give user control over integrations.                 |
| Legal source neutrality   | Planned | App should be provider-agnostic and user-configured. |

---

## Current MVP Target

The first usable MVP should include:

* Desktop Tauri app
* React app shell
* Routing
* Dark UI
* Search page
* Media details page
* Settings page
* Mock metadata provider
* Mock stream provider
* Basic player page
* Local settings persistence

The MVP does not need real provider integration immediately.

The goal is to prove the architecture and user experience first.
