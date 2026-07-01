import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      gap: "16px",
      color: "var(--text-secondary)",
      minHeight: "200px"
    }}>
      <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "var(--accent-primary)" }} />
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <span style={{ fontWeight: 500 }}>{message}</span>
    </div>
  );
}
