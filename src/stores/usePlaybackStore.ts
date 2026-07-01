import { create } from "zustand";
import { PlaybackSession, PlayerSourcePlaceholder } from "../types/library";
import { playbackService } from "../services/playback/playbackService";
import { MediaType } from "../types/media";

interface PlaybackState {
  session: PlaybackSession | null;
  startSession: (source: PlayerSourcePlaceholder) => void;
  updateProgress: (progressSeconds: number) => void;
  togglePlayPause: () => void;
  endSession: () => void;
  getAllProgress: () => Record<string, { progressPercentage: number; mediaId: string; mediaType: MediaType }>;
}

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  session: null,

  startSession: (source: PlayerSourcePlaceholder) => {
    set({
      session: {
        ...source,
        progressSeconds: 0,
        isPlaying: true,
        startedAt: new Date().toISOString(),
      },
    });
  },

  updateProgress: (progressSeconds: number) => {
    const session = get().session;
    if (!session) return;

    const updated: PlaybackSession = { ...session, progressSeconds };
    set({ session: updated });

    // Persist to localStorage
    playbackService.saveProgress({
      mediaId: session.mediaId,
      mediaType: session.mediaType,
      progressSeconds,
      durationSeconds: session.durationSeconds,
      progressPercentage: Math.round((progressSeconds / session.durationSeconds) * 100),
      lastWatchedAt: new Date().toISOString(),
    });
  },

  togglePlayPause: () => {
    set((state) => ({
      session: state.session
        ? { ...state.session, isPlaying: !state.session.isPlaying }
        : null,
    }));
  },

  endSession: () => {
    set({ session: null });
  },

  getAllProgress: () => {
    const raw = playbackService.getAllProgress();
    const result: Record<string, { progressPercentage: number; mediaId: string; mediaType: MediaType }> = {};
    for (const [key, val] of Object.entries(raw)) {
      result[key] = {
        progressPercentage: val.progressPercentage,
        mediaId: val.mediaId,
        mediaType: val.mediaType,
      };
    }
    return result;
  },
}));
