import { getDatabase } from '@/lib/mongodb';
import type { UserProfile } from '@/lib/types';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const db = await getDatabase();
    const profile = await db.collection('users').findOne({ oderId: userId });

    if (!profile) return null;

    return {
        id: profile._id.toString(),
        oderId: profile.userId,
        displayName: profile.displayName,
        email: profile.email,
        photoURL: profile.photoURL,
        travelPreferences: profile.travelPreferences,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
    } as UserProfile;
}

export async function upsertUserProfile(
    userId: string,
    data: {
        displayName?: string;
        email?: string;
        photoURL?: string;
    }
): Promise<void> {
    const db = await getDatabase();
    await db.collection('users').updateOne(
        { oderId: userId },
        {
            $set: {
                ...data,
                updatedAt: new Date(),
            },
            $setOnInsert: {
                oderId: userId,
                createdAt: new Date(),
                travelPreferences: {
                    preferredMode: 'any',
                    budgetLevel: 'any',
                },
            },
        },
        { upsert: true }
    );
}

export async function updateUserDisplayName(userId: string, displayName: string): Promise<void> {
    const db = await getDatabase();
    await db.collection('users').updateOne(
        { oderId: userId },
        {
            $set: {
                displayName,
                updatedAt: new Date(),
            },
        }
    );
}

export async function updateUserPreferences(
    userId: string,
    preferences: {
        preferredMode?: string;
        budgetLevel?: string;
    }
): Promise<void> {
    const db = await getDatabase();
    await db.collection('users').updateOne(
        { oderId: userId },
        {
            $set: {
                travelPreferences: preferences,
                updatedAt: new Date(),
            },
        }
    );
}
