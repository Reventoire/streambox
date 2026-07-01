import type { MediaDetails, MediaItem, MediaType } from "./media";

export interface TmdbConfig {
  apiReadAccessToken?: string;
  enabled: boolean;
}

export interface TmdbImage {
  file_path: string;
  width?: number;
  height?: number;
  aspect_ratio?: number;
}

export interface TmdbExternalIds {
  imdb_id?: string | null;
  tvdb_id?: number | null;
  wikidata_id?: string | null;
  facebook_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;
}

export interface TmdbSearchResult {
  id: number;
  media_type?: "movie" | "tv";
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovieDetails {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  runtime?: number | null;
  vote_average?: number;
  genres?: TmdbGenre[];
  external_ids?: TmdbExternalIds;
}

export interface TmdbTvSeason {
  id: number;
  name: string;
  season_number: number;
  episode_count?: number;
  overview?: string;
  poster_path?: string | null;
}

export interface TmdbTvDetails {
  id: number;
  name: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  first_air_date?: string;
  episode_run_time?: number[];
  vote_average?: number;
  genres?: TmdbGenre[];
  seasons?: TmdbTvSeason[];
  external_ids?: TmdbExternalIds;
}

export interface TmdbProviderError {
  code:
    | "tmdb-not-configured"
    | "tmdb-invalid-token"
    | "tmdb-request-failed"
    | "tmdb-response-invalid";
  message: string;
  statusCode?: number;
}

export type TmdbNormalizedMediaItem = MediaItem & {
  providerId: "tmdb";
  externalIds: {
    tmdbId: string;
    imdbId?: string;
    tvdbId?: string;
  };
};

export type TmdbNormalizedMediaDetails = MediaDetails & {
  providerId: "tmdb";
  externalIds: {
    tmdbId: string;
    imdbId?: string;
    tvdbId?: string;
  };
};

export type TmdbSearchType = MediaType | "multi";
export type TmdbTimeWindow = "day" | "week";
