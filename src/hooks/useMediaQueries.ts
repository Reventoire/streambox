import { useQuery } from "@tanstack/react-query";
import { providerMediaService } from "../services/providers/providerMediaService";
import { isMediaType } from "../types/media";

export const mediaKeys = {
  all: ["media"] as const,
  trendingMovies: () => [...mediaKeys.all, "trending", "movies"] as const,
  popularSeries: () => [...mediaKeys.all, "popular", "series"] as const,
  continueWatching: () => [...mediaKeys.all, "continue-watching"] as const,
  recentlyAdded: () => [...mediaKeys.all, "recently-added"] as const,
  search: (query: string) => [...mediaKeys.all, "search", query] as const,
  details: (type: string, id: string) => [...mediaKeys.all, "details", type, id] as const,
};

export function useTrendingMovies() {
  return useQuery({
    queryKey: mediaKeys.trendingMovies(),
    queryFn: providerMediaService.getTrendingMovies,
  });
}

export function usePopularSeries() {
  return useQuery({
    queryKey: mediaKeys.popularSeries(),
    queryFn: providerMediaService.getPopularSeries,
  });
}

export function useContinueWatching() {
  return useQuery({
    queryKey: mediaKeys.continueWatching(),
    queryFn: providerMediaService.getContinueWatching,
  });
}

export function useRecentlyAdded() {
  return useQuery({
    queryKey: mediaKeys.recentlyAdded(),
    queryFn: providerMediaService.getRecentlyAdded,
  });
}

export function useSearchMedia(query: string) {
  return useQuery({
    queryKey: mediaKeys.search(query),
    queryFn: () => providerMediaService.searchMedia(query),
    enabled: query.trim().length > 0,
  });
}

export function useMediaDetails(type: string, id: string) {
  const mediaType = isMediaType(type) ? type : undefined;

  return useQuery({
    queryKey: mediaKeys.details(type, id),
    queryFn: () => providerMediaService.getMediaDetails(mediaType!, id),
    enabled: !!mediaType && !!id,
  });
}
