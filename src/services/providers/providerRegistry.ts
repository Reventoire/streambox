import type { ProviderCapability, ProviderId, ProviderType } from "../../types/providers";
import type { AnyProvider } from "./providerInterfaces";

const providers = new Map<ProviderId, AnyProvider>();

export function registerProvider(provider: AnyProvider): void {
  providers.set(provider.id, provider);
}

export function unregisterProvider(providerId: ProviderId): void {
  providers.delete(providerId);
}

export function getProvider<TProvider extends AnyProvider = AnyProvider>(
  providerId: ProviderId,
): TProvider | undefined {
  return providers.get(providerId) as TProvider | undefined;
}

export function listProviders(): AnyProvider[] {
  return Array.from(providers.values());
}

export function listProvidersByType(type: ProviderType): AnyProvider[] {
  return listProviders().filter((provider) => provider.type === type);
}

export function listProvidersByCapability(capability: ProviderCapability): AnyProvider[] {
  return listProviders().filter((provider) => provider.capabilities.includes(capability));
}

