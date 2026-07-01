import { useEffect } from "react";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import MediaGrid from "../components/media/MediaGrid";
import MediaCard from "../components/media/MediaCard";
import PageHeader from "../components/shared/PageHeader";
import EmptyState from "../components/shared/EmptyState";
import LoadingState from "../components/shared/LoadingState";
import { Heart } from "lucide-react";
import { MediaItem } from "../types/media";

export default function FavoritesPage() {
  const { favorites, isLoading, loadFavorites } = useFavoritesStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  if (isLoading) return <LoadingState message="Loading favorites..." />;

  const items: MediaItem[] = favorites.map((f) => ({
    id: f.mediaId,
    type: f.mediaType,
    title: f.title,
    year: f.year,
    posterUrl: f.posterUrl,
    backdropUrl: f.backdropUrl,
  }));

  return (
    <div className="page-container">
      <PageHeader title="Favorites" description="Your handpicked collection of must-watch titles." />
      {items.length === 0 ? (
        <EmptyState
          icon={<Heart size={48} />}
          title="No favorites yet"
          message="Tap the heart icon on any movie or series to add it here."
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
