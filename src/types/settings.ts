import type {
  StremioAddonCapability,
  StremioCatalogDefinition,
  StremioManifest,
  StremioResource,
} from "./stremio";
import type { TmdbConfig } from "./tmdb";

export type ThemeMode = "system" | "dark" | "light";

export interface PlayerSettings {
  autoPlayNext: boolean;
  defaultSubtitleLanguage?: string;
  defaultAudioLanguage?: string;
  useExternalPlayer: boolean;
}

export interface PrivacySettings {
  trackHistory: boolean;
  shareCrashReports: boolean;
}

export interface ConfiguredDebridProvider {
  id: string;
  providerType: string;
  name: string;
  enabled: boolean;
}

export interface ConfiguredStremioAddon {
  id: string;
  addonUrl: string;
  manifestUrl: string;
  name: string;
  enabled: boolean;
  version?: string;
  description?: string;
  resources?: StremioResource[];
  types?: string[];
  catalogs?: StremioCatalogDefinition[];
  capabilities?: StremioAddonCapability[];
  manifest?: StremioManifest;
}

export interface MetadataProviderSettings {
  preferredMetadataProviderId: string;
  metadataFallbackOrder: string[];
  allowAddonMetadataFallback: boolean;
  allowMetadataEnrichment: boolean;
  primaryProvider: string;
  language: string;
  tmdb: TmdbConfig;
}

export interface AppSettings {
  theme: ThemeMode;
  player: PlayerSettings;
  privacy: PrivacySettings;
  metadata: MetadataProviderSettings;
  debridProviders: ConfiguredDebridProvider[];
  stremioAddons: ConfiguredStremioAddon[];
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  player: {
    autoPlayNext: true,
    useExternalPlayer: false,
  },
  privacy: {
    trackHistory: true,
    shareCrashReports: false,
  },
  metadata: {
    preferredMetadataProviderId: "mock.metadata",
    metadataFallbackOrder: ["mock.metadata"],
    allowAddonMetadataFallback: true,
    allowMetadataEnrichment: true,
    primaryProvider: "mock.metadata",
    language: "en-US",
    tmdb: {
      enabled: false,
      apiReadAccessToken: "",
    },
  },
  debridProviders: [],
  stremioAddons: [],
};
