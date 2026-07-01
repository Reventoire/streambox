import { LibraryItem } from "../../types/library";

const KEY = "streambox_library";

const load = (): LibraryItem[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

const save = (items: LibraryItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
};

export const libraryService = {
  getLibrary: async (): Promise<LibraryItem[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return load();
  },

  addToLibrary: async (item: LibraryItem): Promise<void> => {
    const items = load();
    if (!items.find((i) => i.mediaId === item.mediaId)) {
      save([...items, item]);
    }
  },

  removeFromLibrary: async (mediaId: string): Promise<void> => {
    save(load().filter((i) => i.mediaId !== mediaId));
  },

  isInLibrary: (mediaId: string): boolean => {
    return load().some((i) => i.mediaId === mediaId);
  },
};
