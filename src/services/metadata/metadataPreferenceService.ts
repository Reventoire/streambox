import type { MediaDetails, MediaItem, MediaType } from "../../types/media";
import type { MetadataProviderSettings } from "../../types/settings";
import { createProviderUnavailableError, ProviderRuntimeError } from "../providers/providerErrors";
import type { MetadataProvider } from "../providers/providerInterfaces";
import { getProvider } from "../providers/providerRegistry";
import { registerTmdbProvider } from "../providers/tmdbProvider";

function ensureConfiguredProviders(settings: MetadataProviderSettings): void {
  registerTmdbProvider(settings);
}

function getPreferredMetadataProvider(
  settings: MetadataProviderSettings,
): MetadataProvider | undefined {
  ensureConfiguredProviders(settings);

  return getProvider<MetadataProvider>(
    settings.preferredMetadataProviderId || settings.primaryProvider || "mock.metadata",
  );
}

function getFallbackProviders(settings: MetadataProviderSettings): MetadataProvider[] {
  ensureConfiguredProviders(settings);

  return settings.metadataFallbackOrder.flatMap((providerId) => {
    const provider = getProvider<MetadataProvider>(providerId);
    return provider ? [provider] : [];
  });
}

function getCandidateProviders(settings: MetadataProviderSettings): MetadataProvider[] {
  const preferred = getPreferredMetadataProvider(settings);
  const fallbacks = getFallbackProviders(settings);
  const providers = preferred ? [preferred, ...fallbacks] : fallbacks;
  const deduped = new Map(providers.map((provider) => [provider.id, provider]));

  return Array.from(deduped.values());
}

async function withFallback<TValue>(
  settings: MetadataProviderSettings,
  resolve: (provider: MetadataProvider) => Promise<TValue>,
): Promise<TValue> {
  const providers = getCandidateProviders(settings);

  for (const provider of providers) {
    try {
      return await resolve(provider);
    } catch {
      continue;
    }
  }

  throw new ProviderRuntimeError(
    createProviderUnavailableError("metadata", "No configured metadata provider could handle this request."),
  );
}

export const metadataPreferenceService = {
  searchMedia: (
    settings: MetadataProviderSettings,
    query: string,
    mediaType?: MediaType,
  ): Promise<MediaItem[]> =>
    withFallback(settings, (provider) => provider.searchMedia(query, { mediaType })),

  getMediaDetails: (
    settings: MetadataProviderSettings,
    type: MediaType,
    id: string,
  ): Promise<MediaDetails> =>
    withFallback(settings, (provider) => provider.getMediaDetails(type, id)),

  getTrending: (
    settings: MetadataProviderSettings,
    type: MediaType | "multi",
    timeWindow: "day" | "week",
  ): Promise<MediaItem[]> =>
    withFallback(settings, (provider) => {
      if (!provider.getTrending) {
        throw new Error("Trending is unavailable.");
      }

      return provider.getTrending(type, timeWindow);
    }),

  getPopular: (settings: MetadataProviderSettings, type: MediaType): Promise<MediaItem[]> =>
    withFallback(settings, (provider) => {
      if (!provider.getPopular) {
        throw new Error("Popular is unavailable.");
      }

      return provider.getPopular(type);
    }),
};
