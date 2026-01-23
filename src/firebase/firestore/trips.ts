"use client";

import { addDoc, collection, Firestore, serverTimestamp } from 'firebase/firestore';
import type { Route } from '@/lib/types';

/**
 * Saves a travel route to a user's 'trips' collection in Firestore.
 * @param db The Firestore database instance.
 * @param userId The ID of the user saving the trip.
 * @param route The route object to save.
 * @returns A promise that resolves with the new document reference.
 */
export function saveTrip(db: Firestore, userId: string, route: Route) {
  const tripsRef = collection(db, 'users', userId, 'trips');
  
  // We add a `savedAt` timestamp to allow sorting by recently saved trips.
  return addDoc(tripsRef, {
    ...route,
    savedAt: serverTimestamp(),
  });
}
