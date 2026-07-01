import { useQuery } from "@tanstack/react-query";
import { mockMediaService } from "../services/mock/mockMediaService";

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
  return useQuery({
    queryKey: mediaKeys.search(query),
    queryFn: () => mockMediaService.searchMedia(query),
    enabled: query.length > 0,
  });
}

export function useMediaDetails(type: string, id: string) {
  return useQuery({
    queryKey: mediaKeys.details(type, id),
    queryFn: () => mockMediaService.getMediaDetails(type, id),
    enabled: !!type && !!id,
  });
}
