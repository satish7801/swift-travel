'use server';

import { summarizeItineraryForSharing } from '@/ai/flows/summarize-itinerary-flow';
import type { SavedItinerary } from '@/lib/types';
import { z } from 'zod';

const ItinerarySchema = z.custom<SavedItinerary>();

export async function summarizeItineraryAction(itinerary: SavedItinerary): Promise<{ summary?: string; error?: string; }> {
    const validatedInput = ItinerarySchema.safeParse(itinerary);
    if (!validatedInput.success) {
        return { error: "Invalid itinerary data provided." };
    }

    try {
        const result = await summarizeItineraryForSharing({ itinerary: validatedInput.data });
        return { summary: result.summary };
    } catch (error: any) {
        console.error('Summarize itinerary error:', error);
        return { error: error.message || 'Failed to generate summary.' };
    }
}
