import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import MediaGrid from "../components/media/MediaGrid";
import MediaCard from "../components/media/MediaCard";
import PageHeader from "../components/shared/PageHeader";
import LoadingState from "../components/shared/LoadingState";
import EmptyState from "../components/shared/EmptyState";
import { useSearchMedia } from "../hooks/useMediaQueries";
import { useIsTmdbPreferred, usePreferredMetadataSearch } from "../hooks/useMetadataProviderQueries";
import "./SearchPage.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { data: results, isLoading, isError } = useSearchMedia(query);
  const isTmdbPreferred = useIsTmdbPreferred();
  const {
    data: tmdbResults,
    isLoading: isLoadingTmdb,
    isError: isTmdbError,
  } = usePreferredMetadataSearch(query);

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
        {isTmdbPreferred && query && (
          <section className="search-provider-section">
            <div className="search-provider-heading">
              <h2>TMDB results</h2>
              <span>Preferred metadata provider</span>
            </div>
            {isLoadingTmdb ? (
              <LoadingState message="Searching TMDB..." />
            ) : isTmdbError ? (
              <EmptyState
                title="TMDB search failed"
                message="Check your TMDB token in Settings and try again."
              />
            ) : tmdbResults && tmdbResults.length > 0 ? (
              <MediaGrid>
                {tmdbResults.map((item) => (
                  <MediaCard key={item.id} item={item} />
                ))}
              </MediaGrid>
            ) : (
              <EmptyState
                title="No TMDB matches"
                message={`TMDB did not return matches for "${query}".`}
              />
            )}
          </section>
        )}

        {isTmdbPreferred && query && (
          <div className="search-provider-heading secondary">
            <h2>Local mock results</h2>
            <span>Development catalog</span>
          </div>
        )}

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
