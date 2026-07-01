import type { TmdbConfig } from "../../types/tmdb";

export function hasTmdbToken(config: TmdbConfig | undefined): boolean {
  return Boolean(config?.apiReadAccessToken?.trim());
}

export function maskTmdbToken(token: string | undefined): string {
  const trimmed = token?.trim() ?? "";

  if (!trimmed) {
    return "";
  }

  const suffix = trimmed.slice(-6);
  return `Saved token ending in ${suffix}`;
}

export function createTmdbConfig(token: string, enabled = true): TmdbConfig {
  return {
    apiReadAccessToken: token.trim(),
    enabled,
  };
}
