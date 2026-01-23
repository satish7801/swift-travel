"use client";

import { doc, setDoc, updateDoc, Firestore, getDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/lib/types';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * Creates or updates a user's profile document in Firestore.
 * This is useful for syncing auth information with the database.
 * It also initializes default travel preferences for new users.
 * @param db The Firestore database instance.
 * @param user The Firebase Auth user object.
 */
export function upsertUserProfile(db: Firestore, user: User): void {
  const userRef = doc(db, 'users', user.uid);

  // This function is both create and update. We use getDoc to see if it exists.
  getDoc(userRef).then(docSnap => {
    const profileData: Partial<UserProfile> = {
        displayName: user.displayName || 'Anonymous User',
        email: user.email || '',
        photoURL: user.photoURL || '',
    };
    
    const isNewUser = !docSnap.exists();
    if (isNewUser || !docSnap.data().travelPreferences) {
        profileData.travelPreferences = {
            preferredMode: 'any',
            budgetLevel: 'any'
        };
    }

    setDoc(userRef, profileData, { merge: true })
        .catch(error => {
            const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: isNewUser ? 'create' : 'update',
                requestResourceData: profileData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  }).catch(error => {
      // This catches errors from getDoc
      const permissionError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'get',
      });
      errorEmitter.emit('permission-error', permissionError);
  });
}


/**
 * Updates a user's display name in their Firestore profile document.
 * @param db The Firestore database instance.
 * @param userId The ID of the user.
 * @param displayName The new display name.
 */
export function updateUserDisplayName(db: Firestore, userId: string, displayName: string): void {
    if (!displayName || displayName.trim().length === 0) {
        throw new Error("Display name cannot be empty.");
    }
    const userRef = doc(db, 'users', userId);
    const dataToUpdate = { displayName };

    updateDoc(userRef, dataToUpdate)
        .catch(error => {
            const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'update',
                requestResourceData: dataToUpdate,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
}

/**
 * Updates a user's travel preferences in their Firestore profile document.
 * @param db The Firestore database instance.
 * @param userId The ID of the user.
 * @param preferences The travel preferences to update.
 */
export function updateUserPreferences(db: Firestore, userId: string, preferences?: Partial<UserProfile['travelPreferences']>): void {
    if (!preferences) {
        throw new Error("Preferences cannot be empty.");
    }
    const userRef = doc(db, 'users', userId);
    const dataToUpdate = { travelPreferences: preferences };
    
    updateDoc(userRef, dataToUpdate)
        .catch(error => {
            const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'update',
                requestResourceData: dataToUpdate,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
}
