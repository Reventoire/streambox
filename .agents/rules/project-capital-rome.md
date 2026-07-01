---
trigger: always_on
---

# Streambox Project Rules

## Project Overview

This project is named **Streambox**.

Streambox is a modern cross-platform desktop application inspired by the Stremio ecosystem. It acts as a media discovery and streaming client that integrates with user-configured Stremio addons and supported Debrid services. The application itself should not hardcode piracy-related services or providers. It should be built around user-supplied accounts, configurable providers, and extensible integrations.

The primary goal is to create an application that feels as polished and responsive as a commercial streaming platform while remaining modular, maintainable, and extensible.

Future support for Android is a first-class objective. All architectural decisions should consider eventual mobile compatibility.

---

## Long-Term Objectives

The application should eventually support:

* Movie and TV browsing
* Search
* Metadata browsing
* Episode navigation
* Continue Watching
* Watch History
* Favorites
* User Library
* Multiple Debrid providers
* Multiple metadata providers
* Multiple Stremio addons
* Torrent stream discovery
* External player support
* Embedded player
* Offline caching (future)
* Automatic updates
* Plugin architecture
* Theme support
* Android compatibility

Design every feature so additional providers can be added without modifying core application logic.

---

## Technology Stack

Frontend

* React
* TypeScript
* Vite

Desktop

* Tauri v2

Backend

* Rust

Development

* pnpm
* Docker Compose
* Git

Development services

* PostgreSQL
* Redis (optional)
* Future API services inside Docker

---

## Architecture Principles

The application must follow clean architecture.

UI should never directly communicate with external APIs.

Use the following separation of responsibilities:

React UI

↓

Application Services

↓

Provider Layer

↓

Tauri Commands

↓

Rust

↓

Operating System

Business logic should remain independent from presentation.

Rust should handle:

* filesystem
* secure credential storage
* native APIs
* downloads
* caching
* performance-sensitive work
* future torrent management
* platform integrations

React should only manage:

* UI
* routing
* state
* user interaction
* presentation

---

## Project Structure

Prefer organizing code similarly to:

src/

* components/
* pages/
* layouts/
* hooks/
* stores/
* services/

  * debrid/
  * stremio/
  * metadata/
  * player/
* utils/
* types/

src-tauri/

* commands/
* config/
* storage/
* downloads/
* providers/
* main.rs

---

## State Management

Use:

* Zustand for application state
* TanStack Query for asynchronous data
* React Router for navigation

Avoid unnecessary global state.

Cache network requests appropriately.

---

## UI Guidelines

The UI should resemble a modern media application.

Inspirations include:

* Stremio
* Plex
* Jellyfin
* Netflix
* Spotify
* Discord

Characteristics:

* dark-first design
* responsive layouts
* smooth animations
* minimal visual clutter
* keyboard navigation
* controller-friendly where possible
* scalable to mobile screens

Never sacrifice usability for visual effects.

---

## Performance

Prioritize:

* fast startup
* low memory usage
* virtualization for long media lists
* lazy loading
* background caching
* asynchronous operations

Avoid unnecessary React re-renders.

Avoid blocking the UI thread.

---

## Error Handling

Never silently ignore errors.

Provide:

* meaningful user-facing messages
* structured logging
* graceful recovery
* retry mechanisms where appropriate

---

## Security

Never hardcode:

* API keys
* credentials
* secrets

Store sensitive information using secure platform storage through Tauri.

Validate all external inputs.

Avoid unsafe Rust unless absolutely necessary.

---

## Code Style

Write:

* modular code
* strongly typed TypeScript
* idiomatic Rust
* descriptive naming
* small reusable functions
* reusable components

Avoid:

* duplicated logic
* giant components
* giant functions
* magic numbers
* deeply nested conditionals

Prefer composition over inheritance.

---

## AI Development Rules

When implementing features:

1. Preserve existing architecture.
2. Prefer reusable abstractions.
3. Never introduce technical debt for short-term convenience.
4. Explain significant architectural decisions.
5. Keep files focused on a single responsibility.
6. Avoid unnecessary dependencies.
7. If multiple approaches exist, recommend the most maintainable one.
8. Generate production-quality code rather than prototypes unless explicitly requested.
9. Do not remove existing functionality without a clear reason.
10. Keep Android compatibility in mind when proposing APIs or UI.

---

## Scope

This project is intended to become a complete production-quality application.

Temporary shortcuts are acceptable only when explicitly marked as TODOs with a clear migration path.

Every implementation should be written with future scalability, maintainability, and cross-platform support in mind.
