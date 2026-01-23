"use client";

import { addDoc, collection, deleteDoc, doc, Firestore, serverTimestamp } from 'firebase/firestore';
import type { GenerateItineraryOutput } from '@/ai/flows/generate-itinerary-flow';
import type { GenerateItineraryOverviewOutput } from '@/ai/flows/generate-itinerary-overview-flow';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function saveItinerary(
    db: Firestore,
    userId: string,
    city: string,
    itineraryData: GenerateItineraryOutput,
    overviewData?: GenerateItineraryOverviewOutput | null,
): void {
    const itinerariesRef = collection(db, 'users', userId, 'itineraries');
    const dataToSave = {
        city,
        title: overviewData?.title || `Trip to ${city}`,
        totalDays: itineraryData.totalDays,
        summary: itineraryData.summary,
        itinerary: itineraryData,
        overview: overviewData || null,
        savedAt: serverTimestamp(),
    };
    
    addDoc(itinerariesRef, dataToSave)
        .catch(error => {
            const permissionError = new FirestorePermissionError({
                path: itinerariesRef.path,
                operation: 'create',
                requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
}

export function deleteItinerary(db: Firestore, userId: string, itineraryId: string): void {
    const itineraryRef = doc(db, 'users', userId, 'itineraries', itineraryId);
    
    deleteDoc(itineraryRef)
        .catch(error => {
            const permissionError = new FirestorePermissionError({
                path: itineraryRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
}
