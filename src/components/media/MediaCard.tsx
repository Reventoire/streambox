import { Play } from "lucide-react";
import "./MediaCard.css";

interface MediaCardProps {
  id: string;
  title: string;
  year?: string;
  type?: "movie" | "series";
  posterUrl?: string;
  onClick?: (id: string) => void;
}

export default function MediaCard({ id, title, year, type, posterUrl, onClick }: MediaCardProps) {
  return (
    <div className="media-card" onClick={() => onClick?.(id)}>
      <div className="media-card-poster-wrapper">
        {posterUrl ? (
          <img src={posterUrl} alt={title} className="media-card-poster" loading="lazy" />
        ) : (
          <div className="media-card-placeholder">
            <span className="media-card-placeholder-text">No Image</span>
          </div>
        )}
        
        <div className="media-card-overlay">
          <button className="media-card-play-btn">
            <Play size={24} fill="currentColor" />
          </button>
        </div>
        
        {type && (
          <div className="media-card-badge">
            {type === "movie" ? "Movie" : "TV"}
          </div>
        )}
      </div>
      
      <div className="media-card-info">
        <h3 className="media-card-title" title={title}>{title}</h3>
        {year && <span className="media-card-year">{year}</span>}
      </div>
    </div>
  );
}
