import { WatchHistoryItem } from "../../types/library";

const KEY = "streambox_history";

const load = (): WatchHistoryItem[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

const save = (items: WatchHistoryItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
};

export const watchHistoryService = {
  getHistory: async (): Promise<WatchHistoryItem[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return load().sort(
      (a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()
    );
  },

  addHistoryEntry: async (entry: WatchHistoryItem): Promise<void> => {
    const items = load().filter((i) => i.mediaId !== entry.mediaId);
    save([entry, ...items]);
  },

  removeHistoryEntry: async (mediaId: string): Promise<void> => {
    save(load().filter((i) => i.mediaId !== mediaId));
  },

  clearHistory: async (): Promise<void> => {
    localStorage.removeItem(KEY);
  },
};
