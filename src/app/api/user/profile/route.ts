import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserProfile, upsertUserProfile, updateUserDisplayName, updateUserPreferences } from '@/lib/db/users';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        let profile = await getUserProfile(session.user.id);

        // If no profile exists, create one from session data
        if (!profile) {
            await upsertUserProfile(session.user.id, {
                displayName: session.user.name ?? undefined,
                email: session.user.email ?? undefined,
                photoURL: session.user.image ?? undefined,
            });
            profile = await getUserProfile(session.user.id);
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { displayName, travelPreferences } = await request.json();

        if (displayName !== undefined) {
            await updateUserDisplayName(session.user.id, displayName);
        }

        if (travelPreferences !== undefined) {
            await updateUserPreferences(session.user.id, travelPreferences);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
