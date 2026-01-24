"use client";

import * as React from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/use-session';
import RouteCard from '@/components/route-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { Route } from '@/lib/types';
import VideoPlayerDialog from '@/components/video-player-dialog';

export const maxDuration = 120; // Extend server action timeout for video generation

interface SavedTrip extends Route {
  id: string;
  savedAt: Date;
}

export default function MyTripsPage() {
  const { user, status } = useUser();
  const [trips, setTrips] = React.useState<SavedTrip[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [videoState, setVideoState] = React.useState<{ route: Route | null; isOpen: boolean }>({
    route: null,
    isOpen: false,
  });

  // Fetch trips when user is authenticated
  React.useEffect(() => {
    if (status === 'authenticated' && user) {
      setLoading(true);
      fetch('/api/trips')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch trips');
          return res.json();
        })
        .then(data => {
          setTrips(data);
          setError(null);
        })
        .catch(err => {
          setError(err.message);
          setTrips([]);
        })
        .finally(() => setLoading(false));
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [user, status]);

  const handleGenerateVideo = (route: Route) => {
    setVideoState({ route, isOpen: true });
  };

  const handleCloseVideoDialog = () => {
    setVideoState({ route: null, isOpen: false });
  }

  const handleTripDeleted = (tripId: string) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
  };


  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-headline font-bold mb-6">My Trips</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-headline font-bold mb-4">My Trips</h1>
        <p className="text-muted-foreground mb-4">You need to be logged in to view your saved trips.</p>
        {/* The login button is in the sidebar, so we just prompt them. */}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-headline font-bold mb-6">My Trips</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-headline font-bold mb-4">Error</h1>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-6">My Trips</h1>
      {trips && trips.length > 0 ? (
        <div className="space-y-4">
          {trips.map(trip => (
            <RouteCard
              key={trip.id}
              route={trip}
              isSavedTrip
              onGenerateVideo={handleGenerateVideo}
              onDeleted={() => handleTripDeleted(trip.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-headline font-semibold">No trips saved yet</h2>
          <p className="text-muted-foreground mt-2">Start searching for routes and book your next adventure!</p>
          <Button asChild className="mt-4">
            <Link href="/">Search Routes</Link>
          </Button>
        </div>
      )}
      <VideoPlayerDialog
        route={videoState.route}
        isOpen={videoState.isOpen}
        onClose={handleCloseVideoDialog}
      />
    </div>
  );
}
