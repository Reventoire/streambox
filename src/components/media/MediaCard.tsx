import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MediaItem } from "../../types/media";
import "./MediaCard.css";

interface MediaCardProps {
  item: MediaItem;
}

export default function MediaCard({ item }: MediaCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/media/${item.type}/${item.id}`);
  };

  return (
    <div className="media-card" onClick={handleClick}>
      <div className="media-card-poster-wrapper">
        {item.posterUrl ? (
          <img src={item.posterUrl} alt={item.title} className="media-card-poster" loading="lazy" />
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
        
        {item.type && (
          <div className="media-card-badge">
            {item.type === "movie" ? "Movie" : "TV"}
          </div>
        )}

        {item.watchProgress && (
          <div className="media-card-progress-bar">
            <div 
              className="media-card-progress-fill" 
              style={{ width: `${item.watchProgress.progressPercentage}%` }}
            />
          </div>
        )}
      </div>
      
      <div className="media-card-info">
        <h3 className="media-card-title" title={item.title}>{item.title}</h3>
        {item.year && <span className="media-card-year">{item.year}</span>}
      </div>
    </div>
  );
}
