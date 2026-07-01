import { useEffect } from "react";
import { useLibraryStore } from "../stores/useLibraryStore";
import MediaGrid from "../components/media/MediaGrid";
import MediaCard from "../components/media/MediaCard";
import PageHeader from "../components/shared/PageHeader";
import EmptyState from "../components/shared/EmptyState";
import LoadingState from "../components/shared/LoadingState";
import { BookOpen } from "lucide-react";
import type { MediaItem } from "../types/media";

export default function LibraryPage() {
  const { library, isLoading, loadLibrary } = useLibraryStore();

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  if (isLoading) return <LoadingState message="Loading library..." />;

  // Convert LibraryItem to MediaItem shape for MediaCard
  const items: MediaItem[] = library.map((l) => ({
    id: l.mediaId,
    type: l.mediaType,
    title: l.title,
    year: l.year,
    posterUrl: l.posterUrl,
    backdropUrl: l.backdropUrl,
  }));

  return (
    <div className="page-container">
      <PageHeader title="Library" description="Everything you've saved to watch later." />
      {items.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={48} />}
          title="Your library is empty"
          message="Add movies and series from the details page using the + button."
        />
      ) : (
        <MediaGrid>
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </MediaGrid>
      )}
    </div>
  );
}
