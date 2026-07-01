import { create } from "zustand";
import { AppSettings, DEFAULT_SETTINGS } from "../types/settings";
import { settingsService } from "../services/settings/settingsService";

interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
  error: string | null;
  loadSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: true,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await settingsService.getAppSettings();
      set({ settings: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to load settings", isLoading: false });
    }
  },

  updateSettings: async (partialSettings: Partial<AppSettings>) => {
    const current = get().settings;
    const updated = { ...current, ...partialSettings };
    
    // Optimistic update
    set({ settings: updated });
    
    try {
      await settingsService.saveAppSettings(updated);
    } catch (err: any) {
      // Revert on failure
      set({ settings: current, error: err.message || "Failed to save settings" });
    }
  },

  resetSettings: async () => {
    set({ isLoading: true });
    try {
      const defaults = await settingsService.resetAppSettings();
      set({ settings: defaults, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to reset settings", isLoading: false });
    }
  }
}));
