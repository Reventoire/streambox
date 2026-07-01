import React from "react";
import "./Badge.css";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "accent";
}

export default function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  );
}
