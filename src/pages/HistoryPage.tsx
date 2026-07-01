import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHistoryStore } from "../stores/useHistoryStore";
import PageHeader from "../components/shared/PageHeader";
import EmptyState from "../components/shared/EmptyState";
import LoadingState from "../components/shared/LoadingState";
import { Clock, Trash2, X } from "lucide-react";
import "./HistoryPage.css";

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, isLoading, loadHistory, removeHistoryEntry, clearHistory } = useHistoryStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (isLoading) return <LoadingState message="Loading history..." />;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="page-container history-page">
      <PageHeader
        title="Watch History"
        description="Everything you've recently watched."
        actions={
          history.length > 0 ? (
            <button className="clear-history-btn" onClick={clearHistory}>
              <Trash2 size={16} /> Clear All
            </button>
          ) : undefined
        }
      />

      {history.length === 0 ? (
        <EmptyState
          icon={<Clock size={48} />}
          title="No watch history"
          message="Start watching something and it will appear here."
        />
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div
              key={item.id}
              className="history-item"
              onClick={() => navigate(`/media/${item.mediaType}/${item.mediaId}`)}
            >
              {item.posterUrl ? (
                <img src={item.posterUrl} alt={item.title} className="history-poster" />
              ) : (
                <div className="history-poster-placeholder">
                  <Clock size={24} className="text-muted" />
                </div>
              )}
              <div className="history-info">
                <span className="history-title">{item.title}</span>
                <span className="history-date">{formatDate(item.watchedAt)}</span>
                {item.progressPercentage > 0 && (
                  <div className="history-progress-bar">
                    <div
                      className="history-progress-fill"
                      style={{ width: `${item.progressPercentage}%` }}
                    />
                  </div>
                )}
              </div>
              <button
                className="history-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeHistoryEntry(item.mediaId);
                }}
                title="Remove from history"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
