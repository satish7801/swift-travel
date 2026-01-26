'use server';

import { generateRoutes } from '@/ai/flows/generate-routes-flow';
import { confirmLocationChoice } from '@/ai/flows/confirm-location-choice';
import { findLocations } from '@/ai/flows/find-locations-flow';
import { searchFormSchema, type SearchFilters } from '@/lib/schemas';
import type { Route, UserProfile } from '@/lib/types';

/**
 * Validates a location string using an AI-powered location search and confirmation step.
 * @param location The user-provided location string.
 * @returns The validated location name.
 * @throws An error if the location cannot be validated.
 */
async function validateLocation(location: string): Promise<string> {
    const { locations: possibleLocations } = await findLocations({ query: location });

    if (possibleLocations.length === 0) {
        throw new Error(`Could not find any locations matching "${location}". Please try a different search term.`);
    }

    // If there's a single match, we can be confident.
    if (possibleLocations.length === 1) {
        return possibleLocations[0];
    }

    // Otherwise, use another AI step to confirm the best match from the possibilities.
    const confirmation = await confirmLocationChoice({
        locationName: location,
        possibleLocations: possibleLocations,
    });

    if (confirmation.isValidLocation && confirmation.confirmedLocationName) {
        return confirmation.confirmedLocationName;
    }

    throw new Error(`Could not confidently determine location for "${location}". Please be more specific.`);
}


export async function searchRoutesAction(
    filters: SearchFilters,
    preferences?: Partial<UserProfile['travelPreferences']>
): Promise<Route[]> {
    const validatedFields = searchFormSchema.safeParse(filters);

    if (!validatedFields.success) {
        throw new Error(validatedFields.error.errors[0].message);
    }

    const { from, to, date } = validatedFields.data;

    try {
        // Validate 'from' and 'to' locations before generating routes
        const [validatedFrom, validatedTo] = await Promise.all([
            validateLocation(from),
            validateLocation(to)
        ]);

        const input = {
            from: validatedFrom,
            to: validatedTo,
            date: date,
            modes: [], // Will be handled by transport preferences if needed, or default to all
            // We can map user travelPreferences here if we update ProviderRegistry to accept them
        }

        // Import registry dynamically to avoid circular deps if any (though importing from Providers index is fine)
        const { providerRegistry } = await import('@/lib/providers');

        // Convert date string/Date object to Date object
        const searchDate = date || new Date();

        // Map preferences to modes if present
        const modes: ('flight' | 'train' | 'bus')[] = [];
        const preferredMode = preferences?.preferredMode;
        if (preferredMode && preferredMode !== 'any' && (preferredMode === 'flight' || preferredMode === 'train' || preferredMode === 'bus')) {
            modes.push(preferredMode);
        } else {
            modes.push('flight', 'train', 'bus');
        }

        const routes = await providerRegistry.searchAll({
            from: validatedFrom,
            to: validatedTo,
            date: searchDate,
            modes: modes,
            budgetMax: preferences?.budgetLevel === 'budget' ? 2000 : undefined
        });

        return routes;

    } catch (error: any) {
        console.error('Search action error:', error);
        // Re-throw user-friendly errors from validation or AI
        throw new Error(error.message || 'An error occurred while searching for routes.');
    }
}
