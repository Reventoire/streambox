import type { MediaDetails, MediaItem, MediaType } from "../../types/media";
import type {
  ProviderCapability,
  ProviderConfig,
  ProviderHealth,
  ProviderManifest,
  ProviderSearchOptions,
} from "../../types/providers";
import type { MetadataProvider } from "./providerInterfaces";
import type { MetadataProviderSettings } from "../../types/settings";
import type { TmdbConfig } from "../../types/tmdb";
import {
  getTmdbMovieDetails,
  getTmdbPopular,
  getTmdbTrending,
  getTmdbTvDetails,
  normalizeTmdbDetails,
  normalizeTmdbItems,
  searchTmdb,
  validateTmdbToken,
} from "../metadata/tmdbService";
import { hasTmdbToken } from "../settings/tmdbCredentialService";
import { registerProvider, unregisterProvider } from "./providerRegistry";

export const TMDB_PROVIDER_ID = "tmdb";

const TMDB_CAPABILITIES: ProviderCapability[] = [
  "metadata.search",
  "metadata.details",
  "metadata.movie-details",
  "metadata.series-details",
  "metadata.images",
  "metadata.external-ids",
  "metadata.trending",
  "metadata.popular",
];

function createManifest(config: TmdbConfig): ProviderManifest {
  return {
    id: TMDB_PROVIDER_ID,
    type: "metadata",
    name: "TMDB Metadata",
    description: "Searches and enriches movie and series metadata through the TMDB API.",
    version: "v3",
    capabilities: TMDB_CAPABILITIES,
    status: hasTmdbToken(config) ? "unknown" : "disabled",
  };
}

function createConfig(config: TmdbConfig): ProviderConfig {
  return {
    enabled: config.enabled && hasTmdbToken(config),
    requiresConfiguration: true,
    configurationState: hasTmdbToken(config) ? "ready" : "not-configured",
    fields: [
      {
        key: "apiReadAccessToken",
        label: "TMDB API Read Access Token",
        inputType: "password",
        required: true,
        sensitive: true,
      },
    ],
  };
}

export class TmdbMetadataProvider implements MetadataProvider {
  readonly type = "metadata";
  readonly id = TMDB_PROVIDER_ID;
  readonly manifest: ProviderManifest;
  readonly capabilities = TMDB_CAPABILITIES;
  readonly config: ProviderConfig;

  constructor(private readonly tmdbConfig: TmdbConfig) {
    this.manifest = createManifest(tmdbConfig);
    this.config = createConfig(tmdbConfig);
  }

  async getHealth(): Promise<ProviderHealth> {
    if (!this.config.enabled) {
      return {
        providerId: this.id,
        status: "disabled",
        checkedAt: new Date().toISOString(),
        message: "TMDB token is not configured.",
      };
    }

    try {
      const startedAt = performance.now();
      await validateTmdbToken(this.tmdbConfig.apiReadAccessToken ?? "");

      return {
        providerId: this.id,
        status: "healthy",
        checkedAt: new Date().toISOString(),
        latencyMs: Math.round(performance.now() - startedAt),
        message: "TMDB metadata requests are available.",
      };
    } catch {
      return {
        providerId: this.id,
        status: "unavailable",
        checkedAt: new Date().toISOString(),
        message: "TMDB token could not be validated.",
      };
    }
  }

  async searchMedia(query: string, options?: ProviderSearchOptions): Promise<MediaItem[]> {
    const results = await searchTmdb(
      this.tmdbConfig,
      query,
      options?.mediaType ?? "multi",
    );

    return normalizeTmdbItems(results);
  }

  async getMediaDetails(type: MediaType, id: string): Promise<MediaDetails> {
    const tmdbId = id.startsWith("tmdb:") ? id.split(":")[2] : id;
    const details =
      type === "movie"
        ? await getTmdbMovieDetails(this.tmdbConfig, tmdbId)
        : await getTmdbTvDetails(this.tmdbConfig, tmdbId);

    return normalizeTmdbDetails(details);
  }

  async getTrending(type: MediaType | "multi", timeWindow: "day" | "week"): Promise<MediaItem[]> {
    const results = await getTmdbTrending(this.tmdbConfig, type, timeWindow);
    return normalizeTmdbItems(results);
  }

  async getPopular(type: MediaType): Promise<MediaItem[]> {
    const results = await getTmdbPopular(this.tmdbConfig, type);
    return normalizeTmdbItems(results);
  }
}

export function registerTmdbProvider(metadataSettings: MetadataProviderSettings): void {
  if (!hasTmdbToken(metadataSettings.tmdb)) {
    unregisterProvider(TMDB_PROVIDER_ID);
    return;
  }

  registerProvider(new TmdbMetadataProvider(metadataSettings.tmdb));
}
