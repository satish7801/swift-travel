import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getItinerary, deleteItinerary } from '@/lib/db/itineraries';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const itinerary = await getItinerary(session.user.id, id);

        if (!itinerary) {
            return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
        }

        return NextResponse.json(itinerary);
    } catch (error) {
        console.error('Error fetching itinerary:', error);
        return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const deleted = await deleteItinerary(session.user.id, id);

        if (!deleted) {
            return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting itinerary:', error);
        return NextResponse.json({ error: 'Failed to delete itinerary' }, { status: 500 });
    }
}
