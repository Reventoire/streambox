import { create } from "zustand";
import { playbackService } from "../services/playback/playbackService";
import { playerService } from "../services/player/playerService";
import { createIdlePlayerState } from "../services/player/PlayerBackend";
import type { MediaType } from "../types/media";
import type { PlaybackSession, PlayerSource, PlayerState } from "../types/player";

interface PlaybackState {
  session: PlaybackSession | null;
  playerState: PlayerState;
  error: string | null;
  startSession: (source: PlayerSource) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (positionSeconds: number) => Promise<void>;
  seekRelative: (deltaSeconds: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setPlaybackSpeed: (speed: number) => Promise<void>;
  selectAudioTrack: (trackId: string) => Promise<void>;
  selectSubtitleTrack: (trackId: string | null) => Promise<void>;
  endSession: () => Promise<void>;
  getAllProgress: () => Record<string, { progressPercentage: number; mediaId: string; mediaType: MediaType }>;
}

let unsubscribeFromPlayer: (() => void) | null = null;

function persistPlayerProgress(state: PlayerState): void {
  if (!state.session || state.progress.durationSeconds <= 0) {
    return;
  }

  void playbackService.saveProgress({
    mediaId: state.session.source.mediaId,
    mediaType: state.session.source.mediaType,
    progressSeconds: state.progress.currentTimeSeconds,
    durationSeconds: state.progress.durationSeconds,
    progressPercentage: state.progress.progressPercentage,
    lastWatchedAt: state.progress.lastUpdatedAt,
  });
}

export const usePlaybackStore = create<PlaybackState>((set, get) => {
  const applyPlayerState = (state: PlayerState, shouldPersistProgress = true) => {
    if (shouldPersistProgress) {
      persistPlayerProgress(state);
    }

    set({
      session: state.session,
      playerState: state,
      error: state.error?.message ?? null,
    });
  };

  const runPlayerCommand = async (
    command: () => Promise<PlayerState>,
    shouldPersistProgress = true,
  ) => {
    const state = await command();
    applyPlayerState(state, shouldPersistProgress);
  };

  return {
    session: null,
    playerState: createIdlePlayerState("mock"),
    error: null,

    startSession: async (source: PlayerSource) => {
      if (!unsubscribeFromPlayer) {
        unsubscribeFromPlayer = playerService.subscribe(({ state }) => {
          applyPlayerState(state);
        });
      }

      await runPlayerCommand(() => playerService.loadSource(source));
    },

    play: () => runPlayerCommand(() => playerService.play()),

    pause: () => runPlayerCommand(() => playerService.pause()),

    togglePlayPause: () => runPlayerCommand(() => playerService.togglePlayback()),

    seekTo: (positionSeconds: number) =>
      runPlayerCommand(() => playerService.seek(positionSeconds)),

    seekRelative: (deltaSeconds: number) => {
      const currentTime = get().playerState.progress.currentTimeSeconds;
      return runPlayerCommand(() => playerService.seek(currentTime + deltaSeconds));
    },

    setVolume: (volume: number) =>
      runPlayerCommand(() => playerService.setVolume(volume), false),

    setPlaybackSpeed: (speed: number) =>
      runPlayerCommand(() => playerService.setPlaybackSpeed(speed), false),

    selectAudioTrack: (trackId: string) =>
      runPlayerCommand(() => playerService.selectAudioTrack(trackId), false),

    selectSubtitleTrack: (trackId: string | null) =>
      runPlayerCommand(() => playerService.selectSubtitleTrack(trackId), false),

    endSession: async () => {
      persistPlayerProgress(get().playerState);

      await runPlayerCommand(() => playerService.stop(), false);

      if (unsubscribeFromPlayer) {
        unsubscribeFromPlayer();
        unsubscribeFromPlayer = null;
      }
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
  };
});
