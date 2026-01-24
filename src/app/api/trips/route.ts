import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTrips, saveTrip } from '@/lib/db/trips';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const trips = await getTrips(session.user.id);
        return NextResponse.json(trips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const trip = await request.json();
        const tripId = await saveTrip(session.user.id, trip);
        return NextResponse.json({ id: tripId });
    } catch (error) {
        console.error('Error saving trip:', error);
        return NextResponse.json({ error: 'Failed to save trip' }, { status: 500 });
    }
}
