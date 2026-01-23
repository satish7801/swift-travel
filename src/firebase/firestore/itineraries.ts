"use client";

import { addDoc, collection, deleteDoc, doc, Firestore, serverTimestamp } from 'firebase/firestore';
import type { GenerateItineraryOutput } from '@/ai/flows/generate-itinerary-flow';
import type { GenerateItineraryOverviewOutput } from '@/ai/flows/generate-itinerary-overview-flow';

export async function saveItinerary(
    db: Firestore,
    userId: string,
    city: string,
    itineraryData: GenerateItineraryOutput,
    overviewData?: GenerateItineraryOverviewOutput | null,
): Promise<string> {
    const itinerariesRef = collection(db, 'users', userId, 'itineraries');
    const docRef = await addDoc(itinerariesRef, {
        city,
        title: overviewData?.title || `Trip to ${city}`,
        totalDays: itineraryData.totalDays,
        summary: itineraryData.summary,
        itinerary: itineraryData,
        overview: overviewData || null,
        savedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function deleteItinerary(db: Firestore, userId: string, itineraryId: string): Promise<void> {
    const itineraryRef = doc(db, 'users', userId, 'itineraries', itineraryId);
    await deleteDoc(itineraryRef);
}
