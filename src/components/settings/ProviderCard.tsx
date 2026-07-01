import { Settings, Trash2 } from "lucide-react";
import Toggle from "./Toggle";
import "./ProviderCard.css";

interface ProviderCardProps {
  name: string;
  description?: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onConfigure?: () => void;
  onRemove?: () => void;
}

export default function ProviderCard({ name, description, enabled, onToggle, onConfigure, onRemove }: ProviderCardProps) {
  return (
    <div className={`provider-card ${enabled ? "enabled" : "disabled"}`}>
      <div className="provider-card-header">
        <div className="provider-card-info">
          <h3 className="provider-card-name">{name}</h3>
          {description && <p className="provider-card-desc">{description}</p>}
        </div>
        <Toggle checked={enabled} onChange={onToggle} />
      </div>
      <div className="provider-card-actions">
        {onConfigure && (
          <button className="provider-action-btn" onClick={onConfigure}>
            <Settings size={16} /> Configure
          </button>
        )}
        {onRemove && (
          <button className="provider-action-btn destructive" onClick={onRemove}>
            <Trash2 size={16} /> Remove
          </button>
        )}
      </div>
    </div>
  );
}
