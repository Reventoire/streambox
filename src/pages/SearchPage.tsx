import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import MediaGrid from "../components/media/MediaGrid";
import MediaCard from "../components/media/MediaCard";
import PageHeader from "../components/shared/PageHeader";
import LoadingState from "../components/shared/LoadingState";
import EmptyState from "../components/shared/EmptyState";
import { useSearchMedia } from "../hooks/useMediaQueries";
import "./SearchPage.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { data: results, isLoading, isError } = useSearchMedia(query);

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
          placeholder="Search by title, genre, or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="search-results-area">
        {!query ? (
          <EmptyState 
            title="What are you looking for?" 
            message="Type in the search bar above to find your next favorite movie or series." 
            icon={<SearchIcon size={48} />}
          />
        ) : isLoading ? (
          <LoadingState message="Searching..." />
        ) : isError ? (
          <EmptyState 
            title="Search Error" 
            message="Something went wrong while searching. Please try again." 
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
            message={`We couldn't find anything for "${query}". Try adjusting your keywords.`} 
          />
        )}
      </div>
    </div>
  );
}
