import React from "react";
import "./SettingsRow.css";

interface SettingsRowProps {
  label: string;
  description?: string;
  control: React.ReactNode;
}

export default function SettingsRow({ label, description, control }: SettingsRowProps) {
  return (
    <div className="settings-row">
      <div className="settings-row-text">
        <span className="settings-row-label">{label}</span>
        {description && <span className="settings-row-desc">{description}</span>}
      </div>
      <div className="settings-row-control">
        {control}
      </div>
    </div>
  );
}
