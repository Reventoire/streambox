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
  manifestUrl: string;
  name: string;
  enabled: boolean;
}

export interface MetadataProviderSettings {
  primaryProvider: string;
  language: string;
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
    primaryProvider: "tmdb",
    language: "en-US",
  },
  debridProviders: [],
  stremioAddons: [],
};
