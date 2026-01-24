'use server';

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { saveItinerary } from '@/lib/db/itineraries';
import { generateId } from '@/lib/utils';
import type { Route, SavedItinerary } from '@/lib/types';
import type { GenerateItineraryOutput } from '@/ai/flows/generate-itinerary-flow';

interface Stop {
    id: string;
    location: string;
    date: Date | string | undefined;
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

    // Generate deterministic itinerary based on stops
    // Assuming auto-filled dates from client are present or we mock them

    const itineraryDays: any[] = [];
    let dayCount = 1;

    for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        const nextStop = stops[i + 1];

        // Day for arriving/exploring current stop
        itineraryDays.push({
            day: dayCount,
            title: `Explore ${stop.location}`,
            activities: [
                `Arrive in ${stop.location}`,
                `Check-in to hotel`,
                `Local sightseeing in ${stop.location}`,
                `Dinner at a local restaurant`
            ]
        });
        dayCount++;

        // Add another day for exploration if it's not a transit-only stop
        // For simplicity, just 1 day per stop + travel day
        if (i < stops.length - 1) {
            itineraryDays.push({
                day: dayCount,
                title: `Travel to ${nextStop.location}`,
                activities: [
                    `Breakfast in ${stop.location}`,
                    `Travel to ${nextStop.location} (Flight/Train/Bus)`,
                    `Arrival in ${nextStop.location}`
                ]
            });
            dayCount++;
        }
    }

    const generatedItinerary: GenerateItineraryOutput = {
        totalDays: dayCount - 1,
        itinerary: itineraryDays,
        summary: summary
    };

    // Overview for the rich view
    const overview = {
        title: title,
        introduction: summary,
        dailyBreakdown: itineraryDays.map(d => ({
            day: d.day,
            dayTitle: d.title,
            narrative: `Spend your day exploring the beautiful sights of ${d.title.replace('Explore ', '').replace('Travel to ', '')}. Enjoy local cuisine and culture.`,
            proTip: "Wear comfortable shoes for walking."
        })),
        conclusion: "Have a safe trip back home!",
        estimatedCost: "₹15,000 - ₹25,000",
        bestTimeToVisit: "October to March",
        gettingAround: "Local taxis and public transport are available.",
        whatToPack: ["Comfortable clothes", "Walking shoes", "Power bank", "Camera"],
        suggestedVideos: [`Travel vlog ${city}`, `Things to do in ${stops[stops.length - 1].location}`]
    };

    try {
        const id = await saveItinerary(
            session.user.id,
            city,
            title,
            summary,
            generatedItinerary.totalDays,
            generatedItinerary,
            overview
        );

        return { success: true, id: id };
    } catch (error) {
        console.error("Failed to save itinerary", error);
        return { success: false, error: "Failed to save itinerary to database." };
    }
}
