import { useState } from "react";
import { RotateCcw, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import SettingsSection from "../components/settings/SettingsSection";
import SettingsRow from "../components/settings/SettingsRow";
import Toggle from "../components/settings/Toggle";
import Select, { SelectOption } from "../components/settings/Select";
import ProviderCard from "../components/settings/ProviderCard";
import StremioAddonManifestForm from "../components/settings/StremioAddonManifestForm";
import PageHeader from "../components/shared/PageHeader";
import {
  getProviderSummariesByType,
  useProviderSummaries,
  type ProviderSummary,
} from "../hooks/useProviderQueries";
import { useSettingsStore } from "../stores/useSettingsStore";
import type { ConfiguredStremioAddon } from "../types/settings";
import { createTmdbConfig, hasTmdbToken, maskTmdbToken } from "../services/settings/tmdbCredentialService";
import { validateTmdbToken } from "../services/metadata/tmdbService";
import { TMDB_PROVIDER_ID } from "../services/providers/tmdbProvider";
import "./SettingsPage.css";

const THEME_OPTIONS: SelectOption[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "system", label: "System Default" },
];

const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "fr-FR", label: "French" },
  { value: "de-DE", label: "German" },
  { value: "es-ES", label: "Spanish" },
  { value: "ja-JP", label: "Japanese" },
];

const METADATA_PROVIDER_OPTIONS: SelectOption[] = [
  { value: "mock.metadata", label: "Mock Metadata Provider" },
];

function renderMockProviderCard(summary: ProviderSummary) {
  const { provider, health } = summary;

  return (
    <ProviderCard
      key={provider.id}
      name={provider.manifest.name}
      description={provider.manifest.description}
      enabled={provider.config.enabled}
      typeLabel={provider.type}
      status={health.status}
      capabilities={provider.capabilities}
      configurationState={provider.config.configurationState}
      healthMessage={health.message}
      version={provider.manifest.version}
      readOnlyLabel={provider.id === TMDB_PROVIDER_ID ? "Configured" : "Mock"}
      readOnly
    />
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings, isLoading } = useSettingsStore();
  const { data: providerSummaries } = useProviderSummaries(settings.stremioAddons, settings.metadata);
  const [tmdbTokenInput, setTmdbTokenInput] = useState("");
  const [isTestingTmdb, setIsTestingTmdb] = useState(false);
  const [tmdbTestMessage, setTmdbTestMessage] = useState<string | null>(null);
  const [tmdbTestOk, setTmdbTestOk] = useState<boolean | null>(null);

  const metadataProviderCards = [
    ...getProviderSummariesByType(providerSummaries, "metadata"),
    ...getProviderSummariesByType(providerSummaries, "catalog"),
  ];
  const streamProviderCards = getProviderSummariesByType(providerSummaries, "stream");
  const stremioProviderCards = getProviderSummariesByType(providerSummaries, "stremio-addon");
  const debridProviderCards = getProviderSummariesByType(providerSummaries, "debrid");
  const tmdbSummary = metadataProviderCards.find((summary) => summary.provider.id === TMDB_PROVIDER_ID);
  const addonMetadataAvailable = settings.stremioAddons.some((addon) =>
    addon.capabilities?.includes("metadata") ||
    addon.resources?.some((resource) => resource.name === "meta"),
  );
  const metadataProviderOptions: SelectOption[] = [
    ...METADATA_PROVIDER_OPTIONS,
    ...(hasTmdbToken(settings.metadata.tmdb)
      ? [{ value: TMDB_PROVIDER_ID, label: "TMDB Metadata" }]
      : []),
    ...(addonMetadataAvailable
      ? [{ value: "stremio.addon.metadata", label: "Stremio Addon Metadata" }]
      : []),
  ];

  const handleSaveStremioAddon = (addon: ConfiguredStremioAddon) => {
    const existingAddons = settings.stremioAddons.filter((item) => item.id !== addon.id);
    void updateSettings({ stremioAddons: [...existingAddons, addon] });
  };

  const updateMetadataSettings = (metadataPatch: Partial<typeof settings.metadata>) => {
    void updateSettings({
      metadata: {
        ...settings.metadata,
        ...metadataPatch,
      },
    });
  };

  const handleSaveTmdbToken = () => {
    const nextConfig = createTmdbConfig(tmdbTokenInput, true);
    const fallbackOrder = Array.from(
      new Set([TMDB_PROVIDER_ID, ...settings.metadata.metadataFallbackOrder, "mock.metadata"]),
    );

    setTmdbTokenInput("");
    setTmdbTestMessage("TMDB token saved locally.");
    setTmdbTestOk(true);
    updateMetadataSettings({
      tmdb: nextConfig,
      preferredMetadataProviderId: TMDB_PROVIDER_ID,
      primaryProvider: TMDB_PROVIDER_ID,
      metadataFallbackOrder: fallbackOrder,
    });
  };

  const handleTestTmdbConnection = async () => {
    const tokenToTest = tmdbTokenInput.trim() || settings.metadata.tmdb.apiReadAccessToken || "";
    setIsTestingTmdb(true);
    setTmdbTestMessage(null);
    setTmdbTestOk(null);

    try {
      const isValid = await validateTmdbToken(tokenToTest);
      setTmdbTestOk(isValid);
      setTmdbTestMessage(isValid ? "TMDB connection is healthy." : "TMDB token is missing.");
    } catch {
      setTmdbTestOk(false);
      setTmdbTestMessage("TMDB connection test failed.");
    } finally {
      setIsTestingTmdb(false);
    }
  };

  const renderStremioProviderCard = (summary: ProviderSummary) => {
    const { provider, health } = summary;
    const savedAddon = settings.stremioAddons.find((addon) => addon.id === provider.id);

    if (!savedAddon) {
      return renderMockProviderCard(summary);
    }

    return (
      <ProviderCard
        key={provider.id}
        name={provider.manifest.name}
        description={provider.manifest.description}
        enabled={savedAddon.enabled}
        typeLabel={provider.type}
        status={health.status}
        capabilities={provider.capabilities}
        configurationState={provider.config.configurationState}
        healthMessage={health.message}
        version={provider.manifest.version}
        onToggle={(enabled) => {
          const updated = settings.stremioAddons.map((addon) =>
            addon.id === savedAddon.id ? { ...addon, enabled } : addon,
          );
          void updateSettings({ stremioAddons: updated });
        }}
        onRemove={() => {
          const updated = settings.stremioAddons.filter((addon) => addon.id !== savedAddon.id);
          void updateSettings({ stremioAddons: updated });
        }}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="page-container settings-page">
        <p className="text-muted">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="page-container settings-page">
      <PageHeader
        title="Settings"
        description="Manage your Streambox preferences and provider configuration."
        actions={
          <button
            className="reset-settings-btn"
            onClick={resetSettings}
            title="Reset all settings to defaults"
          >
            <RotateCcw size={16} /> Reset to Defaults
          </button>
        }
      />

      {/* General */}
      <SettingsSection
        title="General"
        description="Appearance and language preferences."
      >
        <SettingsRow
          label="Theme"
          description="Choose between a dark, light, or system-synced appearance."
          control={
            <Select
              value={settings.theme}
              options={THEME_OPTIONS}
              onChange={(theme) => updateSettings({ theme: theme as typeof settings.theme })}
            />
          }
        />
        <SettingsRow
          label="Interface Language"
          description="The language used across the Streambox UI."
          control={
            <Select
              value={settings.metadata.language}
              options={LANGUAGE_OPTIONS}
              onChange={(language) =>
                updateSettings({ metadata: { ...settings.metadata, language } })
              }
            />
          }
        />
      </SettingsSection>

      {/* Player */}
      <SettingsSection
        title="Player"
        description="Playback and streaming preferences."
      >
        <SettingsRow
          label="Auto-play Next Episode"
          description="Automatically play the next episode when one finishes."
          control={
            <Toggle
              checked={settings.player.autoPlayNext}
              onChange={(autoPlayNext) =>
                updateSettings({ player: { ...settings.player, autoPlayNext } })
              }
            />
          }
        />
        <SettingsRow
          label="Use External Player"
          description="Open media in your preferred external media player instead of the built-in player."
          control={
            <Toggle
              checked={settings.player.useExternalPlayer}
              onChange={(useExternalPlayer) =>
                updateSettings({ player: { ...settings.player, useExternalPlayer } })
              }
            />
          }
        />
      </SettingsSection>

      {/* Privacy */}
      <SettingsSection
        title="Privacy"
        description="Control what data Streambox stores locally."
      >
        <SettingsRow
          label="Track Watch History"
          description="Save watch history and continue watching progress locally."
          control={
            <Toggle
              checked={settings.privacy.trackHistory}
              onChange={(trackHistory) =>
                updateSettings({ privacy: { ...settings.privacy, trackHistory } })
              }
            />
          }
        />
        <SettingsRow
          label="Share Crash Reports"
          description="Automatically send anonymous crash reports to help improve Streambox."
          control={
            <Toggle
              checked={settings.privacy.shareCrashReports}
              onChange={(shareCrashReports) =>
                updateSettings({ privacy: { ...settings.privacy, shareCrashReports } })
              }
            />
          }
        />
      </SettingsSection>

      {/* Metadata Providers */}
      <SettingsSection
        title="Metadata and Catalog Providers"
        description="Configure provider-neutral metadata and catalog sources. TMDB is used only for metadata and discovery."
      >
        <SettingsRow
          label="Preferred Metadata Provider"
          description="Used first for search, details, trending, and popular metadata."
          control={
            <Select
              value={settings.metadata.preferredMetadataProviderId}
              options={metadataProviderOptions}
              onChange={(preferredMetadataProviderId) =>
                updateMetadataSettings({
                  preferredMetadataProviderId,
                  primaryProvider: preferredMetadataProviderId,
                  metadataFallbackOrder: Array.from(
                    new Set([preferredMetadataProviderId, "mock.metadata"]),
                  ),
                })
              }
            />
          }
        />
        <SettingsRow
          label="Allow Metadata Enrichment"
          description="Allow canonical metadata providers to enrich provider previews when IDs can be mapped reliably."
          control={
            <Toggle
              checked={settings.metadata.allowMetadataEnrichment}
              onChange={(allowMetadataEnrichment) =>
                updateMetadataSettings({ allowMetadataEnrichment })
              }
            />
          }
        />
        <SettingsRow
          label="Allow Addon Metadata Fallback"
          description="Allow saved addon metadata as a fallback later. Addon stream discovery remains separate."
          control={
            <Toggle
              checked={settings.metadata.allowAddonMetadataFallback}
              onChange={(allowAddonMetadataFallback) =>
                updateMetadataSettings({ allowAddonMetadataFallback })
              }
            />
          }
        />
        <div className="tmdb-settings-panel">
          <div className="tmdb-settings-header">
            <div>
              <h3>TMDB Metadata</h3>
              <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
            </div>
            {hasTmdbToken(settings.metadata.tmdb) && (
              <span>{maskTmdbToken(settings.metadata.tmdb.apiReadAccessToken)}</span>
            )}
          </div>
          <div className="tmdb-token-row">
            <input
              type="password"
              value={tmdbTokenInput}
              onChange={(event) => setTmdbTokenInput(event.target.value)}
              placeholder={hasTmdbToken(settings.metadata.tmdb) ? "Enter a new TMDB token to replace saved token" : "TMDB API Read Access Token"}
              autoComplete="off"
            />
            <button
              className="manifest-action-btn"
              disabled={!tmdbTokenInput.trim()}
              onClick={handleSaveTmdbToken}
            >
              Save Token
            </button>
            <button
              className="manifest-action-btn secondary"
              disabled={isTestingTmdb || (!tmdbTokenInput.trim() && !hasTmdbToken(settings.metadata.tmdb))}
              onClick={handleTestTmdbConnection}
            >
              {isTestingTmdb && <Loader2 size={16} className="spin-icon" />}
              Test TMDB Connection
            </button>
          </div>
          {tmdbTestMessage && (
            <p className={`tmdb-test-message ${tmdbTestOk ? "ok" : "error"}`}>
              {tmdbTestMessage}
            </p>
          )}
          <p className="settings-empty-hint">
            Future metadata providers planned: TheTVDB, OMDb, and Fanart.tv.
          </p>
        </div>
        <div className="settings-provider-list">
          {metadataProviderCards.map(renderMockProviderCard)}
          {!tmdbSummary && (
            <ProviderCard
              name="TMDB Metadata"
              description="Search, details, images, external IDs, trending, and popular metadata through a user-provided token."
              enabled={false}
              typeLabel="metadata"
              status="disabled"
              capabilities={[
                "metadata.search",
                "metadata.movie-details",
                "metadata.series-details",
                "metadata.images",
                "metadata.external-ids",
                "metadata.trending",
                "metadata.popular",
              ]}
              configurationState="not-configured"
              healthMessage="Add a TMDB API Read Access Token to enable this provider."
              version="v3"
              readOnlyLabel="Not configured"
              readOnly
            />
          )}
        </div>
      </SettingsSection>

      {/* Stream Providers */}
      <SettingsSection
        title="Stream Providers"
        description="Placeholder stream discovery providers. No real stream resolution or playback source integration is enabled."
      >
        <div className="settings-provider-list">
          {streamProviderCards.map(renderMockProviderCard)}
        </div>
      </SettingsSection>

      {/* Stremio Addons */}
      <SettingsSection
        title="Stremio Addons"
        description="Fetch and save addon manifests, then browse manifest-listed catalogs. Streams, torrents, Debrid, and playback URL integration remain disabled."
      >
        <StremioAddonManifestForm onSave={handleSaveStremioAddon} />
        <div className="settings-provider-list">
          {stremioProviderCards.map(renderStremioProviderCard)}
        </div>
        {settings.stremioAddons.length > 0 && (
          <div className="settings-addon-catalog-preview">
            <div className="settings-addon-catalog-preview-header">
              <div>
                <h3>Saved addon catalogs</h3>
                <p>Catalog definitions are read from saved manifests and fetched only when browsed.</p>
              </div>
              <Link to="/addon-catalogs" className="settings-catalog-link">
                Browse Catalogs
              </Link>
            </div>
            <div className="settings-addon-catalog-list">
              {settings.stremioAddons.map((addon) => (
                <div className="settings-addon-catalog-item" key={addon.id}>
                  <div>
                    <strong>{addon.name}</strong>
                    <span>{addon.enabled ? "Enabled" : "Disabled"}</span>
                  </div>
                  {addon.catalogs && addon.catalogs.length > 0 ? (
                    <div className="settings-addon-catalog-pills">
                      {addon.catalogs.map((catalog) => (
                        <span key={`${addon.id}-${catalog.type}-${catalog.id}`}>
                          {catalog.name ?? catalog.id} / {catalog.type}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p>No catalogs declared by this manifest.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {settings.stremioAddons.length === 0 && (
          <p className="settings-empty-hint">No user addons saved yet. Fetch a manifest URL above to preview and save metadata locally.</p>
        )}
      </SettingsSection>

      {/* Debrid Providers */}
      <SettingsSection
        title="Debrid Providers"
        description="Connect a Debrid service to enable high-speed cached stream links. Credential entry is intentionally disabled for now."
      >
        <div className="settings-provider-list">
          {debridProviderCards.map(renderMockProviderCard)}
        </div>
        {settings.debridProviders.length === 0 && (
          <p className="settings-empty-hint">No user Debrid providers configured. Real provider credentials are not accepted yet.</p>
        )}
        {settings.debridProviders.map((provider) => (
          <ProviderCard
            key={provider.id}
            name={provider.name}
            description={provider.providerType}
            enabled={provider.enabled}
            onToggle={(enabled) => {
              const updated = settings.debridProviders.map((p) =>
                p.id === provider.id ? { ...p, enabled } : p
              );
              updateSettings({ debridProviders: updated });
            }}
            onRemove={() => {
              const updated = settings.debridProviders.filter((p) => p.id !== provider.id);
              updateSettings({ debridProviders: updated });
            }}
          />
        ))}
        <button className="add-provider-btn" disabled title="Real Debrid configuration is not enabled yet">
          <Plus size={18} /> Add Debrid Provider Later
        </button>
      </SettingsSection>
    </div>
  );
}
