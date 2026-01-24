// Transport Provider Interface
// Abstraction layer for different data sources (AI, real APIs in future)

import type { Route } from '@/lib/types';

/**
 * Search parameters for transport routes
 */
export interface SearchParams {
    from: string;
    to: string;
    date: Date;
    modes?: ('flight' | 'train' | 'bus' | 'car')[];
    passengers?: number;
    classPreference?: string;
    budgetMax?: number;
}

/**
 * Transport provider interface - can be implemented by AI or real APIsearch
 */
export interface TransportProvider {
    name: string;

    /**
     * Search for available routes between two locations
     */
    searchRoutes(params: SearchParams): Promise<Route[]>;

    /**
     * Get details about a specific route
     */
    getRouteDetails?(routeId: string): Promise<Route | null>;

    /**
     * Check if provider supports a specific mode
     */
    supportsMode(mode: 'flight' | 'train' | 'bus' | 'car'): boolean;

    /**
     * Check if provider covers a specific route/region
     */
    coversRoute?(from: string, to: string): boolean;
}

/**
 * Provider registry - manages multiple providers
 */
class ProviderRegistry {
    private providers: Map<string, TransportProvider> = new Map();

    register(provider: TransportProvider): void {
        this.providers.set(provider.name, provider);
    }

    get(name: string): TransportProvider | undefined {
        return this.providers.get(name);
    }

    getAll(): TransportProvider[] {
        return Array.from(this.providers.values());
    }

    /**
     * Get providers that support a specific mode
     */
    getByMode(mode: 'flight' | 'train' | 'bus' | 'car'): TransportProvider[] {
        return this.getAll().filter(p => p.supportsMode(mode));
    }

    /**
     * Search across all providers and merge results
     */
    async searchAll(params: SearchParams): Promise<Route[]> {
        const results: Route[] = [];

        for (const provider of this.providers.values()) {
            try {
                const routes = await provider.searchRoutes(params);
                results.push(...routes);
            } catch (error) {
                console.error(`Provider ${provider.name} failed:`, error);
            }
        }

        // Sort by price
        results.sort((a, b) => a.price - b.price);

        return results;
    }
}

// Singleton registry
export const providerRegistry = new ProviderRegistry();

/**
 * Get the default provider (AI-based)
 */
export function getDefaultProvider(): TransportProvider | undefined {
    return providerRegistry.get('ai');
}
