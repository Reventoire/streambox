import type { MediaItem, MediaType } from "./media";

export type ProviderId = string;

export type ProviderType =
  | "metadata"
  | "catalog"
  | "stream"
  | "debrid"
  | "stremio-addon";

export type ProviderStatus =
  | "healthy"
  | "degraded"
  | "unavailable"
  | "disabled"
  | "unknown";

export type ProviderCapability =
  | "metadata.search"
  | "metadata.details"
  | "catalog.trending"
  | "catalog.popular"
  | "catalog.recent"
  | "catalog.continue-watching"
  | "stream.discovery"
  | "stream.resolve"
  | "debrid.health"
  | "debrid.availability"
  | "debrid.resolve"
  | "stremio.manifest"
  | "stremio.catalog"
  | "stremio.metadata"
  | "stremio.stream"
  | "stremio.subtitles";

export interface ProviderHealth {
  providerId: ProviderId;
  status: ProviderStatus;
  checkedAt: string;
  message?: string;
  latencyMs?: number;
}

export interface ProviderError {
  providerId?: ProviderId;
  code:
    | "provider-unavailable"
    | "provider-disabled"
    | "provider-not-configured"
    | "capability-unavailable"
    | "mock-only"
    | "unknown-provider-error";
  message: string;
  isRecoverable: boolean;
}

export interface ProviderConfig {
  enabled: boolean;
  requiresConfiguration: boolean;
  configurationState: "ready" | "not-configured" | "placeholder";
  fields: ProviderConfigField[];
}

export interface ProviderConfigField {
  key: string;
  label: string;
  inputType: "text" | "url" | "password" | "select" | "toggle";
  required: boolean;
  sensitive: boolean;
  placeholder?: string;
}

export interface ProviderManifest {
  id: ProviderId;
  type: ProviderType;
  name: string;
  description: string;
  version: string;
  capabilities: ProviderCapability[];
  status: ProviderStatus;
}

export interface ProviderCatalog {
  id: string;
  name: string;
  description?: string;
  mediaTypes: MediaType[];
}

export interface ProviderStream {
  id: string;
  mediaId: string;
  mediaType: MediaType;
  title: string;
  quality: "unknown" | "480p" | "720p" | "1080p" | "4k";
  isResolved: boolean;
  isMock: boolean;
}

export interface DebridAvailability {
  providerId: ProviderId;
  streamId: string;
  status: "available" | "unavailable" | "unknown";
  checkedAt: string;
}

export interface ProviderSearchOptions {
  mediaType?: MediaType;
  limit?: number;
}

export interface StreamSearchRequest {
  media: MediaItem;
  episodeId?: string;
}
