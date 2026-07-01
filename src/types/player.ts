import type { Episode, MediaDetails, MediaType } from "./media";

export type PlayerBackendType = "mock";

export type PlayerStatus =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "stopped"
  | "ended"
  | "error";

export interface PlayerTrack {
  id: string;
  label: string;
  language?: string;
}

export interface AudioTrack extends PlayerTrack {
  kind: "audio";
}

export interface SubtitleTrack extends PlayerTrack {
  kind: "subtitle";
}

export interface PlaybackProgress {
  currentTime: number;
  duration: number;
  progressPercentage: number;
  updatedAt: string;
}

export interface PlayerSource {
  id: string;
  mediaId: string;
  mediaType: MediaType;
  title: string;
  episodeId?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
  duration?: number;
  posterUrl?: string;
  backdropUrl?: string;
  backendType: PlayerBackendType;
}

export interface PlaybackSession {
  id: string;
  source: PlayerSource;
  startedAt: string;
  updatedAt: string;
}

export interface PlayerState {
  session: PlaybackSession | null;
  status: PlayerStatus;
  currentTime: number;
  duration: number;
  volume: number;
  playbackSpeed: number;
  isBuffering: boolean;
  error: string | null;
  audioTracks: AudioTrack[];
  subtitleTracks: SubtitleTrack[];
  selectedAudioTrackId?: string;
  selectedSubtitleTrackId?: string;
}

export interface PlayerBackend {
  readonly backendType: PlayerBackendType;
  play(source: PlayerSource): Promise<PlaybackSession>;
  pause(): Promise<void>;
  stop(): Promise<void>;
  seek(seconds: number): Promise<void>;
  setVolume(volume: number): Promise<void>;
  setPlaybackSpeed(speed: number): Promise<void>;
}

export function isPlaybackMediaDetails(value: MediaDetails | null | undefined): value is MediaDetails {
  return Boolean(value?.id && value.type && value.title);
}

export type EpisodePlaybackInput = Pick<
  Episode,
  "id" | "episodeNumber" | "title"
> & {
  seasonNumber?: number;
};
