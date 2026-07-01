import type { MediaDetails, MediaItem, MediaType } from "../../types/media";
import type {
  DebridAvailability,
  ProviderCapability,
  ProviderCatalog,
  ProviderCatalogQuery,
  ProviderConfig,
  ProviderHealth,
  ProviderId,
  ProviderManifest,
  ProviderSearchOptions,
  ProviderStream,
  ProviderType,
  StreamSearchRequest,
} from "../../types/providers";
import { mockMediaService } from "../mock/mockMediaService";
import { createCapabilityUnavailableError, ProviderRuntimeError } from "./providerErrors";
import type {
  CatalogProvider,
  DebridProvider,
  MetadataProvider,
  StremioAddonProvider,
  StreamProvider,
} from "./providerInterfaces";
import { getProvider, registerProvider } from "./providerRegistry";

const MOCK_HEALTH_LATENCY_MS = 12;

function now(): string {
  return new Date().toISOString();
}

function createManifest(
  id: ProviderId,
  type: ProviderType,
  name: string,
  description: string,
  capabilities: ProviderCapability[],
): ProviderManifest {
  return {
    id,
    type,
    name,
    description,
    version: "0.1.0-mock",
    capabilities,
    status: "healthy",
  };
}

function createPlaceholderConfig(): ProviderConfig {
  return {
    enabled: true,
    requiresConfiguration: false,
    configurationState: "placeholder",
    fields: [],
  };
}

abstract class MockBaseProvider {
  abstract readonly type: ProviderType;
  readonly config = createPlaceholderConfig();

  protected constructor(
    readonly id: ProviderId,
    readonly manifest: ProviderManifest,
    readonly capabilities: ProviderCapability[],
  ) {}

  async getHealth(): Promise<ProviderHealth> {
    return {
      providerId: this.id,
      status: "healthy",
      checkedAt: now(),
      latencyMs: MOCK_HEALTH_LATENCY_MS,
      message: "Mock provider is available for local development.",
    };
  }
}

export class MockMetadataProvider extends MockBaseProvider implements MetadataProvider {
  readonly type = "metadata";

  constructor() {
    const capabilities: ProviderCapability[] = [
      "metadata.search",
      "metadata.details",
      "metadata.movie-details",
      "metadata.series-details",
      "metadata.images",
    ];
    super(
      "mock.metadata",
      createManifest(
        "mock.metadata",
        "metadata",
        "Mock Metadata Provider",
        "Provides normalized local movie and series metadata for development.",
        capabilities,
      ),
      capabilities,
    );
  }

  async searchMedia(query: string, options?: ProviderSearchOptions): Promise<MediaItem[]> {
    const results = await mockMediaService.searchMedia(query);
    const filtered = options?.mediaType
      ? results.filter((item) => item.type === options.mediaType)
      : results;

    return typeof options?.limit === "number" ? filtered.slice(0, options.limit) : filtered;
  }

  getMediaDetails(type: MediaType, id: string): Promise<MediaDetails> {
    return mockMediaService.getMediaDetails(type, id);
  }
}

export class MockCatalogProvider extends MockBaseProvider implements CatalogProvider {
  readonly type = "catalog";

  constructor() {
    const capabilities: ProviderCapability[] = [
      "catalog.trending",
      "catalog.popular",
      "catalog.recent",
      "catalog.continue-watching",
    ];
    super(
      "mock.catalog",
      createManifest(
        "mock.catalog",
        "catalog",
        "Mock Catalog Provider",
        "Serves local discovery rows for Home and catalog development.",
        capabilities,
      ),
      capabilities,
    );
  }

  async listCatalogs(): Promise<ProviderCatalog[]> {
    return [
      {
        id: "trending-movies",
        name: "Trending Movies",
        mediaTypes: ["movie"],
      },
      {
        id: "popular-series",
        name: "Popular Series",
        mediaTypes: ["series"],
      },
      {
        id: "continue-watching",
        name: "Continue Watching",
        mediaTypes: ["movie", "series"],
      },
      {
        id: "recently-added",
        name: "Recently Added",
        mediaTypes: ["movie", "series"],
      },
    ];
  }

  async getCatalog(catalogId: string, _query?: ProviderCatalogQuery): Promise<MediaItem[]> {
    switch (catalogId) {
      case "trending-movies":
        return mockMediaService.getTrendingMovies();
      case "popular-series":
        return mockMediaService.getPopularSeries();
      case "continue-watching":
        return mockMediaService.getContinueWatching();
      case "recently-added":
        return mockMediaService.getRecentlyAdded();
      default:
        throw new ProviderRuntimeError(
          createCapabilityUnavailableError(
            this.id,
            `Mock catalog "${catalogId}" is not available.`,
          ),
        );
    }
  }
}

export class MockStreamProvider extends MockBaseProvider implements StreamProvider {
  readonly type = "stream";

  constructor() {
    const capabilities: ProviderCapability[] = ["stream.discovery"];
    super(
      "mock.stream",
      createManifest(
        "mock.stream",
        "stream",
        "Mock Stream Provider",
        "Returns non-playable placeholder stream candidates for UI development.",
        capabilities,
      ),
      capabilities,
    );
  }

  async getStreams(request: StreamSearchRequest): Promise<ProviderStream[]> {
    return [
      {
        id: `mock-stream-${request.media.id}`,
        mediaId: request.media.id,
        mediaType: request.media.type,
        title: `${request.media.title} Mock Source`,
        quality: "1080p",
        isResolved: false,
        isMock: true,
      },
    ];
  }
}

export class MockDebridProvider extends MockBaseProvider implements DebridProvider {
  readonly type = "debrid";

  constructor() {
    const capabilities: ProviderCapability[] = [
      "debrid.health",
      "debrid.availability",
      "debrid.resolve",
    ];
    super(
      "mock.debrid",
      createManifest(
        "mock.debrid",
        "debrid",
        "Mock Debrid Provider",
        "Exercises Debrid provider UI without accepting or storing credentials.",
        capabilities,
      ),
      capabilities,
    );
  }

  async checkAvailability(stream: ProviderStream): Promise<DebridAvailability> {
    return {
      providerId: this.id,
      streamId: stream.id,
      status: "unknown",
      checkedAt: now(),
    };
  }

  async resolveStream(stream: ProviderStream): Promise<ProviderStream> {
    return {
      ...stream,
      isResolved: false,
      isMock: true,
    };
  }
}

export class MockStremioAddonProvider
  extends MockBaseProvider
  implements StremioAddonProvider
{
  readonly type = "stremio-addon";

  constructor() {
    const capabilities: ProviderCapability[] = [
      "stremio.manifest",
    ];
    super(
      "mock.stremio-addon",
      createManifest(
        "mock.stremio-addon",
        "stremio-addon",
        "Mock Stremio Addon",
        "Represents a Stremio-compatible addon shape without network access.",
        capabilities,
      ),
      capabilities,
    );
  }

  async getManifest(): Promise<ProviderManifest> {
    return this.manifest;
  }

  async listCatalogs(): Promise<ProviderCatalog[]> {
    return [];
  }

  async getCatalog(catalogId: string, _query?: ProviderCatalogQuery): Promise<MediaItem[]> {
    // Mock addon has no remote manifest catalogs. Configured user addons expose
    // catalog browsing through ConfiguredStremioAddonProvider.
    throw new ProviderRuntimeError(
      createCapabilityUnavailableError(
        this.id,
        `Stremio catalog "${catalogId}" is planned but not enabled yet.`,
      ),
    );
  }

  async getStreams(request: StreamSearchRequest): Promise<ProviderStream[]> {
    // TODO: Later stream requests will use the manifest stream resource.
    // Torrent resolution, scraping, Debrid, and playback integration are disabled.
    throw new ProviderRuntimeError(
      createCapabilityUnavailableError(
        this.id,
        `Stremio streams for "${request.media.title}" are planned but not enabled yet.`,
      ),
    );
  }
}

export function registerMockProviders(): void {
  const mockProviders = [
    new MockMetadataProvider(),
    new MockCatalogProvider(),
    new MockStreamProvider(),
    new MockDebridProvider(),
    new MockStremioAddonProvider(),
  ];

  for (const provider of mockProviders) {
    if (!getProvider(provider.id)) {
      registerProvider(provider);
    }
  }
}
