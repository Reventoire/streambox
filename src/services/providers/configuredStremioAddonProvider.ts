import type { MediaItem } from "../../types/media";
import { isMediaType } from "../../types/media";
import type { ConfiguredStremioAddon } from "../../types/settings";
import type { StremioAddonConfig, StremioCatalogDefinition, StremioManifest } from "../../types/stremio";
import type {
  ProviderCapability,
  ProviderCatalog,
  ProviderCatalogQuery,
  ProviderConfig,
  ProviderHealth,
  ProviderManifest,
  ProviderStream,
  StreamSearchRequest,
} from "../../types/providers";
import {
  convertManifestToProviderManifest,
  fetchCatalog,
  normalizeCatalogItems,
} from "../stremio/stremioAddonService";
import { createCapabilityUnavailableError, ProviderRuntimeError } from "./providerErrors";
import type { StremioAddonProvider } from "./providerInterfaces";
import { registerProvider, unregisterProvider } from "./providerRegistry";

const registeredConfiguredAddonIds = new Set<string>();

function createManifestFromConfig(config: ConfiguredStremioAddon): StremioManifest {
  return (
    config.manifest ?? {
      id: config.id.replace(/^stremio\.addon\./, ""),
      name: config.name,
      version: config.version ?? "unknown",
      description: config.description,
      resources: config.resources ?? [],
      types: config.types ?? [],
      catalogs: config.catalogs ?? [],
    }
  );
}

function createProviderConfig(config: ConfiguredStremioAddon): ProviderConfig {
  return {
    enabled: config.enabled,
    requiresConfiguration: false,
    configurationState: "ready",
    fields: [],
  };
}

function createCatalogKey(catalog: StremioCatalogDefinition): string {
  return `${catalog.type}:${catalog.id}`;
}

function toProviderCatalog(catalog: StremioCatalogDefinition): ProviderCatalog | null {
  if (!isMediaType(catalog.type)) {
    return null;
  }

  return {
    id: createCatalogKey(catalog),
    sourceId: catalog.id,
    sourceType: catalog.type,
    name: catalog.name ?? catalog.id,
    mediaTypes: [catalog.type],
    extras: catalog.extra?.map((extra) => ({
      ...extra,
      isRequired: extra.isRequired ?? catalog.extraRequired?.includes(extra.name),
    })),
  };
}

export class ConfiguredStremioAddonProvider implements StremioAddonProvider {
  readonly type = "stremio-addon";
  readonly id: string;
  readonly manifest: ProviderManifest;
  readonly capabilities: ProviderCapability[];
  readonly config: ProviderConfig;
  private readonly stremioManifest: StremioManifest;

  constructor(private readonly addonConfig: ConfiguredStremioAddon) {
    const stremioManifest = createManifestFromConfig(addonConfig);
    this.stremioManifest = stremioManifest;
    this.manifest = convertManifestToProviderManifest(stremioManifest);
    this.id = this.manifest.id;
    this.capabilities = this.manifest.capabilities;
    this.config = createProviderConfig(addonConfig);
  }

  async getHealth(): Promise<ProviderHealth> {
    return {
      providerId: this.id,
      status: this.addonConfig.enabled ? "healthy" : "disabled",
      checkedAt: new Date().toISOString(),
      message: this.addonConfig.enabled
        ? "Manifest metadata is saved locally. Catalog browsing is available when the addon manifest supports catalogs. Stream requests remain disabled."
        : "Addon is saved locally but disabled.",
    };
  }

  async getManifest(): Promise<ProviderManifest> {
    return this.manifest;
  }

  async listCatalogs(): Promise<ProviderCatalog[]> {
    if (!this.capabilities.includes("stremio.catalog")) {
      return [];
    }

    return this.stremioManifest.catalogs.flatMap((catalog): ProviderCatalog[] => {
      const normalized = toProviderCatalog(catalog);
      return normalized ? [normalized] : [];
    });
  }

  async getCatalog(catalogId: string, query?: ProviderCatalogQuery): Promise<MediaItem[]> {
    if (!this.addonConfig.enabled) {
      throw new ProviderRuntimeError(
        createCapabilityUnavailableError(this.id, "Stremio addon is disabled."),
      );
    }

    const catalog = this.stremioManifest.catalogs.find(
      (candidate) => createCatalogKey(candidate) === catalogId || candidate.id === catalogId,
    );

    if (!catalog) {
      throw new ProviderRuntimeError(
        createCapabilityUnavailableError(this.id, `Stremio catalog "${catalogId}" is not listed by the manifest.`),
      );
    }

    const addonConfig: StremioAddonConfig = {
      id: this.addonConfig.id,
      addonUrl: this.addonConfig.addonUrl,
      manifestUrl: this.addonConfig.manifestUrl,
      enabled: this.addonConfig.enabled,
      manifest: this.stremioManifest,
      providerManifest: this.manifest,
    };

    const response = await fetchCatalog(addonConfig, catalog.type, catalog.id, query);
    return normalizeCatalogItems(response);
  }

  async getStreams(_request: StreamSearchRequest): Promise<ProviderStream[]> {
    // TODO: Later stream requests will use the manifest stream resource.
    // Stream fetching, torrent resolution, and Debrid integration are disabled.
    throw new ProviderRuntimeError(
      createCapabilityUnavailableError(
        this.id,
        "Stremio stream requests are planned but not enabled yet.",
      ),
    );
  }
}

export function registerConfiguredStremioAddonProviders(
  addons: ConfiguredStremioAddon[],
): void {
  const nextProviderIds = new Set<string>();

  for (const addon of addons) {
    const provider = new ConfiguredStremioAddonProvider(addon);
    nextProviderIds.add(provider.id);
    registerProvider(provider);
  }

  for (const providerId of registeredConfiguredAddonIds) {
    if (!nextProviderIds.has(providerId)) {
      unregisterProvider(providerId);
    }
  }

  registeredConfiguredAddonIds.clear();
  for (const providerId of nextProviderIds) {
    registeredConfiguredAddonIds.add(providerId);
  }
}

