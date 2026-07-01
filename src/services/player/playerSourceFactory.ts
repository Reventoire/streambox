import type { Episode, MediaDetails } from "../../types/media";
import type { EpisodePlaybackInput, PlayerSource } from "../../types/player";

const SECONDS_PER_MINUTE = 60;

function sanitizeId(value: string): string {
  return value.replace(/[^a-zA-Z0-9:._-]/g, "-");
}

function getMediaDurationSeconds(media: MediaDetails): number | undefined {
  return media.runtime ? media.runtime * SECONDS_PER_MINUTE : undefined;
}

export function createPlaceholderPlayerSourceFromMediaDetails(
  media: MediaDetails,
): PlayerSource {
  if (!media.id || !media.type || !media.title) {
    throw new Error("Cannot create a mock player source without media id, type, and title.");
  }

  return {
    id: `mock-source:${sanitizeId(media.type)}:${sanitizeId(media.id)}`,
    mediaId: media.id,
    mediaType: media.type,
    title: media.title,
    duration: getMediaDurationSeconds(media),
    posterUrl: media.posterUrl,
    backdropUrl: media.backdropUrl,
    backendType: "mock",
  };
}

export function createPlaceholderPlayerSourceFromEpisode(
  media: MediaDetails,
  episode: Episode | EpisodePlaybackInput,
): PlayerSource {
  if (!media.id || media.type !== "series" || !media.title || !episode.id) {
    throw new Error("Cannot create a mock episode source without series and episode identity.");
  }

  return {
    id: `mock-source:${sanitizeId(media.id)}:${sanitizeId(episode.id)}`,
    mediaId: media.id,
    mediaType: media.type,
    title: media.title,
    episodeId: episode.id,
    seasonNumber: "seasonNumber" in episode ? episode.seasonNumber : undefined,
    episodeNumber: episode.episodeNumber,
    episodeTitle: episode.title,
    posterUrl: media.posterUrl,
    backdropUrl: media.backdropUrl,
    backendType: "mock",
  };
}
