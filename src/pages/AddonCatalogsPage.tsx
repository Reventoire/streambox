import { useEffect, useMemo, useState } from "react";
import { Compass, Search } from "lucide-react";
import MediaCard from "../components/media/MediaCard";
import MediaGrid from "../components/media/MediaGrid";
import EmptyState from "../components/shared/EmptyState";
import ErrorState from "../components/shared/ErrorState";
import LoadingState from "../components/shared/LoadingState";
import PageHeader from "../components/shared/PageHeader";
import {
  useSavedStremioAddonCatalogs,
  useSavedStremioCatalog,
} from "../hooks/useStremioCatalogQueries";
import { useSettingsStore } from "../stores/useSettingsStore";
import type { ProviderCatalogQuery } from "../types/providers";
import "./AddonCatalogsPage.css";

const SELECT_DELIMITER = "|||";

function getSelectionValue(providerId: string, catalogId: string): string {
  return `${providerId}${SELECT_DELIMITER}${catalogId}`;
}

function splitSelectionValue(value: string): { providerId?: string; catalogId?: string } {
  const [providerId, catalogId] = value.split(SELECT_DELIMITER);
  return { providerId, catalogId };
}

function isFilled(value: string | number | boolean | undefined): boolean {
  return value !== undefined && value !== "";
}

export default function AddonCatalogsPage() {
  const { settings } = useSettingsStore();
  const { data: catalogOptions = [], isLoading: isLoadingCatalogs } =
    useSavedStremioAddonCatalogs(settings.stremioAddons);
  const [selectedValue, setSelectedValue] = useState("");
  const [extraValues, setExtraValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!selectedValue && catalogOptions.length > 0) {
      const firstOption = catalogOptions[0];
      setSelectedValue(getSelectionValue(firstOption.providerId, firstOption.catalog.id));
    }
  }, [catalogOptions, selectedValue]);

  const selectedOption = useMemo(() => {
    const { providerId, catalogId } = splitSelectionValue(selectedValue);

    return catalogOptions.find(
      (option) => option.providerId === providerId && option.catalog.id === catalogId,
    );
  }, [catalogOptions, selectedValue]);

  useEffect(() => {
    setExtraValues({});
  }, [selectedValue]);

  const extras = selectedOption?.catalog.extras ?? [];
  const catalogQuery = useMemo<ProviderCatalogQuery>(() => {
    return extras.reduce<ProviderCatalogQuery>((query, extra) => {
      const value = extraValues[extra.name];

      if (value !== undefined && value !== "") {
        query[extra.name] = extra.name === "skip" ? Number(value) : value;
      }

      return query;
    }, {});
  }, [extraValues, extras]);

  const missingRequiredExtra = extras.some(
    (extra) => extra.isRequired && !isFilled(catalogQuery[extra.name]),
  );
  const {
    data: items = [],
    isLoading: isLoadingItems,
    isError,
    error,
    refetch,
  } = useSavedStremioCatalog(
    settings.stremioAddons,
    selectedOption?.providerId,
    selectedOption?.catalog.id,
    catalogQuery,
    Boolean(selectedOption && !missingRequiredExtra),
  );

  const errorMessage = error instanceof Error ? error.message : "Catalog request failed.";

  return (
    <div className="page-container addon-catalogs-page">
      <PageHeader
        title="Addon Catalogs"
        description="Browse catalog results from saved Stremio-compatible addon manifests."
      />

      <section className="addon-catalog-controls glass-panel">
        <div className="addon-catalog-field">
          <label htmlFor="addon-catalog-select">Catalog source</label>
          <select
            id="addon-catalog-select"
            value={selectedValue}
            onChange={(event) => setSelectedValue(event.target.value)}
            disabled={catalogOptions.length === 0}
          >
            {catalogOptions.map((option) => (
              <option
                key={getSelectionValue(option.providerId, option.catalog.id)}
                value={getSelectionValue(option.providerId, option.catalog.id)}
              >
                {option.providerName} / {option.catalog.name} ({option.catalog.sourceType})
              </option>
            ))}
          </select>
        </div>

        {selectedOption && extras.length > 0 && (
          <div className="addon-catalog-extra-grid">
            {extras.map((extra) => (
              <div className="addon-catalog-field" key={extra.name}>
                <label htmlFor={`addon-extra-${extra.name}`}>
                  {extra.name === "search" ? "Addon search" : extra.name}
                  {extra.isRequired ? " *" : ""}
                </label>
                {extra.options && extra.options.length > 0 ? (
                  <select
                    id={`addon-extra-${extra.name}`}
                    value={extraValues[extra.name] ?? ""}
                    onChange={(event) =>
                      setExtraValues((current) => ({
                        ...current,
                        [extra.name]: event.target.value,
                      }))
                    }
                  >
                    <option value="">Any</option>
                    {extra.options.map((option) => (
                      <option value={option} key={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="addon-catalog-input-shell">
                    {extra.name === "search" && <Search size={18} />}
                    <input
                      id={`addon-extra-${extra.name}`}
                      type={extra.name === "skip" ? "number" : "text"}
                      min={extra.name === "skip" ? 0 : undefined}
                      value={extraValues[extra.name] ?? ""}
                      placeholder={extra.name === "search" ? "Search this addon catalog" : ""}
                      onChange={(event) =>
                        setExtraValues((current) => ({
                          ...current,
                          [extra.name]: event.target.value,
                        }))
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedOption && (
        <div className="addon-catalog-source-label">
          Results from <strong>{selectedOption.providerName}</strong> /{" "}
          <strong>{selectedOption.catalog.name}</strong>
        </div>
      )}

      <div className="addon-catalog-results">
        {isLoadingCatalogs ? (
          <LoadingState message="Loading saved addon catalogs..." />
        ) : catalogOptions.length === 0 ? (
          <EmptyState
            title="No addon catalogs available"
            message="Save and enable a Stremio-compatible addon manifest with movie or series catalogs in Settings."
            icon={<Compass size={48} />}
          />
        ) : missingRequiredExtra ? (
          <EmptyState
            title="Catalog input required"
            message="Fill in the required catalog fields before fetching results."
          />
        ) : isLoadingItems ? (
          <LoadingState message="Fetching addon catalog..." />
        ) : isError ? (
          <ErrorState title="Catalog fetch failed" message={errorMessage} onRetry={() => refetch()} />
        ) : items.length > 0 ? (
          <MediaGrid>
            {items.map((item) => (
              <MediaCard key={`${item.type}-${item.id}`} item={item} />
            ))}
          </MediaGrid>
        ) : (
          <EmptyState
            title="No catalog results"
            message="This addon returned an empty catalog for the selected filters."
          />
        )}
      </div>
    </div>
  );
}
