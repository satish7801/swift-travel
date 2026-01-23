"use client";

import * as React from 'react';
import Link from 'next/link';
import { useUser, useCollection } from '@/firebase';
import RouteCard from '@/components/route-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { Route } from '@/lib/types';

export default function MyTripsPage() {
  const { user, status } = useUser();

  const { data: trips, loading, error } = useCollection<Route>(
    user ? `users/${user.uid}/trips` : '',
    { orderBy: ['savedAt', 'desc'] }
  );

  if (status === 'loading' || status === 'loading-uninitialized') {
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
        <p className="text-destructive">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-6">My Trips</h1>
      {trips && trips.length > 0 ? (
        <div className="space-y-4">
          {trips.map(trip => (
            <RouteCard key={trip.id} route={trip} isSavedTrip />
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
    </div>
  );
}
