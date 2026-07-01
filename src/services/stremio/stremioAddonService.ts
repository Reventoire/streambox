import type { ProviderCapability, ProviderManifest } from "../../types/providers";
import type {
  StremioAddonCapability,
  StremioAddonValidationError,
  StremioAddonValidationResult,
  StremioCatalogDefinition,
  StremioCatalogExtraDefinition,
  StremioManifest,
  StremioResource,
} from "../../types/stremio";

const MANIFEST_FILE_NAME = "manifest.json";

export class StremioAddonServiceError extends Error {
  readonly validation: StremioAddonValidationResult;

  constructor(message: string, validation: StremioAddonValidationResult) {
    super(message);
    this.name = "StremioAddonServiceError";
    this.validation = validation;
  }
}

interface StremioManifestTransport {
  fetchJson(url: string): Promise<unknown>;
}

const browserManifestTransport: StremioManifestTransport = {
  async fetchJson(url: string): Promise<unknown> {
    // TODO: Move manifest networking behind a Tauri command before tightening
    // provider trust rules, CORS handling, redirects, and platform policy.
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Manifest request failed with HTTP ${response.status}`);
    }

    return response.json();
  },
};

function validationResult(
  errors: StremioAddonValidationError[],
  normalizedAddonUrl?: string,
  manifestUrl?: string,
  manifest?: StremioManifest,
): StremioAddonValidationResult {
  return {
    isValid: errors.length === 0,
    normalizedAddonUrl,
    manifestUrl,
    manifest,
    errors,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function normalizeStringArray(value: unknown): string[] {
  return isStringArray(value) ? value : [];
}

function normalizeResources(value: unknown): StremioResource[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((resource): StremioResource[] => {
    if (typeof resource === "string") {
      return [{ name: resource }];
    }

    if (!isRecord(resource) || typeof resource.name !== "string") {
      return [];
    }

    return [
      {
        name: resource.name,
        types: normalizeStringArray(resource.types),
        idPrefixes: normalizeStringArray(resource.idPrefixes),
      },
    ];
  });
}

function normalizeCatalogExtra(value: unknown): StremioCatalogExtraDefinition[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const extras = value.flatMap((extra): StremioCatalogExtraDefinition[] => {
    if (!isRecord(extra) || typeof extra.name !== "string") {
      return [];
    }

    return [
      {
        name: extra.name,
        isRequired: typeof extra.isRequired === "boolean" ? extra.isRequired : undefined,
        options: normalizeStringArray(extra.options),
      },
    ];
  });

  return extras.length > 0 ? extras : undefined;
}

function normalizeCatalogs(value: unknown): StremioCatalogDefinition[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((catalog): StremioCatalogDefinition[] => {
    if (!isRecord(catalog) || typeof catalog.id !== "string" || typeof catalog.type !== "string") {
      return [];
    }

    return [
      {
        id: catalog.id,
        type: catalog.type,
        name: typeof catalog.name === "string" ? catalog.name : undefined,
        extra: normalizeCatalogExtra(catalog.extra),
        extraRequired: normalizeStringArray(catalog.extraRequired),
      },
    ];
  });
}

function normalizeManifest(input: unknown): StremioManifest | null {
  if (!isRecord(input)) {
    return null;
  }

  return {
    id: typeof input.id === "string" ? input.id : "",
    name: typeof input.name === "string" ? input.name : "",
    version: typeof input.version === "string" ? input.version : "",
    description: typeof input.description === "string" ? input.description : undefined,
    resources: normalizeResources(input.resources),
    types: normalizeStringArray(input.types),
    catalogs: normalizeCatalogs(input.catalogs),
    idPrefixes: normalizeStringArray(input.idPrefixes),
  };
}

function getResourceNames(manifest: StremioManifest): Set<string> {
  return new Set(manifest.resources.map((resource) => resource.name));
}

export function normalizeAddonUrl(inputUrl: string): StremioAddonValidationResult {
  const trimmedUrl = inputUrl.trim();

  if (!trimmedUrl) {
    return validationResult([
      {
        code: "empty-url",
        message: "Enter a Stremio addon URL.",
      },
    ]);
  }

  try {
    const parsedUrl = new URL(trimmedUrl);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return validationResult([
        {
          code: "unsupported-protocol",
          message: "Addon URLs must use http or https.",
        },
      ]);
    }

    parsedUrl.hash = "";
    const isManifestUrl = parsedUrl.pathname.endsWith(`/${MANIFEST_FILE_NAME}`);

    if (!isManifestUrl) {
      parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, "");
    }

    return validationResult([], parsedUrl.toString().replace(/\/$/, ""));
  } catch {
    return validationResult([
      {
        code: "invalid-url",
        message: "Enter a valid absolute URL.",
      },
    ]);
  }
}

export function getManifestUrl(addonUrl: string): StremioAddonValidationResult {
  const normalized = normalizeAddonUrl(addonUrl);

  if (!normalized.isValid || !normalized.normalizedAddonUrl) {
    return normalized;
  }

  if (normalized.normalizedAddonUrl.endsWith(`/${MANIFEST_FILE_NAME}`)) {
    return validationResult([], normalized.normalizedAddonUrl, normalized.normalizedAddonUrl);
  }

  return validationResult(
    [],
    normalized.normalizedAddonUrl,
    `${normalized.normalizedAddonUrl}/${MANIFEST_FILE_NAME}`,
  );
}

export function validateAddonUrl(addonUrl: string): StremioAddonValidationResult {
  return getManifestUrl(addonUrl);
}

export function validateManifest(manifestInput: unknown): StremioAddonValidationResult {
  const manifest = normalizeManifest(manifestInput);

  if (!manifest || !isRecord(manifestInput)) {
    return validationResult([
      {
        code: "manifest-response-invalid",
        message: "Manifest response must be a JSON object.",
      },
    ]);
  }

  const errors: StremioAddonValidationError[] = [];

  if (!manifest.id) {
    errors.push({ code: "missing-manifest-id", message: "Manifest is missing an id." });
  }

  if (!manifest.name) {
    errors.push({ code: "missing-manifest-name", message: "Manifest is missing a name." });
  }

  if (!manifest.version) {
    errors.push({ code: "missing-manifest-version", message: "Manifest is missing a version." });
  }

  if (manifest.resources.length === 0) {
    errors.push({
      code: "invalid-manifest-resources",
      message: "Manifest must declare at least one resource.",
    });
  }

  if (manifest.types.length === 0) {
    errors.push({
      code: "invalid-manifest-types",
      message: "Manifest must declare at least one supported media type.",
    });
  }

  if (manifestInput.catalogs !== undefined && !Array.isArray(manifestInput.catalogs)) {
    errors.push({
      code: "invalid-manifest-catalogs",
      message: "Manifest catalogs must be an array.",
    });
  }

  return validationResult(errors, undefined, undefined, errors.length === 0 ? manifest : undefined);
}

export async function fetchAddonManifest(addonUrl: string): Promise<StremioManifest> {
  const manifestUrlResult = getManifestUrl(addonUrl);

  if (!manifestUrlResult.isValid || !manifestUrlResult.manifestUrl) {
    throw new StremioAddonServiceError("Addon URL is not valid.", manifestUrlResult);
  }

  let manifestResponse: unknown;

  try {
    manifestResponse = await browserManifestTransport.fetchJson(manifestUrlResult.manifestUrl);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Could not fetch addon manifest.";

    throw new StremioAddonServiceError(
      message,
      validationResult(
        [{ code: "manifest-fetch-failed", message }],
        manifestUrlResult.normalizedAddonUrl,
        manifestUrlResult.manifestUrl,
      ),
    );
  }

  const validation = validateManifest(manifestResponse);

  if (!validation.isValid || !validation.manifest) {
    throw new StremioAddonServiceError(
      "Addon manifest is not valid.",
      validationResult(
        validation.errors,
        manifestUrlResult.normalizedAddonUrl,
        manifestUrlResult.manifestUrl,
      ),
    );
  }

  return validation.manifest;
}

export function getCapabilitiesFromManifest(
  manifest: StremioManifest,
): StremioAddonCapability[] {
  const resources = getResourceNames(manifest);
  const capabilities: StremioAddonCapability[] = ["manifest"];

  if (resources.has("catalog")) {
    capabilities.push("catalog");
  }

  if (resources.has("meta")) {
    capabilities.push("metadata");
  }

  if (resources.has("stream")) {
    capabilities.push("stream");
  }

  if (resources.has("subtitles")) {
    capabilities.push("subtitles");
  }

  return capabilities;
}

export function convertManifestToProviderManifest(
  manifest: StremioManifest,
): ProviderManifest {
  const resources = getResourceNames(manifest);
  const capabilities: ProviderCapability[] = ["stremio.manifest"];

  // TODO: Later catalog requests will use manifest.catalogs once catalog
  // request/response normalization is implemented.
  if (resources.has("catalog")) {
    capabilities.push("stremio.catalog");
  }

  if (resources.has("meta")) {
    capabilities.push("stremio.metadata");
  }

  // TODO: Later stream requests will use the manifest stream resource. Stream
  // fetching is intentionally disabled during manifest-only support.
  if (resources.has("stream")) {
    capabilities.push("stremio.stream");
  }

  if (resources.has("subtitles")) {
    capabilities.push("stremio.subtitles");
  }

  return {
    id: `stremio.addon.${manifest.id}`,
    type: "stremio-addon",
    name: manifest.name,
    description: manifest.description ?? "Stremio-compatible addon manifest.",
    version: manifest.version,
    capabilities,
    status: "healthy",
  };
}
