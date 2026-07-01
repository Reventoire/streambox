import { WatchProgress } from "../../types/media";

const KEY = "streambox_progress";

const load = (): Record<string, WatchProgress> => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
};

const save = (data: Record<string, WatchProgress>) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

export const playbackService = {
  saveProgress: async (progress: WatchProgress): Promise<void> => {
    const data = load();
    data[progress.mediaId] = progress;
    save(data);
  },

  getProgress: (mediaId: string): WatchProgress | null => {
    return load()[mediaId] ?? null;
  },

  getAllProgress: (): Record<string, WatchProgress> => {
    return load();
  },

  clearProgress: async (mediaId: string): Promise<void> => {
    const data = load();
    delete data[mediaId];
    save(data);
  },
};
