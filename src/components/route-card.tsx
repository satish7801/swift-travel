'use client';

import * as React from 'react';
import { ArrowRight, Bus, Leaf, Loader2, MoreVertical, Plane, TrainFront } from 'lucide-react';
import type { Route, TransportMode } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from './ui/separator';
import { VariantProps } from 'class-variance-authority';
import { badgeVariants } from './ui/badge';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { saveTrip } from '@/firebase/firestore/trips';

const transportIcons: Record<TransportMode, React.ReactNode> = {
  flight: <Plane className="h-5 w-5" />,
  train: <TrainFront className="h-5 w-5" />,
  bus: <Bus className="h-5 w-5" />,
};

const getAvailabilityVariant = (availability: Route['availability']): VariantProps<typeof badgeVariants>['variant'] => {
    switch (availability) {
        case 'Available':
            return 'success';
        case 'Filling Fast':
        case 'Few Seats Left':
            return 'warning';
        case 'Sold Out':
            return 'destructive';
        default:
            return 'secondary';
    }
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function RouteCard({ route }: { route: Route }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isBooking, setIsBooking] = React.useState(false);

  const handleBookNow = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Please log in to book a trip.' });
      return;
    }
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Could not connect to the database.' });
      return;
    }

    setIsBooking(true);
    try {
      await saveTrip(firestore, user.uid, route);
      toast({ title: 'Trip Booked!', description: 'Your trip has been saved to "My Trips".' });
    } catch (error: any) {
      console.error("Booking failed", error);
      toast({ variant: 'destructive', title: 'Booking Failed', description: error.message || 'An unknown error occurred.' });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="p-4 flex-row items-start justify-between">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                {route.legs.map((leg, index) => (
                    <div key={leg.id} className="flex items-center gap-2">
                        <div className="p-2 bg-muted rounded-full">{transportIcons[leg.mode]}</div>
                        {index < route.legs.length - 1 && <MoreVertical className="h-4 w-4 text-muted-foreground" />}
                    </div>
                ))}
            </div>
            <div>
                <p className="font-semibold text-lg">{route.legs[0].departureLocation.split('(')[0].trim()} <ArrowRight className="inline-block h-4 w-4 mx-1" /> {route.legs[route.legs.length - 1].arrivalLocation.split('(')[0].trim()}</p>
                <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-sm text-muted-foreground">
                    <p>Total duration: {route.totalDuration}</p>
                    <div className="flex items-center gap-1">
                        <Leaf className="h-4 w-4 text-success" />
                        <span>{route.carbonFootprint.toFixed(1)} kg CO₂e</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="text-right">
            <p className="text-2xl font-bold">₹{route.price.toLocaleString('en-IN')}</p>
            <Badge variant={getAvailabilityVariant(route.availability)} className="mt-1">{route.availability}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Separator className="mb-4" />
        <div className="space-y-4">
        {route.legs.map((leg, index) => (
            <div key={leg.id} className="grid grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-3">
                    <div className="text-primary">{transportIcons[leg.mode]}</div>
                    <div>
                        <p className="font-semibold">{leg.operator}</p>
                        <p className="text-xs text-muted-foreground">{leg.details}</p>
                    </div>
                </div>
                <div className="text-center">
                    <p className="font-semibold">{formatTime(leg.departureTime)} - {formatTime(leg.arrivalTime)}</p>
                    <p className="text-xs text-muted-foreground">{leg.departureLocation} to {leg.arrivalLocation}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold">{leg.duration}</p>
                </div>
            </div>
        ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }} 
          disabled={!user || route.availability === 'Sold Out' || isBooking}
          onClick={handleBookNow}
        >
          {isBooking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isBooking ? 'Booking...' : 'Book Now'}
        </Button>
      </CardFooter>
    </Card>
  );
}
