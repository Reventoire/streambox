import type { PlaybackProgress, PlaybackSession } from "../../types/player";

const PLAYBACK_HISTORY_STORAGE_KEY = "streambox_playback_history";

export interface StoredPlaybackHistoryItem {
  sessionId: string;
  mediaId: string;
  mediaType: string;
  title: string;
  progress: PlaybackProgress;
  posterUrl?: string;
  backdropUrl?: string;
}

function readHistory(): StoredPlaybackHistoryItem[] {
  try {
    const stored = localStorage.getItem(PLAYBACK_HISTORY_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as StoredPlaybackHistoryItem[]) : [];
  } catch {
    return [];
  }
}

function writeHistory(items: StoredPlaybackHistoryItem[]): void {
  localStorage.setItem(PLAYBACK_HISTORY_STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
}

export const playbackHistoryService = {
  upsert(session: PlaybackSession, progress: PlaybackProgress): void {
    const nextItem: StoredPlaybackHistoryItem = {
      sessionId: session.id,
      mediaId: session.source.mediaId,
      mediaType: session.source.mediaType,
      title: session.source.episodeTitle
        ? `${session.source.title} - ${session.source.episodeTitle}`
        : session.source.title,
      progress,
      posterUrl: session.source.posterUrl,
      backdropUrl: session.source.backdropUrl,
    };
    const existing = readHistory().filter((item) => item.mediaId !== session.source.mediaId);
    writeHistory([nextItem, ...existing]);
  },

  list(): StoredPlaybackHistoryItem[] {
    return readHistory();
  },
};
