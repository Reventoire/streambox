import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import type { MediaItem } from "../../types/media";
import "./MediaCard.css";

interface MediaCardProps {
  item: MediaItem;
}

export default function MediaCard({ item }: MediaCardProps) {
  return (
    <Link
      to={`/media/${item.type}/${item.id}`}
      className="media-card"
      aria-label={`Open ${item.title} details`}
    >
      <div className="media-card-poster-wrapper">
        {item.posterUrl ? (
          <img src={item.posterUrl} alt={item.title} className="media-card-poster" loading="lazy" />
        ) : (
          <div className="media-card-placeholder">
            <span className="media-card-placeholder-text">No Image</span>
          </div>
        )}
        
        <div className="media-card-overlay">
          <span className="media-card-play-btn" aria-hidden="true">
            <Play size={24} fill="currentColor" />
          </span>
        </div>
        
        {item.type && (
          <div className="media-card-badge">
            {item.type === "movie" ? "Movie" : "TV"}
          </div>
        )}

        {item.watchProgress && (
          <div className="media-card-progress-bar">
            <div 
              className="media-card-progress-fill" 
              style={{ width: `${Math.max(0, Math.min(item.watchProgress.progressPercentage, 100))}%` }}
            />
          </div>
        )}
      </div>
      
      <div className="media-card-info">
        <h3 className="media-card-title" title={item.title}>{item.title}</h3>
        {item.year && <span className="media-card-year">{item.year}</span>}
      </div>
    </Link>
  );
}
