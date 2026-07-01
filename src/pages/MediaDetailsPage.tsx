import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Film, Heart, Play, Plus } from "lucide-react";
import Badge from "../components/shared/Badge";
import ErrorState from "../components/shared/ErrorState";
import LoadingState from "../components/shared/LoadingState";
import { usePreferredMetadataDetails } from "../hooks/useMetadataProviderQueries";
import { createPlaceholderPlayerSourceFromMediaDetails } from "../services/player/playerSourceFactory";
import { usePlaybackStore } from "../stores/usePlaybackStore";
import type { MediaDetails, MediaItem } from "../types/media";
import { isMediaType } from "../types/media";
import "./MediaDetailsPage.css";

interface MediaDetailsLocationState {
  mediaPreview?: MediaItem;
}

function createDetailsFromPreview(preview: MediaItem | undefined): MediaDetails | undefined {
  if (!preview?.id || !isMediaType(preview.type) || !preview.title) {
    return undefined;
  }

  return {
    ...preview,
    type: preview.type,
  };
}

export default function MediaDetailsPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const startPlayback = usePlaybackStore((state) => state.startPlayback);
  const preview = createDetailsFromPreview(
    (location.state as MediaDetailsLocationState | null)?.mediaPreview,
  );

  const { data: media, isLoading, isError, refetch } = usePreferredMetadataDetails(
    type || "",
    id || "",
  );
  const playableMedia = media ?? preview;

  const handlePlay = async () => {
    if (!playableMedia?.id || !isMediaType(playableMedia.type)) {
      return;
    }

    const source = createPlaceholderPlayerSourceFromMediaDetails(playableMedia);
    await startPlayback(source);
    navigate("/player");
  };

  if (isLoading && !preview) {
    return <LoadingState message="Loading details..." />;
  }

  if ((isError || !playableMedia) && !preview) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (!playableMedia) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="media-details-page">
      <div className="details-hero">
        <div className="details-backdrop-wrapper">
          {playableMedia.backdropUrl ? (
            <img
              src={playableMedia.backdropUrl}
              alt={playableMedia.title}
              className="details-backdrop"
            />
          ) : (
            <div className="details-backdrop-placeholder" />
          )}
          <div className="details-overlay" />
        </div>

        <div className="details-hero-content">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>

          <div className="details-main">
            <div className="details-poster-wrapper">
              {playableMedia.posterUrl ? (
                <img
                  src={playableMedia.posterUrl}
                  alt={playableMedia.title}
                  className="details-poster"
                />
              ) : (
                <div className="details-poster-placeholder">
                  <Film size={48} className="text-muted" />
                </div>
              )}
            </div>

            <div className="details-info">
              <Badge variant="accent">
                {playableMedia.type === "movie" ? "Movie" : "Series"}
              </Badge>

              <h1 className="details-title">{playableMedia.title}</h1>

              <div className="details-meta">
                {playableMedia.year && (
                  <span className="meta-item">
                    <Calendar size={16} /> {playableMedia.year}
                  </span>
                )}
                {playableMedia.runtime && (
                  <span className="meta-item">
                    <Clock size={16} /> {playableMedia.runtime} min
                  </span>
                )}
                {playableMedia.rating && (
                  <span className="meta-item rating">
                    {"\u2605"} {playableMedia.rating.toFixed(1)}
                  </span>
                )}
              </div>

              {playableMedia.genres && playableMedia.genres.length > 0 && (
                <div className="details-genres">
                  {playableMedia.genres.map((genre) => (
                    <Badge key={genre.id} variant="outline">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}

              <p className="details-description">{playableMedia.description}</p>

              <div className="details-actions">
                <button className="btn-primary" onClick={() => void handlePlay()}>
                  <Play size={20} fill="currentColor" /> Play
                </button>
                <button className="icon-action-btn">
                  <Heart size={24} />
                </button>
                <button className="icon-action-btn">
                  <Plus size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {playableMedia.type === "series" && playableMedia.seasons && (
        <div className="seasons-section">
          <h2>Seasons & Episodes</h2>
          <div className="seasons-list">
            {playableMedia.seasons.map((season) => (
              <div key={season.id} className="season-card glass-panel">
                <h3>{season.title}</h3>
                {season.episodes.length === 0 ? (
                  <p className="text-muted">Episodes coming soon...</p>
                ) : (
                  <ul>
                    {season.episodes.map((episode) => (
                      <li key={episode.id}>
                        {episode.episodeNumber}. {episode.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
