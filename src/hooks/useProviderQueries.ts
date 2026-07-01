import { useQuery } from "@tanstack/react-query";
import type { ProviderHealth, ProviderType } from "../types/providers";
import type { AnyProvider } from "../services/providers/providerInterfaces";
import { registerMockProviders } from "../services/providers/mockProviders";
import { listProviders, listProvidersByType } from "../services/providers/providerRegistry";

registerMockProviders();

export interface ProviderSummary {
  provider: AnyProvider;
  health: ProviderHealth;
}

export const providerKeys = {
  all: ["providers"] as const,
  summaries: () => [...providerKeys.all, "summaries"] as const,
};

async function getProviderSummaries(): Promise<ProviderSummary[]> {
  const providers = listProviders();
  const summaries = await Promise.all(
    providers.map(async (provider) => ({
      provider,
      health: await provider.getHealth(),
    })),
  );

  return summaries.sort((a, b) => a.provider.manifest.name.localeCompare(b.provider.manifest.name));
}

export function useProviderSummaries() {
  return useQuery({
    queryKey: providerKeys.summaries(),
    queryFn: getProviderSummaries,
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

