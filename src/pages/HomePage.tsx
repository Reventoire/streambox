import { Play, Info } from "lucide-react";
import MediaRow from "../components/media/MediaRow";
import MediaCard from "../components/media/MediaCard";
import LoadingState from "../components/shared/LoadingState";
import { 
  useTrendingMovies, 
  usePopularSeries, 
  useContinueWatching, 
  useRecentlyAdded 
} from "../hooks/useMediaQueries";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { data: trendingMovies, isLoading: loadingTrending } = useTrendingMovies();
  const { data: popularSeries, isLoading: loadingPopular } = usePopularSeries();
  const { data: continueWatching, isLoading: loadingContinue } = useContinueWatching();
  const { data: recentlyAdded, isLoading: loadingRecent } = useRecentlyAdded();

  const heroItem = trendingMovies?.[0];

  if (loadingTrending || loadingPopular || loadingContinue || loadingRecent) {
    return <LoadingState message="Loading Streambox..." />;
  }

  return (
    <div className="home-container">
      {heroItem && (
        <section className="hero-section">
          <div className="hero-backdrop-wrapper">
            <img 
              src={heroItem.backdropUrl} 
              alt={heroItem.title} 
              className="hero-backdrop" 
            />
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            {heroItem.type && (
              <span className="hero-badge">{heroItem.type === "movie" ? "Featured Movie" : "Featured Series"}</span>
            )}
            <h1 className="hero-title">{heroItem.title}</h1>
            <div className="hero-meta">
              {heroItem.year && <span>{heroItem.year}</span>}
              {heroItem.genres?.map(g => (
                <span key={g.id} className="hero-meta-dot">{g.name}</span>
              ))}
            </div>
            <p className="hero-description">{heroItem.description}</p>
            <div className="hero-actions">
              <button 
                className="btn-primary" 
                onClick={() => navigate(`/media/${heroItem.type}/${heroItem.id}`)}
              >
                <Play size={20} fill="currentColor" /> Play
              </button>
              <button 
                className="btn-secondary"
                onClick={() => navigate(`/media/${heroItem.type}/${heroItem.id}`)}
              >
                <Info size={20} /> Details
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="home-rows-container">
        {continueWatching && continueWatching.length > 0 && (
          <MediaRow title="Continue Watching">
            {continueWatching.map(item => (
              <MediaCard key={item.id} item={item} />
            ))}
          </MediaRow>
        )}

        {trendingMovies && trendingMovies.length > 1 && (
          <MediaRow title="Trending Movies">
            {trendingMovies.slice(1).map(item => (
              <MediaCard key={item.id} item={item} />
            ))}
          </MediaRow>
        )}

        {popularSeries && popularSeries.length > 0 && (
          <MediaRow title="Popular Series">
            {popularSeries.map(item => (
              <MediaCard key={item.id} item={item} />
            ))}
          </MediaRow>
        )}

        {recentlyAdded && recentlyAdded.length > 0 && (
          <MediaRow title="Recently Added">
            {recentlyAdded.map(item => (
              <MediaCard key={item.id} item={item} />
            ))}
          </MediaRow>
        )}
      </div>
    </div>
  );
}
