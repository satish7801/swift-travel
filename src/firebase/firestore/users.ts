"use client";

import { doc, setDoc, updateDoc, Firestore, getDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/lib/types';

/**
 * Creates or updates a user's profile document in Firestore.
 * This is useful for syncing auth information with the database.
 * It also initializes default travel preferences for new users.
 * @param db The Firestore database instance.
 * @param user The Firebase Auth user object.
 */
export async function upsertUserProfile(db: Firestore, user: User): Promise<void> {
  const userRef = doc(db, 'users', user.uid);

  const profileData: Partial<UserProfile> = {
    displayName: user.displayName || 'Anonymous User',
    email: user.email || '',
    photoURL: user.photoURL || '',
  };

  // Check if we need to initialize preferences for a new user or existing user without them
  const docSnap = await getDoc(userRef);
  if (!docSnap.exists() || !docSnap.data().travelPreferences) {
    profileData.travelPreferences = {
      preferredMode: 'any',
      budgetLevel: 'any'
    };
  }

  await setDoc(userRef, profileData, { merge: true });
}


/**
 * Updates a user's display name in their Firestore profile document.
 * @param db The Firestore database instance.
 * @param userId The ID of the user.
 * @param displayName The new display name.
 */
export async function updateUserDisplayName(db: Firestore, userId: string, displayName: string): Promise<void> {
    if (!displayName || displayName.trim().length === 0) {
        throw new Error("Display name cannot be empty.");
    }
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
        displayName: displayName
    });
}

/**
 * Updates a user's travel preferences in their Firestore profile document.
 * @param db The Firestore database instance.
 * @param userId The ID of the user.
 * @param preferences The travel preferences to update.
 */
export async function updateUserPreferences(db: Firestore, userId: string, preferences?: Partial<UserProfile['travelPreferences']>): Promise<void> {
    if (!preferences) {
        throw new Error("Preferences cannot be empty.");
    }
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
        travelPreferences: preferences
    });
}
