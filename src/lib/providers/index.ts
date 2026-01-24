// Provider exports
export * from './transport-provider';
export * from './ai-provider';
export * from './indian-rail-provider';
export * from './personal-vehicle-provider';

import { providerRegistry } from './transport-provider';
import { aiProvider } from './ai-provider';
import { indianRailProvider } from './indian-rail-provider';
import { personalVehicleProvider } from './personal-vehicle-provider';

// Register providers
providerRegistry.register(indianRailProvider);
providerRegistry.register(aiProvider);
providerRegistry.register(personalVehicleProvider);
