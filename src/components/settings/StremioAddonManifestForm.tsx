import { Loader2, Search, Save } from "lucide-react";
import { useState } from "react";
import type { ConfiguredStremioAddon } from "../../types/settings";
import type {
  StremioAddonValidationError,
  StremioManifest,
} from "../../types/stremio";
import {
  convertManifestToProviderManifest,
  fetchAddonManifest,
  getCapabilitiesFromManifest,
  getManifestUrl,
  StremioAddonServiceError,
  validateAddonUrl,
} from "../../services/stremio/stremioAddonService";

interface ManifestPreview {
  addonUrl: string;
  manifestUrl: string;
  manifest: StremioManifest;
}

interface StremioAddonManifestFormProps {
  onSave: (addon: ConfiguredStremioAddon) => void;
}

function formatValidationErrors(errors: StremioAddonValidationError[]): string[] {
  return errors.map((error) => error.message);
}

export default function StremioAddonManifestForm({ onSave }: StremioAddonManifestFormProps) {
  const [addonUrl, setAddonUrl] = useState("");
  const [preview, setPreview] = useState<ManifestPreview | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchManifest = async () => {
    const urlValidation = validateAddonUrl(addonUrl);
    setPreview(null);

    if (!urlValidation.isValid || !urlValidation.manifestUrl || !urlValidation.normalizedAddonUrl) {
      setErrors(formatValidationErrors(urlValidation.errors));
      return;
    }

    setErrors([]);
    setIsLoading(true);

    try {
      const manifest = await fetchAddonManifest(addonUrl);
      setPreview({
        addonUrl: urlValidation.normalizedAddonUrl,
        manifestUrl: urlValidation.manifestUrl,
        manifest,
      });
    } catch (error) {
      if (error instanceof StremioAddonServiceError) {
        setErrors(formatValidationErrors(error.validation.errors));
      } else {
        setErrors(["Could not fetch addon manifest."]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddon = () => {
    if (!preview) return;

    const providerManifest = convertManifestToProviderManifest(preview.manifest);
    const manifestUrl = getManifestUrl(preview.manifestUrl);

    onSave({
      id: providerManifest.id,
      addonUrl: preview.addonUrl,
      manifestUrl: manifestUrl.manifestUrl ?? preview.manifestUrl,
      name: preview.manifest.name,
      enabled: true,
      version: preview.manifest.version,
      description: preview.manifest.description,
      resources: preview.manifest.resources,
      types: preview.manifest.types,
      catalogs: preview.manifest.catalogs,
      capabilities: getCapabilitiesFromManifest(preview.manifest),
      manifest: preview.manifest,
    });
  };

  return (
    <div className="stremio-manifest-form">
      <div className="stremio-manifest-input-row">
        <input
          className="stremio-manifest-input"
          type="url"
          value={addonUrl}
          placeholder="https://example.com/addon/manifest.json"
          onChange={(event) => setAddonUrl(event.target.value)}
          aria-label="Stremio addon URL"
        />
        <button
          className="manifest-action-btn"
          type="button"
          disabled={isLoading}
          onClick={() => void handleFetchManifest()}
        >
          {isLoading ? <Loader2 size={18} className="spin-icon" /> : <Search size={18} />}
          Fetch Manifest
        </button>
      </div>

      {errors.length > 0 && (
        <div className="manifest-validation-errors" role="alert">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      {preview && (
        <div className="manifest-preview-card">
          <div className="manifest-preview-header">
            <div>
              <h3>{preview.manifest.name}</h3>
              <p>{preview.manifest.description ?? "No description provided."}</p>
            </div>
            <span>{preview.manifest.version}</span>
          </div>

          <div className="manifest-preview-grid">
            <div>
              <span>ID</span>
              <strong>{preview.manifest.id}</strong>
            </div>
            <div>
              <span>Resources</span>
              <strong>{preview.manifest.resources.map((resource) => resource.name).join(", ")}</strong>
            </div>
            <div>
              <span>Types</span>
              <strong>{preview.manifest.types.join(", ")}</strong>
            </div>
            <div>
              <span>Catalogs</span>
              <strong>
                {preview.manifest.catalogs.length > 0
                  ? preview.manifest.catalogs
                      .map((catalog) => `${catalog.type}/${catalog.id}`)
                      .join(", ")
                  : "None declared"}
              </strong>
            </div>
          </div>

          <button className="manifest-save-btn" type="button" onClick={handleSaveAddon}>
            <Save size={18} /> Save Addon
          </button>
        </div>
      )}
    </div>
  );
}

