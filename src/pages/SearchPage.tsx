import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import MediaGrid from "../components/media/MediaGrid";
import MediaCard from "../components/media/MediaCard";
import PageHeader from "../components/shared/PageHeader";
import LoadingState from "../components/shared/LoadingState";
import EmptyState from "../components/shared/EmptyState";
import ErrorState from "../components/shared/ErrorState";
import { useSearchMedia } from "../hooks/useMediaQueries";
import "./SearchPage.css";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const normalizedQuery = query.trim();
  const { data: results, isLoading, isError, refetch } = useSearchMedia(normalizedQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  return (
    <div className="page-container search-page">
      <PageHeader 
        title="Search" 
        description="Discover new movies, series, and more."
      />

      <div className="search-input-container">
        <SearchIcon className="search-page-icon" size={24} />
        <input 
          type="text" 
          className="search-page-input" 
          placeholder="Search by title, genre, year, type, or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="search-results-area">
        {!normalizedQuery ? (
          <EmptyState 
            title="What are you looking for?" 
            message="Type in the search bar above to find your next favorite movie or series." 
            icon={<SearchIcon size={48} />}
          />
        ) : isLoading ? (
          <LoadingState message="Searching..." />
        ) : isError ? (
          <ErrorState
            title="Search Error" 
            message="Something went wrong while searching. Please try again." 
            onRetry={() => void refetch()}
          />
        ) : results && results.length > 0 ? (
          <MediaGrid>
            {results.map(item => (
              <MediaCard key={item.id} item={item} />
            ))}
          </MediaGrid>
        ) : (
          <EmptyState 
            title="No matches found" 
            message={`We couldn't find anything for "${normalizedQuery}". Try adjusting your keywords.`} 
          />
        )}
      </div>
    </div>
  );
}
