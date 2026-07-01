import { useQuery } from "@tanstack/react-query";
import { metadataPreferenceService } from "../services/metadata/metadataPreferenceService";
import { TMDB_PROVIDER_ID } from "../services/providers/tmdbProvider";
import { useSettingsStore } from "../stores/useSettingsStore";
import type { MediaType } from "../types/media";

export const metadataProviderKeys = {
  all: ["metadata"] as const,
  preferredSearch: (providerId: string, query: string, type?: MediaType) =>
    [...metadataProviderKeys.all, providerId, "search", query, type] as const,
  trending: (providerId: string, type: MediaType | "multi", timeWindow: "day" | "week") =>
    [...metadataProviderKeys.all, providerId, "trending", type, timeWindow] as const,
  popular: (providerId: string, type: MediaType) =>
    [...metadataProviderKeys.all, providerId, "popular", type] as const,
  details: (providerId: string, type: string, id: string) =>
    [...metadataProviderKeys.all, providerId, "details", type, id] as const,
};

function useMetadataSettings() {
  return useSettingsStore((state) => state.settings.metadata);
}

export function useIsTmdbPreferred(): boolean {
  const metadata = useMetadataSettings();
  return metadata.preferredMetadataProviderId === TMDB_PROVIDER_ID;
}

export function usePreferredMetadataSearch(query: string, type?: MediaType) {
  const metadata = useMetadataSettings();

  return useQuery({
    queryKey: metadataProviderKeys.preferredSearch(
      metadata.preferredMetadataProviderId,
      query,
      type,
    ),
    queryFn: () => metadataPreferenceService.searchMedia(metadata, query, type),
    enabled: query.trim().length > 0 && metadata.preferredMetadataProviderId === TMDB_PROVIDER_ID,
    staleTime: 60_000,
  });
}

export function usePreferredMetadataDetails(type: string, id: string) {
  const metadata = useMetadataSettings();

  return useQuery({
    queryKey: metadataProviderKeys.details(metadata.preferredMetadataProviderId, type, id),
    queryFn: () =>
      metadataPreferenceService.getMediaDetails(
        metadata,
        type as MediaType,
        id,
      ),
    enabled: Boolean(id && (type === "movie" || type === "series")),
  });
}

export function usePreferredTrending(type: MediaType | "multi", timeWindow: "day" | "week") {
  const metadata = useMetadataSettings();

  return useQuery({
    queryKey: metadataProviderKeys.trending(metadata.preferredMetadataProviderId, type, timeWindow),
    queryFn: () => metadataPreferenceService.getTrending(metadata, type, timeWindow),
    enabled: metadata.preferredMetadataProviderId === TMDB_PROVIDER_ID,
    staleTime: 120_000,
  });
}

export function usePreferredPopular(type: MediaType) {
  const metadata = useMetadataSettings();

  return useQuery({
    queryKey: metadataProviderKeys.popular(metadata.preferredMetadataProviderId, type),
    queryFn: () => metadataPreferenceService.getPopular(metadata, type),
    enabled: metadata.preferredMetadataProviderId === TMDB_PROVIDER_ID,
    staleTime: 120_000,
  });
}
