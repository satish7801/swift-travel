"use client";

import { addDoc, collection, doc, deleteDoc, Firestore, serverTimestamp } from 'firebase/firestore';
import type { Route } from '@/lib/types';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * Saves a travel route to a user's 'trips' collection in Firestore.
 * @param db The Firestore database instance.
 * @param userId The ID of the user saving the trip.
 * @param route The route object to save.
 */
export function saveTrip(db: Firestore, userId: string, route: Route): void {
  const tripsRef = collection(db, 'users', userId, 'trips');
  
  const dataToSave = {
    ...route,
    savedAt: serverTimestamp(),
  };

  addDoc(tripsRef, dataToSave)
    .catch(error => {
      const permissionError = new FirestorePermissionError({
        path: tripsRef.path,
        operation: 'create',
        requestResourceData: dataToSave,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
}

/**
 * Deletes a travel route from a user's 'trips' collection in Firestore.
 * @param db The Firestore database instance.
 * @param userId The ID of the user who owns the trip.
 * @param tripId The ID of the trip document to delete.
 */
export function deleteTrip(db: Firestore, userId: string, tripId: string): void {
    const tripRef = doc(db, 'users', userId, 'trips', tripId);
    
    deleteDoc(tripRef)
        .catch(error => {
            const permissionError = new FirestorePermissionError({
                path: tripRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
}
