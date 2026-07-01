import type { PlaybackSession, PlayerBackend, PlayerSource } from "../../types/player";
import { MockPlayerBackend } from "./MockPlayerBackend";

const DEFAULT_MOVIE_DURATION_SECONDS = 90 * 60;
const DEFAULT_SERIES_DURATION_SECONDS = 45 * 60;

const mockBackend = new MockPlayerBackend();

function getBackend(source: PlayerSource): PlayerBackend {
  switch (source.backendType) {
    case "mock":
      return mockBackend;
    default:
      return mockBackend;
  }
}

export const playerService = {
  getDuration(source: PlayerSource): number {
    return (
      source.duration ??
      (source.mediaType === "series"
        ? DEFAULT_SERIES_DURATION_SECONDS
        : DEFAULT_MOVIE_DURATION_SECONDS)
    );
  },

  start(source: PlayerSource): Promise<PlaybackSession> {
    return getBackend(source).play(source);
  },

  pause(source: PlayerSource): Promise<void> {
    return getBackend(source).pause();
  },

  stop(source: PlayerSource): Promise<void> {
    return getBackend(source).stop();
  },

  seek(source: PlayerSource, seconds: number): Promise<void> {
    return getBackend(source).seek(seconds);
  },

  setVolume(source: PlayerSource, volume: number): Promise<void> {
    return getBackend(source).setVolume(volume);
  },

  setPlaybackSpeed(source: PlayerSource, speed: number): Promise<void> {
    return getBackend(source).setPlaybackSpeed(speed);
  },
};
