// Unified API Manager with Priority-based Fallback
// Supports multiple API keys for AI (Gemini) and Train (IRCTC/RailRadar) APIs

export type APICategory = 'ai' | 'train' | 'bus' | 'flight';

export interface APIKeyConfig {
    key: string;
    name: string;
    category: APICategory;
    priority: number;
    enabled: boolean;
    baseUrl?: string;
    rateLimitPerMinute?: number;
}

interface KeyStatus {
    failureCount: number;
    lastFailure?: Date;
    lastSuccess?: Date;
}

class APIManager {
    private configs: Map<APICategory, APIKeyConfig[]> = new Map();
    private keyStatus: Map<string, KeyStatus> = new Map();

    // Cooldown period after failures (5 minutes)
    private readonly FAILURE_COOLDOWN_MS = 5 * 60 * 1000;
    // Max failures before temporary disable
    private readonly MAX_FAILURES = 3;

    constructor() {
        this.loadFromEnv();
    }

    private loadFromEnv(): void {
        // ============ AI API Keys (Gemini) ============
        const aiKeys: APIKeyConfig[] = [];

        // Primary AI key
        if (process.env.GOOGLE_GENAI_API_KEY) {
            aiKeys.push({
                key: process.env.GOOGLE_GENAI_API_KEY,
                name: 'Google AI Primary',
                category: 'ai',
                priority: 1,
                enabled: true,
            });
        }

        // Fallback AI keys
        for (let i = 2; i <= 5; i++) {
            const key = process.env[`GOOGLE_GENAI_API_KEY_${i}`];
            if (key) {
                aiKeys.push({
                    key,
                    name: `Google AI Fallback ${i - 1}`,
                    category: 'ai',
                    priority: i,
                    enabled: true,
                });
            }
        }

        this.configs.set('ai', aiKeys.sort((a, b) => a.priority - b.priority));

        // ============ Train API Keys ============
        const trainKeys: APIKeyConfig[] = [];

        // IRCTC Connect (free, no key needed - always available)
        trainKeys.push({
            key: 'irctc-connect',
            name: 'IRCTC Connect (Free)',
            category: 'train',
            priority: 1,
            enabled: true,
        });

        // RailRadar API (free tier)
        if (process.env.RAILRADAR_API_KEY) {
            trainKeys.push({
                key: process.env.RAILRADAR_API_KEY,
                name: 'RailRadar',
                category: 'train',
                priority: 2,
                enabled: true,
                baseUrl: 'https://api.railradar.io/v1',
            });
        }

        // Indian Rail API
        if (process.env.INDIAN_RAIL_API_KEY) {
            trainKeys.push({
                key: process.env.INDIAN_RAIL_API_KEY,
                name: 'Indian Rail API',
                category: 'train',
                priority: 3,
                enabled: true,
                baseUrl: 'https://indianrailapi.com/api/v2',
            });
        }

        // eRail API
        if (process.env.ERAIL_API_KEY) {
            trainKeys.push({
                key: process.env.ERAIL_API_KEY,
                name: 'eRail',
                category: 'train',
                priority: 4,
                enabled: true,
                baseUrl: 'https://api.erail.in/v1',
            });
        }

        this.configs.set('train', trainKeys.sort((a, b) => a.priority - b.priority));

        // ============ Bus API Keys ============
        const busKeys: APIKeyConfig[] = [];

        if (process.env.REDBUS_API_KEY) {
            busKeys.push({
                key: process.env.REDBUS_API_KEY,
                name: 'RedBus',
                category: 'bus',
                priority: 1,
                enabled: true,
            });
        }

        this.configs.set('bus', busKeys);

        // ============ Flight API Keys ============
        const flightKeys: APIKeyConfig[] = [];

        if (process.env.SKYSCANNER_API_KEY) {
            flightKeys.push({
                key: process.env.SKYSCANNER_API_KEY,
                name: 'Skyscanner',
                category: 'flight',
                priority: 1,
                enabled: true,
            });
        }

        if (process.env.TBO_API_KEY) {
            flightKeys.push({
                key: process.env.TBO_API_KEY,
                name: 'TBO',
                category: 'flight',
                priority: 2,
                enabled: true,
            });
        }

        this.configs.set('flight', flightKeys);
    }

    /**
     * Get the best available API key for a category
     */
    getKey(category: APICategory): APIKeyConfig | null {
        const keys = this.getAvailableKeys(category);
        return keys.length > 0 ? keys[0] : null;
    }

    /**
     * Get all available keys for a category
     */
    private getAvailableKeys(category: APICategory): APIKeyConfig[] {
        const allKeys = this.configs.get(category) || [];
        const now = new Date();

        return allKeys.filter(config => {
            if (!config.enabled) return false;

            const status = this.keyStatus.get(config.key);
            if (!status) return true;

            // Check if in cooldown
            if (status.failureCount >= this.MAX_FAILURES && status.lastFailure) {
                if ((now.getTime() - status.lastFailure.getTime()) < this.FAILURE_COOLDOWN_MS) {
                    return false;
                }
                // Reset after cooldown
                status.failureCount = 0;
            }

            return true;
        });
    }

    /**
     * Report API failure
     */
    reportFailure(key: string): void {
        const status = this.keyStatus.get(key) || { failureCount: 0 };
        status.failureCount++;
        status.lastFailure = new Date();
        this.keyStatus.set(key, status);
        console.warn(`API failure: ${key} (${status.failureCount} failures)`);
    }

    /**
     * Report API success
     */
    reportSuccess(key: string): void {
        const status = this.keyStatus.get(key) || { failureCount: 0 };
        status.failureCount = 0;
        status.lastSuccess = new Date();
        this.keyStatus.set(key, status);
    }

    /**
     * Get status summary for admin dashboard
     */
    getStatusSummary(): Record<APICategory, { name: string; status: string; priority: number }[]> {
        const summary: Record<string, any[]> = {};

        for (const [category, keys] of this.configs) {
            summary[category] = keys.map(config => {
                const status = this.keyStatus.get(config.key);
                let statusText = 'Active';

                if (!config.enabled) {
                    statusText = 'Disabled';
                } else if (status && status.failureCount >= this.MAX_FAILURES) {
                    const lastFail = status.lastFailure;
                    if (lastFail && (Date.now() - lastFail.getTime()) < this.FAILURE_COOLDOWN_MS) {
                        statusText = 'Cooldown';
                    }
                } else if (status && status.failureCount > 0) {
                    statusText = `Warning (${status.failureCount} fails)`;
                }

                return {
                    name: config.name,
                    status: statusText,
                    priority: config.priority,
                };
            });
        }

        return summary as Record<APICategory, { name: string; status: string; priority: number }[]>;
    }

    /**
     * Check if any API is available for a category
     */
    hasAPI(category: APICategory): boolean {
        return this.getAvailableKeys(category).length > 0;
    }
}

// Singleton
export const apiManager = new APIManager();

// Helper exports
export function getAIKey(): string {
    const config = apiManager.getKey('ai');
    if (!config) throw new Error('No AI API key configured');
    return config.key;
}

export function getTrainAPI(): APIKeyConfig | null {
    return apiManager.getKey('train');
}

export function getBusAPI(): APIKeyConfig | null {
    return apiManager.getKey('bus');
}

export function getFlightAPI(): APIKeyConfig | null {
    return apiManager.getKey('flight');
}
