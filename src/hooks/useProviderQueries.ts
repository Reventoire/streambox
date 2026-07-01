import { useQuery } from "@tanstack/react-query";
import type { ProviderHealth, ProviderType } from "../types/providers";
import type { ConfiguredStremioAddon, MetadataProviderSettings } from "../types/settings";
import { registerConfiguredStremioAddonProviders } from "../services/providers/configuredStremioAddonProvider";
import type { AnyProvider } from "../services/providers/providerInterfaces";
import { registerMockProviders } from "../services/providers/mockProviders";
import { listProviders, listProvidersByType } from "../services/providers/providerRegistry";
import { registerTmdbProvider } from "../services/providers/tmdbProvider";

registerMockProviders();

export interface ProviderSummary {
  provider: AnyProvider;
  health: ProviderHealth;
}

export const providerKeys = {
  all: ["providers"] as const,
  summaries: (addons: ConfiguredStremioAddon[]) =>
    [
      ...providerKeys.all,
      "summaries",
      addons.map((addon) => ({
        id: addon.id,
        enabled: addon.enabled,
        manifestUrl: addon.manifestUrl,
        capabilities: addon.capabilities?.join(","),
        version: addon.version,
      })),
    ] as const,
  summariesWithMetadata: (
    addons: ConfiguredStremioAddon[],
    metadata: MetadataProviderSettings,
  ) =>
    [
      ...providerKeys.summaries(addons),
      {
        preferredMetadataProviderId: metadata.preferredMetadataProviderId,
        tmdbConfigured: Boolean(metadata.tmdb.apiReadAccessToken),
        tmdbEnabled: metadata.tmdb.enabled,
      },
    ] as const,
};

async function getProviderSummaries(
  configuredStremioAddons: ConfiguredStremioAddon[],
  metadataSettings?: MetadataProviderSettings,
): Promise<ProviderSummary[]> {
  registerConfiguredStremioAddonProviders(configuredStremioAddons);
  if (metadataSettings) {
    registerTmdbProvider(metadataSettings);
  }
  const providers = listProviders();
  const summaries = await Promise.all(
    providers.map(async (provider) => ({
      provider,
      health: await provider.getHealth(),
    })),
  );

  return summaries.sort((a, b) => a.provider.manifest.name.localeCompare(b.provider.manifest.name));
}

export function useProviderSummaries(
  configuredStremioAddons: ConfiguredStremioAddon[] = [],
  metadataSettings?: MetadataProviderSettings,
) {
  return useQuery({
    queryKey: metadataSettings
      ? providerKeys.summariesWithMetadata(configuredStremioAddons, metadataSettings)
      : providerKeys.summaries(configuredStremioAddons),
    queryFn: () => getProviderSummaries(configuredStremioAddons, metadataSettings),
    staleTime: 30_000,
  });
}

export function getProviderSummariesByType(
  summaries: ProviderSummary[] | undefined,
  type: ProviderType,
): ProviderSummary[] {
  if (summaries) {
    return summaries.filter((summary) => summary.provider.type === type);
  }

  return listProvidersByType(type).map((provider) => ({
    provider,
    health: {
      providerId: provider.id,
      status: "unknown",
      checkedAt: new Date().toISOString(),
    },
  }));
}
