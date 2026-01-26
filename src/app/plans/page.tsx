"use client";

import * as React from 'react';
import Link from 'next/link';
import { ClipboardList, Loader2, Calendar, MapPin, ArrowRight, Plus } from 'lucide-react';
import { useUser } from '@/hooks/use-session';
import { Button } from '@/components/ui/button';
import type { SavedItinerary } from '@/lib/types';
import { AuthGuard } from '@/components/auth-guard';

export default function PlansPage() {
  return (
    <AuthGuard>
      <PlansContent />
    </AuthGuard>
  );
}

function PlansContent() {
  const { user } = useUser();
  const [itineraries, setItineraries] = React.useState<SavedItinerary[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchItineraries = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/itineraries');
        if (response.ok) {
          const data = await response.json();
          setItineraries(data);
        }
      } catch (error) {
        console.error('Failed to fetch itineraries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [user]);

  const formatDate = (dateValue: Date | string) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <main className="flex-1">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading your plans...</p>
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
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <ClipboardList className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-2xl font-bold">Sign in to view plans</h1>
            <p className="text-muted-foreground">
              Create and save AI-generated travel itineraries.
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl glass flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">My Plans</h1>
                <p className="text-muted-foreground">{itineraries.length} saved itineraries</p>
              </div>
            </div>
            <Link href="/planner">
              <Button className="bg-accent hover:bg-accent/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create New Plan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-12">
        {itineraries.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
              <Calendar className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">No plans yet</h2>
              <p className="text-muted-foreground mt-2">
                Use the AI planner to create your first travel itinerary
              </p>
            </div>
            <Link href="/planner">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Start Planning
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary) => (
              <Link
                key={itinerary.id}
                href={`/plans/${itinerary.id}`}
                className="group block"
              >
                <div className="card-premium p-6 h-full hover-lift">
                  {/* City Badge */}
                  <div className="flex items-center gap-2 text-sm text-primary mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{itinerary.city}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {itinerary.title || `${itinerary.totalDays} Days in ${itinerary.city}`}
                  </h3>

                  {/* Summary */}
                  {itinerary.summary && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {itinerary.summary}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {itinerary.totalDays} days
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      View <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-muted-foreground mt-3">
                    Saved {formatDate(itinerary.savedAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
