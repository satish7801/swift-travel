"use client";

import { doc, setDoc, updateDoc, Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';

/**
 * Creates or updates a user's profile document in Firestore.
 * This is useful for syncing auth information with the database.
 * @param db The Firestore database instance.
 * @param user The Firebase Auth user object.
 */
export async function upsertUserProfile(db: Firestore, user: User): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  }, { merge: true });
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
