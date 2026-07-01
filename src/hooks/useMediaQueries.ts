import { useQuery } from "@tanstack/react-query";
import { mockMediaService } from "../services/mock/mockMediaService";
import type { MediaType } from "../types/media";

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
    queryFn: mockMediaService.getTrendingMovies,
  });
}

export function usePopularSeries() {
  return useQuery({
    queryKey: mediaKeys.popularSeries(),
    queryFn: mockMediaService.getPopularSeries,
  });
}

export function useContinueWatching() {
  return useQuery({
    queryKey: mediaKeys.continueWatching(),
    queryFn: mockMediaService.getContinueWatching,
  });
}

export function useRecentlyAdded() {
  return useQuery({
    queryKey: mediaKeys.recentlyAdded(),
    queryFn: mockMediaService.getRecentlyAdded,
  });
}

export function useSearchMedia(query: string) {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: mediaKeys.search(normalizedQuery),
    queryFn: () => mockMediaService.searchMedia(normalizedQuery),
    enabled: normalizedQuery.length > 0,
  });
}

export function useMediaDetails(type: MediaType | undefined, id: string | undefined) {
  return useQuery({
    queryKey: mediaKeys.details(type ?? "unknown", id ?? "unknown"),
    queryFn: () => {
      if (!type || !id) {
        throw new Error("Media type and id are required");
      }

      return mockMediaService.getMediaDetails(type, id);
    },
    enabled: !!type && !!id,
  });
}
