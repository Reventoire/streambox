import { create } from "zustand";
import { WatchHistoryItem } from "../types/library";
import { watchHistoryService } from "../services/library/watchHistoryService";
import { getErrorMessage } from "../utils/errors";

interface HistoryState {
  history: WatchHistoryItem[];
  isLoading: boolean;
  error: string | null;
  loadHistory: () => Promise<void>;
  addHistoryEntry: (entry: WatchHistoryItem) => Promise<void>;
  removeHistoryEntry: (mediaId: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  history: [],
  isLoading: false,
  error: null,

  loadHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await watchHistoryService.getHistory();
      set({ history: data, isLoading: false });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err, "Failed to load history"), isLoading: false });
    }
  },

  addHistoryEntry: async (entry: WatchHistoryItem) => {
    await watchHistoryService.addHistoryEntry(entry);
    set((state) => ({
      history: [entry, ...state.history.filter((h) => h.mediaId !== entry.mediaId)],
    }));
  },

  removeHistoryEntry: async (mediaId: string) => {
    await watchHistoryService.removeHistoryEntry(mediaId);
    set((state) => ({
      history: state.history.filter((h) => h.mediaId !== mediaId),
    }));
  },

  clearHistory: async () => {
    await watchHistoryService.clearHistory();
    set({ history: [] });
  },
}));
