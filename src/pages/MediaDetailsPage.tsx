import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Heart, Plus, ArrowLeft, Clock, Calendar, Film, HeartOff, BookMinus, Star } from "lucide-react";
import { useMediaDetails } from "../hooks/useMediaQueries";
import LoadingState from "../components/shared/LoadingState";
import ErrorState from "../components/shared/ErrorState";
import Badge from "../components/shared/Badge";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import { useLibraryStore } from "../stores/useLibraryStore";
import { isMediaType } from "../types/media";
import type { PlayerSource } from "../types/player";
import "./MediaDetailsPage.css";

export default function MediaDetailsPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const mediaType = isMediaType(type) ? type : undefined;

  const { data: media, isLoading, isError, refetch } = useMediaDetails(mediaType, id);

  const { loadFavorites, addToFavorites, removeFromFavorites, isInFavorites } = useFavoritesStore();
  const { loadLibrary, addToLibrary, removeFromLibrary, isInLibrary } = useLibraryStore();

  useEffect(() => {
    loadFavorites();
    loadLibrary();
  }, [loadFavorites, loadLibrary]);

  if (!mediaType || !id) {
    return (
      <ErrorState
        title="Media not found"
        message="This media route is not available."
        actionLabel="Back Home"
        onRetry={() => navigate("/")}
      />
    );
  }

  if (isLoading) return <LoadingState message="Loading details..." />;
  if (isError || !media) return <ErrorState onRetry={() => refetch()} />;

  const favorited = isInFavorites(media.id);
  const inLibrary = isInLibrary(media.id);

  const handlePlay = () => {
    const source: PlayerSource = {
      id: `mock-${media.type}-${media.id}`,
      mediaId: media.id,
      mediaType: media.type,
      sourceType: "mock",
      title: media.title,
      year: media.year,
      posterUrl: media.posterUrl,
      backdropUrl: media.backdropUrl,
      durationSeconds: media.runtime ? media.runtime * 60 : 5400, // fallback 90 min
    };
    navigate("/player", { state: { source } });
  };

  const handleToggleFavorite = () => {
    if (favorited) {
      removeFromFavorites(media.id);
    } else {
      addToFavorites(media);
    }
  };

  const handleToggleLibrary = () => {
    if (inLibrary) {
      removeFromLibrary(media.id);
    } else {
      addToLibrary(media);
    }
  };

  return (
    <div className="media-details-page">
      <div className="details-hero">
        <div className="details-backdrop-wrapper">
          {media.backdropUrl ? (
            <img src={media.backdropUrl} alt={media.title} className="details-backdrop" />
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
              {media.posterUrl ? (
                <img src={media.posterUrl} alt={media.title} className="details-poster" />
              ) : (
                <div className="details-poster-placeholder">
                  <Film size={48} className="text-muted" />
                </div>
              )}
            </div>

            <div className="details-info">
              {media.type && (
                <Badge variant="accent">
                  {media.type === "movie" ? "Movie" : "Series"}
                </Badge>
              )}

              <h1 className="details-title">{media.title}</h1>

              <div className="details-meta">
                {media.year && (
                  <span className="meta-item">
                    <Calendar size={16} /> {media.year}
                  </span>
                )}
                {media.runtime && (
                  <span className="meta-item">
                    <Clock size={16} /> {media.runtime} min
                  </span>
                )}
                {media.rating && (
                  <span className="meta-item rating">
                    <Star size={16} fill="currentColor" /> {media.rating.toFixed(1)}
                  </span>
                )}
              </div>

              {media.genres && media.genres.length > 0 && (
                <div className="details-genres">
                  {media.genres.map((g) => (
                    <Badge key={g.id} variant="outline">{g.name}</Badge>
                  ))}
                </div>
              )}

              <p className="details-description">{media.description}</p>

              <div className="details-actions">
                <button className="btn-primary" onClick={handlePlay}>
                  <Play size={20} fill="currentColor" /> Play
                </button>
                <button
                  className={`icon-action-btn ${favorited ? "active" : ""}`}
                  onClick={handleToggleFavorite}
                  title={favorited ? "Remove from Favorites" : "Add to Favorites"}
                  aria-label={favorited ? "Remove from Favorites" : "Add to Favorites"}
                >
                  {favorited ? <HeartOff size={24} /> : <Heart size={24} />}
                </button>
                <button
                  className={`icon-action-btn ${inLibrary ? "active" : ""}`}
                  onClick={handleToggleLibrary}
                  title={inLibrary ? "Remove from Library" : "Add to Library"}
                  aria-label={inLibrary ? "Remove from Library" : "Add to Library"}
                >
                  {inLibrary ? <BookMinus size={24} /> : <Plus size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {media.type === "series" && media.seasons && (
        <div className="seasons-section">
          <h2>Seasons & Episodes</h2>
          <div className="seasons-list">
            {media.seasons.map((season) => (
              <div key={season.id} className="season-card glass-panel">
                <h3>{season.title}</h3>
                {season.episodes.length === 0 ? (
                  <p className="text-muted">Episodes coming soon...</p>
                ) : (
                  <div className="episode-list">
                    {season.episodes.map((ep) => (
                      <div key={ep.id} className="episode-item">
                        <span className="episode-number">E{ep.episodeNumber}</span>
                        <div className="episode-copy">
                          <span className="episode-title">{ep.title}</span>
                          {ep.description && (
                            <span className="episode-description">{ep.description}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
