import type {
  PlaybackEvent,
  PlaybackProgress,
  PlayerBackendType,
  PlayerCapability,
  PlayerSource,
  PlayerState,
} from "../../types/player";

export type PlayerStateListener = (event: PlaybackEvent) => void;

export interface PlayerBackend {
  readonly backendType: PlayerBackendType;
  readonly capabilities: PlayerCapability[];

  loadSource(source: PlayerSource): Promise<PlayerState>;
  play(): Promise<PlayerState>;
  pause(): Promise<PlayerState>;
  stop(): Promise<PlayerState>;
  seek(positionSeconds: number): Promise<PlayerState>;
  setVolume(volume: number): Promise<PlayerState>;
  setMuted(isMuted: boolean): Promise<PlayerState>;
  setPlaybackSpeed(speed: number): Promise<PlayerState>;
  selectAudioTrack(trackId: string): Promise<PlayerState>;
  selectSubtitleTrack(trackId: string | null): Promise<PlayerState>;
  getState(): PlayerState;
  subscribe(listener: PlayerStateListener): () => void;
}

export function createPlaybackProgress(
  currentTimeSeconds: number,
  durationSeconds: number,
): PlaybackProgress {
  const safeDuration = Math.max(0, durationSeconds);
  const safeCurrentTime = Math.max(0, Math.min(currentTimeSeconds, safeDuration));

  return {
    currentTimeSeconds: safeCurrentTime,
    durationSeconds: safeDuration,
    progressPercentage:
      safeDuration > 0 ? Math.round((safeCurrentTime / safeDuration) * 100) : 0,
    lastUpdatedAt: new Date().toISOString(),
  };
}

export function createIdlePlayerState(backendType: PlayerBackendType): PlayerState {
  return {
    backendType,
    status: "idle",
    session: null,
    progress: createPlaybackProgress(0, 0),
    volume: 80,
    isMuted: false,
    playbackSpeed: 1,
    audioTracks: [],
    subtitleTracks: [],
    selectedAudioTrackId: null,
    selectedSubtitleTrackId: null,
    isBuffering: false,
    error: null,
  };
}
