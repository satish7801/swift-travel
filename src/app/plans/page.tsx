"use client";

import * as React from 'react';
import Link from 'next/link';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Calendar, Clock, Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { deleteItinerary } from '@/firebase/firestore/itineraries';
import { format } from 'date-fns';
import type { SavedItinerary } from '@/lib/types';


function PlanCard({ plan, onDelete }: { plan: SavedItinerary; onDelete: (id: string) => void; }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const handleDelete = () => {
    setIsDeleting(true);
    onDelete(plan.id);
    // The dialog will be closed by the parent component upon successful deletion and re-render.
    // We can add a timeout to close it anyway if something goes wrong.
    setTimeout(() => {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
    }, 3000);
  };

  const savedDate = plan.savedAt instanceof Date ? plan.savedAt : new Date((plan.savedAt?.seconds ?? 0) * 1000);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-headline">{plan.title}</CardTitle>
            <CardDescription>{plan.summary}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {plan.totalDays} Days
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Saved on {format(savedDate, "PPP")}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline">
            <Link href={`/plans/${plan.id}`}>View Plan</Link>
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this itinerary from your saved plans.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


export default function MyPlansPage() {
  const { user, status } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const { data: plans, loading, error } = useCollection<SavedItinerary>(
    user ? `users/${user.uid}/itineraries` : '',
    { orderBy: ['savedAt', 'desc'] }
  );

  const handleDeletePlan = (id: string) => {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Authentication error.' });
      return;
    }
    // Call the firestore function which now handles its own errors
    deleteItinerary(firestore, user.uid, id);
    toast({ title: 'Plan Deleted', description: 'The itinerary has been removed.' });
  }


  if (status === 'loading' || status === 'loading-uninitialized') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-headline font-bold mb-6">My Plans</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-headline font-bold mb-4">My Plans</h1>
        <p className="text-muted-foreground mb-4">You need to be logged in to view your saved plans.</p>
      </div>
    );
  }

  if (loading) {
     return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-headline font-bold mb-6">My Plans</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
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
      <h1 className="text-3xl font-headline font-bold mb-6">My Plans</h1>
      {plans && plans.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map(plan => (
            <PlanCard key={plan.id} plan={plan} onDelete={handleDeletePlan} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-headline font-semibold">No plans saved yet</h2>
          <p className="text-muted-foreground mt-2">Use the Itinerary Planner to create and save your first trip plan!</p>
          <Button asChild className="mt-4">
            <Link href="/planner">Go to Planner</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
