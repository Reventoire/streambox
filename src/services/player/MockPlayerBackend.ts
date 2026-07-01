import type { PlaybackSession, PlayerBackend, PlayerSource } from "../../types/player";

export class MockPlayerBackend implements PlayerBackend {
  readonly backendType = "mock";

  async play(source: PlayerSource): Promise<PlaybackSession> {
    const now = new Date().toISOString();

    return {
      id: `mock-session-${crypto.randomUUID()}`,
      source,
      startedAt: now,
      updatedAt: now,
    };
  }

  async pause(): Promise<void> {
    return Promise.resolve();
  }

  async stop(): Promise<void> {
    return Promise.resolve();
  }

  async seek(_seconds: number): Promise<void> {
    return Promise.resolve();
  }

  async setVolume(_volume: number): Promise<void> {
    return Promise.resolve();
  }

  async setPlaybackSpeed(_speed: number): Promise<void> {
    return Promise.resolve();
  }
}
