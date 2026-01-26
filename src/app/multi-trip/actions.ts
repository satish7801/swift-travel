'use server';

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { saveItinerary } from '@/lib/db/itineraries';
import { generateId } from '@/lib/utils';
import type { Route, SavedItinerary } from '@/lib/types';
import type { GenerateItineraryOutput } from '@/ai/flows/generate-itinerary-flow';
import { estimateTravelDetails } from '@/lib/travel-utils';
import { generateMultiCityItinerary } from '@/ai/flows/generate-multi-city-itinerary-flow';

interface Stop {
    id: string;
    location: string;
    date: Date | string | undefined;
    period?: string;
    selectedAttractions?: string[];
}

export async function createMultiCityItinerary(stops: Stop[]) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { success: false, error: "Please sign in to save your trip." };
    }

    // Validate stops
    if (!stops || stops.length < 2) {
        return { success: false, error: 'At least 2 stops are required' };
    }

    const city = stops[0].location; // Start city
    const destinations = stops.slice(1).map(s => s.location).join(' -> ');
    const title = `Multi-City Trip: ${city} to ${stops[stops.length - 1].location}`;
    const summary = `A journey across ${stops.length} cities starting from ${city}.`;

    // Prepare stops with travel details
    const stopsWithTravel = await Promise.all(stops.map(async (s, index) => {
        let travelToNext = undefined;
        if (index < stops.length - 1) {
            const nextStop = stops[index + 1];
            travelToNext = estimateTravelDetails(s.location, nextStop.location);
        }

        return {
            id: s.id,
            location: s.location,
            date: s.date ? (typeof s.date === 'string' ? s.date : s.date.toISOString()) : undefined,
            period: s.period,
            selectedAttractions: s.selectedAttractions,
            travelToNext
        };
    }));

    // Generate AI itinerary based on stops
    try {
        const generatedItinerary = await generateMultiCityItinerary({
            stops: stopsWithTravel
        });

        // Overview for the rich view
        const overviewLine = `A journey across ${stops.length} cities starting from ${city}.`;

        const overview = {
            title: title,
            introduction: generatedItinerary.summary || overviewLine,
            dailyBreakdown: generatedItinerary.itinerary.map((d: any) => ({
                day: d.day,
                dayTitle: d.title,
                narrative: `Experience: ${d.activities.join('. ')}.`, // Simple narrative fallback
                proTip: "Wear comfortable shoes and carry water."
            })),
            conclusion: "Have a safe and memorable trip!",
            estimatedCost: "₹15,000 - ₹25,000", // This could also be AI generated ideally
            bestTimeToVisit: "October to March",
            gettingAround: "Local taxis and public transport.",
            whatToPack: ["Comfortable clothes", "Walking shoes", "Power bank", "Camera", "Sunscreen"],
            suggestedVideos: [`Travel vlog ${destinations}`]
        };

        const id = await saveItinerary(
            session.user.id,
            city,
            title,
            generatedItinerary.summary || summary,
            generatedItinerary.totalDays,
            generatedItinerary,
            overview
        );

        return { success: true, id: id };
    } catch (error: any) {
        console.error("Failed to generate/save itinerary", error);
        return { success: false, error: error.message || "Failed to generate itinerary. Please try again." };
    }
}
