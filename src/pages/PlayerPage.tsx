import { useEffect } from "react";
import { ArrowLeft, Home, Pause, Play, RotateCcw, Square, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/shared/EmptyState";
import { usePlaybackStore } from "../stores/usePlaybackStore";
import "./PlayerPage.css";

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function PlayerPage() {
  const navigate = useNavigate();
  const {
    session,
    status,
    currentTime,
    duration,
    volume,
    playbackSpeed,
    error,
    tick,
    togglePlayPause,
    seek,
    setVolume,
    setPlaybackSpeed,
    stopPlayback,
  } = usePlaybackStore();

  useEffect(() => {
    if (status !== "playing") {
      return undefined;
    }

    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [status, tick]);

  const handleStopAndBack = async () => {
    await stopPlayback();
    navigate(-1);
  };

  if (!session) {
    return (
      <div className="page-container player-empty-page">
        <EmptyState
          title="No mock playback session"
          message="Start playback from a movie or series details page to open the placeholder player."
          icon={<Play size={48} />}
        />
        <div className="player-empty-actions">
          <button className="player-secondary-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back
          </button>
          <button className="player-primary-btn" onClick={() => navigate("/")}>
            <Home size={18} /> Home
          </button>
        </div>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayTitle = session.source.episodeTitle
    ? `${session.source.title}: ${session.source.episodeTitle}`
    : session.source.title;

  return (
    <div className="player-page">
      <div className="player-backdrop">
        {session.source.backdropUrl ? (
          <img src={session.source.backdropUrl} alt="" />
        ) : (
          <div className="player-backdrop-placeholder" />
        )}
        <div className="player-backdrop-overlay" />
      </div>

      <div className="player-shell">
        <button className="player-back-btn" onClick={handleStopAndBack}>
          <ArrowLeft size={20} /> Back
        </button>

        <section className="player-stage">
          <div className="player-poster-frame">
            {session.source.posterUrl ? (
              <img src={session.source.posterUrl} alt={session.source.title} />
            ) : (
              <Play size={56} />
            )}
          </div>
          <div className="player-placeholder-copy">
            <span>Mock Player</span>
            <h1>{displayTitle}</h1>
            <p>
              This placeholder session has no stream URL and uses the mock playback backend.
            </p>
            {error && <p className="player-error">{error}</p>}
          </div>
        </section>

        <section className="player-controls glass-panel">
          <div className="player-progress-row">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={(event) => void seek(Number(event.target.value))}
              style={{ backgroundSize: `${progress}% 100%` }}
              aria-label="Playback progress"
            />
            <span>{formatTime(duration)}</span>
          </div>

          <div className="player-control-row">
            <button className="player-icon-btn" onClick={() => void seek(0)} title="Restart">
              <RotateCcw size={20} />
            </button>
            <button className="player-main-btn" onClick={() => void togglePlayPause()}>
              {status === "playing" ? (
                <>
                  <Pause size={22} fill="currentColor" /> Pause
                </>
              ) : (
                <>
                  <Play size={22} fill="currentColor" /> Play
                </>
              )}
            </button>
            <button className="player-icon-btn" onClick={handleStopAndBack} title="Stop">
              <Square size={18} fill="currentColor" />
            </button>

            <label className="player-range-control">
              <Volume2 size={18} />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(event) => void setVolume(Number(event.target.value))}
                aria-label="Volume"
              />
            </label>

            <select
              className="player-speed-select"
              value={playbackSpeed}
              onChange={(event) => void setPlaybackSpeed(Number(event.target.value))}
              aria-label="Playback speed"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  );
}
