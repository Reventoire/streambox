import type { ProviderManifest } from "./providers";

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
  | "manifest-response-invalid";

export interface StremioAddonValidationError {
  code: StremioAddonValidationCode;
  message: string;
}

export interface StremioAddonValidationResult {
  isValid: boolean;
  normalizedAddonUrl?: string;
  manifestUrl?: string;
  manifest?: StremioManifest;
  errors: StremioAddonValidationError[];
}

