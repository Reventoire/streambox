import type { ProviderError, ProviderId } from "../../types/providers";

export class ProviderRuntimeError extends Error {
  readonly providerError: ProviderError;

  constructor(providerError: ProviderError) {
    super(providerError.message);
    this.name = "ProviderRuntimeError";
    this.providerError = providerError;
  }
}

export function createProviderUnavailableError(
  providerId: ProviderId,
  message = "Provider is unavailable.",
): ProviderError {
  return {
    providerId,
    code: "provider-unavailable",
    message,
    isRecoverable: true,
  };
}

export function createCapabilityUnavailableError(
  providerId: ProviderId,
  message = "Provider capability is unavailable.",
): ProviderError {
  return {
    providerId,
    code: "capability-unavailable",
    message,
    isRecoverable: true,
  };
}

