import { create } from "zustand";
import { LibraryItem, mediaItemToLibraryItem } from "../types/library";
import { MediaItem } from "../types/media";
import { libraryService } from "../services/library/libraryService";
import { getErrorMessage } from "../utils/errors";

interface LibraryState {
  library: LibraryItem[];
  isLoading: boolean;
  error: string | null;
  loadLibrary: () => Promise<void>;
  addToLibrary: (item: MediaItem) => Promise<void>;
  removeFromLibrary: (mediaId: string) => Promise<void>;
  isInLibrary: (mediaId: string) => boolean;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  library: [],
  isLoading: false,
  error: null,

  loadLibrary: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await libraryService.getLibrary();
      set({ library: data, isLoading: false });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err, "Failed to load library"), isLoading: false });
    }
  },

  addToLibrary: async (item: MediaItem) => {
    const libraryItem = mediaItemToLibraryItem(item);
    await libraryService.addToLibrary(libraryItem);
    set((state) => ({
      library: state.library.some((i) => i.mediaId === item.id)
        ? state.library
        : [...state.library, libraryItem],
    }));
  },

  removeFromLibrary: async (mediaId: string) => {
    await libraryService.removeFromLibrary(mediaId);
    set((state) => ({
      library: state.library.filter((i) => i.mediaId !== mediaId),
    }));
  },

  isInLibrary: (mediaId: string) => {
    return get().library.some((i) => i.mediaId === mediaId);
  },
}));
