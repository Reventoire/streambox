import type { MediaType } from "./media";

export type PlayerBackendType =
  | "mock"
  | "external-mpv"
  | "libmpv"
  | "android";

export type PlayerCapability =
  | "play"
  | "pause"
  | "stop"
  | "seek"
  | "volume"
  | "playback-speed"
  | "audio-tracks"
  | "subtitle-tracks"
  | "progress"
  | "duration"
  | "buffering"
  | "errors";

export type PlayerStatus =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "stopped"
  | "ended"
  | "error";

export type PlayerSourceType = "mock" | "stream" | "file";

export interface PlayerSource {
  id: string;
  mediaId: string;
  mediaType: MediaType;
  sourceType: PlayerSourceType;
  title: string;
  year?: string;
  posterUrl?: string;
  backdropUrl?: string;
  episodeId?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
  durationSeconds: number;
}

export interface PlayerTrack {
  id: string;
  label: string;
  language?: string;
  isDefault?: boolean;
}

export interface AudioTrack extends PlayerTrack {
  channels?: string;
}

export interface SubtitleTrack extends PlayerTrack {
  format?: string;
}

export interface PlaybackProgress {
  currentTimeSeconds: number;
  durationSeconds: number;
  progressPercentage: number;
  lastUpdatedAt: string;
}

export interface PlayerError {
  code: string;
  message: string;
  isRecoverable: boolean;
}

export interface PlaybackSession {
  id: string;
  source: PlayerSource;
  backendType: PlayerBackendType;
  startedAt: string;
  updatedAt: string;
}

export interface PlayerState {
  backendType: PlayerBackendType;
  status: PlayerStatus;
  session: PlaybackSession | null;
  progress: PlaybackProgress;
  volume: number;
  isMuted: boolean;
  playbackSpeed: number;
  audioTracks: AudioTrack[];
  subtitleTracks: SubtitleTrack[];
  selectedAudioTrackId: string | null;
  selectedSubtitleTrackId: string | null;
  isBuffering: boolean;
  error: PlayerError | null;
}

export type PlaybackCommand =
  | "load"
  | "play"
  | "pause"
  | "stop"
  | "seek"
  | "set-volume"
  | "set-playback-speed"
  | "select-audio-track"
  | "select-subtitle-track";

export type PlaybackEventType =
  | "state-changed"
  | "progress-changed"
  | "tracks-changed"
  | "playback-error";

export interface PlaybackEvent {
  type: PlaybackEventType;
  state: PlayerState;
}

