import { FavoriteItem } from "../../types/library";

const KEY = "streambox_favorites";

const load = (): FavoriteItem[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

const save = (items: FavoriteItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
};

export const favoritesService = {
  getFavorites: async (): Promise<FavoriteItem[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return load();
  },

  addToFavorites: async (item: FavoriteItem): Promise<void> => {
    const items = load();
    if (!items.find((i) => i.mediaId === item.mediaId)) {
      save([...items, item]);
    }
  },

  removeFromFavorites: async (mediaId: string): Promise<void> => {
    save(load().filter((i) => i.mediaId !== mediaId));
  },

  isInFavorites: (mediaId: string): boolean => {
    return load().some((i) => i.mediaId === mediaId);
  },
};
