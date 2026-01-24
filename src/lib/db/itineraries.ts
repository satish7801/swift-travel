import { getDatabase } from '@/lib/mongodb';
import type { SavedItinerary } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function getItineraries(userId: string): Promise<SavedItinerary[]> {
    const db = await getDatabase();
    const itineraries = await db
        .collection('itineraries')
        .find({ userId })
        .sort({ savedAt: -1 })
        .toArray();

    return itineraries.map((itinerary) => ({
        ...itinerary,
        id: itinerary._id.toString(),
        _id: undefined,
    })) as SavedItinerary[];
}

export async function getItinerary(userId: string, itineraryId: string): Promise<SavedItinerary | null> {
    const db = await getDatabase();
    const itinerary = await db.collection('itineraries').findOne({
        _id: new ObjectId(itineraryId),
        userId,
    });

    if (!itinerary) return null;

    return {
        ...itinerary,
        id: itinerary._id.toString(),
        _id: undefined,
    } as SavedItinerary;
}

export async function saveItinerary(
    userId: string,
    city: string,
    title: string,
    summary: string,
    totalDays: number,
    itinerary: any,
    overview?: any
): Promise<string> {
    const db = await getDatabase();
    const result = await db.collection('itineraries').insertOne({
        userId,
        city,
        title,
        summary,
        totalDays,
        itinerary,
        overview,
        savedAt: new Date(),
    });
    return result.insertedId.toString();
}

export async function deleteItinerary(userId: string, itineraryId: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.collection('itineraries').deleteOne({
        _id: new ObjectId(itineraryId),
        userId,
    });
    return result.deletedCount > 0;
}
