import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useHistoryStore } from "../stores/useHistoryStore";
import { usePlaybackStore } from "../stores/usePlaybackStore";
import type { PlayerSource } from "../types/player";
import "./PlayerPage.css";

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function PlayerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const source = location.state?.source as PlayerSource | undefined;

  const {
    playerState,
    startSession,
    togglePlayPause,
    seekTo,
    seekRelative,
    setVolume,
    setPlaybackSpeed,
    endSession,
  } = usePlaybackStore();
  const { addHistoryEntry } = useHistoryStore();

  useEffect(() => {
    if (!source) return;

    void startSession(source);
    void addHistoryEntry({
      id: `${source.mediaId}-${Date.now()}`,
      mediaId: source.mediaId,
      mediaType: source.mediaType,
      title: source.title,
      year: source.year,
      posterUrl: source.posterUrl,
      watchedAt: new Date().toISOString(),
      progressPercentage: 0,
    });

    return () => {
      void endSession();
    };
  }, [addHistoryEntry, endSession, source, startSession]);

  const handleStop = () => {
    void endSession();
    navigate(-1);
  };

  const handleSeek = (deltaSeconds: number) => {
    void seekRelative(deltaSeconds);
  };

  const duration = playerState.progress.durationSeconds || source?.durationSeconds || 0;

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    void seekTo(Math.floor(ratio * duration));
  };

  if (!source) {
    return (
      <div className="player-page player-no-source">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <p className="text-muted">No media selected for playback.</p>
      </div>
    );
  }

  const progress = playerState.progress.currentTimeSeconds;
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;
  const isPlaying = playerState.status === "playing";
  const isLoading = playerState.status === "loading";

  const subtitle = source.episodeTitle
    ? `S${source.seasonNumber} E${source.episodeNumber} - ${source.episodeTitle}`
    : source.year;

  return (
    <div className="player-page">
      <div className="player-backdrop-wrapper">
        {source.backdropUrl ? (
          <img src={source.backdropUrl} alt={source.title} className="player-backdrop" />
        ) : source.posterUrl ? (
          <img src={source.posterUrl} alt={source.title} className="player-backdrop" />
        ) : (
          <div className="player-backdrop-placeholder" />
        )}
        <div className="player-overlay" />
      </div>

      <div className="player-topbar">
        <button className="back-btn" onClick={handleStop}>
          <ArrowLeft size={24} />
        </button>
        <div className="player-title-area">
          <span className="player-title">{source.title}</span>
          {subtitle && <span className="player-subtitle">{subtitle}</span>}
        </div>
        <div className="player-volume-control">
          <Volume2 size={22} className="text-muted" />
          <input
            type="range"
            min="0"
            max="100"
            value={playerState.volume}
            onChange={(event) => void setVolume(Number(event.target.value))}
            aria-label="Volume"
          />
        </div>
      </div>

      <div className="player-notice">
        <span>
          Real playback is not yet available. This session is running on the mock player backend.
        </span>
      </div>

      <div className="player-controls-area">
        <div className="player-progress-track" onClick={handleProgressClick}>
          <div className="player-progress-fill" style={{ width: `${progressPct}%` }} />
          <div className="player-progress-thumb" style={{ left: `${progressPct}%` }} />
        </div>

        <div className="player-time-row">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="player-buttons">
          <button className="player-btn" onClick={() => handleSeek(-10)} title="Rewind 10s">
            <SkipBack size={28} />
          </button>
          <button
            className="player-btn player-btn-main"
            disabled={isLoading}
            onClick={() => void togglePlayPause()}
          >
            {isPlaying ? (
              <Pause size={36} fill="currentColor" />
            ) : (
              <Play size={36} fill="currentColor" />
            )}
          </button>
          <button className="player-btn" onClick={() => handleSeek(10)} title="Forward 10s">
            <SkipForward size={28} />
          </button>
        </div>

        <select
          className="player-speed-select"
          value={playerState.playbackSpeed}
          onChange={(event) => void setPlaybackSpeed(Number(event.target.value))}
          aria-label="Playback speed"
        >
          <option value="0.5">0.5x</option>
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>

        <button className="player-stop-btn" onClick={handleStop}>
          Stop & Go Back
        </button>
      </div>
    </div>
  );
}
