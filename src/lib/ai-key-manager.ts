// AI API Key Manager with Priority-based Fallback
// Supports multiple API keys configured by admin

export interface APIKeyConfig {
    key: string;
    name: string;
    priority: number;
    enabled: boolean;
    rateLimitPerMinute?: number;
    lastUsed?: Date;
    failureCount?: number;
}

class AIKeyManager {
    private keys: APIKeyConfig[] = [];
    private currentKeyIndex: number = 0;
    private failureCounts: Map<string, number> = new Map();
    private lastFailure: Map<string, Date> = new Map();

    // Cooldown period after failures (5 minutes)
    private readonly FAILURE_COOLDOWN_MS = 5 * 60 * 1000;
    // Max failures before temporary disable
    private readonly MAX_FAILURES = 3;

    constructor() {
        this.loadKeysFromEnv();
    }

    private loadKeysFromEnv(): void {
        // Load primary key
        const primaryKey = process.env.GOOGLE_GENAI_API_KEY;
        if (primaryKey) {
            this.keys.push({
                key: primaryKey,
                name: 'Primary',
                priority: 1,
                enabled: true,
            });
        }

        // Load fallback keys (GOOGLE_GENAI_API_KEY_2, GOOGLE_GENAI_API_KEY_3, etc.)
        for (let i = 2; i <= 5; i++) {
            const fallbackKey = process.env[`GOOGLE_GENAI_API_KEY_${i}`];
            if (fallbackKey) {
                this.keys.push({
                    key: fallbackKey,
                    name: `Fallback ${i - 1}`,
                    priority: i,
                    enabled: true,
                });
            }
        }

        // Sort by priority
        this.keys.sort((a, b) => a.priority - b.priority);
    }

    /**
     * Get the next available API key
     */
    getKey(): string | null {
        const availableKeys = this.getAvailableKeys();

        if (availableKeys.length === 0) {
            console.error('No API keys available');
            return null;
        }

        return availableKeys[0].key;
    }

    /**
     * Get all available keys (not in cooldown, not max failures)
     */
    private getAvailableKeys(): APIKeyConfig[] {
        const now = new Date();

        return this.keys.filter(keyConfig => {
            if (!keyConfig.enabled) return false;

            const failures = this.failureCounts.get(keyConfig.key) || 0;
            const lastFail = this.lastFailure.get(keyConfig.key);

            // If max failures reached, check if cooldown has passed
            if (failures >= this.MAX_FAILURES) {
                if (lastFail && (now.getTime() - lastFail.getTime()) < this.FAILURE_COOLDOWN_MS) {
                    return false; // Still in cooldown
                }
                // Cooldown passed, reset failure count
                this.failureCounts.set(keyConfig.key, 0);
            }

            return true;
        });
    }

    /**
     * Report a failure for a key (triggers fallback logic)
     */
    reportFailure(key: string): void {
        const currentCount = this.failureCounts.get(key) || 0;
        this.failureCounts.set(key, currentCount + 1);
        this.lastFailure.set(key, new Date());

        console.warn(`API key failure reported. Failures: ${currentCount + 1}`);

        // Move to next available key
        const availableKeys = this.getAvailableKeys();
        if (availableKeys.length > 0) {
            console.log(`Switching to fallback key: ${availableKeys[0].name}`);
        }
    }

    /**
     * Report success (resets failure count)
     */
    reportSuccess(key: string): void {
        this.failureCounts.set(key, 0);
    }

    /**
     * Get status of all keys
     */
    getStatus(): { name: string; priority: number; enabled: boolean; failures: number; status: string }[] {
        return this.keys.map(keyConfig => ({
            name: keyConfig.name,
            priority: keyConfig.priority,
            enabled: keyConfig.enabled,
            failures: this.failureCounts.get(keyConfig.key) || 0,
            status: this.getKeyStatus(keyConfig),
        }));
    }

    private getKeyStatus(keyConfig: APIKeyConfig): string {
        if (!keyConfig.enabled) return 'Disabled';

        const failures = this.failureCounts.get(keyConfig.key) || 0;
        const lastFail = this.lastFailure.get(keyConfig.key);
        const now = new Date();

        if (failures >= this.MAX_FAILURES) {
            if (lastFail && (now.getTime() - lastFail.getTime()) < this.FAILURE_COOLDOWN_MS) {
                const remainingMs = this.FAILURE_COOLDOWN_MS - (now.getTime() - lastFail.getTime());
                const remainingMins = Math.ceil(remainingMs / 60000);
                return `Cooldown (${remainingMins}m)`;
            }
        }

        if (failures > 0) return `Active (${failures} failures)`;
        return 'Active';
    }

    /**
     * Check if any keys are available
     */
    hasAvailableKeys(): boolean {
        return this.getAvailableKeys().length > 0;
    }

    /**
     * Get total configured keys count
     */
    getKeyCount(): number {
        return this.keys.length;
    }
}

// Singleton instance
export const aiKeyManager = new AIKeyManager();

// Helper function for easy access
export function getAIApiKey(): string {
    const key = aiKeyManager.getKey();
    if (!key) {
        throw new Error('No AI API keys configured. Please set GOOGLE_GENAI_API_KEY in .env');
    }
    return key;
}
