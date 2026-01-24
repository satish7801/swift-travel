import { getDatabase } from '@/lib/mongodb';
import type { Route } from '@/lib/types';
import { ObjectId } from 'mongodb';

export interface SavedTrip extends Route {
    id: string;
    savedAt: Date;
}

export async function getTrips(userId: string): Promise<SavedTrip[]> {
    const db = await getDatabase();
    const trips = await db
        .collection('trips')
        .find({ userId })
        .sort({ savedAt: -1 })
        .toArray();

    return trips.map((trip) => ({
        ...trip,
        id: trip._id.toString(),
        _id: undefined,
    })) as SavedTrip[];
}

export async function saveTrip(userId: string, trip: Route): Promise<string> {
    const db = await getDatabase();
    const result = await db.collection('trips').insertOne({
        ...trip,
        userId,
        savedAt: new Date(),
    });
    return result.insertedId.toString();
}

export async function deleteTrip(userId: string, tripId: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.collection('trips').deleteOne({
        _id: new ObjectId(tripId),
        userId,
    });
    return result.deletedCount > 0;
}
