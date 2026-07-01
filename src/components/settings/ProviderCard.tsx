import { Settings, Trash2 } from "lucide-react";
import Toggle from "./Toggle";
import type { ProviderStatus } from "../../types/providers";
import "./ProviderCard.css";

interface ProviderCardProps {
  name: string;
  description?: string;
  enabled?: boolean;
  typeLabel?: string;
  status?: ProviderStatus;
  capabilities?: string[];
  configurationState?: string;
  healthMessage?: string;
  version?: string;
  readOnly?: boolean;
  readOnlyLabel?: string;
  onToggle?: (enabled: boolean) => void;
  onConfigure?: () => void;
  onRemove?: () => void;
}

function formatLabel(value: string): string {
  return value
    .split(/[-.]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ProviderCard({
  name,
  description,
  enabled = true,
  typeLabel,
  status,
  capabilities,
  configurationState,
  healthMessage,
  version,
  readOnly = false,
  readOnlyLabel = "Mock",
  onToggle,
  onConfigure,
  onRemove,
}: ProviderCardProps) {
  const hasActions = Boolean(onConfigure || onRemove);

  return (
    <div className={`provider-card ${enabled ? "enabled" : "disabled"}`}>
      <div className="provider-card-header">
        <div className="provider-card-info">
          <div className="provider-card-title-row">
            <h3 className="provider-card-name">{name}</h3>
            {status && (
              <span className={`provider-status-pill status-${status}`}>
                {formatLabel(status)}
              </span>
            )}
          </div>
          {description && <p className="provider-card-desc">{description}</p>}
        </div>
        {onToggle && !readOnly ? (
          <Toggle checked={enabled} onChange={onToggle} />
        ) : (
          <span className="provider-readonly-label">{readOnlyLabel}</span>
        )}
      </div>

      {(typeLabel || configurationState || version) && (
        <div className="provider-meta-grid">
          {typeLabel && (
            <div className="provider-meta-item">
              <span className="provider-meta-label">Type</span>
              <span className="provider-meta-value">{formatLabel(typeLabel)}</span>
            </div>
          )}
          {configurationState && (
            <div className="provider-meta-item">
              <span className="provider-meta-label">Config</span>
              <span className="provider-meta-value">{formatLabel(configurationState)}</span>
            </div>
          )}
          {version && (
            <div className="provider-meta-item">
              <span className="provider-meta-label">Version</span>
              <span className="provider-meta-value">{version}</span>
            </div>
          )}
        </div>
      )}

      {capabilities && capabilities.length > 0 && (
        <div className="provider-capabilities">
          {capabilities.map((capability) => (
            <span key={capability} className="provider-capability-pill">
              {formatLabel(capability)}
            </span>
          ))}
        </div>
      )}

      {healthMessage && <p className="provider-health-message">{healthMessage}</p>}

      {hasActions && (
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
      )}
    </div>
  );
}
