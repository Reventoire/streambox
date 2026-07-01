export const MEDIA_TYPES = ["movie", "series"] as const;

export type MediaType = (typeof MEDIA_TYPES)[number];

export function isMediaType(value: string | undefined): value is MediaType {
  return MEDIA_TYPES.some((mediaType) => mediaType === value);
}

export interface Genre {
  id: string;
  name: string;
}

export interface WatchProgress {
  progressPercentage: number;
  lastWatchedAt: string; // ISO Date String
}

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  year?: string;
  posterUrl?: string;
  backdropUrl?: string;
  genres?: Genre[];
  rating?: number;
  description?: string;
  watchProgress?: WatchProgress;
}

export interface Episode {
  id: string;
  seasonId: string;
  episodeNumber: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  releasedAt?: string;
}

export interface Season {
  id: string;
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface MediaDetails extends MediaItem {
  runtime?: number; // in minutes
  cast?: string[];
  director?: string;
  seasons?: Season[];
}
