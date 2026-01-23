'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUser, useDoc } from '@/firebase';
import type { SavedItinerary } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Youtube, Wallet, CalendarDays, Car, ShoppingBag, Lightbulb, ArrowLeft } from 'lucide-react';

function ItineraryOverviewDisplay({ overview }: { overview: NonNullable<SavedItinerary['overview']> }) {
    return (
        <Card>
            <CardHeader className="text-center p-6">
                <h2 className="text-4xl font-bold font-headline text-primary">{overview.title}</h2>
                <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">{overview.introduction}</p>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                {/* Quick Facts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                        <Wallet className="h-7 w-7 text-primary mt-1 shrink-0" />
                        <div>
                            <h4 className="font-semibold">Estimated Cost</h4>
                            <p className="text-muted-foreground text-sm">{overview.estimatedCost}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <CalendarDays className="h-7 w-7 text-primary mt-1 shrink-0" />
                        <div>
                            <h4 className="font-semibold">Best Time to Visit</h4>
                            <p className="text-muted-foreground text-sm">{overview.bestTimeToVisit}</p>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Daily Breakdown */}
                <h3 className="text-3xl font-bold font-headline text-center">Your Day-by-Day Itinerary</h3>
                <div className="space-y-8">
                    {overview.dailyBreakdown.map(day => (
                        <div key={day.day} className="border-l-2 border-primary pl-6 relative">
                            <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-primary border-4 border-background" />
                            <h4 className="text-2xl font-bold font-headline">Day {day.day}: {day.dayTitle}</h4>
                            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed mt-2">{day.narrative}</p>
                            {day.proTip && (
                                <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                    <Lightbulb className="h-5 w-5 mt-0.5 shrink-0" />
                                    <div>
                                        <h5 className="font-semibold">Pro Tip</h5>
                                        <p className="text-sm">{day.proTip}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Additional Info Section */}
                <h3 className="text-3xl font-bold font-headline text-center">Practical Information</h3>
                <div className="grid md:grid-cols-2 gap-8 pt-4">
                    <div>
                        <h4 className="text-xl font-bold font-headline mb-3 flex items-center gap-3"><Car className="h-6 w-6 text-primary" /> Getting Around</h4>
                        <p className="text-muted-foreground leading-relaxed">{overview.gettingAround}</p>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold font-headline mb-3 flex items-center gap-3"><ShoppingBag className="h-6 w-6 text-primary" /> What to Pack</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {overview.whatToPack.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator />

                {/* Conclusion & Videos */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold font-headline mb-2">An Unforgettable Journey</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">{overview.conclusion}</p>
                </div>
                {overview.suggestedVideos && overview.suggestedVideos.length > 0 && (
                    <div className="text-center pt-4">
                        <h3 className="text-2xl font-bold font-headline mb-4">Visualize Your Trip</h3>
                        <p className="text-muted-foreground mb-4">Watch travel vlogs to get a feel for your destination:</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {overview.suggestedVideos.map((videoQuery, index) => (
                                <Button key={index} asChild variant="outline">
                                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(videoQuery)}`} target="_blank" rel="noopener noreferrer">
                                        <Youtube className="mr-2 h-4 w-4" />
                                        {videoQuery}
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


function BasicItineraryDisplay({ plan }: { plan: SavedItinerary }) {
    return (
        <Card>
            <CardHeader>
                <h2 className="text-3xl font-headline text-center">{plan.title}</h2>
                <p className="text-center text-muted-foreground">{plan.summary}</p>
            </CardHeader>
            <CardContent className="space-y-6">
                {plan.itinerary.itinerary.map(dayPlan => (
                    <div key={dayPlan.day} className="border-l-2 border-primary pl-6 relative">
                        <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-primary border-4 border-background" />
                        <h3 className="text-xl font-bold font-headline">Day {dayPlan.day}: {dayPlan.title}</h3>
                        <ul className="mt-2 list-disc list-inside space-y-1 text-muted-foreground">
                            {dayPlan.activities.map((activity, index) => (
                                <li key={index}>{activity}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function PlanSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-full mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-lg p-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-px w-full" />
             <Skeleton className="h-8 w-1/2 mx-auto" />
             <div className="space-y-8">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                         <Skeleton className="h-16 w-full" />
                    </div>
                ))}
             </div>
        </div>
    )
}

export default function SavedPlanPage() {
    const params = useParams();
    const planId = params.id as string;
    const { user, status: authStatus } = useUser();

    const { data: plan, loading, error } = useDoc<SavedItinerary>(
        user && planId ? `users/${user.uid}/itineraries/${planId}` : ''
    );

    if (authStatus === 'loading' || (authStatus === 'authenticated' && loading)) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                 <div className="mb-6">
                    <Button variant="outline" asChild>
                        <Link href="/plans"><ArrowLeft className="mr-2 h-4 w-4" /> Back to My Plans</Link>
                    </Button>
                </div>
                <PlanSkeleton />
            </div>
        );
    }
    
    if (authStatus === 'unauthenticated') {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-headline font-bold mb-4">Access Denied</h1>
                <p className="text-muted-foreground">You must be logged in to view this page.</p>
                 <Button asChild className="mt-4">
                    <Link href="/plans">Back to My Plans</Link>
                </Button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-headline font-bold mb-4">Error</h1>
                <p className="text-destructive">Could not load the plan. It may have been deleted or there was a network issue.</p>
                 <Button asChild className="mt-4">
                    <Link href="/plans">Back to My Plans</Link>
                </Button>
            </div>
        );
    }
    
    if (!plan) {
         return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-headline font-bold mb-4">Plan Not Found</h1>
                <p className="text-muted-foreground">The requested itinerary could not be found.</p>
                <Button asChild className="mt-4">
                    <Link href="/plans">Back to My Plans</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <Button variant="outline" asChild>
                    <Link href="/plans"><ArrowLeft className="mr-2 h-4 w-4" /> Back to My Plans</Link>
                </Button>
            </div>
            
            {plan.overview ? <ItineraryOverviewDisplay overview={plan.overview} /> : <BasicItineraryDisplay plan={plan} />}
        </div>
    );
}
