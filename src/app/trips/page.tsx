"use client";

import * as React from 'react';
import { Briefcase, Trash2, Loader2, Plane, Train, Bus, ArrowRight, MapPin } from 'lucide-react';
import RouteCard from '@/components/route-card';
import type { Route, SavedTrip } from '@/lib/types';
import { useUser } from '@/hooks/use-session';
import { useToast } from '@/hooks/use-toast';
import { AuthGuard } from '@/components/auth-guard';

export default function TripsPage() {
  return (
    <AuthGuard>
      <TripsContent />
    </AuthGuard>
  );
}

function TripsContent() {
  const { user } = useUser();

  const [trips, setTrips] = React.useState<SavedTrip[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchTrips = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/trips');
        if (response.ok) {
          const data = await response.json();
          setTrips(data);
        }
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  const handleDeleteTrip = (deletedId: string) => {
    setTrips(prev => prev.filter(t => t.id !== deletedId));
  };

  if (loading) {
    return (
      <main className="flex-1">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading your trips...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex-1">
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Briefcase className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Sign in to view trips</h1>
            <p className="text-muted-foreground">
              Save your favorite routes and access them from anywhere.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      {/* Header */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl glass flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">My Trips</h1>
              <p className="text-muted-foreground">{trips.length} saved routes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-12">
        {trips.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
              <MapPin className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">No trips saved yet</h2>
              <p className="text-muted-foreground mt-2">
                Search for routes and save your favorites here
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {trips.map((trip) => (
              <RouteCard
                key={trip.id}
                route={trip as Route & { id: string }}
                isSavedTrip
                onDeleted={() => handleDeleteTrip(trip.id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
