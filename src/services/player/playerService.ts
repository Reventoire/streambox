import type { PlayerSource, PlayerState } from "../../types/player";
import type { PlayerBackend, PlayerStateListener } from "./PlayerBackend";
import { MockPlayerBackend } from "./backends/MockPlayerBackend";

class PlayerService {
  constructor(private readonly backend: PlayerBackend) {}

  getState(): PlayerState {
    return this.backend.getState();
  }

  getCapabilities() {
    return this.backend.capabilities;
  }

  subscribe(listener: PlayerStateListener): () => void {
    return this.backend.subscribe(listener);
  }

  loadSource(source: PlayerSource): Promise<PlayerState> {
    return this.backend.loadSource(source);
  }

  play(): Promise<PlayerState> {
    return this.backend.play();
  }

  pause(): Promise<PlayerState> {
    return this.backend.pause();
  }

  async togglePlayback(): Promise<PlayerState> {
    const state = this.backend.getState();

    if (state.status === "playing") {
      return this.backend.pause();
    }

    return this.backend.play();
  }

  stop(): Promise<PlayerState> {
    return this.backend.stop();
  }

  seek(positionSeconds: number): Promise<PlayerState> {
    return this.backend.seek(positionSeconds);
  }

  setVolume(volume: number): Promise<PlayerState> {
    return this.backend.setVolume(volume);
  }

  setMuted(isMuted: boolean): Promise<PlayerState> {
    return this.backend.setMuted(isMuted);
  }

  setPlaybackSpeed(speed: number): Promise<PlayerState> {
    return this.backend.setPlaybackSpeed(speed);
  }

  selectAudioTrack(trackId: string): Promise<PlayerState> {
    return this.backend.selectAudioTrack(trackId);
  }

  selectSubtitleTrack(trackId: string | null): Promise<PlayerState> {
    return this.backend.selectSubtitleTrack(trackId);
  }
}

export const playerService = new PlayerService(new MockPlayerBackend());

