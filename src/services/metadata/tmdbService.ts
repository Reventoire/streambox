import type { MediaItem, MediaType } from "../../types/media";
import type {
  TmdbConfig,
  TmdbExternalIds,
  TmdbMovieDetails,
  TmdbNormalizedMediaDetails,
  TmdbNormalizedMediaItem,
  TmdbProviderError,
  TmdbSearchResult,
  TmdbSearchType,
  TmdbTimeWindow,
  TmdbTvDetails,
} from "../../types/tmdb";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const TMDB_PROVIDER_ID = "tmdb";

class TmdbServiceError extends Error {
  readonly providerError: TmdbProviderError;

  constructor(providerError: TmdbProviderError) {
    super(providerError.message);
    this.name = "TmdbServiceError";
    this.providerError = providerError;
  }
}

interface TmdbListResponse<TItem> {
  results: TItem[];
}

function requireToken(configOrToken: TmdbConfig | string): string {
  const token =
    typeof configOrToken === "string"
      ? configOrToken.trim()
      : configOrToken.apiReadAccessToken?.trim() ?? "";

  if (!token) {
    throw new TmdbServiceError({
      code: "tmdb-not-configured",
      message: "TMDB API Read Access Token is not configured.",
    });
  }

  return token;
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(`${TMDB_API_BASE_URL}${path}`);

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function fetchTmdbJson<TResponse>(
  configOrToken: TmdbConfig | string,
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<TResponse> {
  const token = requireToken(configOrToken);
  const response = await fetch(buildUrl(path, params), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new TmdbServiceError({
      code: response.status === 401 ? "tmdb-invalid-token" : "tmdb-request-failed",
      message:
        response.status === 401
          ? "TMDB rejected the saved token."
          : `TMDB request failed with HTTP ${response.status}.`,
      statusCode: response.status,
    });
  }

  return response.json() as Promise<TResponse>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getImageUrl(path: string | null | undefined, size: "w342" | "w780" | "original") {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : undefined;
}

function getYear(value: string | undefined): string | undefined {
  return value ? value.slice(0, 4) : undefined;
}

function normalizeExternalIds(tmdbId: number, externalIds?: TmdbExternalIds) {
  return {
    tmdbId: String(tmdbId),
    imdbId: externalIds?.imdb_id ?? undefined,
    tvdbId: externalIds?.tvdb_id ? String(externalIds.tvdb_id) : undefined,
  };
}

function createTmdbMediaId(type: MediaType, tmdbId: number): string {
  return `tmdb:${type}:${tmdbId}`;
}

function normalizeSearchType(result: TmdbSearchResult): MediaType | null {
  if (result.media_type === "movie" || result.title) {
    return "movie";
  }

  if (result.media_type === "tv" || result.name) {
    return "series";
  }

  return null;
}

export async function validateTmdbToken(token: string): Promise<boolean> {
  const trimmedToken = token.trim();

  if (!trimmedToken) {
    return false;
  }

  await fetchTmdbJson(trimmedToken, "/configuration");
  return true;
}

export async function searchTmdb(
  config: TmdbConfig,
  query: string,
  type: TmdbSearchType = "multi",
): Promise<TmdbSearchResult[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const path =
    type === "movie" ? "/search/movie" : type === "series" ? "/search/tv" : "/search/multi";
  const response = await fetchTmdbJson<TmdbListResponse<TmdbSearchResult>>(config, path, {
    query: trimmedQuery,
    include_adult: false,
  });

  return response.results.filter((result) => normalizeSearchType(result));
}

export function normalizeTmdbSearchResult(
  result: TmdbSearchResult,
): TmdbNormalizedMediaItem | null {
  const type = normalizeSearchType(result);

  if (!type) {
    return null;
  }

  const title = type === "movie" ? result.title : result.name;

  if (!title) {
    return null;
  }

  return {
    id: createTmdbMediaId(type, result.id),
    type,
    title,
    year: getYear(type === "movie" ? result.release_date : result.first_air_date),
    posterUrl: getImageUrl(result.poster_path, "w342"),
    backdropUrl: getImageUrl(result.backdrop_path, "w780"),
    description: result.overview,
    rating: result.vote_average,
    providerId: TMDB_PROVIDER_ID,
    externalIds: normalizeExternalIds(result.id),
  };
}

export async function getTmdbMovieDetails(
  config: TmdbConfig,
  tmdbId: string | number,
): Promise<TmdbMovieDetails> {
  return fetchTmdbJson<TmdbMovieDetails>(config, `/movie/${tmdbId}`, {
    append_to_response: "external_ids",
  });
}

export async function getTmdbTvDetails(
  config: TmdbConfig,
  tmdbId: string | number,
): Promise<TmdbTvDetails> {
  return fetchTmdbJson<TmdbTvDetails>(config, `/tv/${tmdbId}`, {
    append_to_response: "external_ids",
  });
}

export async function getTmdbExternalIds(
  config: TmdbConfig,
  type: MediaType,
  tmdbId: string | number,
): Promise<TmdbExternalIds> {
  const path = type === "movie" ? `/movie/${tmdbId}/external_ids` : `/tv/${tmdbId}/external_ids`;
  return fetchTmdbJson<TmdbExternalIds>(config, path);
}

export async function getTmdbTrending(
  config: TmdbConfig,
  type: TmdbSearchType,
  timeWindow: TmdbTimeWindow,
): Promise<TmdbSearchResult[]> {
  const tmdbType = type === "series" ? "tv" : type;
  const response = await fetchTmdbJson<TmdbListResponse<TmdbSearchResult>>(
    config,
    `/trending/${tmdbType}/${timeWindow}`,
  );

  return response.results.filter((result) => normalizeSearchType(result));
}

export async function getTmdbPopular(
  config: TmdbConfig,
  type: MediaType,
): Promise<TmdbSearchResult[]> {
  const path = type === "movie" ? "/movie/popular" : "/tv/popular";
  const response = await fetchTmdbJson<TmdbListResponse<TmdbSearchResult>>(config, path);

  return response.results.map((result) => ({
    ...result,
    media_type: type === "movie" ? "movie" : "tv",
  }));
}

export function normalizeTmdbDetails(
  details: TmdbMovieDetails | TmdbTvDetails,
): TmdbNormalizedMediaDetails {
  const isMovie = isRecord(details) && "title" in details;
  const type: MediaType = isMovie ? "movie" : "series";
  const title = isMovie ? (details as TmdbMovieDetails).title : (details as TmdbTvDetails).name;
  const date = isMovie
    ? (details as TmdbMovieDetails).release_date
    : (details as TmdbTvDetails).first_air_date;
  const runtime = isMovie
    ? (details as TmdbMovieDetails).runtime ?? undefined
    : (details as TmdbTvDetails).episode_run_time?.[0];

  return {
    id: createTmdbMediaId(type, details.id),
    type,
    title,
    year: getYear(date),
    runtime,
    posterUrl: getImageUrl(details.poster_path, "w342"),
    backdropUrl: getImageUrl(details.backdrop_path, "original"),
    description: details.overview,
    rating: details.vote_average,
    genres: details.genres?.map((genre) => ({
      id: String(genre.id),
      name: genre.name,
    })),
    seasons:
      !isMovie && (details as TmdbTvDetails).seasons
        ? (details as TmdbTvDetails).seasons
            ?.filter((season) => season.season_number > 0)
            .map((season) => ({
              id: `tmdb-season-${season.id}`,
              seasonNumber: season.season_number,
              title: season.name,
              episodes: [],
            }))
        : undefined,
    providerId: TMDB_PROVIDER_ID,
    externalIds: normalizeExternalIds(details.id, details.external_ids),
  };
}

export function normalizeTmdbItems(results: TmdbSearchResult[]): MediaItem[] {
  return results.flatMap((result): MediaItem[] => {
    const normalized = normalizeTmdbSearchResult(result);
    return normalized ? [normalized] : [];
  });
}

export { TmdbServiceError };
