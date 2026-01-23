'use server';

import { generateRoutes } from '@/ai/flows/generate-routes-flow';
import { confirmLocationChoice } from '@/ai/flows/confirm-location-choice';
import { searchLocations } from '@/lib/locations';
import type { SearchFilters } from '@/components/search-form';
import { searchFormSchema } from '@/components/search-form';
import type { Route } from '@/lib/types';

/**
 * Validates a location string using a mock location search and an AI confirmation step.
 * @param location The user-provided location string.
 * @returns The validated location name.
 * @throws An error if the location cannot be validated.
 */
async function validateLocation(location: string): Promise<string> {
    const possibleLocations = searchLocations(location);

    if (possibleLocations.length === 0) {
        throw new Error(`Could not find any locations matching "${location}".`);
    }

    // If there's a single, perfect match, we can be confident.
    if (possibleLocations.length === 1 && possibleLocations[0].toLowerCase() === location.toLowerCase()) {
        return possibleLocations[0];
    }
    
    // Otherwise, use AI to confirm the best match.
    const confirmation = await confirmLocationChoice({
        locationName: location,
        possibleLocations: possibleLocations,
    });

    if (confirmation.isValidLocation && confirmation.confirmedLocationName) {
        return confirmation.confirmedLocationName;
    }

    throw new Error(`Could not confidently determine location for "${location}". Please be more specific.`);
}


export async function searchRoutesAction(filters: SearchFilters): Promise<Route[]> {
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
          date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }

        const aiResponse = await generateRoutes(input);
        return aiResponse.routes;

    } catch (error: any) {
        console.error('Search action error:', error);
        // Re-throw user-friendly errors from validation or AI
        throw new Error(error.message || 'An error occurred while searching for routes.');
    }
}
