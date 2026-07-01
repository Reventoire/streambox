import { create } from "zustand";
import { FavoriteItem, mediaItemToFavoriteItem } from "../types/library";
import { MediaItem } from "../types/media";
import { favoritesService } from "../services/library/favoritesService";
import { getErrorMessage } from "../utils/errors";

interface FavoritesState {
  favorites: FavoriteItem[];
  isLoading: boolean;
  error: string | null;
  loadFavorites: () => Promise<void>;
  addToFavorites: (item: MediaItem) => Promise<void>;
  removeFromFavorites: (mediaId: string) => Promise<void>;
  isInFavorites: (mediaId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  loadFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await favoritesService.getFavorites();
      set({ favorites: data, isLoading: false });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err, "Failed to load favorites"), isLoading: false });
    }
  },

  addToFavorites: async (item: MediaItem) => {
    const favItem = mediaItemToFavoriteItem(item);
    await favoritesService.addToFavorites(favItem);
    set((state) => ({
      favorites: state.favorites.some((i) => i.mediaId === item.id)
        ? state.favorites
        : [...state.favorites, favItem],
    }));
  },

  removeFromFavorites: async (mediaId: string) => {
    await favoritesService.removeFromFavorites(mediaId);
    set((state) => ({
      favorites: state.favorites.filter((i) => i.mediaId !== mediaId),
    }));
  },

  isInFavorites: (mediaId: string) => {
    return get().favorites.some((i) => i.mediaId === mediaId);
  },
}));
