import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onRetry?: () => void;
}

export default function ErrorState({ 
  title = "Something went wrong", 
  message = "An error occurred while trying to fetch the data.",
  actionLabel = "Try Again",
  onRetry 
}: ErrorStateProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      gap: "16px",
      color: "var(--text-muted)",
      minHeight: "300px",
      textAlign: "center"
    }}>
      <div style={{ 
        color: "#ef4444", 
        background: "rgba(239, 68, 68, 0.1)",
        padding: "24px",
        borderRadius: "50%",
        marginBottom: "8px"
      }}>
        <AlertTriangle size={48} />
      </div>
      <h3 style={{ color: "var(--text-primary)", margin: 0, fontSize: "1.25rem" }}>{title}</h3>
      <p style={{ margin: 0, maxWidth: "300px", lineHeight: 1.5 }}>{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          style={{
            marginTop: "16px",
            padding: "10px 24px",
            backgroundColor: "var(--accent-primary)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--accent-primary-hover)"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "var(--accent-primary)"}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
