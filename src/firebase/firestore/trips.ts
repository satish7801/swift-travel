"use client";

import { addDoc, collection, doc, deleteDoc, Firestore, serverTimestamp } from 'firebase/firestore';
import type { Route } from '@/lib/types';

/**
 * Saves a travel route to a user's 'trips' collection in Firestore.
 * @param db The Firestore database instance.
 * @param userId The ID of the user saving the trip.
 * @param route The route object to save.
 * @returns A promise that resolves when the operation is complete.
 */
export async function saveTrip(db: Firestore, userId: string, route: Route): Promise<void> {
  const tripsRef = collection(db, 'users', userId, 'trips');
  
  // We add a `savedAt` timestamp to allow sorting by recently saved trips.
  await addDoc(tripsRef, {
    ...route,
    savedAt: serverTimestamp(),
  });
}

/**
 * Deletes a travel route from a user's 'trips' collection in Firestore.
 * @param db The Firestore database instance.
 * @param userId The ID of the user who owns the trip.
 * @param tripId The ID of the trip document to delete.
 * @returns A promise that resolves when the operation is complete.
 */
export async function deleteTrip(db: Firestore, userId: string, tripId: string): Promise<void> {
    const tripRef = doc(db, 'users', userId, 'trips', tripId);
    await deleteDoc(tripRef);
}
