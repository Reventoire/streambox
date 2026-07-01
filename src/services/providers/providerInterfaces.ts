import type { MediaDetails, MediaItem, MediaType } from "../../types/media";
import type {
  DebridAvailability,
  ProviderCapability,
  ProviderCatalog,
  ProviderConfig,
  ProviderHealth,
  ProviderId,
  ProviderManifest,
  ProviderSearchOptions,
  ProviderStream,
  ProviderType,
  StreamSearchRequest,
} from "../../types/providers";

export interface BaseProvider {
  readonly id: ProviderId;
  readonly type: ProviderType;
  readonly manifest: ProviderManifest;
  readonly capabilities: ProviderCapability[];
  readonly config: ProviderConfig;
  getHealth(): Promise<ProviderHealth>;
}

/**
 * Metadata providers must return Streambox-normalized media models.
 * Provider-specific response shapes should be converted before reaching UI,
 * stores, or reusable media components.
 */
export interface MetadataProvider extends BaseProvider {
  readonly type: "metadata";
  searchMedia(query: string, options?: ProviderSearchOptions): Promise<MediaItem[]>;
  getMediaDetails(type: MediaType, id: string): Promise<MediaDetails>;
}

export interface CatalogProvider extends BaseProvider {
  readonly type: "catalog";
  listCatalogs(): Promise<ProviderCatalog[]>;
  getCatalog(catalogId: string): Promise<MediaItem[]>;
}

export interface StreamProvider extends BaseProvider {
  readonly type: "stream";
  getStreams(request: StreamSearchRequest): Promise<ProviderStream[]>;
}

/**
 * Debrid services will later implement this interface behind user-controlled
 * configuration and secure Tauri credential storage. React must not receive
 * provider-specific credentials, private URLs, or raw Debrid API responses.
 */
export interface DebridProvider extends BaseProvider {
  readonly type: "debrid";
  checkAvailability(stream: ProviderStream): Promise<DebridAvailability>;
  resolveStream(stream: ProviderStream): Promise<ProviderStream>;
}

/**
 * Stremio-compatible addons will later implement this interface. Addon
 * manifests, catalogs, metadata, and streams must be validated and normalized
 * before any data is returned to UI code.
 */
export interface StremioAddonProvider extends BaseProvider {
  readonly type: "stremio-addon";
  getManifest(): Promise<ProviderManifest>;
  getCatalog(catalogId: string): Promise<MediaItem[]>;
  getStreams(request: StreamSearchRequest): Promise<ProviderStream[]>;
}

export type AnyProvider =
  | MetadataProvider
  | CatalogProvider
  | StreamProvider
  | DebridProvider
  | StremioAddonProvider;

