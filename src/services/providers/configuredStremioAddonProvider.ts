import type { MediaItem } from "../../types/media";
import type { ConfiguredStremioAddon } from "../../types/settings";
import type { StremioManifest } from "../../types/stremio";
import type {
  ProviderCapability,
  ProviderConfig,
  ProviderHealth,
  ProviderManifest,
  ProviderStream,
  StreamSearchRequest,
} from "../../types/providers";
import { convertManifestToProviderManifest } from "../stremio/stremioAddonService";
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

export class ConfiguredStremioAddonProvider implements StremioAddonProvider {
  readonly type = "stremio-addon";
  readonly id: string;
  readonly manifest: ProviderManifest;
  readonly capabilities: ProviderCapability[];
  readonly config: ProviderConfig;

  constructor(private readonly addonConfig: ConfiguredStremioAddon) {
    const stremioManifest = createManifestFromConfig(addonConfig);
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
        ? "Manifest metadata is saved locally. Catalog and stream requests are not enabled yet."
        : "Addon is saved locally but disabled.",
    };
  }

  async getManifest(): Promise<ProviderManifest> {
    return this.manifest;
  }

  async getCatalog(_catalogId: string): Promise<MediaItem[]> {
    // TODO: Later catalog requests will use saved manifest.catalogs after
    // request validation and response normalization are implemented.
    throw new ProviderRuntimeError(
      createCapabilityUnavailableError(
        this.id,
        "Stremio catalog requests are planned but not enabled yet.",
      ),
    );
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

