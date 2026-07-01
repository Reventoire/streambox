import { MediaItem, MediaType } from "./media";
export type { PlaybackSession, PlayerSource } from "./player";

export interface LibraryItem {
  mediaId: string;
  mediaType: MediaType;
  addedAt: string; // ISO Date String
  // Snapshot of key display fields so we can render without re-fetching
  title: string;
  year?: string;
  posterUrl?: string;
  backdropUrl?: string;
}

export interface FavoriteItem {
  mediaId: string;
  mediaType: MediaType;
  addedAt: string; // ISO Date String
  title: string;
  year?: string;
  posterUrl?: string;
  backdropUrl?: string;
}

export interface WatchHistoryItem {
  id: string; // unique per watch session
  mediaId: string;
  mediaType: MediaType;
  title: string;
  year?: string;
  posterUrl?: string;
  watchedAt: string; // ISO Date String
  progressPercentage: number;
}

// Helper to convert a MediaItem snapshot to LibraryItem
export function mediaItemToLibraryItem(item: MediaItem): LibraryItem {
  return {
    mediaId: item.id,
    mediaType: item.type,
    addedAt: new Date().toISOString(),
    title: item.title,
    year: item.year,
    posterUrl: item.posterUrl,
    backdropUrl: item.backdropUrl,
  };
}

// Helper to convert a MediaItem snapshot to FavoriteItem
export function mediaItemToFavoriteItem(item: MediaItem): FavoriteItem {
  return {
    mediaId: item.id,
    mediaType: item.type,
    addedAt: new Date().toISOString(),
    title: item.title,
    year: item.year,
    posterUrl: item.posterUrl,
    backdropUrl: item.backdropUrl,
  };
}
