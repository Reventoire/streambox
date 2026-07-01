import { create } from "zustand";
import { playbackHistoryService } from "../services/player/playbackHistoryService";
import { playerService } from "../services/player/playerService";
import type { PlaybackProgress, PlaybackSession, PlayerSource, PlayerState } from "../types/player";

interface PlaybackActions {
  startPlayback: (source: PlayerSource) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stopPlayback: () => Promise<void>;
  seek: (seconds: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setPlaybackSpeed: (speed: number) => Promise<void>;
  tick: () => void;
  clearError: () => void;
}

type PlaybackStore = PlayerState & PlaybackActions;

const DEFAULT_VOLUME = 0.8;
const DEFAULT_PLAYBACK_SPEED = 1;
const TICK_SECONDS = 1;

function createProgress(
  currentTime: number,
  duration: number,
): PlaybackProgress {
  return {
    currentTime,
    duration,
    progressPercentage: duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0,
    updatedAt: new Date().toISOString(),
  };
}

function persistProgress(session: PlaybackSession | null, currentTime: number, duration: number): void {
  if (!session) {
    return;
  }

  playbackHistoryService.upsert(session, createProgress(currentTime, duration));
}

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  session: null,
  status: "idle",
  currentTime: 0,
  duration: 0,
  volume: DEFAULT_VOLUME,
  playbackSpeed: DEFAULT_PLAYBACK_SPEED,
  isBuffering: false,
  error: null,
  audioTracks: [],
  subtitleTracks: [],
  selectedAudioTrackId: undefined,
  selectedSubtitleTrackId: undefined,

  startPlayback: async (source) => {
    if (!source.mediaId || !source.mediaType || !source.title) {
      set({
        status: "error",
        error: "Cannot start playback without media identity.",
      });
      return;
    }

    set({ status: "loading", isBuffering: true, error: null });

    try {
      const session = await playerService.start(source);
      const duration = playerService.getDuration(source);

      set({
        session,
        status: "playing",
        currentTime: 0,
        duration,
        isBuffering: false,
        error: null,
      });
      persistProgress(session, 0, duration);
    } catch {
      set({
        status: "error",
        isBuffering: false,
        error: "Could not start the mock player.",
      });
    }
  },

  play: async () => {
    const session = get().session;

    if (!session) {
      return;
    }

    await playerService.start(session.source);
    set({ status: "playing", error: null });
  },

  pause: async () => {
    const session = get().session;

    if (!session) {
      return;
    }

    await playerService.pause(session.source);
    set({ status: "paused" });
    persistProgress(session, get().currentTime, get().duration);
  },

  togglePlayPause: async () => {
    if (get().status === "playing") {
      await get().pause();
      return;
    }

    await get().play();
  },

  stopPlayback: async () => {
    const session = get().session;

    if (session) {
      await playerService.stop(session.source);
      persistProgress(session, get().currentTime, get().duration);
    }

    set({
      session: null,
      status: "stopped",
      currentTime: 0,
      duration: 0,
      error: null,
      isBuffering: false,
    });
  },

  seek: async (seconds) => {
    const session = get().session;

    if (!session) {
      return;
    }

    const duration = get().duration;
    const nextTime = Math.max(0, Math.min(seconds, duration));
    await playerService.seek(session.source, nextTime);
    set({ currentTime: nextTime });
    persistProgress(session, nextTime, duration);
  },

  setVolume: async (volume) => {
    const session = get().session;
    const nextVolume = Math.max(0, Math.min(volume, 1));

    if (session) {
      await playerService.setVolume(session.source, nextVolume);
    }

    set({ volume: nextVolume });
  },

  setPlaybackSpeed: async (speed) => {
    const session = get().session;
    const nextSpeed = Math.max(0.25, Math.min(speed, 2));

    if (session) {
      await playerService.setPlaybackSpeed(session.source, nextSpeed);
    }

    set({ playbackSpeed: nextSpeed });
  },

  tick: () => {
    const { session, status, currentTime, duration, playbackSpeed } = get();

    if (!session || status !== "playing") {
      return;
    }

    const nextTime = Math.min(duration, currentTime + TICK_SECONDS * playbackSpeed);
    const nextStatus = nextTime >= duration ? "ended" : "playing";

    set({
      currentTime: nextTime,
      status: nextStatus,
    });
    persistProgress(session, nextTime, duration);
  },

  clearError: () => set({ error: null }),
}));
