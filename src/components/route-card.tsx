'use client';

import * as React from 'react';
import { ArrowRight, Bus, Leaf, Loader2, MoreHorizontal, MoreVertical, Plane, TrainFront, Trash2, Film, Car } from 'lucide-react';
import type { Route, TransportMode } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from './ui/separator';
import { VariantProps } from 'class-variance-authority';
import { badgeVariants } from './ui/badge';
import { useUser } from '@/hooks/use-session';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


const transportIcons: Record<TransportMode, React.ReactNode> = {
  flight: <Plane className="h-5 w-5" />,
  train: <TrainFront className="h-5 w-5" />,
  bus: <Bus className="h-5 w-5" />,
  car: <Car className="h-5 w-5" />,
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

export default function RouteCard({ route, isSavedTrip, onGenerateVideo, onDeleted }: { route: Route & { id: string }, isSavedTrip?: boolean, onGenerateVideo?: (route: Route) => void, onDeleted?: () => void }) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleSaveTrip = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Please log in to save a trip.' });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(route),
      });

      if (!response.ok) throw new Error('Failed to save trip');

      toast({ title: 'Trip Saved!', description: 'This trip has been added to "My Trips".' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to save trip' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/trips/${route.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete trip');

      toast({ title: 'Trip Deleted', description: 'The trip has been removed from your list.' });
      setIsDeleteDialogOpen(false);
      onDeleted?.();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to delete trip' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
          <div className="flex items-start gap-2">
            <div className="text-right">
              <p className="text-2xl font-bold">₹{route.price.toLocaleString('en-IN')}</p>
              <Badge variant={getAvailabilityVariant(route.availability)} className="mt-1">{route.availability}</Badge>
            </div>
            {isSavedTrip && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onGenerateVideo?.(route)}>
                    <Film className="mr-2 h-4 w-4" />
                    <span>Generate Video</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
        {!isSavedTrip && (
          <CardFooter className="p-4 pt-0">
            <Button
              className="w-full"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}
              disabled={!user || route.availability === 'Sold Out' || isSaving}
              onClick={handleSaveTrip}
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSaving ? 'Saving...' : 'Save Trip'}
            </Button>
          </CardFooter>
        )}
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this trip from your saved trips.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
