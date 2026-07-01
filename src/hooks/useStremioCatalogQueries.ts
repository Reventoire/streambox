import { useQuery } from "@tanstack/react-query";
import type { ProviderCatalog, ProviderCatalogQuery } from "../types/providers";
import type { ConfiguredStremioAddon } from "../types/settings";
import { registerConfiguredStremioAddonProviders } from "../services/providers/configuredStremioAddonProvider";
import type { StremioAddonProvider } from "../services/providers/providerInterfaces";
import { getProvider, listProvidersByType } from "../services/providers/providerRegistry";

export interface StremioAddonCatalogOption {
  providerId: string;
  providerName: string;
  catalog: ProviderCatalog;
}

function addonSettingsKey(addons: ConfiguredStremioAddon[]) {
  return addons.map((addon) => ({
    id: addon.id,
    enabled: addon.enabled,
    manifestUrl: addon.manifestUrl,
    catalogCount: addon.catalogs?.length ?? 0,
    version: addon.version,
  }));
}

export const stremioCatalogKeys = {
  all: ["stremio-catalogs"] as const,
  lists: (addons: ConfiguredStremioAddon[]) =>
    [...stremioCatalogKeys.all, "lists", addonSettingsKey(addons)] as const,
  catalog: (
    addons: ConfiguredStremioAddon[],
    providerId: string | undefined,
    catalogId: string | undefined,
    extras: ProviderCatalogQuery,
  ) =>
    [
      ...stremioCatalogKeys.all,
      "catalog",
      addonSettingsKey(addons),
      providerId,
      catalogId,
      extras,
    ] as const,
};

async function listSavedAddonCatalogs(
  addons: ConfiguredStremioAddon[],
): Promise<StremioAddonCatalogOption[]> {
  registerConfiguredStremioAddonProviders(addons);

  const providers = listProvidersByType("stremio-addon") as StremioAddonProvider[];
  const configuredProviderIds = new Set(addons.map((addon) => addon.id));
  const configuredProviders = providers.filter(
    (provider) => configuredProviderIds.has(provider.id) && provider.config.enabled,
  );
  const catalogGroups = await Promise.all(
    configuredProviders.map(async (provider) => ({
      provider,
      catalogs: await provider.listCatalogs(),
    })),
  );

  return catalogGroups.flatMap(({ provider, catalogs }) =>
    catalogs.map((catalog) => ({
      providerId: provider.id,
      providerName: provider.manifest.name,
      catalog,
    })),
  );
}

export function useSavedStremioAddonCatalogs(addons: ConfiguredStremioAddon[]) {
  return useQuery({
    queryKey: stremioCatalogKeys.lists(addons),
    queryFn: () => listSavedAddonCatalogs(addons),
    staleTime: 30_000,
  });
}

export function useSavedStremioCatalog(
  addons: ConfiguredStremioAddon[],
  providerId: string | undefined,
  catalogId: string | undefined,
  extras: ProviderCatalogQuery,
  enabled = true,
) {
  return useQuery({
    queryKey: stremioCatalogKeys.catalog(addons, providerId, catalogId, extras),
    queryFn: async () => {
      registerConfiguredStremioAddonProviders(addons);

      const provider = providerId
        ? getProvider<StremioAddonProvider>(providerId)
        : undefined;

      if (!provider || !catalogId) {
        return [];
      }

      return provider.getCatalog(catalogId, extras);
    },
    enabled: Boolean(enabled && providerId && catalogId),
    staleTime: 60_000,
  });
}
