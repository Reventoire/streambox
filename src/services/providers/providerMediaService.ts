import type { MediaDetails, MediaItem, MediaType } from "../../types/media";
import {
  createProviderUnavailableError,
  ProviderRuntimeError,
} from "./providerErrors";
import type { CatalogProvider, MetadataProvider } from "./providerInterfaces";
import { getProvider } from "./providerRegistry";
import { registerMockProviders } from "./mockProviders";

registerMockProviders();

function requireMetadataProvider(): MetadataProvider {
  const provider = getProvider<MetadataProvider>("mock.metadata");

  if (!provider) {
    throw new ProviderRuntimeError(
      createProviderUnavailableError("mock.metadata", "Mock metadata provider is unavailable."),
    );
  }

  return provider;
}

function requireCatalogProvider(): CatalogProvider {
  const provider = getProvider<CatalogProvider>("mock.catalog");

  if (!provider) {
    throw new ProviderRuntimeError(
      createProviderUnavailableError("mock.catalog", "Mock catalog provider is unavailable."),
    );
  }

  return provider;
}

export const providerMediaService = {
  getTrendingMovies: (): Promise<MediaItem[]> =>
    requireCatalogProvider().getCatalog("trending-movies"),

  getPopularSeries: (): Promise<MediaItem[]> =>
    requireCatalogProvider().getCatalog("popular-series"),

  getContinueWatching: (): Promise<MediaItem[]> =>
    requireCatalogProvider().getCatalog("continue-watching"),

  getRecentlyAdded: (): Promise<MediaItem[]> =>
    requireCatalogProvider().getCatalog("recently-added"),

  searchMedia: (query: string): Promise<MediaItem[]> =>
    requireMetadataProvider().searchMedia(query),

  getMediaDetails: (type: MediaType, id: string): Promise<MediaDetails> =>
    requireMetadataProvider().getMediaDetails(type, id),
};

