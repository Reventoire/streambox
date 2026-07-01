import { RotateCcw, Plus } from "lucide-react";
import SettingsSection from "../components/settings/SettingsSection";
import SettingsRow from "../components/settings/SettingsRow";
import Toggle from "../components/settings/Toggle";
import Select, { SelectOption } from "../components/settings/Select";
import ProviderCard from "../components/settings/ProviderCard";
import PageHeader from "../components/shared/PageHeader";
import { useSettingsStore } from "../stores/useSettingsStore";
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
  { value: "tmdb", label: "TMDB (The Movie Database)" },
  { value: "imdb", label: "IMDB" },
];

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings, isLoading } = useSettingsStore();

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
        title="Metadata Providers"
        description="Configure which service provides media metadata, posters, and descriptions."
      >
        <SettingsRow
          label="Primary Metadata Provider"
          description="Used to fetch movie and series information."
          control={
            <Select
              value={settings.metadata.primaryProvider}
              options={METADATA_PROVIDER_OPTIONS}
              onChange={(primaryProvider) =>
                updateSettings({ metadata: { ...settings.metadata, primaryProvider } })
              }
            />
          }
        />
      </SettingsSection>

      {/* Stremio Addons */}
      <SettingsSection
        title="Stremio Addons"
        description="Add and manage Stremio-compatible addons for additional content sources."
      >
        {settings.stremioAddons.length === 0 && (
          <p className="settings-empty-hint">No addons configured. Add a Stremio addon using its manifest URL.</p>
        )}
        {settings.stremioAddons.map((addon) => (
          <ProviderCard
            key={addon.id}
            name={addon.name}
            description={addon.manifestUrl}
            enabled={addon.enabled}
            onToggle={(enabled) => {
              const updated = settings.stremioAddons.map((a) =>
                a.id === addon.id ? { ...a, enabled } : a
              );
              updateSettings({ stremioAddons: updated });
            }}
            onRemove={() => {
              const updated = settings.stremioAddons.filter((a) => a.id !== addon.id);
              updateSettings({ stremioAddons: updated });
            }}
          />
        ))}
        <button className="add-provider-btn">
          <Plus size={18} /> Add Stremio Addon
        </button>
      </SettingsSection>

      {/* Debrid Providers */}
      <SettingsSection
        title="Debrid Providers"
        description="Connect a Debrid service to enable high-speed cached stream links."
      >
        {settings.debridProviders.length === 0 && (
          <p className="settings-empty-hint">No Debrid providers configured. Support for Real-Debrid, AllDebrid, and others is coming soon.</p>
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
        <button className="add-provider-btn">
          <Plus size={18} /> Add Debrid Provider
        </button>
      </SettingsSection>
    </div>
  );
}
