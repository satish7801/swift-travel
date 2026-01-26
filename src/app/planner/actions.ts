'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { saveItinerary } from '@/lib/db/itineraries';
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
    originCity: z.string(),
    city: z.string(),
    attractions: z.array(z.string()).min(1, { message: "Please select at least one attraction." }),
});

export async function generateItineraryAction(originCity: string, city: string, attractions: string[]) {
    const validatedInput = ItinerarySchema.safeParse({ originCity, city, attractions });
    if (!validatedInput.success) {
        return { error: validatedInput.error.errors[0].message };
    }

    try {
        // Step 1: Generate the basic itinerary
        const basicItinerary = await generateItinerary(validatedInput.data);
        if (!basicItinerary) {
            throw new Error('Failed to generate the initial itinerary plan.');
        }

        // Step 2: Immediately generate the rich overview
        const overview = await generateItineraryOverview({ originCity, city, itinerary: basicItinerary });
        if (!overview) {
            throw new Error('Failed to generate the detailed itinerary overview.');
        }

        return { itinerary: basicItinerary, overview };

    } catch (error: any) {
        console.error('Generate itinerary error:', error);
        return { error: error.message || 'Failed to generate itinerary.' };
    }
}

/**
 * Generate AI itinerary and save to database
 */
export async function generateAndSaveItinerary(cities: string[], startDate: string, endDate: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "Please sign in to create an itinerary." };
    }

    if (!cities || cities.length < 1) {
        return { success: false, error: "Please select at least one city." };
    }

    if (!startDate || !endDate) {
        return { success: false, error: "Please select both start and end dates." };
    }

    const originCity = cities[0];
    const city = cities.length > 1 ? cities[1] : cities[0];

    // Convert cities (excluding origin) into attractions/destinations
    const attractions = cities.length > 1
        ? cities.slice(1).map(c => `Explore ${c}`)
        : [`Explore ${city}`, `Local sightseeing in ${city}`, `Cultural experiences in ${city}`];

    try {
        // Step 1: Generate structured itinerary
        const itineraryData = await generateItinerary({
            originCity,
            city,
            attractions,
        });

        if (!itineraryData) {
            throw new Error('Failed to generate itinerary.');
        }

        // Step 2: Generate rich overview
        const overview = await generateItineraryOverview({
            originCity,
            city,
            itinerary: itineraryData,
        });

        if (!overview) {
            throw new Error('Failed to generate itinerary overview.');
        }

        // Step 3: Save to database
        const title = overview.title || `${itineraryData.totalDays} Days in ${city}`;
        const summary = itineraryData.summary;

        const id = await saveItinerary(
            session.user.id,
            city,
            title,
            summary,
            itineraryData.totalDays,
            itineraryData,
            overview
        );

        return { success: true, id };
    } catch (error: any) {
        console.error("Failed to generate AI itinerary:", error);
        return { success: false, error: error.message || "Failed to generate itinerary. Please try again." };
    }
}
