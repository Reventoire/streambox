import type { ProviderManifest } from "./providers";
import type { MediaItem } from "./media";

export interface StremioResource {
  name: string;
  types?: string[];
  idPrefixes?: string[];
}

export type StremioAddonCapability =
  | "manifest"
  | "catalog"
  | "metadata"
  | "stream"
  | "subtitles";

export interface StremioCatalogExtraDefinition {
  name: string;
  isRequired?: boolean;
  options?: string[];
}

export interface StremioCatalogDefinition {
  id: string;
  type: string;
  name?: string;
  extra?: StremioCatalogExtraDefinition[];
  extraRequired?: string[];
}

export interface StremioManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  resources: StremioResource[];
  types: string[];
  catalogs: StremioCatalogDefinition[];
  idPrefixes?: string[];
}

export interface StremioCatalogExtra {
  name: string;
  value: string | number | boolean;
}

export type StremioCatalogQuery = Record<string, string | number | boolean | undefined>;

export interface StremioCatalogRequest {
  addonBaseUrl: string;
  type: string;
  catalogId: string;
  extras?: StremioCatalogQuery;
}

export interface StremioMetaPreview {
  id: string;
  type: string;
  name: string;
  poster?: string;
  background?: string;
  logo?: string;
  description?: string;
  releaseInfo?: string;
  imdbRating?: string;
  genres?: string[];
}

export interface StremioCatalogResponse {
  metas: StremioMetaPreview[];
}

export interface StremioAddonConfig {
  id: string;
  addonUrl: string;
  manifestUrl: string;
  enabled: boolean;
  manifest: StremioManifest;
  providerManifest: ProviderManifest;
}

export type StremioAddonValidationCode =
  | "empty-url"
  | "invalid-url"
  | "unsupported-protocol"
  | "missing-manifest-id"
  | "missing-manifest-name"
  | "missing-manifest-version"
  | "invalid-manifest-resources"
  | "invalid-manifest-types"
  | "invalid-manifest-catalogs"
  | "manifest-fetch-failed"
  | "manifest-response-invalid"
  | "missing-catalog-type"
  | "missing-catalog-id"
  | "catalog-not-supported"
  | "catalog-fetch-failed"
  | "catalog-response-invalid"
  | "invalid-catalog-metas";

export interface StremioAddonValidationError {
  code: StremioAddonValidationCode;
  message: string;
}

export interface StremioAddonValidationResult {
  isValid: boolean;
  normalizedAddonUrl?: string;
  manifestUrl?: string;
  catalogUrl?: string;
  manifest?: StremioManifest;
  catalogResponse?: StremioCatalogResponse;
  catalogItems?: MediaItem[];
  errors: StremioAddonValidationError[];
}

