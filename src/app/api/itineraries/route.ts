import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getItineraries, saveItinerary } from '@/lib/db/itineraries';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const itineraries = await getItineraries(session.user.id);
        return NextResponse.json(itineraries);
    } catch (error) {
        console.error('Error fetching itineraries:', error);
        return NextResponse.json({ error: 'Failed to fetch itineraries' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { city, title, summary, totalDays, itinerary, overview } = await request.json();
        const itineraryId = await saveItinerary(
            session.user.id,
            city,
            title,
            summary,
            totalDays,
            itinerary,
            overview
        );
        return NextResponse.json({ id: itineraryId });
    } catch (error) {
        console.error('Error saving itinerary:', error);
        return NextResponse.json({ error: 'Failed to save itinerary' }, { status: 500 });
    }
}
