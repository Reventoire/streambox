import type {
  AudioTrack,
  PlaybackEventType,
  PlaybackSession,
  PlayerCapability,
  PlayerSource,
  PlayerState,
  SubtitleTrack,
} from "../../../types/player";
import {
  createIdlePlayerState,
  createPlaybackProgress,
  type PlayerBackend,
  type PlayerStateListener,
} from "../PlayerBackend";

const MOCK_TICK_MS = 1000;
const MOCK_LOAD_DELAY_MS = 200;

const MOCK_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: "mock-audio-en-stereo",
    label: "English Stereo",
    language: "en",
    channels: "2.0",
    isDefault: true,
  },
  {
    id: "mock-audio-en-surround",
    label: "English 5.1",
    language: "en",
    channels: "5.1",
  },
];

const MOCK_SUBTITLE_TRACKS: SubtitleTrack[] = [
  {
    id: "mock-subtitles-en",
    label: "English",
    language: "en",
    format: "mock",
  },
  {
    id: "mock-subtitles-es",
    label: "Spanish",
    language: "es",
    format: "mock",
  },
];

const MOCK_CAPABILITIES: PlayerCapability[] = [
  "play",
  "pause",
  "stop",
  "seek",
  "volume",
  "playback-speed",
  "audio-tracks",
  "subtitle-tracks",
  "progress",
  "duration",
  "buffering",
  "errors",
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function createSession(source: PlayerSource): PlaybackSession {
  const now = new Date().toISOString();

  return {
    id: `mock-session-${source.mediaId}-${Date.now()}`,
    source,
    backendType: "mock",
    startedAt: now,
    updatedAt: now,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export class MockPlayerBackend implements PlayerBackend {
  readonly backendType = "mock";
  readonly capabilities = MOCK_CAPABILITIES;

  private state: PlayerState = createIdlePlayerState(this.backendType);
  private listeners = new Set<PlayerStateListener>();
  private timer: ReturnType<typeof window.setInterval> | null = null;

  async loadSource(source: PlayerSource): Promise<PlayerState> {
    this.clearTimer();
    this.updateState({
      ...this.state,
      status: "loading",
      isBuffering: true,
      error: null,
      progress: createPlaybackProgress(0, source.durationSeconds),
    });

    await delay(MOCK_LOAD_DELAY_MS);

    this.updateState({
      ...createIdlePlayerState(this.backendType),
      status: "playing",
      session: createSession(source),
      progress: createPlaybackProgress(0, source.durationSeconds),
      volume: this.state.volume,
      isMuted: this.state.isMuted,
      playbackSpeed: this.state.playbackSpeed,
      audioTracks: MOCK_AUDIO_TRACKS,
      subtitleTracks: MOCK_SUBTITLE_TRACKS,
      selectedAudioTrackId: MOCK_AUDIO_TRACKS[0]?.id ?? null,
      selectedSubtitleTrackId: null,
      isBuffering: false,
    });
    this.startTimer();

    return this.state;
  }

  async play(): Promise<PlayerState> {
    if (!this.state.session) {
      return this.state;
    }

    const progress =
      this.state.status === "ended"
        ? createPlaybackProgress(0, this.state.progress.durationSeconds)
        : this.state.progress;

    this.updateState({
      ...this.state,
      status: "playing",
      progress,
      error: null,
      session: this.touchSession(this.state.session),
    });
    this.startTimer();

    return this.state;
  }

  async pause(): Promise<PlayerState> {
    this.clearTimer();

    if (this.state.session) {
      this.updateState({
        ...this.state,
        status: "paused",
        session: this.touchSession(this.state.session),
      });
    }

    return this.state;
  }

  async stop(): Promise<PlayerState> {
    this.clearTimer();
    this.updateState({
      ...createIdlePlayerState(this.backendType),
      status: "stopped",
      volume: this.state.volume,
      isMuted: this.state.isMuted,
      playbackSpeed: this.state.playbackSpeed,
      progress: this.state.progress,
    });

    return this.state;
  }

  async seek(positionSeconds: number): Promise<PlayerState> {
    if (!this.state.session) {
      return this.state;
    }

    this.updateState(
      {
        ...this.state,
        progress: createPlaybackProgress(positionSeconds, this.state.progress.durationSeconds),
        session: this.touchSession(this.state.session),
      },
      "progress-changed",
    );

    return this.state;
  }

  async setVolume(volume: number): Promise<PlayerState> {
    this.updateState({
      ...this.state,
      volume: clamp(Math.round(volume), 0, 100),
    });

    return this.state;
  }

  async setMuted(isMuted: boolean): Promise<PlayerState> {
    this.updateState({
      ...this.state,
      isMuted,
    });

    return this.state;
  }

  async setPlaybackSpeed(speed: number): Promise<PlayerState> {
    this.updateState({
      ...this.state,
      playbackSpeed: clamp(speed, 0.25, 3),
    });

    return this.state;
  }

  async selectAudioTrack(trackId: string): Promise<PlayerState> {
    const track = this.state.audioTracks.find((candidate) => candidate.id === trackId);

    if (!track) {
      return this.setRecoverableError("audio-track-not-found", "Audio track is not available.");
    }

    this.updateState(
      {
        ...this.state,
        selectedAudioTrackId: track.id,
        error: null,
      },
      "tracks-changed",
    );

    return this.state;
  }

  async selectSubtitleTrack(trackId: string | null): Promise<PlayerState> {
    if (trackId === null) {
      this.updateState(
        {
          ...this.state,
          selectedSubtitleTrackId: null,
          error: null,
        },
        "tracks-changed",
      );

      return this.state;
    }

    const track = this.state.subtitleTracks.find((candidate) => candidate.id === trackId);

    if (!track) {
      return this.setRecoverableError(
        "subtitle-track-not-found",
        "Subtitle track is not available.",
      );
    }

    this.updateState(
      {
        ...this.state,
        selectedSubtitleTrackId: track.id,
        error: null,
      },
      "tracks-changed",
    );

    return this.state;
  }

  getState(): PlayerState {
    return this.state;
  }

  subscribe(listener: PlayerStateListener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private startTimer(): void {
    this.clearTimer();

    this.timer = window.setInterval(() => {
      if (this.state.status !== "playing" || !this.state.session) {
        return;
      }

      const nextTime =
        this.state.progress.currentTimeSeconds + 1 * this.state.playbackSpeed;
      const duration = this.state.progress.durationSeconds;

      if (nextTime >= duration) {
        this.clearTimer();
        this.updateState(
          {
            ...this.state,
            status: "ended",
            progress: createPlaybackProgress(duration, duration),
            session: this.touchSession(this.state.session),
          },
          "progress-changed",
        );
        return;
      }

      this.updateState(
        {
          ...this.state,
          progress: createPlaybackProgress(nextTime, duration),
          session: this.touchSession(this.state.session),
        },
        "progress-changed",
      );
    }, MOCK_TICK_MS);
  }

  private clearTimer(): void {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  private updateState(state: PlayerState, eventType: PlaybackEventType = "state-changed"): void {
    this.state = state;

    for (const listener of this.listeners) {
      listener({
        type: eventType,
        state: this.state,
      });
    }
  }

  private touchSession(session: PlaybackSession): PlaybackSession {
    return {
      ...session,
      updatedAt: new Date().toISOString(),
    };
  }

  private setRecoverableError(code: string, message: string): PlayerState {
    this.updateState(
      {
        ...this.state,
        error: {
          code,
          message,
          isRecoverable: true,
        },
      },
      "playback-error",
    );

    return this.state;
  }
}
