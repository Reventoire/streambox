import { FileQuestion } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
}

export default function EmptyState({ 
  title = "No Results Found", 
  message = "We couldn't find anything matching your request.",
  icon = <FileQuestion size={48} />
}: EmptyStateProps) {
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
        color: "var(--border-highlight)", 
        background: "var(--bg-surface-hover)",
        padding: "24px",
        borderRadius: "50%",
        marginBottom: "8px"
      }}>
        {icon}
      </div>
      <h3 style={{ color: "var(--text-primary)", margin: 0, fontSize: "1.25rem" }}>{title}</h3>
      <p style={{ margin: 0, maxWidth: "300px", lineHeight: 1.5 }}>{message}</p>
    </div>
  );
}
