'use server';

import { findAttractions } from '@/ai/flows/find-attractions-flow';
import { generateItinerary, type GenerateItineraryOutput } from '@/ai/flows/generate-itinerary-flow';
import { generateItineraryOverview } from '@/ai/flows/generate-itinerary-overview-flow';
import { z } from 'zod';

const CitySchema = z.string().min(2, { message: "Please enter a city name." });

export async function findAttractionsAction(city: string): Promise<{ attractions?: string[]; error?: string; }> {
    const validatedCity = CitySchema.safeParse(city);
    if (!validatedCity.success) {
        return { error: validatedCity.error.errors[0].message };
    }

    try {
        const result = await findAttractions({ city: validatedCity.data });
        return { attractions: result.attractions };
    } catch (error: any) {
        console.error('Find attractions error:', error);
        return { error: error.message || 'Failed to find attractions.' };
    }
}

const ItinerarySchema = z.object({
    city: z.string(),
    attractions: z.array(z.string()).min(1, { message: "Please select at least one attraction." }),
});

export async function generateItineraryAction(city: string, attractions: string[]) {
    const validatedInput = ItinerarySchema.safeParse({ city, attractions });
    if (!validatedInput.success) {
        return { error: validatedInput.error.errors[0].message };
    }

    try {
        const result = await generateItinerary(validatedInput.data);
        return { itinerary: result };
    } catch (error: any) {
        console.error('Generate itinerary error:', error);
        return { error: error.message || 'Failed to generate itinerary.' };
    }
}

export async function generateItineraryOverviewAction(city: string, itinerary: GenerateItineraryOutput) {
    if (!city || !itinerary) {
        return { error: "Missing city or itinerary data." };
    }

    try {
        const result = await generateItineraryOverview({ city, itinerary });
        return { overview: result };
    } catch (error: any) {
        console.error('Generate itinerary overview error:', error);
        return { error: error.message || 'Failed to generate itinerary overview.' };
    }
}
