import { AppSettings, DEFAULT_SETTINGS } from "../../types/settings";

const SETTINGS_STORAGE_KEY = "streambox_settings";

/**
 * A mock local persistence service for settings.
 * In the future, this will be replaced with secure Tauri file storage.
 */
export const settingsService = {
  getAppSettings: async (): Promise<AppSettings> => {
    // Simulate async read delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Deep merge with defaults to ensure missing properties exist
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          player: { ...DEFAULT_SETTINGS.player, ...(parsed.player || {}) },
          privacy: { ...DEFAULT_SETTINGS.privacy, ...(parsed.privacy || {}) },
          metadata: {
            ...DEFAULT_SETTINGS.metadata,
            ...(parsed.metadata || {}),
            tmdb: {
              ...DEFAULT_SETTINGS.metadata.tmdb,
              ...(parsed.metadata?.tmdb || {}),
            },
          },
        };
      }
    } catch (e) {
      console.error("Failed to parse settings, falling back to defaults", e);
    }
    return DEFAULT_SETTINGS;
  },

  saveAppSettings: async (settings: AppSettings): Promise<void> => {
    // Simulate async write delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings", e);
      throw new Error("Could not save settings");
    }
  },

  resetAppSettings: async (): Promise<AppSettings> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    return DEFAULT_SETTINGS;
  }
};
