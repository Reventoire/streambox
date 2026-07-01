import { useParams, useNavigate } from "react-router-dom";
import { Play, Heart, Plus, ArrowLeft, Clock, Calendar, Film } from "lucide-react";
import { useMediaDetails } from "../hooks/useMediaQueries";
import LoadingState from "../components/shared/LoadingState";
import ErrorState from "../components/shared/ErrorState";
import Badge from "../components/shared/Badge";
import "./MediaDetailsPage.css";

export default function MediaDetailsPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  
  const { data: media, isLoading, isError, refetch } = useMediaDetails(type || "", id || "");

  if (isLoading) return <LoadingState message="Loading details..." />;
  if (isError || !media) return <ErrorState onRetry={() => refetch()} />;

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
                    ★ {media.rating.toFixed(1)}
                  </span>
                )}
              </div>
              
              {media.genres && media.genres.length > 0 && (
                <div className="details-genres">
                  {media.genres.map(g => (
                    <Badge key={g.id} variant="outline">{g.name}</Badge>
                  ))}
                </div>
              )}
              
              <p className="details-description">{media.description}</p>
              
              <div className="details-actions">
                <button className="btn-primary">
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

      {media.type === "series" && media.seasons && (
        <div className="seasons-section">
          <h2>Seasons & Episodes</h2>
          <div className="seasons-list">
            {media.seasons.map(season => (
              <div key={season.id} className="season-card glass-panel">
                <h3>{season.title}</h3>
                {season.episodes.length === 0 ? (
                  <p className="text-muted">Episodes coming soon...</p>
                ) : (
                  <ul>
                    {season.episodes.map(ep => (
                      <li key={ep.id}>{ep.episodeNumber}. {ep.title}</li>
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
