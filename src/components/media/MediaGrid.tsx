import React from "react";
import "./MediaGrid.css";

interface MediaGridProps {
  children: React.ReactNode;
}

export default function MediaGrid({ children }: MediaGridProps) {
  return (
    <div className="media-grid">
      {children}
    </div>
  );
}
