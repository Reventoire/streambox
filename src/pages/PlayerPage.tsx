import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, Volume2 } from "lucide-react";
import { PlayerSourcePlaceholder } from "../types/library";
import { usePlaybackStore } from "../stores/usePlaybackStore";
import { useHistoryStore } from "../stores/useHistoryStore";
import "./PlayerPage.css";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlayerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const source = location.state?.source as PlayerSourcePlaceholder | undefined;

  const { session, startSession, updateProgress, togglePlayPause, endSession } = usePlaybackStore();
  const { addHistoryEntry } = useHistoryStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [localProgress, setLocalProgress] = useState(0);

  // Start session and record history on mount
  useEffect(() => {
    if (!source) return;
    startSession(source);
    addHistoryEntry({
      id: `${source.mediaId}-${Date.now()}`,
      mediaId: source.mediaId,
      mediaType: source.mediaType,
      title: source.title,
      year: source.year,
      posterUrl: source.posterUrl,
      watchedAt: new Date().toISOString(),
      progressPercentage: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulate playback ticking
  useEffect(() => {
    if (!session) return;

    if (session.isPlaying) {
      intervalRef.current = setInterval(() => {
        const next = Math.min(session.progressSeconds + 1, session.durationSeconds);
        setLocalProgress(next);
        updateProgress(next);
        if (next >= session.durationSeconds) {
          clearInterval(intervalRef.current!);
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session?.isPlaying, session?.progressSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      endSession();
    };
  }, []);

  const handleStop = () => {
    endSession();
    navigate(-1);
  };

  const handleSeek = (delta: number) => {
    if (!session) return;
    const next = Math.max(0, Math.min(session.progressSeconds + delta, session.durationSeconds));
    setLocalProgress(next);
    updateProgress(next);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!session) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const next = Math.floor(ratio * session.durationSeconds);
    setLocalProgress(next);
    updateProgress(next);
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

  const progress = session?.progressSeconds ?? localProgress;
  const duration = source.durationSeconds;
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;
  const isPlaying = session?.isPlaying ?? false;

  const subtitle = source.episodeTitle
    ? `S${source.seasonNumber} E${source.episodeNumber} — ${source.episodeTitle}`
    : source.year;

  return (
    <div className="player-page">
      {/* Backdrop */}
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

      {/* Top bar */}
      <div className="player-topbar">
        <button className="back-btn" onClick={handleStop}>
          <ArrowLeft size={24} />
        </button>
        <div className="player-title-area">
          <span className="player-title">{source.title}</span>
          {subtitle && <span className="player-subtitle">{subtitle}</span>}
        </div>
        <Volume2 size={22} className="text-muted" />
      </div>

      {/* Placeholder notice */}
      <div className="player-notice">
        <span>⚠️ Real playback is not yet available — this is a placeholder session.</span>
      </div>

      {/* Controls */}
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
          <button className="player-btn player-btn-main" onClick={togglePlayPause}>
            {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" />}
          </button>
          <button className="player-btn" onClick={() => handleSeek(10)} title="Forward 10s">
            <SkipForward size={28} />
          </button>
        </div>

        <button className="player-stop-btn" onClick={handleStop}>
          Stop & Go Back
        </button>
      </div>
    </div>
  );
}
