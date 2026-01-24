'use server';

import { redirect } from 'next/navigation';
import { generateId } from '@/lib/utils';
import type { Route, SavedItinerary } from '@/lib/types';
import { getNearbyPlaces } from '@/lib/data/trip-planner';

interface Stop {
    id: string;
    location: string;
    date: Date | undefined;
}

export async function createMultiCityItinerary(stops: Stop[]) {
    // Validate stops
    if (!stops || stops.length < 2) {
        throw new Error('At least 2 stops are required');
    }

    // Generate a simple itinerary object
    // In a real app, this would call AI to generate rich details
    // Here we mock it for the "Find Best Routes" features

    const itineraryId = generateId();
    const summary = `Trip to ${stops.map(s => s.location).join(', ')}`;

    // Redirect to the planner view (or a new results view)
    // For now, let's redirect to the first planner page or a new implementation
    // Since we don't have a "view itinerary" page that takes raw stops yet, 
    // let's assume we save it and redirect to /plans/[id]

    // TODO: Save to DB
    // await db.itineraries.create(...)

    // For now, return the ID so client can redirect mock
    return { success: true, id: itineraryId };
}
